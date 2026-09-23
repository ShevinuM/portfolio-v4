import type { APIRoute } from "astro";
import { siteCard } from "../../utils/og";

export const GET: APIRoute = async () =>
    new Response(new Uint8Array(await siteCard()), {
        headers: { "Content-Type": "image/png" },
    });
