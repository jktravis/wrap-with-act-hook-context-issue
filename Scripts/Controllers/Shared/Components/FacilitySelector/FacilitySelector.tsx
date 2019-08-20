import { addFacilitiesToIncident, HasPrimaryKeyAndInformationType, removeFacilitiesFromIncident } from "Api/mapApi";
import React, { useEffect, useReducer } from "react";
import Modal from "reactstrap/lib/Modal";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import FormGroup from "reactstrap/lib/FormGroup";
import { Form } from "reactstrap";
import Label from "reactstrap/lib/Label";
import Input from "reactstrap/lib/Input";
import { FaSearch } from "react-icons/fa";
import Button from "reactstrap/lib/Button";
import BeatLoader from "react-spinners/BeatLoader";
import styled from "@emotion/styled";

import { searchAllFacilities, } from "Api/facilityApi";
import { getTranslations } from "Api/translationApi";
import { pickPrimaryKeyAndInfoType } from "../../../Tools/Map/Components/utilities/general";
import { isLoadedSuccess, isLoading, LoadingStatusEvents, } from "../../loadingFsm";
import * as R from "ramda";
import { bindActionCreators, defaultState, isFormValid, reducer } from "./facilitySelectorUtilities";

const FlexCenter = styled("div")`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
FlexCenter.displayName = "FlexCenter";

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
  selectedItems = [],
  toggleFn,
  wktExtent,
}: Props) {
  const [state, dispatch] = useReducer(reducer, { ...defaultState, selectedItems });

  const { translationState, category, subCategory, tags, } = state;

  const actionCreators = bindActionCreators(dispatch);
  const {
    changeInput,
    localize,
    reset,
    searchResult,
    searchStatus,
    translationStatus,
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

  const handleChange = event => {
    const { value } = event.target;
    changeInput(value);
  };

  const closeModal = () => {
    reset();
    toggleFn();
  };

  return (
    <Modal isOpen={isOpen} toggle={closeModal} size="lg">
      {isLoading(translationState)
        ? renderLoading()
        : isLoadedSuccess(translationState)
          ? renderBaseContent({
                    ...state,
            ...actionCreators,
            closeModal,
            dispatch,
            handleChange,
            handleSubmit,
            incidentId,
            })
          : null }
    </Modal>
  );
}

const renderLoading = () => (
  <FlexCenter style={{ padding: "1rem", margin: "1rem" }} data-testid="spinner">
    <BeatLoader />
  </FlexCenter>
);

const renderBaseContent = ({
  category,
  closeModal,
  handleChange,
  handleSubmit,
  keyword,
  loadSearchResultState,
  localizedStrings,
  isCategoryTagSearch,
  tags,
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

            </div>

            <Button
              style={{ alignSelf: "flex-end", marginBottom: ".5rem" }}
              color="primary"
              disabled={!isFormValid({ tags, category, keyword }) || isLoading(loadSearchResultState)}
            >
              <FaSearch /> {localizedStrings.SearchTitle}
            </Button>
          </div>
        </Form>

        {R.cond([
          [isLoading, renderLoading],
        ])(loadSearchResultState)}
      </ModalBody>
    </>
  );
};

export default FacilitySelector;
