module.exports = {
  purge: [],
  theme: {
    extend: {
      width: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
    },
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
