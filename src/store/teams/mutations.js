export const SET_ITEMS = "SET_ITEMS";
export const INSERT_ITEM = "INSERT_ITEM";
export const UPDATE_ITEMS_TOTAL = "UPDATE_ITEMS_TOTAL";
export const UPDATE_ITEM = "UPDATE_ITEM";
export const REMOVE_ITEM = "REMOVE_ITEM";
export const SET_ITEMS_TOTAL = "SET_ITEMS_TOTAL";
export const SEARCH_IN_ITEMS = "SEARCH_IN_ITEMS";
export const TOGGLE_API_CALLING = "TOGGLE_API_CALLING";
export const SET_EXTRA_DATA = "SET_EXTRA_DATA";

// Deleted Section
export const SET_DELETED_ITEMS = "SET_DELETED_ITEMS";
export const INSERT_DELETED_ITEM = "INSERT_DELETED_ITEM";
export const REMOVE_DELETED_ITEM = "REMOVE_DELETED_ITEM";
export const SET_DELETED_ITEMS_TOTAL = "SET_DELETED_ITEMS_TOTAL";
export const SEARCH_IN_DELETED_ITEMS = "SEARCH_IN_DELETED_ITEMS";

export default {
  // set all items into store
  [SET_ITEMS](state, data) {
    state.items = data;
  },

  // insert new item to the store
  [INSERT_ITEM](state, newItem) {
    state.items?.unshift(newItem);
    state.itemsTotal = state.itemsTotal + 1;
  },

  [UPDATE_ITEMS_TOTAL](state) {
    state.extraData.pendingTotal += 1;
    state.extraData.allTotal += 1;
  },

  // remove deleted item from store
  [REMOVE_ITEM](state, removedId) {
    state.items = state.items?.filter((items) => items?.id !== removedId);
    state.itemsTotal = state.itemsTotal - 1;
  },

  // update edited item from store
  [UPDATE_ITEM](state, updatedItem) {
    state.items = state.items?.map((item) => {
      if (item?.id === updatedItem?.id) {
        return updatedItem;
      }
      return item;
    });
  },

  [SET_EXTRA_DATA](state, extraData) {
    state.extraData = extraData;
  },

  // set the total number of items in to store
  [SET_ITEMS_TOTAL](state, total) {
    state.itemsTotal = total;
  },

  // toggle api
  [TOGGLE_API_CALLING](state, value) {
    state.isApiCalling = value;
  },

  // ==========>   Deleted Section   <========= //

  // set all deleted items from DB into store of deleted state
  [SET_DELETED_ITEMS](state, data) {
    state.deletedItems = data;
  },

  // insert deleted item to the store deleted items state
  [INSERT_DELETED_ITEM](state, newItem) {
    state.deletedItems?.unshift(newItem);
    state.deletedItemsTotal = state.deletedItemsTotal + 1;
  },

  // remove deleted item from store from deleted state
  [REMOVE_DELETED_ITEM](state, removedId) {
    state.deletedItems = state.deletedItems?.filter(
      (items) => items?.id !== removedId
    );
    state.deletedItemsTotal = state.deletedItemsTotal - 1;
  },

  // set the total number of deleted items in to store of deleted state
  [SET_DELETED_ITEMS_TOTAL](state, total) {
    state.deletedItemsTotal = total;
  },
};
