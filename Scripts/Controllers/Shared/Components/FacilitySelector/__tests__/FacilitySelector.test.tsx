import React from "react";
import { wait, waitForElement, fireEvent, render } from "@testing-library/react";
import FacilitySelector from "../FacilitySelector";

jest.mock("Api/facilityApi");
jest.mock("Api/mapApi");
jest.mock("Api/translationApi", () => {
  return {
    getTranslations: jest.fn(() =>
      Promise.resolve({
        CategoryTitle: "Category",
        Close: "Close",
        DescriptionTitle: "Description",
        FacilitySearchExistingText: "Search for an existing facility within the system.",
        FacilitySelectorText: "Facility Selector",
        FacilityTitle: "Facility",
        Keyword: "Keyword",
        NameTitle: "Name",
        NoDataMatchedCriteria: "No data matched that criteria.",
        OrganizationColumn: "Organization",
        SearchTitle: "Search",
        SelectAndCloseText: "Select and Close",
        SelectAndContinueText: "Select and Continue",
        SubCategoryTitle: "Sub Category",
      }),
    ),
  };
});

describe("FacilitySelector", () => {
  let props;
  beforeEach(() => {
    props = {
      isOpen: true,
      toggleFn: jest.fn(),
      selectFacilityFn: jest.fn(),
    };
  });

  describe("when translations load successfully", () => {
    it("should show the content", async () => {
      const { getByTestId } = render(<FacilitySelector {...props} />);
      // @ts-ignore
      await wait(() => expect(getByTestId("content")).toBeInTheDocument());
    });

    describe("when waiting for search results ", () => {
      it("should show a spinner", async () => {
        const { getByTestId, getByLabelText, getByText } = render(<FacilitySelector {...props} />);
        const keywordInput = await waitForElement(() => getByLabelText("Keyword"));

        fireEvent.change(keywordInput, { target: { value: "test" } });
        fireEvent.click(getByText("Search"));

        // @ts-ignore
        expect(getByTestId("spinner")).toBeInTheDocument();
      });
    });
  });

});
