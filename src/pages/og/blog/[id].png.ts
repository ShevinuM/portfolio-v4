import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { postCard } from "../../../utils/og";
import { getListingItem } from "../../../utils/adapters";

/** One PNG per post, at /og/blog/<post id>.png. */
export async function getStaticPaths() {
    const posts = await getCollection("posts");
    return posts.map((post) => ({
        params: { id: post.id },
        props: { post },
    }));
}

export const GET: APIRoute = async ({ props }) => {
    // getListingItem formats the date the same way the post page prints it, so
    // the card and the page never disagree.
    const item = getListingItem((props as { post: unknown }).post);

    const png = await postCard({
        title: item.title,
        date: item.date,
        tags: item.tags,
        author: item.authors,
    });

    return new Response(new Uint8Array(png), {
        headers: { "Content-Type": "image/png" },
    });
};
