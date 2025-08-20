interface LanguageConfig {
  icon: string;
  borderColor: string;
  color: string;
  aliases?: string[];
}

export const languageConfigs: Record<string, LanguageConfig> = {
  typescript: {
    icon: "TS",
    borderColor: "border-[#3178C6]",
    color: "#3178C6",
    aliases: ["ts"],
  },
  javascript: {
    icon: "JS",
    borderColor: "border-[#F7DF1E]",
    color: "#F7DF1E",
    aliases: ["js"],
  },
  python: {
    icon: "PY",
    borderColor: "border-[#3776AB]",
    color: "#3776AB",
    aliases: ["py"],
  },
  java: {
    icon: "JV",
    borderColor: "border-[#007396]",
    color: "#007396",
  },
  c: {
    icon: "C",
    borderColor: "border-[#A8B9CC]",
    color: "#A8B9CC",
  },
  cpp: {
    icon: "C++",
    borderColor: "border-[#00599C]",
    color: "#00599C",
    aliases: ["c++", "cpp"],
  },
  csharp: {
    icon: "C#",
    borderColor: "border-[#239120]",
    color: "#239120",
    aliases: ["cs"],
  },
  go: {
    icon: "GO",
    borderColor: "border-[#00ADD8]",
    color: "#00ADD8",
  },
  rust: {
    icon: "RS",
    borderColor: "border-[#000000]",
    color: "#000000",
    aliases: ["rs"],
  },
  html: {
    icon: "HTML",
    borderColor: "border-[#E34F26]",
    color: "#E34F26",
  },
  css: {
    icon: "CSS",
    borderColor: "border-[#1572B6]",
    color: "#1572B6",
  },
  scss: {
    icon: "SCSS",
    borderColor: "border-[#CC6699]",
    color: "#CC6699",
  },
  json: {
    icon: "JSON",
    borderColor: "border-[#FFB499]",
    color: "#FFB499",
  },
  yaml: {
    icon: "YAML",
    borderColor: "border-[#CB171E]",
    color: "#CB171E",
    aliases: ["yml"],
  },
  xml: {
    icon: "XML",
    borderColor: "border-[#F60]",
    color: "#F60",
  },
  markdown: {
    icon: "MD",
    borderColor: "border-[#D2B48C]",
    color: "#D2B48C",
    aliases: ["md"],
  },
  shell: {
    icon: "SH",
    borderColor: "border-[#4EAA25]",
    color: "#4EAA25",
    aliases: ["bash", "sh"],
  },
  sql: {
    icon: "SQL",
    borderColor: "border-[#4479A1]",
    color: "#4479A1",
  },
  graphql: {
    icon: "GQL",
    borderColor: "border-[#FF69B4]",
    color: "#FF69B4",
    aliases: ["gql"],
  },
  mermaid: {
    icon: "MER",
    borderColor: "border-[#FF3670]",
    color: "#FF3670",
  },
  plaintext: {
    icon: "TXT",
    borderColor: "border-gray-400",
    color: "#9CA3AF",
    aliases: ["txt", "plaintext", "plaintxt"],
  },
};

export function normalizeLanguage(lang: string): string {
  for (const [key, config] of Object.entries(languageConfigs)) {
    if (key === lang || config.aliases?.includes(lang)) {
      return key;
    }
  }
  return "plaintext";
}
