import { createGlobalStyle } from 'styled-components';
 
export const theme = {
  colors: {
    primary: "#89cdf6",
    primaryHover: "#6fb8ea",
    primaryLight: "#eaf6fd",
    primarySoft: "#d6ecfa",
 
    text: "#43505c",
    textSub: "#5c6b78",
    textLight: "#9aa5b1",
    textMuted: "#b3bdc9",
    border: "#e3e9f0",
    background: "#f8fafc",
 
    error: "#e5484d",
    success: "#3fb37f",
    warning: "#e0a83e",
 
    white: "#ffffff",
  },
  radius: {
    button: "12px",
    card: "28px",
    input: "12px",
    badge: "9999px",
  },
  font: {
    family: "'SUITE Variable', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
  },
  shadow: {
    card: "0 12px 32px rgba(80, 130, 180, 0.14)",
    button: "0 6px 16px rgba(111, 184, 234, 0.35)",
  },
};
 
export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
 
  body {
    font-family: ${theme.font.family};
    background: #f4f7fb;
    color: ${theme.colors.text};
    -webkit-font-smoothing: antialiased;
  }
 
  button {
    font-family: inherit;
    border: none;
    background: none;
    cursor: pointer;
  }
 
  input, textarea {
    font-family: inherit;
  }
`;