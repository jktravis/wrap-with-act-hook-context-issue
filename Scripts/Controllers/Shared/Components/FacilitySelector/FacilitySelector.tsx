import { addFacilitiesToIncident, HasPrimaryKeyAndInformationType, removeFacilitiesFromIncident } from "Api/mapApi";
import React, { useEffect, useReducer } from "react";
import Modal from "reactstrap/lib/Modal";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import FormGroup from "reactstrap/lib/FormGroup";
import { Form } from "reactstrap";
import Label from "reactstrap/lib/Label";
import Input from "reactstrap/lib/Input";
import { FaSearch, FaSurprise } from "react-icons/fa";
import ModalFooter from "reactstrap/lib/ModalFooter";
import Button from "reactstrap/lib/Button";
import ButtonGroup from "reactstrap/lib/ButtonGroup";
import BeatLoader from "react-spinners/BeatLoader";
import styled from "@emotion/styled";
import Switch from "react-switch";
import Select from "react-select";
import sweetAlert from "sweetalert2";

import {
  getCategoriesForIncident,
  getSubCategoryForCategory,
  getTagsForIncident,
  searchAllFacilities,
} from "Api/facilityApi";
import { getTranslations } from "Api/translationApi";
import formatString from "Utilities/formatString";
import { pickPrimaryKeyAndInfoType } from "../../../Tools/Map/Components/utilities/general";
import { isLoadedSuccess, isLoading, LoadingStatusEvents, isFailure } from "../../loadingFsm";
import * as R from "ramda";
import Alert from "reactstrap/lib/Alert";
import hasLength from "Utilities/hasLength";
import { bindActionCreators, defaultState, getColumns, isFormValid, reducer } from "./facilitySelectorUtilities";

const FlexCenter = styled("div")`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
FlexCenter.displayName = "FlexCenter";

const ErrorContainer = styled(Alert)`
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
`;

const PAGE_SIZE = 8;

function getPageSize(len) {
  return len < PAGE_SIZE && len > 0 ? len : PAGE_SIZE;
}

interface Props {
  isOpen: boolean;
  toggleFn: Function;
  selectFacilityFn: (FacilityGUID) => void;
  removeFacilityFn: (FacilityGUID) => void;
  wktExtent: string;
  incidentId?: string;
  /**
   * Ids of facilities
   */
  selectedItems?: string[];
  organizationName?: string;
}

function FacilitySelector({
  incidentId,
  isOpen,
  organizationName,
  removeFacilityFn,
  selectFacilityFn,
  selectedItems = [],
  toggleFn,
  wktExtent,
}: Props) {
  const [state, dispatch] = useReducer(reducer, { ...defaultState, selectedItems });

  const {
    translationState,
    category,
    subCategory,
    tags,
    keyword,
    loadSearchResultState,
    facilityData,
    useExtent,
  } = state;

  const actionCreators = bindActionCreators(dispatch);
  const {
    changeInput,
    loadCategoriesSuccess,
    loadSubCategoriesSuccess,
    loadTagsSuccess,
    localize,
    reset,
    searchResult,
    searchStatus,
    toggleSelection,
    translationStatus,
    loadCategoriesInit,
    loadSubCategoriesInit,
    loadTagsInit,
  } = actionCreators;

  /**
   * Fetch localizations
   */
  useEffect(() => {
    translationStatus(LoadingStatusEvents.onLoad);
    Promise.all([
      getTranslations(Object.keys(state.localizedStrings)),
      getTranslations(Object.keys(state.localizedStrings), "Mapping"),
    ])
      .then(([root, mappings]) => {
        translationStatus(LoadingStatusEvents.onSuccess);
        localize({ ...root, ...mappings });
      })
      .catch(() => {
        translationStatus(LoadingStatusEvents.onFailure);
      });
    // We only want this effect to run once...ever, so provide an empty dependency list
  }, []);

  /**
   * Fetch available categories and tags, if we have an incident
   */
  useEffect(() => {
    if (incidentId) {
      loadCategoriesInit();
      getCategoriesForIncident(incidentId).then(loadCategoriesSuccess);

      loadTagsInit();
      getTagsForIncident(incidentId).then(loadTagsSuccess);
    }
    // IncidentID is really the only variable here. The others are actions that are created on every render.
    // Therefore, providing them will _always_ cause this to rerun.
  }, [incidentId]);

  useEffect(() => {
    if (category) {
      loadSubCategoriesInit();
      getSubCategoryForCategory(category.PrimaryKey).then(loadSubCategoriesSuccess);
    }
    // category is really the only variable here. The others are actions that are created on every render.
    // Therefore, providing them will _always_ cause this to rerun.
  }, [category]);

  const handleSubmit = event => {
    event.preventDefault();
    searchStatus(LoadingStatusEvents.onLoad);
    const params = {
      query: state.keyword,
      categoryGUID: R.prop("PrimaryKey", category),
      subCategoryGUID: R.prop("PrimaryKey", subCategory),
      facilityTags: tags
        ? R.compose(
            JSON.stringify,
            R.map(R.prop("PrimaryKey")),
          )(tags)
        : undefined,
      wktString: state.useExtent ? wktExtent : undefined,
      orgListString: organizationName ? `["${organizationName}"]` : undefined,
    };
    searchAllFacilities(params)
      .then(facilityData => {
        searchStatus(LoadingStatusEvents.onSuccess);
        searchResult(facilityData);
      })
      .catch(() => {
        searchStatus(LoadingStatusEvents.onFailure);
      });
  };

  useEffect(() => {
    if (isFormValid({ tags, category, keyword }) && !isLoading(loadSearchResultState) && hasLength(facilityData)) {
      handleSubmit({ preventDefault() {} });
    }
    // useExtent is really the only variable here. The others are actions that are created on every render.
    // Therefore, providing them will _always_ cause this to rerun.
  }, [useExtent]);

  const addRemoveAll = addAll => {
    actionCreators.toggleAll();

    const data = R.map(pickPrimaryKeyAndInfoType, state.facilityData);
    if (addAll) {
      addFacilitiesToIncident(incidentId, data);
    } else {
      removeFacilitiesFromIncident(incidentId, data);
    }
  };

  const handleChange = event => {
    const { value } = event.target;
    changeInput(value);
  };

  const closeModal = () => {
    reset();
    toggleFn();
  };

  const handleToggleChange = R.curry((descriptorQuery: HasPrimaryKeyAndInformationType, value) => {
    toggleSelection(descriptorQuery);
    if (value) {
      selectFacilityFn(descriptorQuery);
    } else {
      removeFacilityFn(descriptorQuery);
    }
  });

  return (
    <Modal isOpen={isOpen} toggle={closeModal} size="lg">
      {R.cond([
        [isLoading, renderLoading],
        [
          isLoadedSuccess,
          R.thunkify(renderBaseContent)({
            ...state,
            ...actionCreators,
            addRemoveAll,
            closeModal,
            dispatch,
            handleChange,
            handleSubmit,
            handleToggleChange,
            incidentId,
          }),
        ],
        [isFailure, R.thunkify(renderFailure)(state)],
      ])(translationState)}
    </Modal>
  );
}

const getTrProps = (state, row) => {
  return {
    "data-testid": R.path(["original", "PrimaryKey"], row),
  };
};

const renderFailure = ({ localizedStrings }) => (
  <ErrorContainer color="danger" data-testid="error">
    <FaSurprise /> {localizedStrings.SomethingWentWrongText}
  </ErrorContainer>
);

const renderLoading = () => (
  <FlexCenter style={{ padding: "1rem", margin: "1rem" }} data-testid="spinner">
    <BeatLoader />
  </FlexCenter>
);

const renderBaseContent = ({
  addRemoveAll,
  areAllToggled,
  availableCategories,
  availableSubCategories,
  availableTags,
  category,
  categoryLoadState,
  closeModal,
  facilityData,
  handleChange,
  handleSubmit,
  handleToggleChange,
  incidentId,
  keyword,
  loadSearchResultState,
  localizedStrings,
  isCategoryTagSearch,
  selectCategory,
  selectSubCategory,
  selectTags,
  selectedItems,
  subCategory,
  subCategoryLoadState,
  tags,
  tagsLoadState,
  toggleSearchType,
  toggleUseExtent,
  useExtent,
}) => {
  return (
    <>
      <ModalHeader toggle={closeModal} data-testid="content">
        {localizedStrings.FacilitySelectorText}
      </ModalHeader>
      <ModalBody>
        <Form
          onSubmit={handleSubmit}
          autoComplete="off"
          style={{ borderBottom: "1px solid #ddd", borderRadius: "2px", padding: "0 .5rem" }}
        >
          <p>{localizedStrings.FacilitySearchExistingText}</p>
          <div style={{ display: "flex" }}>
            <div
              style={{
                flex: 1,
                marginRight: ".5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <FormGroup>
                  <Label for="keyword">{localizedStrings.Keyword}</Label>
                  <Input
                    id="keyword"
                    name="keyword"
                    onChange={handleChange}
                    value={keyword}
                    placeholder={localizedStrings.Keyword}
                    disabled={isCategoryTagSearch}
                  />
                </FormGroup>
              </div>

              <div style={{ display: "flex" }}>
                <Label for="search-type" style={{ marginRight: ".5rem", marginBottom: "1rem", fontWeight: "bold" }}>
                  {localizedStrings.SearchByCategoryTags}
                </Label>

                <Switch id="search-type" checked={isCategoryTagSearch} onChange={toggleSearchType} />
              </div>

              <div style={{ display: "flex" }}>
                <Label
                  for="limit-map-extent"
                  style={{ marginRight: ".5rem", marginBottom: "1rem", fontWeight: "bold" }}
                >
                  {localizedStrings.LimitToMapExtent}
                </Label>

                <Switch id="limit-map-extent" checked={useExtent} onChange={toggleUseExtent} />
              </div>
            </div>

            {incidentId && (
              <div
                data-testid="category-selection"
                style={{
                  flex: 1,
                  marginLeft: ".5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {[
                  {
                    labelText: localizedStrings.CategoryTitle,
                    id: "category",
                    options: availableCategories,
                    onChange: selectCategory,
                    value: category,
                    isMulti: false,
                    isLoading: isLoading(categoryLoadState),
                    disabled: !isCategoryTagSearch,
                  },
                  {
                    labelText: localizedStrings.SubCategoryTitle,
                    id: "sub-category",
                    options: availableSubCategories,
                    onChange: selectSubCategory,
                    value: subCategory,
                    isMulti: false,
                    isLoading: isLoading(subCategoryLoadState),
                    disabled: !isCategoryTagSearch || !category,
                  },
                ].map(item => {
                  return (
                    <FormGroup key={item.id}>
                      <Label htmlFor={item.id}>{item.labelText}</Label>
                      <Select
                        id={item.id}
                        name={item.id}
                        options={item.options}
                        getOptionValue={R.prop("PrimaryKey")}
                        getOptionLabel={R.prop("Name")}
                        placeholder={item.labelText}
                        onChange={item.onChange}
                        value={item.value}
                        isDisabled={item.disabled}
                        isClearable
                        isMulti={item.isMulti}
                        isLoading={item.isLoading}
                        className="react-select"
                        classnamePrefex="react-select"
                      />
                    </FormGroup>
                  );
                })}
              </div>
            )}

            <div
              data-testid="tag-selection"
              style={{
                flex: 1,
                marginLeft: ".5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {incidentId &&
                [
                  {
                    labelText: localizedStrings.TagTitle,
                    id: "tags",
                    options: availableTags,
                    onChange: selectTags,
                    value: tags,
                    isMulti: true,
                    isLoading: isLoading(tagsLoadState),
                    disabled: !isCategoryTagSearch,
                  },
                ].map(item => (
                  <FormGroup key={item.id}>
                    <Label htmlFor={item.id}>{item.labelText}</Label>
                    <Select
                      id={item.id}
                      name={item.id}
                      options={item.options}
                      getOptionValue={R.prop("PrimaryKey")}
                      getOptionLabel={R.prop("Name")}
                      placeholder={item.labelText}
                      onChange={item.onChange}
                      value={item.value}
                      isDisabled={item.disabled}
                      isClearable
                      isMulti={item.isMulti}
                      isLoading={item.isLoading}
                      className="react-select"
                      classnamePrefex="react-select"
                    />
                  </FormGroup>
                ))}

              <Button
                style={{ alignSelf: "flex-end", marginBottom: ".5rem" }}
                color="primary"
                disabled={!isFormValid({ tags, category, keyword }) || isLoading(loadSearchResultState)}
              >
                <FaSearch /> {localizedStrings.SearchTitle}
              </Button>
            </div>
          </div>
        </Form>

        {R.cond([
          [isLoading, renderLoading],
          [
            R.both(isLoadedSuccess, () => hasLength(facilityData)),
            () => (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <FormGroup
                  style={{
                    display: "flex",
                    alignSelf: "flex-end",
                    margin: "1rem 0 0",
                  }}
                >
                  <Label htmlFor="toggle-all" style={{ marginRight: ".5rem" }}>
                    {localizedStrings.ToggleAllText}
                  </Label>
                  <Switch
                    id="toggle-all"
                    checked={areAllToggled}
                    onChange={checked => {
                      const { length: numItems } = facilityData;
                      // prompt only when there are more items than in a page
                      if (numItems > PAGE_SIZE) {
                        return sweetAlert
                          .fire({
                            title: localizedStrings.AreYouSure,
                            text: formatString(localizedStrings.YouAreAboutToAddNItemToMap, [
                              checked ? R.toLower(localizedStrings.AddTitle) : R.toLower(localizedStrings.RemoveTitle),
                              numItems,
                            ]),
                            showCancelButton: true,
                            cancelButtonText: localizedStrings.CancelText,
                            reverseButtons: true,
                          })
                          .then(({ value }) => {
                            if (value) {
                              addRemoveAll(checked);
                            }
                          });
                      }
                      addRemoveAll(checked);
                    }}
                  />
                </FormGroup>

                {/*Table Goes here*/}
              </div>
            ),
          ],
          [
            R.both(isLoadedSuccess, () => !hasLength(facilityData)),
            () => <div>{localizedStrings.NoDataMatchedCriteria}</div>,
          ],
        ])(loadSearchResultState)}
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button color="warning" onClick={closeModal}>
            {localizedStrings.Close}
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </>
  );
};

export default FacilitySelector;
