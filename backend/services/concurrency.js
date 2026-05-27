export const mapWithConcurrency = async (items, limit, fn) => {
  const results = new Array(items.length);
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await fn(items[index], index);
    }
  };

  const workers = Math.min(limit, items.length);
  await Promise.all(Array.from({ length: workers }, worker));
  return results;
};
