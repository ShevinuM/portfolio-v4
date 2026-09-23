import type { NavLink } from "../types";

export const NAV_LINKS: NavLink[] = [
    { href: "/", label: "About", isActive: true },
    { href: "/resume/", label: "Resume", isActive: true },
    { href: "/publications/", label: "Publications", isActive: true },
    { href: "/projects/", label: "Code", isActive: true },
    { href: "/blog/", label: "Blog", isActive: true },
    { href: "/tags/", label: "Tags", isActive: true },
    // Disabled until there is a talk to list. To bring the section back:
    // rename src/pages/_talks back to src/pages/talks, then set isActive true
    // here and in PAGES.talks (src/config/pages.ts).
    { href: "/talks/", label: "Talks", isActive: false },
];
