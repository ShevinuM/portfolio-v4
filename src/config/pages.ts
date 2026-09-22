import type { PagesConfig } from "../types";

export const PAGES: PagesConfig = {
    home: {
        title: "About Me",
        subtitle: "",
        isActive: true,
    },
    blog: {
        title: "Blog",
        subtitle: "",
        isActive: true,
    },
    publications: {
        title: "Publications",
        subtitle: "A collection of research papers and scientific articles.",
        isActive: true,
    },
    // Disabled until there is a talk to list. The routes themselves live at
    // src/pages/_talks — Astro ignores anything under src/pages prefixed with
    // an underscore, so no /talks page is emitted and it stays out of the
    // sitemap. Leaving isActive false as well means the routes still refuse to
    // render if that directory is ever renamed back without updating the nav.
    talks: {
        title: "Talks & Presentations",
        subtitle: "Public lectures, colloquia, and conference presentations.",
        isActive: false,
    },
    projects: {
        title: "Code & Projects",
        subtitle: "Open source contributions and technological experiments.",
        isActive: true,
    },
    tags: {
        title: "Tags",
        subtitle: "Explore content by topic.",
        isActive: true,
    },
    cv: {
        title: "Resume",
        subtitle: "",
        isActive: true,
    },
};
