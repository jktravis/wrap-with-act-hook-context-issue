import * as R from "ramda";

const pickPrimaryKeyAndInfoType = R.pick(["PrimaryKey", "InformationType"]);

export {
  pickPrimaryKeyAndInfoType,
};
