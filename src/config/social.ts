import type { SocialLink } from "../types";

export const SOCIALS: SocialLink[] = [
    {
        name: "Github",
        href: "https://github.com/ShevinuM",
        linkTitle: `Shevinu Nawalage on GitHub`,
        isActive: true,
    },
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/shevinum/",
        linkTitle: `Shevinu Nawalage on LinkedIn`,
        isActive: true,
    },
    {
        name: "ResearchGate",
        href: "https://www.researchgate.net/profile/Shevinu-Nawalage",
        linkTitle: `Shevinu Nawalage on ResearchGate`,
        isActive: true,
    },
    {
        name: "Mail",
        href: "mailto:shevinu2002@gmail.com",
        linkTitle: `Send an email to Shevinu`,
        isActive: true,
    },
];

export const SOCIAL_ICONS: Record<string, string> = {
    Github: "Github",
    LinkedIn: "LinkedIn",
    ResearchGate: "ResearchGate",
    Mail: "Mail",
    RSS: "RSS",
};
