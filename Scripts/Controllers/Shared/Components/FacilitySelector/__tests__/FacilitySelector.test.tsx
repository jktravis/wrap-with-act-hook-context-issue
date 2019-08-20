import React from "react";
import { wait, waitForElement, fireEvent } from "@testing-library/react";
import renderWithTheme from "Utilities/testUtils/renderWithTheme";
import FacilitySelector from "../FacilitySelector";
import { getTranslations } from "Api/translationApi";
import { searchAllFacilities, getCategoriesForIncident } from "Api/facilityApi";

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
  let props, searchResultMock;
  beforeEach(() => {
    searchResultMock = [
      {
        PrimaryKey: "123",
        CurrentCultureTranslation: "Name 1",
        FriendlyOrgName: "Org Name 1",
        ScrubbedFacilityDescription: "Description1",
        FacilityCategory: "Category 1",
        FacilitySubCategory: "Sub Cat 1",
      },
    ];
    props = {
      isOpen: true,
      toggleFn: jest.fn(),
      selectFacilityFn: jest.fn(),
    };
  });

  describe("on load", () => {
    it("should call the translation api", async () => {
      renderWithTheme(<FacilitySelector {...props} />);
      // @ts-ignore
      expect(getTranslations).toHaveBeenCalled();
    });

    describe("when incidentId is missing", () => {
      it("should _not_ get categories for available facilities", () => {
        renderWithTheme(<FacilitySelector {...props} />);
        // @ts-ignore
        expect(getCategoriesForIncident).not.toHaveBeenCalled();
      });
    });

    describe("when incidentId is given", () => {
      it("should get categories for available facilities", () => {
        renderWithTheme(<FacilitySelector {...props} incidentId={"123"} />);
        // @ts-ignore
        expect(getCategoriesForIncident).toHaveBeenCalledWith("123");
      });
    });

    it("should show a load spinner", () => {
      const { getByTestId } = renderWithTheme(<FacilitySelector {...props} />);

      // @ts-ignore
      expect(getByTestId("spinner")).toBeInTheDocument();
    });
  });

  describe("when translations load successfully", () => {
    it("should show the content", async () => {
      const { getByTestId } = renderWithTheme(<FacilitySelector {...props} />);
      // @ts-ignore
      await wait(() => expect(getByTestId("content")).toBeInTheDocument());
    });

    describe("when no incidentId is provided", () => {
      it("should NOT offer category search", async () => {
        const { queryByTestId } = renderWithTheme(<FacilitySelector {...props} />);

        await wait();

        // @ts-ignore
        expect(queryByTestId("category-selection")).not.toBeInTheDocument();
      });

      it("should NOT offer tag search", async () => {
        const { queryByLabelText } = renderWithTheme(<FacilitySelector {...props} />);

        await wait();

        // @ts-ignore
        expect(queryByLabelText("Tags")).not.toBeInTheDocument();
      });
    });

    describe("when incidentId is provided", () => {
      it("should offer category search", async () => {
        const { getByTestId } = renderWithTheme(<FacilitySelector {...props} incidentId={"123"} />);

        await waitForElement(() => getByTestId("category-selection"));
      });

      it("should offer tag search", async () => {
        const { getByLabelText } = renderWithTheme(<FacilitySelector {...props} incidentId={"123"} />);

        await waitForElement(() => getByLabelText("Tags"));
      });
    });

    describe("when no input has been entered", () => {
      it("should disable the search button", async () => {
        const { getByText } = renderWithTheme(<FacilitySelector {...props} />);
        await wait(() => {
          // @ts-ignore
          expect(getByText("Search")).toHaveAttribute("disabled");
        });
      });
    });

    describe("when input has been entered", () => {
      it("should enable the search button", async () => {
        const { getByText, getByLabelText } = renderWithTheme(<FacilitySelector {...props} />);
        await wait(() => {
          const keywordInput = getByLabelText("Keyword");
          fireEvent.change(keywordInput, { target: { value: "test" } });
          // @ts-ignore
          expect(getByText("Search")).not.toHaveAttribute("disabled");
        });
      });
    });

    describe("when waiting for search results ", () => {
      it("should show a spinner", async () => {
        const { getByTestId, getByLabelText, getByText } = renderWithTheme(<FacilitySelector {...props} />);
        const keywordInput = await waitForElement(() => getByLabelText("Keyword"));

        fireEvent.change(keywordInput, { target: { value: "test" } });
        fireEvent.click(getByText("Search"));

        // @ts-ignore
        expect(getByTestId("spinner")).toBeInTheDocument();
      });
    });
  });

  describe("when there are no search results ", () => {
    it("should show a message stating so", async () => {
      const { getByLabelText, getByText } = renderWithTheme(<FacilitySelector {...props} />);
      const keywordInput = await waitForElement(() => getByLabelText("Keyword"));

      fireEvent.change(keywordInput, { target: { value: "test" } });
      fireEvent.click(getByText("Search"), {});

      const message = await waitForElement(() => getByText("No data matched that criteria."));
      // @ts-ignore
      expect(message).toBeInTheDocument();
    });
  });

  describe("when there are search results ", () => {
    it("should display table with contents", async () => {
      // @ts-ignore
      searchAllFacilities.mockImplementationOnce(() => Promise.resolve(searchResultMock));
      const { getByLabelText, getByText, getByTestId } = renderWithTheme(<FacilitySelector {...props} />);
      const keywordInput = await waitForElement(() => getByLabelText("Keyword"));

      fireEvent.change(keywordInput, { target: { value: "test" } });
      fireEvent.click(getByText("Search"), {});

      const row = await waitForElement(() => getByTestId(searchResultMock[0].PrimaryKey));
      // @ts-ignore
      expect(row).toBeInTheDocument();
    });
  });

  describe("when translations fail to load", () => {
    const originalError = console.error;
    beforeEach(() => {
      /**
       * Avoid error in console
       */
      console.error = jest.fn();
    });

    afterEach(() => {
      /**
       * restore original console
       */
      console.error = originalError;
    });
    it("should show the content", async () => {
      // @ts-ignore
      getTranslations.mockImplementationOnce(() => Promise.reject("Test error"));
      const { getByTestId } = renderWithTheme(<FacilitySelector {...props} />);

      // @ts-ignore
      await wait(() => expect(getByTestId("error")).toBeInTheDocument());
    });
  });
});
