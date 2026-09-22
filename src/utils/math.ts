/**
 * Detects math in a markdown body so KaTeX's stylesheet is only requested by
 * pages that actually render it — it is ~19kB and nothing else on the site
 * needs it.
 *
 * remark-math parses `$...$` and `$$...$$`. The match is deliberately loose:
 * a false positive costs one cached stylesheet, a false negative would ship
 * unstyled math.
 */
export function containsMath(body: string | undefined): boolean {
    if (!body) return false;
    return /\$\$[\s\S]*?\$\$/.test(body) || /\$[^$\n]+\$/.test(body);
}
