import { render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "emotion-theming";

const renderWithTheme = (ui, options = {}) => {
  const theme = {
    colors: {
      white: "#f7f7f7",
      borderColor: "#dde2e7",
      lightGray: "#9f9d9d",
      darkGray: "#343A40",
      black: "#2d2d2d",
      fontColor: "#212529",
      logoBlack: "#1d2122",
      accentColor: "#d83326",
    },
  };

  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>, options);
};

export default renderWithTheme;
