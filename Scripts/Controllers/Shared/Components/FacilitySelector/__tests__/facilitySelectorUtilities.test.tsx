import * as R from "ramda";
import { pickPrimaryKeyAndInfoType } from "../../../../Tools/Map/Components/utilities/general";
import { LoadingStates, LoadingStatusEvents } from "../../../loadingFsm";
import { defaultState, reducer, Actions, bindActionCreators, isFormValid } from "../facilitySelectorUtilities";

describe("facilitySelectorUtilities", () => {
  describe("reducer", () => {
    describe("when Action is SearchResults", () => {
      it("should update facilityData state with payload data ", () => {
        const action = {
          type: Actions.SearchResults,
          payload: {
            facilityData: [{ PrimaryKey: "123", InformationType: "Facility" }],
          },
        };
        expect(reducer(defaultState, action)).toEqual({
          ...defaultState,
          facilityData: action.payload.facilityData,
        });
      });

      describe("when selectedItems already has all the facilities", () => {
        it("should turn on areAllToggled", () => {
          const action = {
            type: Actions.SearchResults,
            payload: {
              facilityData: [{ PrimaryKey: "123", OtherKeyThatMakesIncludesFail: true, InformationType: "Facility" }],
            },
          };

          const state = {
            ...defaultState,
            selectedItems: [{ PrimaryKey: "123", InformationType: "Facility" }],
          };

          expect(reducer(state, action)).toEqual({
            ...state,
            facilityData: action.payload.facilityData,
            areAllToggled: true,
          });
        });
      });

      describe("when selectedItems does not include all items in facilityData", () => {
        it("should turn off areAllToggled", () => {
          const action = {
            type: Actions.SearchResults,
            payload: {
              facilityData: [
                { PrimaryKey: "123", OtherKeyThatMakesIncludesFail: true, InformationType: "Facility" },
                { PrimaryKey: "345", OtherKeyThatMakesIncludesFail: true, InformationType: "Facility" },
              ],
            },
          };

          const state = {
            ...defaultState,
            selectedItems: [{ PrimaryKey: "123", InformationType: "Facility" }],
          };

          expect(reducer(state, action)).toEqual({
            ...state,
            facilityData: action.payload.facilityData,
            areAllToggled: false,
          });
        });
      });

      describe("when facilityData has the same length as selectedItems, but the items are different", () => {
        it("should turn off areAllToggled", () => {
          const action = {
            type: Actions.SearchResults,
            payload: {
              facilityData: [{ PrimaryKey: "234", OtherKeyThatMakesIncludesFail: true, InformationType: "Facility" }],
            },
          };

          const state = {
            ...defaultState,
            selectedItems: [{ PrimaryKey: "123", InformationType: "Facility" }],
          };

          expect(reducer(state, action)).toEqual({
            ...state,
            facilityData: action.payload.facilityData,
            areAllToggled: false,
          });
        });
      });
    });

    describe("when Action is TransitionSearch", () => {
      it("should run a transition on loadSearchResultState with the payload event", () => {
        const action = {
          type: Actions.TransitionSearch,
          payload: {
            event: LoadingStatusEvents.onLoad,
          },
        };
        expect(reducer(defaultState, action)).toEqual({
          ...defaultState,
          loadSearchResultState: LoadingStates.IsLoading,
        });
      });
    });

    describe("when Action is TransitionTranslation", () => {
      it("should run a transition on translationState with the payload event", () => {
        const action = {
          type: Actions.TransitionTranslation,
          payload: {
            event: LoadingStatusEvents.onLoad,
          },
        };
        expect(reducer(defaultState, action)).toEqual({
          ...defaultState,
          translationState: LoadingStates.IsLoading,
        });
      });
    });

    describe("when Action is Localize", () => {
      it("should merge in the localizedStrings state with the new strings", () => {
        const action = {
          type: Actions.Localize,
          payload: {
            localizedStrings: {
              Category: "Categoría",
            },
          },
        };

        expect(reducer(defaultState, action)).toEqual({
          ...defaultState,
          localizedStrings: {
            ...defaultState.localizedStrings,
            ...action.payload.localizedStrings,
          },
        });
      });
    });

    describe("when Action is ChangeInput", () => {
      it("should  update the keyword value", () => {
        const action = {
          type: Actions.ChangeInput,
          payload: {
            value: "Foo",
          },
        };

        expect(reducer(defaultState, action)).toEqual({
          ...defaultState,
          keyword: action.payload.value,
        });
      });
    });

    describe("when Action is ToggleSelection", () => {
      it("should add the item to selectedItems", () => {
        const action = {
          type: Actions.ToggleSelection,
          payload: {
            id: { PrimaryKey: "123", InformationType: "Facility" },
          },
        };

        expect(reducer(defaultState, action)).toEqual({
          ...defaultState,
          selectedItems: [action.payload.id],
        });
      });

      it("should toggle all on when last item is manually selected", () => {
        const action = {
          type: Actions.ToggleSelection,
          payload: {
            id: { PrimaryKey: "123", InformationType: "Facility" },
          },
        };

        const state = {
          ...defaultState,
          facilityData: [
            { PrimaryKey: "123", InformationType: "Facility" },
            { PrimaryKey: "234", InformationType: "Facility" },
          ],
          selectedItems: [{ PrimaryKey: "234", InformationType: "Facility" }],
        };

        expect(reducer(state, action)).toEqual({
          ...state,
          areAllToggled: true,
          selectedItems: [
            { PrimaryKey: "234", InformationType: "Facility" },
            { PrimaryKey: "123", InformationType: "Facility" },
          ],
        });
      });

      it("should toggle all off when any item is manually de-selected", () => {
        const action = {
          type: Actions.ToggleSelection,
          payload: {
            id: { PrimaryKey: "123", InformationType: "Facility" },
          },
        };

        const state = {
          ...defaultState,
          areAllToggled: true,
          facilityData: [
            { PrimaryKey: "123", InformationType: "Facility" },
            { PrimaryKey: "234", InformationType: "Facility" },
          ],
          selectedItems: [
            { PrimaryKey: "234", InformationType: "Facility" },
            { PrimaryKey: "123", InformationType: "Facility" },
          ],
        };

        expect(reducer(state, action)).toEqual({
          ...state,
          areAllToggled: false,
          selectedItems: [{ PrimaryKey: "234", InformationType: "Facility" }],
        });
      });
    });

    describe("when Action is Reset", () => {
      it("should reset all the user-input search state", () => {
        const action = {
          type: Actions.Reset,
        };

        const state = {
          ...defaultState,
          facilityData: [{ PrimaryKey: "123", InformationType: "Facility" }],
          keyword: "foo",
          loadSearchResultState: LoadingStates.Success,
        };

        expect(reducer(state, action)).toEqual(defaultState);
      });
    });

    describe("when Action is ToggleUseExtent", () => {
      it("should reset all the user-input search state", () => {
        const action = {
          type: Actions.ToggleUseExtent,
        };

        expect(reducer(defaultState, action)).toEqual({
          ...defaultState,
          useExtent: true,
        });
      });
    });

    describe("when Action is SelectCategory", () => {
      it("should set the category state with the payload", () => {
        const action = {
          type: Actions.SelectCategory,
          payload: {
            category: { Id: "123", Name: "Foo" },
          },
        };

        expect(reducer(defaultState, action)).toEqual({
          ...defaultState,
          category: action.payload.category,
        });
      });

      it("should set the clear any subCategory previously selected", () => {
        const action = {
          type: Actions.SelectCategory,
          payload: {
            category: { Id: "123", Name: "Foo" },
          },
        };

        const state = {
          ...defaultState,
          subCategory: { Id: "123" },
        };

        expect(reducer(state, action)).toEqual({
          ...defaultState,
          category: action.payload.category,
          subCategory: null,
        });
      });
    });

    describe("when Action is SelectSubCategory", () => {
      it("should set the category state with the payload", () => {
        const action = {
          type: Actions.SelectSubCategory,
          payload: {
            subCategory: { Id: "123", Name: "Foo" },
          },
        };

        expect(reducer(defaultState, action)).toEqual({
          ...defaultState,
          subCategory: action.payload.subCategory,
        });
      });
    });

    describe("when Action is SelectTags", () => {
      it("should set the category state with the payload", () => {
        const action = {
          type: Actions.SelectTags,
          payload: {
            tags: [{ Id: "123", Name: "Foo" }],
          },
        };

        expect(reducer(defaultState, action)).toEqual({
          ...defaultState,
          tags: action.payload.tags,
        });
      });
    });

    describe("when Action is TransitionCategory", () => {
      it("should run a transition on categoryLoadState with the payload event", () => {
        const action = {
          type: Actions.TransitionCategory,
          payload: {
            event: LoadingStatusEvents.onLoad,
          },
        };

        expect(reducer(defaultState, action)).toEqual({
          ...defaultState,
          categoryLoadState: LoadingStates.IsLoading,
        });
      });
    });

    describe("when Action is LoadCategoriesSuccess", () => {
      it("should update load status for availableCategories", () => {
        const action = {
          type: Actions.LoadCategoriesSuccess,
          payload: {
            availableCategories: [{ id: 123 }],
          },
        };

        const state = {
          ...defaultState,
          categoryLoadState: LoadingStates.IsLoading,
        };

        expect(reducer(state, action)).toEqual({
          ...defaultState,
          categoryLoadState: LoadingStates.Success,
          availableCategories: action.payload.availableCategories,
        });
      });
    });

    describe("when Action is LoadCategoriesInit", () => {
      it("should update load status for availableCategories", () => {
        const action = {
          type: Actions.LoadCategoriesInit,
        };

        const state = {
          ...defaultState,
          categoryLoadState: LoadingStates.NotStarted,
        };

        expect(reducer(state, action)).toEqual({
          ...defaultState,
          categoryLoadState: LoadingStates.IsLoading,
        });
      });
    });

    describe("when Action is TransitionSubCategory", () => {
      it("should run a transition on subCategoryLoadState with the payload event", () => {
        const action = {
          type: Actions.TransitionSubCategory,
          payload: {
            event: LoadingStatusEvents.onLoad,
          },
        };

        expect(reducer(defaultState, action)).toEqual({
          ...defaultState,
          subCategoryLoadState: LoadingStates.IsLoading,
        });
      });
    });

    describe("when Action is LoadSubCategoriesSuccess", () => {
      it("should update load status for availableSubCategories", () => {
        const action = {
          type: Actions.LoadSubCategoriesSuccess,
          payload: {
            availableSubCategories: [{ id: 123 }],
          },
        };

        const state = {
          ...defaultState,
          subCategoryLoadState: LoadingStates.IsLoading,
        };

        expect(reducer(state, action)).toEqual({
          ...defaultState,
          subCategoryLoadState: LoadingStates.Success,
          availableSubCategories: action.payload.availableSubCategories,
        });
      });
    });

    describe("when Action is LoadSubCategoriesInit", () => {
      it("should update load status for availableSubCategories", () => {
        const action = {
          type: Actions.LoadSubCategoriesInit,
        };

        const state = {
          ...defaultState,
          subCategoryLoadState: LoadingStates.NotStarted,
        };

        expect(reducer(state, action)).toEqual({
          ...defaultState,
          subCategoryLoadState: LoadingStates.IsLoading,
        });
      });
    });

    describe("when Action is TransitionTags", () => {
      it("should run a transition on tagLoadState with the payload event", () => {
        const action = {
          type: Actions.TransitionTags,
          payload: {
            event: LoadingStatusEvents.onLoad,
          },
        };

        expect(reducer(defaultState, action)).toEqual({
          ...defaultState,
          tagsLoadState: LoadingStates.IsLoading,
        });
      });
    });

    describe("when Action is LoadTagsInit", () => {
      it("should update load status for availableTags", () => {
        const action = {
          type: Actions.LoadTagsInit,
        };

        const state = {
          ...defaultState,
          tagsLoadState: LoadingStates.NotStarted,
        };

        expect(reducer(state, action)).toEqual({
          ...defaultState,
          tagsLoadState: LoadingStates.IsLoading,
        });
      });
    });

    describe("when Action is LoadTagsSuccess", () => {
      it("should update load status for availableTags", () => {
        const action = {
          type: Actions.LoadTagsSuccess,
          payload: {
            availableTags: [{ id: 123 }],
          },
        };

        const state = {
          ...defaultState,
          tagsLoadState: LoadingStates.IsLoading,
        };

        expect(reducer(state, action)).toEqual({
          ...defaultState,
          tagsLoadState: LoadingStates.Success,
          availableTags: action.payload.availableTags,
        });
      });
    });

    describe("when Action is ToggleAll", () => {
      it("should toggle the areAllToggled state", () => {
        const action = {
          type: Actions.ToggleAll,
        };

        let state = {
          ...defaultState,
        };

        state = reducer(state, action);
        expect(state).toEqual({
          ...defaultState,
          areAllToggled: true,
        });

        expect(reducer(state, action)).toEqual(defaultState);
      });

      it("should add all data to selected state", () => {
        const action = {
          type: Actions.ToggleAll,
        };

        const state = {
          ...defaultState,
          facilityData: [
            { PrimaryKey: "123", InformationType: "Facility" },
            { PrimaryKey: "234", InformationType: "Facility" },
          ],
        };

        expect(reducer(state, action)).toEqual({
          ...state,
          areAllToggled: true,
          selectedItems: state.facilityData.map(pickPrimaryKeyAndInfoType),
        });
      });

      it("should not add duplicates", () => {
        const action = {
          type: Actions.ToggleAll,
        };

        const state = {
          ...defaultState,
          facilityData: [
            { PrimaryKey: "123", InformationType: "Facility" },
            { PrimaryKey: "234", InformationType: "Facility" },
          ],
          selectedItems: [
            { PrimaryKey: "123", InformationType: "Facility" },
            { PrimaryKey: "234", InformationType: "Facility" },
          ],
        };

        expect(reducer(state, action)).toEqual({
          ...state,
          areAllToggled: true,
        });
      });

      describe("when already toggled", () => {
        it("should remove all data from selected state", () => {
          const action = {
            type: Actions.ToggleAll,
          };

          const state = {
            ...defaultState,
            areAllToggled: true,
            facilityData: [
              { PrimaryKey: "123", InformationType: "Facility" },
              { PrimaryKey: "234", InformationType: "Facility" },
            ],
            selectedItems: [
              { PrimaryKey: "123", InformationType: "Facility" },
              { PrimaryKey: "234", InformationType: "Facility" },
            ],
          };

          expect(reducer(state, action)).toEqual({
            ...state,
            areAllToggled: false,
            selectedItems: [],
          });
        });
      });
    });

    describe("when Action is ToggleSearchType", () => {
      it("should toggle the isCategoryTagSearch boolean", () => {
        const action = {
          type: Actions.ToggleSearchType,
        };

        let state = {
          ...defaultState,
        };

        state = reducer(state, action);

        expect(state).toEqual({
          ...state,
          isCategoryTagSearch: true,
        });
      });

      describe("when isCategoryTagSearch toggles to true", () => {
        it("should clear out the keyword value", () => {
          const action = {
            type: Actions.ToggleSearchType,
          };

          let state = {
            ...defaultState,
            isCategoryTagSearch: false,
            keyword: "Testing...",
          };

          state = reducer(state, action);

          expect(state).toEqual({
            ...state,
            isCategoryTagSearch: true,
            keyword: "",
          });
        });
      });

      describe("when isCategoryTagSearch toggles to false", () => {
        it("should clear out the category, sub-category and tags values", () => {
          const action = {
            type: Actions.ToggleSearchType,
          };

          let state = {
            ...defaultState,
            isCategoryTagSearch: true,
            keyword: "Testing...",
            category: {},
            subCategory: {},
            tags: [],
          };

          state = reducer(state, action);

          expect(state).toEqual({
            ...state,
            isCategoryTagSearch: false,
            keyword: "Testing...",
            category: null,
            subCategory: null,
            tags: null,
          });
        });
      });
    });
  });

  describe("actionCreators", () => {
    it("should create actionCreators ", () => {
      const dispatch = jest.fn(R.identity);
      const actionCreators = bindActionCreators(dispatch);

      expect(actionCreators).toHaveProperty("localize");
      expect(actionCreators).toHaveProperty("searchResult");
      expect(actionCreators).toHaveProperty("searchStatus");
      expect(actionCreators).toHaveProperty("translationStatus");
      expect(actionCreators).toHaveProperty("changeInput");
      expect(actionCreators).toHaveProperty("toggleSelection");
      expect(actionCreators).toHaveProperty("reset");
      expect(actionCreators).toHaveProperty("loadSubCategoriesSuccess");
      expect(actionCreators).toHaveProperty("loadCategoriesSuccess");
      expect(actionCreators).toHaveProperty("loadTagsSuccess");
      expect(actionCreators).toHaveProperty("selectCategory");
      expect(actionCreators).toHaveProperty("selectSubCategory");
      expect(actionCreators).toHaveProperty("selectTags");
      expect(actionCreators).toHaveProperty("loadCategoriesInit");
      expect(actionCreators).toHaveProperty("loadSubCategoriesInit");
      expect(actionCreators).toHaveProperty("loadTagsInit");
      expect(actionCreators).toHaveProperty("toggleAll");
    });
  });

  describe("isFormValid", () => {
    describe("when keyword has length", () => {
      it("should be valid", () => {
        expect(isFormValid({ keyword: "a", category: null, tags: null })).toBe(true);
      });
    });

    describe("when category not null", () => {
      it("should be valid", () => {
        expect(isFormValid({ keyword: "", category: {}, tags: null })).toBe(true);
      });
    });

    describe("when tags not null", () => {
      it("should be valid", () => {
        expect(isFormValid({ keyword: "", category: null, tags: {} })).toBe(true);
      });
    });

    describe("when keyword is empty, category is null, and tags is null", () => {
      it("should _not_ be valid", () => {
        expect(isFormValid({ keyword: "", category: null, tags: null })).toBe(false);
      });
    });
  });
});
