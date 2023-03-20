export const randomEnumValue = (enumeration: { [key: string]: any }): any => {
  const values = Object.keys(enumeration);
  const enumKey = values[Math.floor(Math.random() * values.length)];
  return enumeration[enumKey];
};

export const objectIsEmpty = (obj?: Record<string, unknown>): boolean => {
  return obj ? Object.keys(obj).length === 0 : true;
};

export const getArrayFrom0To = (numb: number): number[] => {
  return Array(numb)
    .fill('')
    .map((_, i) => i);
};
