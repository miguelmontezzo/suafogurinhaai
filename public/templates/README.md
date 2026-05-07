# Modelos de figurinha por seleção

Coloque aqui a **figurinha base** de cada seleção do Mundial 2026.
A imagem é usada automaticamente como **primeira imagem** do prompt
quando alguém seleciona aquela seleção em `/generate`.

## Convenção de nome

`{TEAM_CODE}.png` — onde `TEAM_CODE` é o código de 3 letras da seleção
definido em `src/lib/teams.ts`.

Exemplos:

```
public/templates/BRA.png
public/templates/ARG.png
public/templates/FRA.png
public/templates/POR.png
```

## Recomendações

- Formato: **PNG** (preferido) ou JPG.
- Proporção: **2:3** (a figurinha final é 49×65 mm).
- Resolução mínima sugerida: 1024×1536.
- Sem bordas extras — a IA vai usar como referência visual exata.

Para subir um modelo novo, basta adicionar o arquivo aqui e fazer commit/push.
O deploy do Vercel atualiza automaticamente.
