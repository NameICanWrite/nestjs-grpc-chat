const toCamel = (str) => {
  const lowerStr = str.toLowerCase();
  return lowerStr.replace(/([_-][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

const isObject = (obj) =>
  obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'function';

export const keysToCamel = (obj) => {
  if (isObject(obj)) {
    const n = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const k of Object.keys(obj)) {
      n[toCamel(k)] = keysToCamel(obj[k]);
    }

    return n;
  }
  if (Array.isArray(obj)) {
    return obj.map((i) => {
      return keysToCamel(i);
    });
  }

  return obj;
};
