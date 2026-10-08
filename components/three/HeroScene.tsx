"use client";

import { useEffect, useRef } from "react";

/**
 * 3D layer for the hero: a slowly turning geodesic lattice (blue members, gold joints),
 * a receding blueprint grid, drifting gold particles and gold light trails.
 * - three.js is imported lazily so it never blocks first paint.
 * - Renders a single still frame when the visitor prefers reduced motion.
 * - Pauses when the hero is off-screen or the tab is hidden.
 */
export function HeroScene({ variant = "full" }: { variant?: "full" | "compact" }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const small = window.innerWidth < 768;
      const compact = variant === "compact";

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
      } catch {
        return; // No WebGL: the CSS blueprint layer still carries the look.
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2));
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.setAttribute("aria-hidden", "true");
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      // Navy depth fog suits the dark homepage hero; the light inner-page heroes skip it.
      if (!compact) scene.fog = new THREE.Fog(0x071a2b, 9, 26);
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0.6, 11);

      const BLUE = new THREE.Color(0x1e88e5);
      const GOLD = new THREE.Color(0xc9a227);

      // --- Structural lattice ------------------------------------------------
      const rig = new THREE.Group();
      scene.add(rig);

      const geo = new THREE.IcosahedronGeometry(2.7, 1);
      const edges = new THREE.EdgesGeometry(geo);
      const lattice = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: compact ? new THREE.Color(0x145da0) : BLUE, transparent: true, opacity: compact ? 0.4 : 0.55 }),
      );
      rig.add(lattice);

      // Joints: one gold point per unique vertex.
      const pos = geo.getAttribute("position");
      const seen = new Set<string>();
      const joints: number[] = [];
      for (let i = 0; i < pos.count; i++) {
        const k = `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`;
        if (seen.has(k)) continue;
        seen.add(k);
        joints.push(pos.getX(i), pos.getY(i), pos.getZ(i));
      }
      const jointGeo = new THREE.BufferGeometry();
      jointGeo.setAttribute("position", new THREE.Float32BufferAttribute(joints, 3));
      const jointMat = new THREE.PointsMaterial({ color: GOLD, size: 0.11, transparent: true, opacity: 0.95, sizeAttenuation: true });
      rig.add(new THREE.Points(jointGeo, jointMat));

      // Inner core: a finer, fainter shell for depth.
      const core = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.25, 0)),
        new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.4 }),
      );
      rig.add(core);

      // Orbit rings, like a gear pitch circle and a survey ring.
      const ringA = new THREE.Mesh(
        new THREE.TorusGeometry(3.9, 0.006, 6, 200),
        new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.55 }),
      );
      ringA.rotation.x = Math.PI / 2.3;
      rig.add(ringA);
      const ringB = new THREE.Mesh(
        new THREE.TorusGeometry(4.6, 0.004, 6, 200),
        new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.35 }),
      );
      ringB.rotation.set(Math.PI / 1.8, 0.4, 0);
      rig.add(ringB);

      // Tick marks on ring A (engineering scale).
      const ticks: number[] = [];
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        const r1 = 3.9;
        const r2 = i % 6 === 0 ? 4.15 : 4.02;
        ticks.push(Math.cos(a) * r1, Math.sin(a) * r1, 0, Math.cos(a) * r2, Math.sin(a) * r2, 0);
      }
      const tickGeo = new THREE.BufferGeometry();
      tickGeo.setAttribute("position", new THREE.Float32BufferAttribute(ticks, 3));
      const tickLines = new THREE.LineSegments(tickGeo, new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.45 }));
      tickLines.rotation.x = ringA.rotation.x;
      rig.add(tickLines);

      // --- Blueprint floor ---------------------------------------------------
      const grid = new THREE.GridHelper(60, 60, 0x1e88e5, 0x145da0);
      const gridMat = grid.material as import("three").Material;
      gridMat.transparent = true;
      gridMat.opacity = 0.18;
      grid.position.y = -4.2;
      if (!compact) scene.add(grid);

      // --- Gold particles ----------------------------------------------------
      const COUNT = compact ? (small ? 60 : 140) : small ? 160 : 380;
      const pPos = new Float32Array(COUNT * 3);
      const pSpeed = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 30;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 16;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
        pSpeed[i] = 0.12 + Math.random() * 0.35;
      }
      const partGeo = new THREE.BufferGeometry();
      partGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const partMat = new THREE.PointsMaterial({ color: GOLD, size: 0.045, transparent: true, opacity: 0.7, depthWrite: false });
      const particles = new THREE.Points(partGeo, partMat);
      scene.add(particles);

      // --- Light trails ------------------------------------------------------
      // A soft comet of light travels along each curve (custom shader: alpha by position along the line).
      const trails: { mat: import("three").ShaderMaterial; speed: number }[] = [];
      const makeTrail = (pts: [number, number, number][], color: import("three").Color, speed: number, opacity: number) => {
        const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
        const points = curve.getPoints(220);
        const g = new THREE.BufferGeometry().setFromPoints(points);
        g.setAttribute("lineT", new THREE.Float32BufferAttribute(points.map((_, i) => i / (points.length - 1)), 1));
        const mat = new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          blending: compact ? THREE.NormalBlending : THREE.AdditiveBlending,
          uniforms: { uTime: { value: Math.random() * 10 }, uColor: { value: color }, uOpacity: { value: opacity } },
          vertexShader: `
            attribute float lineT;
            varying float vT;
            void main() {
              vT = lineT;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
          fragmentShader: `
            uniform float uTime;
            uniform vec3 uColor;
            uniform float uOpacity;
            varying float vT;
            void main() {
              float head = fract(uTime);
              float d = head - vT;
              if (d < 0.0) d += 1.0;
              float tail = smoothstep(0.32, 0.0, d) * step(0.0, d);
              float base = 0.08;
              gl_FragColor = vec4(uColor, uOpacity * max(tail, base));
            }`,
        });
        scene.add(new THREE.Line(g, mat));
        trails.push({ mat, speed });
      };
      makeTrail([[-16, -3.2, -2], [-6, -1.8, 1], [2, -2.6, 2], [9, -0.6, -1], [17, 1.2, -4]], GOLD, 0.11, 0.9);
      makeTrail([[-17, 2.4, -5], [-8, 3.4, -3], [0, 2.2, -2], [8, 3.6, -4], [17, 2.2, -6]], BLUE, 0.08, 0.8);
      makeTrail([[-15, -4.0, 0], [-4, -3.4, 2], [6, -3.9, 1], [16, -2.8, -2]], GOLD, 0.14, 0.6);

      // --- Layout & interaction ---------------------------------------------
      const placeRig = () => {
        const w = host.clientWidth;
        const h = host.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        // Sit to the right of the headline on wide screens; centre and recede on narrow ones.
        if (compact) {
          // Inner-page heroes are short and wide: a smaller lattice tucked to the right.
          const aspect = w / h;
          rig.position.set(w >= 900 ? Math.min(7.5, 2.2 * aspect) : 2.4, w >= 900 ? 0 : 1.2, w >= 900 ? -1 : -5);
          rig.scale.setScalar(w >= 900 ? 0.62 : 0.5);
        } else if (w >= 1024) {
          rig.position.set(4.6, 0.2, 0);
          rig.scale.setScalar(1);
        } else if (w >= 640) {
          rig.position.set(3.2, 1.6, -2);
          rig.scale.setScalar(0.85);
        } else {
          rig.position.set(1.6, 2.6, -4);
          rig.scale.setScalar(0.75);
        }
      };
      placeRig();
      const ro = new ResizeObserver(placeRig);
      ro.observe(host);

      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      if (!reduceMotion) window.addEventListener("pointermove", onPointer, { passive: true });

      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduceMotion) loop();
      });
      io.observe(host);

      const timer = new THREE.Timer();
      timer.connect(document);
      let raf = 0;
      const renderFrame = (t: number, dt: number) => {
        rig.rotation.y = t * 0.08;
        rig.rotation.x = Math.sin(t * 0.15) * 0.12;
        core.rotation.y = -t * 0.22;
        core.rotation.z = t * 0.1;
        ringA.rotation.z = t * 0.05;
        tickLines.rotation.z = t * 0.05;
        ringB.rotation.z = -t * 0.03;
        jointMat.size = 0.1 + Math.sin(t * 1.6) * 0.015;

        const arr = partGeo.getAttribute("position") as import("three").BufferAttribute;
        for (let i = 0; i < COUNT; i++) {
          let y = arr.getY(i) + pSpeed[i] * dt * 0.6;
          if (y > 8) y = -8;
          arr.setY(i, y);
        }
        arr.needsUpdate = true;

        for (const tr of trails) tr.mat.uniforms.uTime.value += tr.speed * dt;

        grid.position.z = (t * 0.6) % 1;

        pointer.x += (pointer.tx - pointer.x) * 0.04;
        pointer.y += (pointer.ty - pointer.y) * 0.04;
        camera.position.x = pointer.x * 0.6;
        camera.position.y = 0.6 - pointer.y * 0.35;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      function loop() {
        cancelAnimationFrame(raf);
        const step = () => {
          if (!visible || document.hidden) return;
          timer.update();
          const dt = Math.min(timer.getDelta(), 0.05);
          renderFrame(timer.getElapsed(), dt);
          raf = requestAnimationFrame(step);
        };
        timer.update();
        raf = requestAnimationFrame(step);
      }

      const onVisibility = () => {
        if (!document.hidden && visible && !reduceMotion) loop();
      };
      document.addEventListener("visibilitychange", onVisibility);

      if (reduceMotion) renderFrame(6, 0);
      else loop();
      host.dataset.ready = "true";

      cleanup = () => {
        cancelAnimationFrame(raf);
        timer.dispose();
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("visibilitychange", onVisibility);
        scene.traverse((obj) => {
          const o = obj as import("three").Mesh;
          o.geometry?.dispose?.();
          const m = o.material as import("three").Material | import("three").Material[] | undefined;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m?.dispose?.();
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [variant]);

  return <div ref={hostRef} className={`hero-scene hero-scene--${variant}`} aria-hidden="true" />;
}
