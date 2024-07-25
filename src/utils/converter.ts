import { EColor } from '@/enums/style';

export const convertHexToRgb = (hex: EColor): { r: number; g: number; b: number } | undefined => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const hexHandled = hex.replace(shorthandRegex, function (_, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexHandled);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : undefined;
};

export const convertNumberToVietnameseCurrency = (n: number, separator?: string, hideUnit?: boolean): string => {
  return n
    .toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
    .replace('VND', hideUnit ? '' : 'đ')
    .replaceAll('.', `${separator || '.'}`)
    .trim();
};
