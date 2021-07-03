const cache = {
  error: [] as Array<any[]>,
};

export const logger = {
  error: (...args: any) => {
    cache.error.push(...args);
    console.warn(...args);
  },
  cache,
};
