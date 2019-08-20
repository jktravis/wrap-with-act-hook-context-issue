import styled from "@emotion/styled";
import React from "react";
import RBPagination from "reactstrap/lib/Pagination";
import PaginationItem from "reactstrap/lib/PaginationItem";
import PaginationLink from "reactstrap/lib/PaginationLink";
import * as R from "ramda";

interface Props {
  canNext: boolean;
  canPrevious: boolean;
  data: any[];
  defaultPage: number;
  defaultPageSize: number;
  loading: boolean;
  nextText: string;
  ofText: string;
  onPageChange: (pageIndex) => void;
  page: number;
  pageJumpText: string;
  pageSize: number;
  pageSizeOptions: number[];
  pageText: string;
  pages: number;
  previousText: string;
  rowsText: string;
  showPageJump: boolean;
  showPageSizeOptions: boolean;
}

const PagerWrapper: any = styled("div")`
  -webkit-tap-highlight-color: ${({ theme }) => theme.colors.black};
  -webkit-touch-callout: none;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
  color: ${({ theme }) => theme.colors.fontColor};
  cursor: default;
  display: flex;
  outline: 0;
  overflow: hidden;
  padding: 0.375rem;
  ul {
    margin: 0;
  }

  nav {
    flex-grow: 1;
  }
`;

const MAX_PAGER_BUTTONS = 10;
const getMaxPagerCount = (numPages, threshold = MAX_PAGER_BUTTONS) => {
  return Math.min(numPages, threshold);
};

const getPagerRange = R.curry((page, totalPages, maxPagerItems) => {
  if (page < maxPagerItems) {
    return [0, maxPagerItems];
  }

  // avoid an off-by-one error
  if (page % maxPagerItems === 0) {
    page = page + 1;
  }

  const maxRange = Math.ceil(page / maxPagerItems) * maxPagerItems;
  const minRange = maxRange - maxPagerItems;

  return [minRange, maxRange > totalPages ? totalPages : maxRange];
});

const getCountInfo = (page, pageSize, ofText, dataSize) => {
  if (!dataSize) {
    return "";
  }
  const firstNum = page > 0 ? page * pageSize + 1 : 1;
  const secondNum = firstNum - 1 + pageSize;

  return `${firstNum} - ${secondNum > dataSize ? dataSize : secondNum} ${ofText} ${dataSize}`;
};

function Pagination(props: Props) {
  const {
    data,
    canNext,
    canPrevious,
    defaultPage,
    defaultPageSize,
    loading,
    nextText,
    ofText,
    page,
    pageSize,
    pageJumpText,
    pageSizeOptions,
    pageText,
    pages,
    previousText,
    rowsText,
    showPageJump,
    showPageSizeOptions,
    onPageChange,
  } = props;

  const incPage = R.compose(
    onPageChange,
    R.inc,
  );
  const decPage = R.compose(
    onPageChange,
    R.dec,
  );

  const isPageActive = R.equals(page);

  const pagerRange = R.compose(
    R.apply(R.range),
    getPagerRange(page, pages),
    getMaxPagerCount,
  )(pages);

  return (
    <PagerWrapper>
      <RBPagination>
        <PaginationItem disabled={!canPrevious} data-testid="react-table__pager__first">
          <PaginationLink first href="#" onClick={() => onPageChange(0)} />
        </PaginationItem>

        <PaginationItem disabled={!canPrevious} data-testid="react-table__pager__prev">
          <PaginationLink previous href="#" onClick={() => decPage(page)} aria-label={previousText} />
        </PaginationItem>

        {R.head(pagerRange) > 0 && (
          <PaginationItem disabled={!canPrevious} data-testid="react-table__pager__prev-range">
            <PaginationLink
              previous
              href="#"
              onClick={() =>
                R.compose(
                  decPage,
                  R.head,
                )(pagerRange)
              }
              aria-label={previousText}
            >
              ...
            </PaginationLink>
          </PaginationItem>
        )}

        {R.compose(
          R.map(n => (
            <PaginationItem active={isPageActive(n)} key={n}>
              <PaginationLink
                href="#"
                onClick={() => isPageActive(n) || onPageChange(n)}
                aria-label={`${pageText} ${n + 1}`}
              >
                {R.inc(n)}
              </PaginationLink>
            </PaginationItem>
          )),
        )(pagerRange)}

        {R.last(pagerRange) < pages - 1 && (
          <PaginationItem disabled={!canNext} data-testid="react-table__pager__next-range">
            <PaginationLink
              next
              href="#"
              onClick={() =>
                R.compose(
                  incPage,
                  R.last,
                )(pagerRange)
              }
              aria-label={nextText}
            >
              ...
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem disabled={!canNext} data-testid="react-table__pager__next">
          <PaginationLink next href="#" onClick={() => incPage(page)} aria-label={nextText} />
        </PaginationItem>

        <PaginationItem disabled={!canNext} data-testid="react-table__pager__last">
          <PaginationLink last href="#" onClick={() => onPageChange(pages)} aria-label={nextText} />
        </PaginationItem>
      </RBPagination>

      <div className="count" data-testid="react-table__pager__total">
        {getCountInfo(page, pageSize, ofText, data.length)}
      </div>
    </PagerWrapper>
  );
}

export { getMaxPagerCount, getCountInfo, getPagerRange };

export default Pagination;
