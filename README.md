# Sua Fogurinha AI · Mundial 2026

Gerador de figurinhas personalizadas do álbum do Mundial 2026 usando `gpt-image-2` (OpenAI Images API).

## Fluxo

1. **Cadastrar modelo** (`/templates`): suba a figurinha base de cada seleção.
   Essa imagem entra como **primeira imagem** do prompt da geração.
2. **Gerar** (`/generate`):
   1. selecione a seleção
   2. tire uma foto da pessoa (câmera ou upload)
   3. preencha **nome do personagem**, **dia/mês/ano**, **altura (m)**, **peso (kg)**, **time** e **país do time**
   4. clique em **Gerar figurinha**
3. **Cópias**: depois da geração escolha quantas cópias adicionar à **fila**.
4. **Imprimir** (`/queue`): a fila monta sozinha as folhas A4 (4×4 = 16 figurinhas por folha, 49×65 mm cada). Clique em **Imprimir** — apenas folhas inteiras devem ir para a impressora.

## Prompt enviado à OpenAI

O texto preenchido com os dados é exatamente o template solicitado:

```
Na primeira imagem em anexo aparece uma figura do álbum do Mundial 2026.
Quero que você crie uma nova figura com as seguintes características:
1. Eu quero que retire a imagem do jogador e coloque a imagem da pessoa que está na segunda imagem...
...
```

A chamada usa `images.edit` do `gpt-image-2` com **duas imagens** (template + foto da pessoa)
e tamanho **1024×1536 (2:3)**, o suficiente para impressão nítida em 49×65 mm.

## Variáveis de ambiente

Crie `.env.local` (ou configure no Vercel):

```
OPENAI_API_KEY=sk-...
OPENAI_IMAGE_MODEL=gpt-image-2
```

## Rodando localmente

```bash
npm install
npm run dev
# http://localhost:3000
```

> A câmera (`getUserMedia`) só funciona em `https://` ou em `http://localhost`.

## Deploy no Vercel

1. Crie um projeto novo no [vercel.com](https://vercel.com) apontando para este repositório.
2. Em **Settings → Environment Variables** configure `OPENAI_API_KEY`.
3. (Opcional) configure `OPENAI_IMAGE_MODEL` (default `gpt-image-2`).
4. **Deploy**. A rota `/api/generate` roda em Node runtime.

## Armazenamento

Modelos cadastrados e a fila de impressão ficam no **localStorage** do navegador
(o servidor não persiste imagens — só faz a chamada à OpenAI). Isso mantém o
deploy serverless trivial e leva os dados pessoais da pessoa a ficarem só no
dispositivo.

## Especificações técnicas

| Item | Valor |
|---|---|
| Tamanho da figurinha | 49 × 65 mm |
| Razão | 2:3 |
| Resolução de geração | 1024 × 1536 (gpt-image-2) |
| Folha de impressão | A4 (210 × 297 mm) |
| Grid por folha | 4 colunas × 4 linhas = 16 figurinhas |
