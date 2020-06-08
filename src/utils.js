function range(start, end) {
  if (start === end) return [start];
  return [start, ...range(start + 1, end)];
}

const chunk = (input, size) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
};

export { range, chunk };
