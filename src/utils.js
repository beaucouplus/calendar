function range(start, end) {
  if (start === end) return [start];
  return [start, ...range(start + 1, end)];
}

const chunk = (input, size) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0 ? [...arr, [item]] : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
};

const renderTwoDigits = (int) => (int < 10 ? `0${int}` : `${int}`);
const hourStringtoNumbers = (string) => string.split(":").map((item) => Number(item));
const numbersToHourString = (hour, minute) => `${renderTwoDigits(Number(hour))}:${renderTwoDigits(Number(minute))}`;

export { range, chunk, renderTwoDigits, hourStringtoNumbers, numbersToHourString };
