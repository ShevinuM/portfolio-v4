/**
 * Open Graph card generation.
 *
 * Cards are rendered at build time by the endpoints under src/pages/og/ and
 * emitted as static PNGs, so nothing runs at request time and GitHub Pages
 * serves plain files. satori lays the card out with a flexbox subset and
 * returns SVG; resvg rasterises it.
 *
 * These replace the two hand-made PNGs that used to sit in public/. Those had
 * to be re-exported by hand whenever anything they showed changed, so the blog
 * card's topic list silently went stale as posts were added. Everything here
 * is derived from content and config instead.
 */
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { SITE, THEMES } from "../config";

const WIDTH = 1200;
const HEIGHT = 630;

const palette = THEMES.light_notepad;

/** The site's own colours, so a theme change carries into the cards. */
const C = {
    bg: palette.background,
    fg: palette.foreground,
    muted: palette.muted,
    border: palette.border,
    accent: palette.accent,
};

/** Domain shown in the corner of every card, without the scheme. */
const DOMAIN = SITE.website.replace(/^https?:\/\//, "").replace(/\/$/, "");

/**
 * Inter, read straight out of the installed package.
 *
 * Resolved through createRequire rather than a path into node_modules: pnpm's
 * store layout is not stable to hand-write, and a guessed path would work here
 * and fail in CI. satori reads ttf, otf and woff — not woff2 — so these are the
 * .woff files.
 *
 * Only the latin subset is loaded. Titles are English; a character outside it
 * renders as tofu rather than failing the build, so if a title ever needs
 * latin-ext, add that subset here.
 */
const require = createRequire(import.meta.url);

function font(weight: 400 | 600 | 700 | 800) {
    return {
        name: "Inter",
        data: readFileSync(
            require.resolve(
                `@fontsource/inter/files/inter-latin-${weight}-normal.woff`,
            ),
        ),
        weight,
        style: "normal" as const,
    };
}

let fontCache: ReturnType<typeof font>[] | undefined;

function fonts() {
    // Every card in a build reuses one set of buffers; re-reading them per
    // endpoint would mean re-reading ~1MB for each post.
    fontCache ??= [font(400), font(600), font(700), font(800)];
    return fontCache;
}

/** satori takes a React-shaped tree. Building it by hand keeps this a .ts file. */
type Node = { type: string; props: Record<string, unknown> };

function el(
    type: string,
    style: Record<string, unknown>,
    children?: unknown,
): Node {
    return { type, props: { style, ...(children === undefined ? {} : { children }) } };
}

/** Small uppercase accent label, e.g. the section a card belongs to. */
function eyebrow(text: string): Node {
    return el(
        "div",
        {
            display: "flex",
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.accent,
        },
        text,
    );
}

/** The accent rule that separates a card's heading from its footer. */
function rule(): Node {
    return el("div", {
        display: "flex",
        width: 96,
        height: 6,
        background: C.accent,
        borderRadius: 3,
    });
}

function pill(text: string): Node {
    return el(
        "div",
        {
            display: "flex",
            fontSize: 22,
            fontWeight: 600,
            color: C.muted,
            border: `2px solid ${C.border}`,
            borderRadius: 999,
            padding: "8px 20px",
        },
        `#${text}`,
    );
}

/** Byline strip pinned to the bottom of every card. */
function footer(left: string): Node {
    return el(
        "div",
        {
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: C.muted,
            borderTop: `2px solid ${C.border}`,
            paddingTop: 24,
        },
        [
            el("div", { display: "flex", fontWeight: 600, color: C.fg }, left),
            el("div", { display: "flex" }, DOMAIN),
        ],
    );
}

/** Outer frame shared by every card: background, padding, accent edge. */
function frame(children: unknown[]): Node {
    return el(
        "div",
        {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: C.bg,
            fontFamily: "Inter",
            padding: "64px 72px",
            justifyContent: "space-between",
            borderLeft: `16px solid ${C.accent}`,
        },
        children,
    );
}

async function toPng(node: Node): Promise<Buffer> {
    const svg = await satori(node as never, {
        width: WIDTH,
        height: HEIGHT,
        fonts: fonts(),
    });
    return Buffer.from(
        new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } })
            .render()
            .asPng(),
    );
}

/**
 * Cap a title so it cannot push the footer off the card.
 *
 * satori has no line-clamp, so this trims by character count and appends an
 * ellipsis. The limit is deliberately generous: at 60px/700 roughly 30
 * characters fit per line at this width, and three lines is the most the
 * layout has room for.
 */
function clampTitle(title: string, limit = 96): string {
    if (title.length <= limit) return title;
    const cut = title.slice(0, limit);
    const lastSpace = cut.lastIndexOf(" ");
    return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** Card for a single blog post: title, date, tags. */
export function postCard(opts: {
    title: string;
    date?: string;
    tags?: string[];
    author?: string;
}): Promise<Buffer> {
    const tags = (opts.tags ?? []).slice(0, 4);
    return toPng(
        frame([
            el(
                "div",
                { display: "flex", flexDirection: "column", gap: 28 },
                [
                    eyebrow("Blog"),
                    el(
                        "div",
                        {
                            display: "flex",
                            fontSize: 60,
                            fontWeight: 800,
                            color: C.fg,
                            lineHeight: 1.15,
                            letterSpacing: "-0.02em",
                        },
                        clampTitle(opts.title),
                    ),
                    rule(),
                    tags.length
                        ? el(
                              "div",
                              { display: "flex", gap: 12, flexWrap: "wrap" },
                              tags.map(pill),
                          )
                        : el("div", { display: "flex" }),
                ],
            ),
            footer(
                [opts.author ?? SITE.author, opts.date].filter(Boolean).join("  ·  "),
            ),
        ]),
    );
}

/** Card for the blog index. Topics come from the posts themselves. */
export function blogCard(topics: string[]): Promise<Buffer> {
    return toPng(
        frame([
            el(
                "div",
                { display: "flex", flexDirection: "column", gap: 28 },
                [
                    eyebrow(SITE.author),
                    el(
                        "div",
                        {
                            display: "flex",
                            fontSize: 108,
                            fontWeight: 800,
                            color: C.fg,
                            letterSpacing: "-0.03em",
                        },
                        "Blog",
                    ),
                    rule(),
                    el(
                        "div",
                        { display: "flex", gap: 12, flexWrap: "wrap" },
                        topics.slice(0, 6).map(pill),
                    ),
                ],
            ),
            footer("Writing on software, AI and learning"),
        ]),
    );
}

/** Default card for the site: name, role, tagline. */
export function siteCard(): Promise<Buffer> {
    return toPng(
        frame([
            el(
                "div",
                { display: "flex", flexDirection: "column", gap: 24 },
                [
                    eyebrow("Personal site"),
                    el(
                        "div",
                        {
                            display: "flex",
                            fontSize: 84,
                            fontWeight: 800,
                            color: C.fg,
                            letterSpacing: "-0.03em",
                        },
                        SITE.author,
                    ),
                    rule(),
                    el(
                        "div",
                        {
                            display: "flex",
                            fontSize: 30,
                            color: C.muted,
                            lineHeight: 1.4,
                            maxWidth: 820,
                        },
                        SITE.desc,
                    ),
                ],
            ),
            footer("About · Resume · Publications · Code · Blog"),
        ]),
    );
}
