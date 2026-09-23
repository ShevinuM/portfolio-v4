import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { blogCard } from "../../utils/og";

export const GET: APIRoute = async () => {
    // Topics are counted off the posts themselves, most used first, so the card
    // cannot drift out of date the way the hand-made one did.
    const posts = await getCollection("posts");
    const counts = new Map<string, number>();

    for (const post of posts) {
        for (const tag of (post.data as { tags?: string[] }).tags ?? []) {
            const name = tag.trim().toLowerCase();
            if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
        }
    }

    const topics = [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([name]) => name);

    return new Response(new Uint8Array(await blogCard(topics)), {
        headers: { "Content-Type": "image/png" },
    });
};
