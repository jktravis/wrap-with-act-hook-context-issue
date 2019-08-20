import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import TestApp from "../ReactSelectTestingTestComponent";

afterEach(cleanup);

describe("TestApp", () => {
  let props;
  beforeEach(() => {
    props = {};
  });

  it("should work", () => {
    const { getByText, getByLabelText, getByTestId } = render(<TestApp {...props} />);
    const select = getByLabelText("Select Option");
    const selectInput = select.querySelector("input");
    fireEvent.focus(selectInput, {});

    const selectControl = select.querySelector(".react-select__control");

    fireEvent.mouseDown(selectControl, {});
    // options are now queryable via '.react-select__option'
    const third = getByText("Third");
    fireEvent.click(third);
    const renderResult = getByTestId("render-result");
    // @ts-ignore
    expect(renderResult).toBeInTheDocument();
  });

  it("should work without using a label, too", () => {
    const { baseElement, getByText, getByTestId } = render(<TestApp {...props} />);
    const select = baseElement.querySelector(".react-select");
    const selectInput = select.querySelector("input");
    fireEvent.focus(selectInput);

    const selectControl = select.querySelector(".react-select__control");

    fireEvent.mouseDown(selectControl);
    // options are now queryable via '.react-select__option'
    expect(select.querySelectorAll(".react-select__option").length).toEqual(3);
    const third = getByText("Third");
    fireEvent.click(third);
    const renderResult = getByTestId("render-result");
    // @ts-ignore
    expect(renderResult).toBeInTheDocument();
  });
});
