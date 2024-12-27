import { promises as fs } from 'fs';
import path from 'path';
import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const imagesDir = path.join(process.cwd(), 'public', 'images');

  try {
    const files = await fs.readdir(imagesDir);
    const images = files.map(file => ({
      name: file,
      url: `/images/${file}`
    }));

    return new Response(JSON.stringify(images), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
};