import { css } from "styled-components";

export const FONTS = {
  name: "Pretendard",
  category: "sans-serif",
  fallback: "'Pretendard', -apple-system, sans-serif",
  googleFontsFamily: null,

  // 용도별 세부 지정
  roles: {
    display: {
      weight: 900,     // Black
      size: "40px",
      lineHeight: "36px",
      
    },
    title: {
      weight: 700,     // Bold
      size: "24px",
      lineHeight: "36px",
      letterSpacing: "-1px"
      
    },
    subtitle: {
      weight: 700,
      size: "22px",       
      lineHeight: "30px",
      
    },
    heading: {
      weight: 600,  // semiBold
      size: "18px",       
      lineHeight: "26px",
    },
    body: {
      weight: 600,
      size: "16px",         
      lineHeight: "24px",
      letterSpacing: "-0.5px"
      
    },
    semibody: {
      weight: 600,
      size: "14px",     
      lineHeight: "20px",
      
    },
    boldbody: {
      weight: 700,
      size: "12px",     
      lineHeight: "normal",
      letterSpacing: "-0.5px"
      
    },
    regbody: {
      weight: 400,
      size: "12px",     
      lineHeight: "normal",
      
    },
  }
}

export const font = (key) => {
  const role = FONTS.roles[key];
  return css`
    font-weight: ${role.weight};
    font-size: ${role.size};
    line-height: ${role.lineHeight};
    letter-spacing: ${role.letterSpacing};
  `;
};

export default FONTS;