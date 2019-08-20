import isEven from "../isEven";
import { compose, not } from "ramda";

const isOdd = compose(
  not,
  isEven,
);

export default isOdd;
