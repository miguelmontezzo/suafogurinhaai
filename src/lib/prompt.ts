export type StickerData = {
  selecao: string;
  nomePersonagem: string;
  dataNascimento: string;
  alturaMetros: string;
  pesoKg: string;
  nomeTime: string;
  paisDoTime: string;
};

export function buildPrompt(d: StickerData): string {
  return [
    "Na primeira imagem em anexo aparece uma figura do álbum do Mundial 2026.",
    "Quero que você crie uma nova figura com as seguintes características:",
    `1. Eu quero que retire a imagem do jogador e coloque a imagem da pessoa que está na segunda imagem. Quero que tenha a camiseta da ${d.selecao} atual, como a que aparece na figura original. Eu quero que a imagem da pessoa tenha textura, sombras, luzes e cores da foto original.`,
    `2. Quero que no lugar do nome do jogador da figurinha apareça o nome: ${d.nomePersonagem}.`,
    `3. Quero que na parte de data de nascimento, altura e peso apareça: ${d.dataNascimento} / ${d.alturaMetros} / ${d.pesoKg}.`,
    `4. Quero que na parte de equipe apareça: ${d.nomeTime} (${d.paisDoTime}).`,
    "5. A imagem deve ser das mesmas medidas e cores que a primeira imagem anexada.",
    "Não deve acrescentar nada, nem mudar nada da mesma. Só realize as mudanças que você solicitadas.",
  ].join("\n");
}
