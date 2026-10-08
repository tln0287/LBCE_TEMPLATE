import {
  AlertCircle, ArrowRight, ArrowUpRight, Atom, Award, BadgeCheck, BarChart3, BedDouble, BookOpen, Briefcase,
  Building, Building2, Bus, Calculator, CalendarDays, Camera, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  CircuitBoard, ClipboardCheck, Clock, Code, Coffee, Cog, Compass, Cpu, CreditCard, Download, ExternalLink, Eye, Factory,
  FileSearch, FileText, FlaskConical, Gavel, GraduationCap, HeartPulse, Image, Info, Landmark, Layers, LayoutGrid,
  Library, Lightbulb, Lock, Mail, MapPin, Medal, Menu, MessageSquare, Mic, Monitor, Music, Network, Newspaper, Pause,
  Phone, Play, Plus, Presentation, Quote, Rocket, Scale, Search, Send, ShieldCheck, Target, Theater, Trophy, UserCheck,
  Users, Wrench, X, Zap,
  type LucideIcon, type LucideProps,
} from "lucide-react";

/** Content files reference icons by name; this map keeps the bundle to the icons actually used. */
const ICONS: Record<string, LucideIcon> = {
  AlertCircle, ArrowRight, ArrowUpRight, Atom, Award, BadgeCheck, BarChart3, BedDouble, BookOpen, Briefcase,
  Building, Building2, Bus, Calculator, CalendarDays, Camera, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  CircuitBoard, ClipboardCheck, Clock, Code, Coffee, Cog, Compass, Cpu, CreditCard, Download, ExternalLink, Eye, Factory,
  FileSearch, FileText, FlaskConical, Gavel, GraduationCap, HeartPulse, Image, Info, Landmark, Layers, LayoutGrid,
  Library, Lightbulb, Lock, Mail, MapPin, Medal, Menu, MessageSquare, Mic, Monitor, Music, Network, Newspaper, Pause,
  Phone, Play, Plus, Presentation, Quote, Rocket, Scale, Search, Send, ShieldCheck, Target, Theater, Trophy, UserCheck,
  Users, Wrench, X, Zap,
};

export type IconName = keyof typeof ICONS | string;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = ICONS[name] ?? FileText;
  return <Cmp aria-hidden="true" strokeWidth={1.75} {...props} />;
}
