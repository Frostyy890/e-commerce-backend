export const objectOmitKeys = (obj, ...keys) => {
  return Object.keys(obj).reduce((newObj, key) => {
    if (!keys.includes(key)) {
      newObj[key] = obj[key];
    }
    return newObj;
  }, {});
};
