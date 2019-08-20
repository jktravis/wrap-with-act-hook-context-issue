import React from "react";
import ReactDOM from "react-dom";
import ErrorBoundary from "Controllers/Shared/Components/ErrorBoundary";
import { IconContext } from "react-icons/lib/esm/index.js";
import { ThemeProvider } from "emotion-theming";

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

/**
 * Use this function to mount a React component from within a non-React file (.ts).
 * Because TypeScript requires a different file extension for both "normal" files and React files, you can't simply use
 * React and ReactDOM from within a TS file. This is partially due to syntactic issues with things like `<any>`. There's
 * really no way for TS to know if this is supposed to be a component/tag named "any", or if this is a type cast.
 * @param {React.Component | React.FunctionComponent} Component The component you want to mount
 * @param {HTMLElement} mountPoint The DOM not on which to mount
 * @param {any} props any additional props that you want the component to have.
 */
function mountComponent({ Component, mountPoint, ...props }) {
  ReactDOM.render(
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <IconContext.Provider value={{ style: { marginTop: "-2px" } }}>
          <Component {...props} />
        </IconContext.Provider>
      </ThemeProvider>
    </ErrorBoundary>,
    mountPoint,
  );
}

/**
 * Unmount a React component form the given mount point
 * @param {HTMLElement} mountPoint
 */
function unmountComponent(mountPoint) {
  ReactDOM.unmountComponentAtNode(mountPoint);
}

export { mountComponent, unmountComponent };
