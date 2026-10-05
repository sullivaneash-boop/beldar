import {
  BookOpen, ClipboardCheck, Gauge, Hammer, LifeBuoy, ListTree, NotebookPen, Palette, Printer,
  Settings, ShieldAlert, Shirt, ShoppingCart, Stethoscope, Timer, Triangle, Clock,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { href: string; label: string; short?: string; icon: LucideIcon };
export type NavGroup = { group: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    group: "Mission",
    items: [
      { href: "/", label: "Mission Control", short: "Home", icon: Gauge },
      { href: "/build", label: "Master Build Plan", short: "Build", icon: ListTree },
      { href: "/guide", label: "Guided Build", short: "Guide", icon: Hammer },
      { href: "/cone-lab", label: "Cone Lab", icon: Triangle },
    ],
  },
  {
    group: "Supply",
    items: [
      { href: "/materials", label: "Materials & Shopping", short: "Materials", icon: ShoppingCart },
      { href: "/wardrobe", label: "Beldar Closet", short: "Wardrobe", icon: Shirt },
    ],
  },
  {
    group: "Face",
    items: [{ href: "/makeup", label: "Makeup Station", short: "Makeup", icon: Palette }],
  },
  {
    group: "Deployment",
    items: [
      { href: "/rehearsal", label: "Rehearsal Mode", short: "Rehearsal", icon: Timer },
      { href: "/halloween", label: "Halloween Mode", short: "Halloween", icon: Clock },
      { href: "/survival", label: "Party Survival", short: "Survival", icon: LifeBuoy },
    ],
  },
  {
    group: "Reference",
    items: [
      { href: "/troubleshooting", label: "Troubleshooting", icon: Stethoscope },
      { href: "/safety", label: "Safety", icon: ShieldAlert },
      { href: "/research", label: "Research & Sources", short: "Sources", icon: BookOpen },
      { href: "/log", label: "Build Log", short: "Log", icon: NotebookPen },
      { href: "/print", label: "Print Center", short: "Print", icon: Printer },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export const allNavItems = navGroups.flatMap((g) => g.items);

export const mobileTabs: NavItem[] = [
  { href: "/", label: "Home", icon: Gauge },
  { href: "/build", label: "Build", icon: ListTree },
  { href: "/guide", label: "Guide", icon: Hammer },
  { href: "/survival", label: "Survival", icon: LifeBuoy },
];

export const checklistIcon = ClipboardCheck;
