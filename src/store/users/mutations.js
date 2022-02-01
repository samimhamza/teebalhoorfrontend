export const SET_ITEMS = "SET_ITEMS";
export const SET_ALL_ITEMS = "SET_ALL_ITEMS";
export const INSERT_ITEM = "INSERT_ITEM";
export const UPDATE_ITEM = "UPDATE_ITEM";
export const SET_EXTRA_DATA = "SET_EXTRA_DATA";
export const SEARCH_IN_ITEMS = "SEARCH_IN_ITEMS";
export const TOGGLE_API_CALLING = "TOGGLE_API_CALLING";
export const SET_NECESSARY_ITEMS = "SET_NECESSARY_ITEMS";
export const SET_ONLINE_USERS_DATA = "SET_ONLINE_USERS_DATA";
export const SET_COUNTRIES = "SET_COUNTRIES";
export const SET_NATIONALS = "SET_NATIONALS";
export const SET_TEAMS = "SET_TEAMS";
export const SET_PROJECTS = "SET_PROJECTS";
export const SET_ROLES = "SET_ROLES";
export const SET_DEPARTMENTS = "SET_DEPARTMENTS";
export const REMOVE_ITEM = "REMOVE_ITEM";

export default {
  // set all items into store
  [SET_ITEMS](state, data) {
    state.items = data;
  },

  [SET_ALL_ITEMS](state, data) {
    state.allItems = data;
  },

  [SET_ONLINE_USERS_DATA](state, data) {
    state.onlineUsers = data;
  },

  // set all necessary data
  [SET_NECESSARY_ITEMS](state, data) {
    state.projects = data?.projects;
    state.countries = data?.countries;
    state.departments = data?.departments;
    state.roles = data?.roles;
    state.teams = data?.teams;
    state.nationals = data?.nationals;
  },

  // insert new item to the store
  [INSERT_ITEM](state, newItem) {
    state.items?.unshift(newItem);
    state.extraData.total = state?.extraData?.total + 1;
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

  // set the extra data of items in to store
  [SET_EXTRA_DATA](state, extraData) {
    state.extraData = extraData;
  },
  [REMOVE_ITEM](state, userId) {
    state.items = state.items.filter((user) => user?.id !== userId);
    state.extraData.total = state.extraData?.total - 1;
  },
  removeItem(state, userId) {
    state.items = state.items.filter((user) => user?.id !== userId);
    state.extraData.total = state.extraData?.total - 1;
  },

  // toggle api
  [TOGGLE_API_CALLING](state, value) {
    state.isApiCalling = value;
  },

  changeItemTotals(state, value) {
    if (value > 0) {
      state.extraData.total = state.extraData?.total + value;
    } else {
      if (state.extraData?.total > 0)
        state.extraData.total = state.extraData?.total - 1;
    }
  },
  changeActiveTotals(state, value) {
    if (value > 0) {
      state.extraData.activeTotal = state.extraData?.activeTotal + value;
    } else {
      if (state.extraData?.activeTotal > 0)
        state.extraData.activeTotal = state.extraData?.activeTotal - 1;
    }
  },

  changeInactiveTotals(state, value) {
    if (value > 0) {
      state.extraData.inactiveTotal = state.extraData?.inactiveTotal + value;
    } else {
      if (state.extraData?.inactiveTotal > 0)
        state.extraData.inactiveTotal = state.extraData?.inactiveTotal - 1;
    }
  },

  changePendingTotals(state, value) {
    if (value > 0) {
      state.extraData.pendingTotal = state.extraData?.pendingTotal + value;
    } else {
      if (state.extraData?.pendingTotal > 0)
        state.extraData.pendingTotal = state.extraData?.pendingTotal - 1;
    }
  },

  changeWarningTotals(state, value) {
    if (value > 0) {
      state.extraData.warningTotal = state.extraData?.warningTotal + value;
    } else {
      if (state.extraData?.warningTotal > 0)
        state.extraData.warningTotal = state.extraData?.warningTotal - 1;
    }
  },

  changeDeletedTotals(state, value) {
    if (value > 0) {
      state.extraData.deletedTotal = state.extraData?.deletedTotal + value;
    } else {
      if (state.extraData?.deletedTotal > 0)
        state.extraData.deletedTotal = state.extraData?.deletedTotal - 1;
    }
  },

  changeTracedTotals(state, value) {
    if (value > 0) {
      state.extraData.tracedTotal = state.extraData?.tracedTotal + value;
    } else {
      if (state.extraData?.tracedTotal > 0)
        state.extraData.tracedTotal = state.extraData?.tracedTotal - 1;
    }
  },
  [SET_COUNTRIES](state, data) {
    state.countries = data;
  },
  [SET_NATIONALS](state, data) {
    state.nationals = data;
  },
  [SET_TEAMS](state, data) {
    state.teams = data;
  },
  [SET_PROJECTS](state, data) {
    state.projects = data;
  },
  [SET_DEPARTMENTS](state, data) {
    state.departments = data;
  },
  [SET_ROLES](state, data) {
    state.roles = data;
  },
};
