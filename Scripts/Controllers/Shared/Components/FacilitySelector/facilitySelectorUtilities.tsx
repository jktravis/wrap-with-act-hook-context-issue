import * as R from "ramda";
import React from "react";
import Switch from "react-switch";
import bindActionCreators from "Utilities/bindActionCreators";
import hasLength from "Utilities/hasLength";
import toggleItemInArray from "Utilities/toggleItemInArray";
import { pickPrimaryKeyAndInfoType } from "../../../Tools/Map/Components/utilities/general";
import { LoadingStates, LoadingStatusEvents, transitionLoading } from "../../loadingFsm";

/**
 * @param localizedStrings
 * @param {descriptorQuery:HasPrimaryKeyAndInformationType => (event) => void} handleChange this needs to be a curried function
 * @param currentFacilities
 */
const getColumns = (localizedStrings, handleChange, currentFacilities = []) => {
  return [
    {
      Header: localizedStrings.NameTitle,
      accessor: "CurrentCultureTranslation",
    },
    {
      Header: localizedStrings.CategoryTitle,
      accessor: "FacilityCategory",
    },
    {
      Header: localizedStrings.SubCategoryTitle,
      accessor: "FacilitySubCategory",
    },
    {
      Header: localizedStrings.TagTitle,
      accessor: "TaggedStringsAsString",
    },
    {
      Header: localizedStrings.AddToMap,
      Cell: props => {
        const descriptor = R.compose(
          pickPrimaryKeyAndInfoType,
          R.pathOr({}, ["row", "_original"]),
        )(props);
        const checked = R.includes(descriptor, currentFacilities);
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Switch id={descriptor.PrimaryKey} checked={checked} onChange={handleChange(descriptor)} />
          </div>
        );
      },
    },
  ];
};

const transitionLoadingAction = R.curry((stateKey, event, state) => {
  return R.assoc(stateKey, transitionLoading(R.prop(stateKey, state), event), state);
});

const mappingTranslations = {
  AddToMap: "Add to Map",
  LimitToMapExtent: "Limit to Map Extent",
  YouAreAboutToAddNItemToMap: "You are about to {0} {1} items to the map. Do you wish to continue?",
};

const rootResourceTranslations = {
  AddTitle: "Add",
  AreYouSure: "Are you sure?",
  CancelText: "Cancel",
  CategoryTitle: "Category",
  Close: "Close",
  FacilityNameText: "Facility Name",
  FacilitySearchExistingText: "Search for an existing facility within the system.",
  FacilitySelectorText: "Facility Selector",
  Keyword: "Keyword",
  NameTitle: "Name",
  NoDataMatchedCriteria: "No data matched that criteria.",
  OrganizationColumn: "Organization",
  RemoveTitle: "Remove",
  SearchTitle: "Search",
  SelectAndCloseText: "Select and Close",
  SelectAndContinueText: "Select and Continue",
  SomethingWentWrongText: "Something went wrong",
  SubCategoryTitle: "Sub Category",
  ChooseSearchType: "Search Type",
  SearchByCategoryTags: "Search by Category / Tags",
  TagTitle: "Tags",
  ToggleAllText: "Toggle All",
};

const isFormValid = R.anyPass([
  R.compose(
    hasLength,
    R.prop("keyword"),
  ),
  R.compose(
    R.complement(R.isNil),
    R.prop("category"),
  ),
  R.compose(
    R.complement(R.isNil),
    R.prop("tags"),
  ),
]);

const defaultState = {
  availableCategories: [],
  availableSubCategories: [],
  availableTags: [],
  category: null,
  categoryLoadState: LoadingStates.NotStarted,
  facilityData: [],
  keyword: "",
  loadSearchResultState: LoadingStates.NotStarted,
  selectedItems: [],
  // false is keyword, true is category/tags
  isCategoryTagSearch: false,
  subCategory: null,
  subCategoryLoadState: LoadingStates.NotStarted,
  tagsLoadState: LoadingStates.NotStarted,
  tags: null,
  translationState: LoadingStates.NotStarted,
  useExtent: false,
  localizedStrings: {
    ...rootResourceTranslations,
    ...mappingTranslations,
  },
  areAllToggled: false,
};

enum Actions {
  ChangeInput = "ChangeInput",
  LoadCategoriesInit = "LoadCategoriesInit",
  LoadCategoriesSuccess = "LoadCategoriesSuccess",
  LoadSubCategoriesInit = "LoadSubCategoriesInit",
  LoadSubCategoriesSuccess = "LoadSubCategoriesSuccess",
  LoadTagsInit = "LoadTagsInit",
  LoadTagsSuccess = "LoadTagsSuccess",
  Localize = "Localize",
  Reset = "Reset",
  SearchResults = "SearchResults",
  SelectCategory = "SelectCategory",
  SelectSubCategory = "SelectSubCategory",
  SelectTags = "SelectTags",
  ToggleSearchType = "ToggleSearchType",
  ToggleAll = "ToggleAll",
  ToggleSelection = "ToggleSelection",
  ToggleUseExtent = "ToggleUseExtent",
  TransitionCategory = "TransitionCategory",
  TransitionSearch = "TransitionSearch",
  TransitionSubCategory = "TransitionSubCategory",
  TransitionTags = "TransitionTags",
  TransitionTranslation = "TransitionTranslation",
}

function reducer(state, action = {} as any) {
  const { payload, type } = action;
  switch (type) {
    case Actions.SearchResults:
      return R.compose(
        state => {
          const setAreAllToggled = R.assoc("areAllToggled");
          if (state.facilityData.length <= state.selectedItems.length) {
            return setAreAllToggled(
              state.facilityData.every(d => {
                return R.includes(pickPrimaryKeyAndInfoType(d), state.selectedItems);
              }),
              state,
            );
          }
          return setAreAllToggled(false, state);
        },
        R.assoc("facilityData", payload.facilityData),
      )(state);

    case Actions.TransitionSearch:
      return transitionLoadingAction("loadSearchResultState", payload.event, state);

    case Actions.Localize:
      return R.assoc("localizedStrings", { ...state.localizedStrings, ...payload.localizedStrings }, state);

    case Actions.TransitionTranslation:
      return R.assoc("translationState", transitionLoading(state.translationState, payload.event), state);

    case Actions.TransitionCategory:
      return R.assoc("categoryLoadState", transitionLoading(state.categoryLoadState, payload.event), state);

    case Actions.TransitionSubCategory:
      return R.assoc("subCategoryLoadState", transitionLoading(state.subCategoryLoadState, payload.event), state);

    case Actions.TransitionTags:
      return R.assoc("tagsLoadState", transitionLoading(state.tagsLoadState, payload.event), state);

    case Actions.ChangeInput:
      return R.assoc("keyword", payload.value, state);

    case Actions.ToggleSelection:
      return R.compose(
        state => {
          return R.assoc("areAllToggled", state.selectedItems.length === state.facilityData.length, state);
        },
        R.over(R.lensProp("selectedItems"), toggleItemInArray(payload.id)),
      )(state);

    case Actions.ToggleSearchType: {
      return R.compose(
        R.ifElse(
          R.view(R.lensProp("isCategoryTagSearch")),
          R.set(R.lensProp("keyword"), ""),
          R.compose(
            R.set(R.lensProp("category"), null),
            R.set(R.lensProp("subCategory"), null),
            R.set(R.lensProp("tags"), null),
          ),
        ),
        R.over(R.lensProp("isCategoryTagSearch"), R.not),
      )(state);
    }

    case Actions.Reset:
      return R.compose(
        R.assoc("facilityData", []),
        R.assoc("keyword", ""),
        R.assoc("selectedItems", []),
        R.assoc("loadSearchResultState", LoadingStates.NotStarted),
      )(state);

    case Actions.ToggleUseExtent:
      return R.assoc("useExtent", !state.useExtent, state);

    case Actions.SelectCategory: {
      return R.compose(
        R.assoc("subCategory", null),
        R.assoc("category", payload.category),
      )(state);
    }

    case Actions.SelectSubCategory: {
      return R.assoc("subCategory", payload.subCategory, state);
    }

    case Actions.SelectTags: {
      return R.assoc("tags", payload.tags, state);
    }

    case Actions.LoadCategoriesInit: {
      return transitionLoadingAction("categoryLoadState", LoadingStatusEvents.onLoad, state);
    }

    case Actions.LoadCategoriesSuccess: {
      return R.compose(
        transitionLoadingAction("categoryLoadState", LoadingStatusEvents.onSuccess),
        R.assoc("availableCategories", payload.availableCategories),
      )(state);
    }

    case Actions.LoadSubCategoriesInit: {
      return transitionLoadingAction("subCategoryLoadState", LoadingStatusEvents.onLoad, state);
    }

    case Actions.LoadSubCategoriesSuccess: {
      return R.compose(
        transitionLoadingAction("subCategoryLoadState", LoadingStatusEvents.onSuccess),
        R.assoc("availableSubCategories", payload.availableSubCategories),
      )(state);
    }

    case Actions.LoadTagsInit: {
      return transitionLoadingAction("tagsLoadState", LoadingStatusEvents.onLoad, state);
    }

    case Actions.LoadTagsSuccess: {
      return R.compose(
        transitionLoadingAction("tagsLoadState", LoadingStatusEvents.onSuccess),
        R.assoc("availableTags", payload.availableTags),
      )(state);
    }

    case Actions.ToggleAll: {
      return R.compose(
        R.ifElse(
          R.prop("areAllToggled"),
          R.assoc("selectedItems", R.map(pickPrimaryKeyAndInfoType, state.facilityData)),
          R.assoc("selectedItems", []),
        ),
        R.assoc("areAllToggled", !state.areAllToggled),
      )(state);
    }

    default:
      return state;
  }
}

//#region Action Creators
const actionCreators = {
  localize(localizedStrings) {
    return {
      type: Actions.Localize,
      payload: { localizedStrings },
    };
  },

  searchResult(facilityData) {
    return {
      type: Actions.SearchResults,
      payload: { facilityData },
    };
  },

  searchStatus(event) {
    return {
      type: Actions.TransitionSearch,
      payload: { event },
    };
  },

  translationStatus(event) {
    return {
      type: Actions.TransitionTranslation,
      payload: { event },
    };
  },

  changeInput(value) {
    return {
      type: Actions.ChangeInput,
      payload: { value },
    };
  },

  toggleSelection(id) {
    return {
      type: Actions.ToggleSelection,
      payload: { id },
    };
  },

  reset() {
    return {
      type: Actions.Reset,
    };
  },

  loadCategoriesInit() {
    return {
      type: Actions.LoadCategoriesInit,
    };
  },

  loadSubCategoriesInit() {
    return {
      type: Actions.LoadSubCategoriesInit,
    };
  },

  loadSubCategoriesSuccess(availableSubCategories) {
    return {
      type: Actions.LoadSubCategoriesSuccess,
      payload: { availableSubCategories },
    };
  },

  loadCategoriesSuccess(availableCategories) {
    return {
      type: Actions.LoadCategoriesSuccess,
      payload: { availableCategories },
    };
  },

  loadTagsInit() {
    return {
      type: Actions.LoadTagsInit,
    };
  },

  loadTagsSuccess(availableTags) {
    return {
      type: Actions.LoadTagsSuccess,
      payload: { availableTags },
    };
  },

  selectCategory(category) {
    return {
      type: Actions.SelectCategory,
      payload: { category },
    };
  },

  selectSubCategory(subCategory) {
    return {
      type: Actions.SelectSubCategory,
      payload: { subCategory },
    };
  },

  selectTags(tags) {
    return {
      type: Actions.SelectTags,
      payload: { tags },
    };
  },

  toggleAll() {
    return {
      type: Actions.ToggleAll,
    };
  },

  toggleSearchType() {
    return {
      type: Actions.ToggleSearchType,
    };
  },

  toggleUseExtent() {
    return {
      type: Actions.ToggleUseExtent,
    };
  },
};

//#endregion

/**
 * Binds the dispatch to the collection of action creators.
 * @param dispatch
 */
const facilityActionCreators = bindActionCreators(actionCreators);

export { Actions, facilityActionCreators as bindActionCreators, defaultState, getColumns, reducer, isFormValid };
