const light = {
  colors: {
    white: "#FFFFFF",
    black: "#000000",
    primary: "#1AB394",
    secondary: "#FFB606",
    message: {
      success: "#1AB394",
      info: "#157BD7",
      warn: "#FFB606",
      error: "#A94442",
    },
    text: {
      dark: "#2F3134",
      light: "#777777",
      white: "#FFFFFF",
    },
    base: {
      lightBG: "#FAFAFA",
      darkBG: "#2F3134",
      border: "#777777",
      shadow: "#0000001A",
    },
  },
  dimentions: {
    header: {
      height: "100px",
    },
  },
};

export type Theme = typeof light;
const theme: Theme = light;
export type AccentType = keyof typeof theme.colors.primary;
export default theme;
