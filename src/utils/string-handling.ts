export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const fromKebabToCamelCase = (str: string): string => {
  return str
    .split('-')
    .map((c, i) => (i === 0 ? c : capitalize(c)))
    .join('');
};

export const fromKebabToPascalCase = (str: string): string => {
  return str
    .split('-')
    .map((c) => capitalize(c))
    .join('');
};

export const fromKebabToSnakeCase = (str: string): string => {
  return str.replace(/-/g, '_');
};

export const fromKebabToUpperSnakeCase = (str: string): string => {
  return str.replace(/-/g, '_').toUpperCase();
};

export const searchString = (target: string | string[], searchValue: string): boolean => {
  const searchKey = searchValue.toLowerCase();
  const searchTarget = target instanceof Array ? target.map((str) => str.toLowerCase()) : target.toLowerCase();
  const searchResult =
    searchTarget instanceof Array ? !!searchTarget.find((str) => str.includes(searchKey)) : searchTarget.includes(searchKey);
  return searchResult;
};

export const truncateStringByCharaters = (content: string, maxLength: number): string => {
  const contentLength = content.length;
  return `${content.slice(0, contentLength > maxLength ? maxLength : contentLength)}${contentLength > maxLength ? '...' : ''}`;
};

export const truncateStringByWords = (content: string, maxWords: number): string => {
  const contentSplited = content.split(' ');
  if (maxWords >= contentSplited.length) {
    return content;
  }
  const contentSplitedOptimized = contentSplited.filter((_, index) => index < maxWords);
  const contentTruncated = contentSplitedOptimized.join(' ');
  return `${contentTruncated}...`;
};

export const removeAllSpace = (str: string): string => {
  return str.replace(/ /g, '');
};

export const removeVietnameseAccents = (str: string): string => {
  let content = str;
  content = content.toLowerCase();
  content = content.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  content = content.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  content = content.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  content = content.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  content = content.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  content = content.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  content = content.replace(/đ/g, 'd');
  content = content.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  content = content.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return content;
};
