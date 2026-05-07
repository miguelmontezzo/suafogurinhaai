import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const EXT = ["png", "jpg", "jpeg", "webp"] as const;

export async function GET(_req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code.toUpperCase().replace(/[^A-Z]/g, "");
  if (!code) return NextResponse.json({ exists: false }, { status: 400 });

  const dir = path.join(process.cwd(), "public", "templates");
  for (const ext of EXT) {
    const file = `${code}.${ext}`;
    try {
      await fs.access(path.join(dir, file));
      return NextResponse.json({
        exists: true,
        url: `/templates/${file}`,
      });
    } catch {
      /* continua */
    }
  }
  return NextResponse.json({ exists: false });
}
