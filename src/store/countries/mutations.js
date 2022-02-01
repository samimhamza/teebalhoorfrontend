export const UPDATE_COUNTRIES = "UPDATE_COUNTRIES";
export const UPDATE_COUNTRIES_TOTAL_WHEN_DELETED =
  "UPDATE_COUNTRIES_TOTAL_WHEN_DELETED";
export const TOGGLE_API_CALLING = "TOGGLE_API_CALLING";
export const UPDATE_COUNTRIES_TOTAL_WHEN_BLOCKED =
  "UPDATE_COUNTRIES_TOTAL_WHEN_BLOCKED";
export const SET_EXTRA_DATA = "SET_EXTRA_DATA";
export const UPDATE_COUNTRIES_TOTAL_WHEN_STATUS_CHANGED =
  "UPDATE_COUNTRIES_TOTAL_WHEN_STATUS_CHANGED";
export const SET_COUTRIES_WITH_COMPANIES = "SET_COUTRIES_WITH_COMPANIES";
export const SET_ASC_COUNTRIES = "SET_ASC_COUNTIRES";
export const REMOVE_ITEM = "REMOVE_ITEM";
export const INSERT_ITEM = "INSERT_ITEM";
// deleted items

export default {
  //update record's total when deleted
  [UPDATE_COUNTRIES_TOTAL_WHEN_DELETED](state, {country_id, key}) {
    state.countries = state.countries.filter((c) => c.id !== country_id);
    switch (key) {
      case "active": {
        state.extraData.activeTotal--;
        state.extraData.deletedTotal++;
      }
        break;
      case "inactive": {
        state.extraData.inactiveTotal--;
        state.extraData.deletedTotal++;
      }
        break;
      case "blocked": {
        state.extraData.blockedTotal--;
        state.extraData.deletedTotal++;
      }
        break;
      default:
        break;
    }
  },
  //change records status
  [UPDATE_COUNTRIES_TOTAL_WHEN_STATUS_CHANGED](state, {country, value, key}) {
    if (value !== key) {
      let init_states = ["active", "inactive"];
      state.countries = state.countries.filter((c) => c.id !== country.id);
      if (value === "active" && init_states.includes(key)) {
        state.extraData.activeTotal++;
        state.extraData.inactiveTotal--;
      } else if (init_states.includes(key)) {
        state.extraData.activeTotal--;
        state.extraData.inactiveTotal++;
      }
      //if blocked tab is selected in case
      if (key === "blocked") {
        state.extraData.blockedTotal--;
        state.extraData.inactiveTotal++;
      } else if (key === "deleted") {
        state.extraData.deletedTotal--;
        state.extraData.inactiveTotal++;
      }
    }
  },
  //change country's state into blocked if its passed in
  [UPDATE_COUNTRIES_TOTAL_WHEN_BLOCKED](state, {country_id, key}) {
    switch (key) {
      case "active": {
        state.countries = state.countries.filter((c) => c.id !== country_id);
        state.extraData.activeTotal--;
        state.extraData.blockedTotal++;
      }
        break;
      case "inactive": {
        state.countries = state.countries.filter((c) => c.id !== country_id);
        state.extraData.inactiveTotal--;
        state.extraData.blockedTotal++;
      }
        break;
      default:
        break;
    }
  },
  // set all items into store
  [UPDATE_COUNTRIES](state, data) {
    state.countries = data;
  },
  // set the extra data of items in to store
  [SET_EXTRA_DATA](state, data) {
    state.extraData = data
  },
  // toggle api
  [TOGGLE_API_CALLING](state, value) {
    state.isApiCalling = value;
  },

  [SET_COUTRIES_WITH_COMPANIES](state, value) {
    state.countriesWithCompanies = value;
  },
  [SET_ASC_COUNTRIES](state, value) {
    state.ascCountries = value;
  },

  // deleted items
  [REMOVE_ITEM](state, depsId) {
    state.countries = state.countries.filter((deps) => deps?.id !== depsId);
  },
  // insert new item to the store
  [INSERT_ITEM](state, newItem) {
    state.countries?.unshift(newItem);
  },

  clearAscCountries(state) {
    state.ascCountries = []
  }
};
