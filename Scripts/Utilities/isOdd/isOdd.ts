import isEven from "../isEven";
import { complement } from "ramda";

const isOdd = complement( isEven, );

export default isOdd;
