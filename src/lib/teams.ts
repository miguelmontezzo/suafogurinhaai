export type Team = {
  code: string;
  name: string;
  flag: string;
};

export const TEAMS: Team[] = [
  { code: "ARG", name: "Argentina", flag: "🇦🇷" },
  { code: "AUS", name: "Austrália", flag: "🇦🇺" },
  { code: "AUT", name: "Áustria", flag: "🇦🇹" },
  { code: "BEL", name: "Bélgica", flag: "🇧🇪" },
  { code: "BRA", name: "Brasil", flag: "🇧🇷" },
  { code: "CMR", name: "Camarões", flag: "🇨🇲" },
  { code: "CAN", name: "Canadá", flag: "🇨🇦" },
  { code: "CHL", name: "Chile", flag: "🇨🇱" },
  { code: "COL", name: "Colômbia", flag: "🇨🇴" },
  { code: "KOR", name: "Coreia do Sul", flag: "🇰🇷" },
  { code: "CRC", name: "Costa Rica", flag: "🇨🇷" },
  { code: "CIV", name: "Costa do Marfim", flag: "🇨🇮" },
  { code: "CRO", name: "Croácia", flag: "🇭🇷" },
  { code: "DEN", name: "Dinamarca", flag: "🇩🇰" },
  { code: "ECU", name: "Equador", flag: "🇪🇨" },
  { code: "EGY", name: "Egito", flag: "🇪🇬" },
  { code: "ESP", name: "Espanha", flag: "🇪🇸" },
  { code: "USA", name: "Estados Unidos", flag: "🇺🇸" },
  { code: "FRA", name: "França", flag: "🇫🇷" },
  { code: "GHA", name: "Gana", flag: "🇬🇭" },
  { code: "GER", name: "Alemanha", flag: "🇩🇪" },
  { code: "ENG", name: "Inglaterra", flag: "🏴" },
  { code: "IRN", name: "Irã", flag: "🇮🇷" },
  { code: "ITA", name: "Itália", flag: "🇮🇹" },
  { code: "JAM", name: "Jamaica", flag: "🇯🇲" },
  { code: "JPN", name: "Japão", flag: "🇯🇵" },
  { code: "MAR", name: "Marrocos", flag: "🇲🇦" },
  { code: "MEX", name: "México", flag: "🇲🇽" },
  { code: "NGA", name: "Nigéria", flag: "🇳🇬" },
  { code: "NOR", name: "Noruega", flag: "🇳🇴" },
  { code: "NZL", name: "Nova Zelândia", flag: "🇳🇿" },
  { code: "NED", name: "Países Baixos", flag: "🇳🇱" },
  { code: "PAN", name: "Panamá", flag: "🇵🇦" },
  { code: "PAR", name: "Paraguai", flag: "🇵🇾" },
  { code: "PER", name: "Peru", flag: "🇵🇪" },
  { code: "POL", name: "Polônia", flag: "🇵🇱" },
  { code: "POR", name: "Portugal", flag: "🇵🇹" },
  { code: "QAT", name: "Catar", flag: "🇶🇦" },
  { code: "KSA", name: "Arábia Saudita", flag: "🇸🇦" },
  { code: "SEN", name: "Senegal", flag: "🇸🇳" },
  { code: "SRB", name: "Sérvia", flag: "🇷🇸" },
  { code: "RSA", name: "África do Sul", flag: "🇿🇦" },
  { code: "SUI", name: "Suíça", flag: "🇨🇭" },
  { code: "SWE", name: "Suécia", flag: "🇸🇪" },
  { code: "TUN", name: "Tunísia", flag: "🇹🇳" },
  { code: "TUR", name: "Turquia", flag: "🇹🇷" },
  { code: "UKR", name: "Ucrânia", flag: "🇺🇦" },
  { code: "URU", name: "Uruguai", flag: "🇺🇾" },
];

export function findTeam(code: string): Team | undefined {
  return TEAMS.find((t) => t.code === code);
}
