module.exports = {
  purge: [],
  theme: {
    extend: {},
  },
  variants: {
    textColor: ["responsive", "hover", "focus", "group-hover", "group-focus"],
    backgroundColor: [
      "responsive",
      "hover",
      "focus",
      "group-hover",
      "group-focus",
      "active",
    ],
    borderWidth: ["responsive", "last"],
    borderColor: [
      "responsive",
      "hover",
      "focus",
      "group-hover",
      "group-focus",
      "focus-within",
      "last",
    ],
    padding: ["responsive", "last"],
    margin: ["responsive", "first", "last"],
  },
  plugins: [],
};
