import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const store = getStore("images");
  const keys = await store.list();

  const images = await Promise.all(
    keys.map(async (key) => {
      const url = await store.getUrl(key);
      return { name: key, url };
    })
  );

  return new Response(JSON.stringify(images), {
    headers: { "Content-Type": "application/json" },
  });
};