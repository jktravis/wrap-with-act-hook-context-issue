import React from "react";
import ReactTable from "react-table";
import Pagination from "./Pagination";

function Table(props) {
  return <ReactTable PaginationComponent={Pagination} className="-striped -highlight" {...props} />;
}

export default Table;
