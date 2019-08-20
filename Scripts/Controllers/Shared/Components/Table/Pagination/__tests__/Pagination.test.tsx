import { fireEvent } from "@testing-library/react";
import * as R from "ramda";
import React from "react";
import renderWithTheme from "Utilities/testUtils/renderWithTheme";
import Pagination, { getCountInfo, getMaxPagerCount, getPagerRange } from "../Pagination";

describe("Pagination", () => {
  let props;
  beforeEach(() => {
    props = {
      canNext: true,
      canPrevious: false,
      data: [],
      defaultPage: 0,
      defaultPageSize: 20,
      loading: false,
      nextText: "Next",
      ofText: "of",
      onPageChange: jest.fn(),
      page: 0,
      pageJumpText: "jump to page",
      pageSize: 8,
      pageSizeOptions: [5, 10, 20, 25, 50, 100],
      pageText: "Page",
      pages: 28,
      previousText: "Previous",
      rowsText: "rows per page",
      showPageJump: true,
      showPageSizeOptions: false,
    };
  });

  describe("First", () => {
    it("should have a first page option", () => {
      const { getByTestId } = renderWithTheme(<Pagination {...props} />);
      getByTestId("react-table__pager__first");
    });

    describe("when canPrevious is false", () => {
      it("should disable the option", () => {
        props.canPrevious = false;
        const { getByTestId } = renderWithTheme(<Pagination {...props} />);
        // @ts-ignore
        expect(getByTestId("react-table__pager__first")).toHaveClass("disabled");
      });
    });

    describe("when canPrevious is true", () => {
      it("should not disable the option", () => {
        props.canPrevious = true;
        const { getByTestId } = renderWithTheme(<Pagination {...props} />);
        // @ts-ignore
        expect(getByTestId("react-table__pager__first")).not.toHaveClass("disabled");
      });
    });

    describe("when clicked", () => {
      it("should call onPageChange with 0", () => {
        props.canPrevious = true;
        const { getByTestId } = renderWithTheme(<Pagination {...props} />);
        // @ts-ignore
        const first: any = getByTestId("react-table__pager__first").firstChild;
        fireEvent.click(first);
        expect(props.onPageChange).toHaveBeenCalledTimes(1);
        expect(props.onPageChange).toHaveBeenCalledWith(0);
      });
    });
  });

  describe("Previous", () => {
    it("should have a prev page option", () => {
      const { getByTestId } = renderWithTheme(<Pagination {...props} />);
      getByTestId("react-table__pager__prev");
    });

    describe("when canPrevious is false", () => {
      it("should disable the option", () => {
        props.canPrevious = false;
        const { getByTestId } = renderWithTheme(<Pagination {...props} />);
        // @ts-ignore
        expect(getByTestId("react-table__pager__prev")).toHaveClass("disabled");
      });
    });

    describe("when canPrevious is true", () => {
      it("should not disable the option", () => {
        props.canPrevious = true;
        const { getByTestId } = renderWithTheme(<Pagination {...props} />);
        // @ts-ignore
        expect(getByTestId("react-table__pager__prev")).not.toHaveClass("disabled");
      });
    });

    describe("when clicked", () => {
      it("should call onPageChange with the page number - 1", () => {
        props.canPrevious = true;
        props.page = 5;
        const { getByTestId } = renderWithTheme(<Pagination {...props} />);
        // @ts-ignore
        const prev: any = getByTestId("react-table__pager__prev").firstChild;
        fireEvent.click(prev);
        expect(props.onPageChange).toHaveBeenCalledTimes(1);
        expect(props.onPageChange).toHaveBeenCalledWith(4);
      });
    });
  });

  describe("Next", () => {
    it("should have a next page option", () => {
      const { getByTestId } = renderWithTheme(<Pagination {...props} />);
      getByTestId("react-table__pager__next");
    });

    describe("when canNext is false", () => {
      it("should disable the option", () => {
        props.canNext = false;
        const { getByTestId } = renderWithTheme(<Pagination {...props} />);
        // @ts-ignore
        expect(getByTestId("react-table__pager__next")).toHaveClass("disabled");
      });
    });

    describe("when canNext is true", () => {
      it("should not disable the option", () => {
        props.canNext = true;
        const { getByTestId } = renderWithTheme(<Pagination {...props} />);
        // @ts-ignore
        expect(getByTestId("react-table__pager__next")).not.toHaveClass("disabled");
      });
    });

    describe("when clicked", () => {
      it("should call onPageChange with the page number - 1", () => {
        props.canNext = true;
        props.page = 5;
        const { getByTestId } = renderWithTheme(<Pagination {...props} />);
        // @ts-ignore
        const next: any = getByTestId("react-table__pager__next").firstChild;
        fireEvent.click(next);
        expect(props.onPageChange).toHaveBeenCalledTimes(1);
        expect(props.onPageChange).toHaveBeenCalledWith(6);
      });
    });
  });

  describe("Last", () => {
    it("should have a last page option", () => {
      const { getByTestId } = renderWithTheme(<Pagination {...props} />);
      getByTestId("react-table__pager__last");
    });

    describe("when canNext is false", () => {
      it("should disable the option", () => {
        props.canNext = false;
        const { getByTestId } = renderWithTheme(<Pagination {...props} />);
        // @ts-ignore
        expect(getByTestId("react-table__pager__last")).toHaveClass("disabled");
      });
    });

    describe("when canNext is true", () => {
      it("should not disable the option", () => {
        props.canNext = true;
        const { getByTestId } = renderWithTheme(<Pagination {...props} />);
        // @ts-ignore
        expect(getByTestId("react-table__pager__last")).not.toHaveClass("disabled");
      });
    });

    describe("when clicked", () => {
      it("should call onPageChange with the pages count", () => {
        props.canNext = true;
        props.pages = 5;
        const { getByTestId } = renderWithTheme(<Pagination {...props} />);
        // @ts-ignore
        const last: any = getByTestId("react-table__pager__last").firstChild;
        fireEvent.click(last);
        expect(props.onPageChange).toHaveBeenCalledTimes(1);
        expect(props.onPageChange).toHaveBeenCalledWith(props.pages);
      });
    });
  });

  describe("Number Buttons", () => {
    it("should show a link for each page", () => {
      props.pages = 3;

      const { getByText, queryByText } = renderWithTheme(<Pagination {...props} />);

      getByText("1");
      getByText("2");
      getByText("3");
      // @ts-ignore
      expect(queryByText("4")).not.toBeInTheDocument();
    });

    it("should show a max of 10 page buttons", () => {
      props.pages = 11;

      const { getByText, queryByText } = renderWithTheme(<Pagination {...props} />);

      getByText("1");
      getByText("5");
      getByText("10");
      // @ts-ignore
      expect(queryByText("11")).not.toBeInTheDocument();
    });

    describe("when clicking", () => {
      it("should call onPageChange with the page number", () => {
        props.pages = 3;
        props.page = 1;

        const { getByText } = renderWithTheme(<Pagination {...props} />);
        // Note: the display value is n + 1
        fireEvent.click(getByText("3"));

        expect(props.onPageChange).toHaveBeenCalledTimes(1);
        expect(props.onPageChange).toHaveBeenCalledWith(2);
      });

      describe("when already on current page", () => {
        it("should NOT call onPageChange", () => {
          props.pages = 3;
          props.page = 2;

          const { getByText } = renderWithTheme(<Pagination {...props} />);
          // Note: the display value is n + 1
          fireEvent.click(getByText("3"));

          expect(props.onPageChange).not.toHaveBeenCalled();
        });
      });
    });

    describe("when page is active", () => {
      it("should have an active class", () => {
        props.pages = 11;
        props.page = 4;

        const { getByText } = renderWithTheme(<Pagination {...props} />);

        // Note: the display value is n + 1
        const activeLi: any = getByText("5").parentNode;
        // @ts-ignore
        expect(activeLi).toHaveClass("active");
      });

      it("should only have one active page", () => {
        props.pages = 3;
        props.page = 1;

        const { getByText } = renderWithTheme(<Pagination {...props} />);

        // Note: the display value is n + 1
        const one: any = getByText("1").parentNode;
        // @ts-ignore
        expect(one).not.toHaveClass("active");

        const three: any = getByText("3").parentNode;
        // @ts-ignore
        expect(three).not.toHaveClass("active");
      });
    });

    describe("when page is greater than the pageItem threshold", () => {
      it("should offset the numbers by a multiple of that threshold", () => {
        props.pages = 30;
        props.page = 10;

        const { getByText } = renderWithTheme(<Pagination {...props} />);

        // Note: the display value is n + 1
        const activeLi: any = getByText("11").parentNode;
        // @ts-ignore
        expect(activeLi).toHaveClass("active");
      });
    });
  });

  describe("Ellipse Buttons", () => {
    describe("Previous Range", () => {
      describe("when pager range has no lower ranges", () => {
        it("should not show a previous range ellipse", () => {
          props.pages = 20;
          props.page = 9;

          const { queryByTestId } = renderWithTheme(<Pagination {...props} />);

          // @ts-ignore
          expect(queryByTestId("react-table__pager__prev-range")).not.toBeInTheDocument();
        });
      });
      describe("when pager range has lower ranges", () => {
        it("should show a previous range ellipse", () => {
          props.pages = 20;
          props.page = 10;

          const { queryByTestId } = renderWithTheme(<Pagination {...props} />);

          // @ts-ignore
          expect(queryByTestId("react-table__pager__prev-range")).toBeInTheDocument();
        });

        describe("when clicked", () => {
          it("should call onPageChange with the last page of the previous range", () => {
            props.pages = 20;
            props.page = 10;

            const { getByTestId } = renderWithTheme(<Pagination {...props} />);

            const link: any = getByTestId("react-table__pager__prev-range").firstChild;
            fireEvent.click(link);

            expect(props.onPageChange).toBeCalledTimes(1);
            expect(props.onPageChange).toBeCalledWith(9);
          });
        });
      });
    });

    describe("Next Range", () => {
      describe("when pager range has does not have higher ranges", () => {
        it("should not show a next range ellipse", () => {
          props.pages = 20;
          props.page = 10;

          const { queryByTestId } = renderWithTheme(<Pagination {...props} />);

          // @ts-ignore
          expect(queryByTestId("react-table__pager__next-range")).not.toBeInTheDocument();
        });
      });
      describe("when pager range has higher ranges", () => {
        it("should show a next range ellipse", () => {
          props.pages = 20;
          props.page = 9;

          const { queryByTestId } = renderWithTheme(<Pagination {...props} />);

          // @ts-ignore
          expect(queryByTestId("react-table__pager__next-range")).toBeInTheDocument();
        });

        describe("when clicked", () => {
          it("should call onPageChange with the last page of the previous range", () => {
            props.pages = 20;
            props.page = 9;

            const { getByTestId } = renderWithTheme(<Pagination {...props} />);

            const link: any = getByTestId("react-table__pager__next-range").firstChild;
            fireEvent.click(link);

            expect(props.onPageChange).toBeCalledTimes(1);
            expect(props.onPageChange).toBeCalledWith(10);
          });
        });
      });
    });
  });

  describe("Totals", () => {
    describe("when there is no data", () => {
      it("should show nothing", () => {
        const { getByTestId } = renderWithTheme(<Pagination {...props} />);
        expect(getByTestId("react-table__pager__total")).toMatchInlineSnapshot(`
          <div
            class="count"
            data-testid="react-table__pager__total"
          />
        `);
      });
    });

    it("should display the current range of items", () => {
      props.page = 0;
      props.data = R.range(0, 20).map(() => {});

      const { getByText } = renderWithTheme(<Pagination {...props} />);

      getByText(`1 - 8 ${props.ofText} 20`);
    });

    describe("when page is non-zero", () => {
      it("should display the next in the range", () => {
        props.page = 1;
        props.pageSize = 10;
        props.data = R.range(0, 20).map(() => {});

        const { getByText } = renderWithTheme(<Pagination {...props} />);

        getByText(`11 - 20 ${props.ofText} 20`);
      });
    });
  });

  describe("getCountInfo", () => {
    describe("when dataSize is falsy", () => {
      it("should return an empty string", () => {
        expect(getCountInfo(undefined, undefined, undefined, undefined)).toEqual("");
      });
    });

    describe("when page is 0", () => {
      it("should return the first set of values", () => {
        const page = 0;
        const pageSize = 10;
        const ofText = "of";
        const dataSize = 20;
        expect(getCountInfo(page, pageSize, ofText, dataSize)).toEqual("1 - 10 of 20");
      });
    });

    describe("when page is greater than 1", () => {
      it("should return the second set of values", () => {
        const page = 1;
        const pageSize = 10;
        const ofText = "of";
        const dataSize = 20;
        expect(getCountInfo(page, pageSize, ofText, dataSize)).toEqual("11 - 20 of 20");
      });
    });

    describe("when page is the last page, and there are fewer items than the page size", () => {
      it("should return the second set of values", () => {
        const page = 1;
        const pageSize = 10;
        const ofText = "of";
        const dataSize = 15;
        expect(getCountInfo(page, pageSize, ofText, dataSize)).toEqual("11 - 15 of 15");
      });
    });
  });

  describe("getMaxPagerCount", () => {
    it("should return the min between given numPages threshold", () => {
      expect(getMaxPagerCount(10, 10)).toEqual(10);
      expect(getMaxPagerCount(28, 10)).toEqual(10);
      expect(getMaxPagerCount(5, 10)).toEqual(5);
    });

    it("should default threshold to 10", () => {
      expect(getMaxPagerCount(10)).toEqual(10);
    });
  });

  describe("getPagerRange", () => {
    describe("when page is less than max", () => {
      it("should return base tuple", () => {
        const max = 10;
        const totalPages = 20;

        expect(getPagerRange(0, totalPages, max)).toEqual([0, max]);
        expect(getPagerRange(1, totalPages, max)).toEqual([0, max]);
        expect(getPagerRange(2, totalPages, max)).toEqual([0, max]);
        expect(getPagerRange(3, totalPages, max)).toEqual([0, max]);
        expect(getPagerRange(4, totalPages, max)).toEqual([0, max]);
        expect(getPagerRange(5, totalPages, max)).toEqual([0, max]);
        expect(getPagerRange(6, totalPages, max)).toEqual([0, max]);
        expect(getPagerRange(7, totalPages, max)).toEqual([0, max]);
        expect(getPagerRange(8, totalPages, max)).toEqual([0, max]);
        expect(getPagerRange(9, totalPages, max)).toEqual([0, max]);
      });
    });

    describe("when page is between 11 through max * 2", () => {
      it("should return page range for current page", () => {
        const max = 10;
        const totalPages = 30;

        expect(getPagerRange(10, totalPages, max)).toEqual([10, 20]);
        expect(getPagerRange(11, totalPages, max)).toEqual([10, 20]);
        expect(getPagerRange(12, totalPages, max)).toEqual([10, 20]);
        expect(getPagerRange(13, totalPages, max)).toEqual([10, 20]);
        expect(getPagerRange(14, totalPages, max)).toEqual([10, 20]);
        expect(getPagerRange(15, totalPages, max)).toEqual([10, 20]);
        expect(getPagerRange(16, totalPages, max)).toEqual([10, 20]);
        expect(getPagerRange(17, totalPages, max)).toEqual([10, 20]);
        expect(getPagerRange(18, totalPages, max)).toEqual([10, 20]);
        expect(getPagerRange(19, totalPages, max)).toEqual([10, 20]);
      });
    });

    describe("when page is between 21 through max * 3", () => {
      it("should return page range for current page", () => {
        const max = 10;
        const totalPages = 30;

        expect(getPagerRange(20, totalPages, max)).toEqual([20, 30]);
        expect(getPagerRange(21, totalPages, max)).toEqual([20, 30]);
        expect(getPagerRange(22, totalPages, max)).toEqual([20, 30]);
        expect(getPagerRange(23, totalPages, max)).toEqual([20, 30]);
        expect(getPagerRange(24, totalPages, max)).toEqual([20, 30]);
        expect(getPagerRange(25, totalPages, max)).toEqual([20, 30]);
        expect(getPagerRange(26, totalPages, max)).toEqual([20, 30]);
        expect(getPagerRange(27, totalPages, max)).toEqual([20, 30]);
        expect(getPagerRange(28, totalPages, max)).toEqual([20, 30]);
        expect(getPagerRange(29, totalPages, max)).toEqual([20, 30]);
      });
    });

    describe("when max is 8 and page is between 21 through max * 3", () => {
      it("should return page range for current page", () => {
        const max = 8;
        const totalPages = 30;

        expect(getPagerRange(0, totalPages, max)).toEqual([0, 8]);
        expect(getPagerRange(1, totalPages, max)).toEqual([0, 8]);
        expect(getPagerRange(2, totalPages, max)).toEqual([0, 8]);
        expect(getPagerRange(3, totalPages, max)).toEqual([0, 8]);
        expect(getPagerRange(4, totalPages, max)).toEqual([0, 8]);
        expect(getPagerRange(5, totalPages, max)).toEqual([0, 8]);
        expect(getPagerRange(6, totalPages, max)).toEqual([0, 8]);
        expect(getPagerRange(7, totalPages, max)).toEqual([0, 8]);

        expect(getPagerRange(8, totalPages, max)).toEqual([8, 16]);
        expect(getPagerRange(9, totalPages, max)).toEqual([8, 16]);
        expect(getPagerRange(10, totalPages, max)).toEqual([8, 16]);
        expect(getPagerRange(11, totalPages, max)).toEqual([8, 16]);
        expect(getPagerRange(12, totalPages, max)).toEqual([8, 16]);
        expect(getPagerRange(13, totalPages, max)).toEqual([8, 16]);
        expect(getPagerRange(14, totalPages, max)).toEqual([8, 16]);
        expect(getPagerRange(15, totalPages, max)).toEqual([8, 16]);
      });
    });

    describe("when page is within range of last segment, and total pages is less", () => {
      it("should return a smaller range", () => {
        const max = 10;
        const totalPages = 28;

        expect(getPagerRange(27, totalPages, max)).toEqual([20, 28]);
      });
    });
  });
});
