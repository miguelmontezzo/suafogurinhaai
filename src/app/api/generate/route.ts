import { NextRequest, NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";
import { buildPrompt, type StickerData } from "@/lib/prompt";

export const runtime = "nodejs";
export const maxDuration = 300;

type Body = {
  data: StickerData;
  templateImage: string; // dataURL
  personImage: string;   // dataURL
};

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; mime: string; ext: string } {
  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!m) throw new Error("Imagem inválida (esperado data URL base64)");
  const mime = m[1];
  const base64 = m[2];
  const ext = mime.split("/")[1].replace("jpeg", "jpg");
  return { buffer: Buffer.from(base64, "base64"), mime, ext };
}

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY não configurada no servidor." },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { data, templateImage, personImage } = body || {};
  if (!data || !templateImage || !personImage) {
    return NextResponse.json(
      { error: "Faltam campos: data, templateImage, personImage" },
      { status: 400 }
    );
  }

  const prompt = buildPrompt(data);

  try {
    const tpl = dataUrlToBuffer(templateImage);
    const psn = dataUrlToBuffer(personImage);

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";

    const result = await client.images.edit({
      model,
      prompt,
      // gpt-image-2 aceita múltiplas imagens (template + foto da pessoa)
      image: [
        await toFile(tpl.buffer, `template.${tpl.ext}`, { type: tpl.mime }),
        await toFile(psn.buffer, `person.${psn.ext}`, { type: psn.mime }),
      ],
      // 1024x1536 = 2:3 portrait, alta resolução para impressão de 49x65mm.
      size: "1024x1536",
      quality: "high",
    });

    const b64 = result.data?.[0]?.b64_json;
    if (!b64) {
      return NextResponse.json({ error: "OpenAI não retornou imagem" }, { status: 502 });
    }

    return NextResponse.json({
      imageDataUrl: `data:image/png;base64,${b64}`,
      promptUsed: prompt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
