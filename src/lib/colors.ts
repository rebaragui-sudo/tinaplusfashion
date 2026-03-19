
export const COLOR_MAP: Record<string, string> = {
  '#e5b791': 'Nude',
  '#000000': 'Preto',
  '#b9b4d2': 'Lavanda',
  '#99b798': 'Verde Menta',
  '#eeb38b': 'Salmão',
  '#fff8ad': 'Amarelo',
  '#573230': 'Marrom',
  '#ccc08f': 'Dourado',
  '#8fa4c4': 'Azul Serenity',
  '#262222': 'Grafite',
  '#ffffff': 'Branco',
  '#b56d08': 'Caramelo',
  '#dacec5': 'Off White',
  '#936a25': 'Ouro',
  '#5c400f': 'Marrom Escuro',
  '#eadcc2': 'Creme',
  '#f3d1d1': 'Rosa Claro',
  '#a38fce': 'Roxo',
  '#9bcbee': 'Azul Bebê',
  '#f7a78d': 'Pêssego',
  '#da1010': 'Vermelho',
  '#9fbe9d': 'Verde Oliva',
  '#136c6b': 'Verde Petróleo',
  '#306991': 'Azul Petróleo',
  '#c35046': 'Terracota',
  '#f2f2e9': 'Marfim',
};

export const getColorName = (color: string) => {
  if (!color) return '';
  if (color.includes(':')) {
    return color.split(':')[0];
  }
  return COLOR_MAP[color.toLowerCase()] || color;
};

export const getColorValue = (color: string) => {
  if (!color) return '';
  if (color.includes(':')) {
    return color.split(':')[1];
  }
  if (color.startsWith('#')) return color;
  // Reverse lookup if it's a name
  const entry = Object.entries(COLOR_MAP).find(([_, name]) => name.toLowerCase() === color.toLowerCase());
  return entry ? entry[0] : color;
};

export const isEstampa = (color: string) => {
  if (!color) return false;
  if (color.includes(':')) return color.split(':')[1] === 'estampa';
  return false;
};

export const getEstampaImage = (color: string): string | null => {
  if (!color) return null;
  const parts = color.split(':');
  if (parts[1] === 'estampa' && parts[2]) return parts.slice(2).join(':');
  return null;
};
