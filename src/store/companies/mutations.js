export const SET_ITEMS = "SET_ITEMS";
export const TOGGLE_API_CALLING = "TOGGLE_API_CALLING";
export const SET_EXTRA_DATA = "SET_EXTRA_DATA";
export const REMOVE_ITEM = "REMOVE_ITEM";
export const INSERT_ITEM = "INSERT_ITEM";
export const UPDATE_ITEM = "UPDATE_ITEM";
export const SET_ASC_COMPANIES = "SET_ASC_COMPANIES";

export default {
  // deleted items
  [REMOVE_ITEM](state, depsId) {
    state.companies = state.companies.filter((deps) => deps?.id !== depsId);
    state.extraData.total = state.extraData?.total - 1;
  },
  // insert new item to the store
  [INSERT_ITEM](state, newItem) {
    state.companies?.unshift(newItem);
    state.extraData.allTotal = state.extraData?.allTotal + 1;
    state.extraData.pendingTotal = state.extraData?.pendingTotal + 1;
  },
  // set all items into store
  [SET_ITEMS](state, data) {
    state.companies = data;
  },
   // update edited item from store
   [UPDATE_ITEM](state, updatedItems) {
    updatedItems.forEach(company => {
      state.companies = state.companies?.map((value) => {
        if(company.id == value.id){
          value = company
        }
        return value
      })
    });
    // state.items = state.items?.map((item) => {
    //   updatedItems.forEach(element => {
    //     if (item?.id === element?.id) {
    //       return element;
    //     }
    //   });
    //   // if (item?.id === updatedItem?.id) {
    //   //   return updatedItem;
    //   // }
    //   return item;
    // });
  },
  // set the extra data of items in to store
  [SET_EXTRA_DATA](state, extraData) {
    state.extraData = extraData;
  },
  // toggle api
  [TOGGLE_API_CALLING](state, value) {
    state.isApiCalling = value;
  },
  [SET_ASC_COMPANIES](state, value) {
    state.ascCompanies = value;
  },

};
