export const UPDATE_DEPARTMENTS = 'UPDATE_DEPARTMENTS';
export const TOGGLE_API_CALLING = "TOGGLE_API_CALLING";
export const SET_EXTRA_DATA = 'SET_EXTRA_DATA';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const INSERT_ITEM = 'INSERT_ITEM';
export const SET_COUNTRIES  = 'SET_COUNTRIES';
export const SET_COMPANIES = 'SET_COMPANIES';
export const SET_ROLES = 'SET_ROLES';


export default {
  [SET_ROLES](state, roles){
    state.roles = roles;
  },

  //set countries 
  [SET_COUNTRIES](state, countries){
    state.countries = countries;
  },
  //set companies 
  [SET_COMPANIES](state, companies){
    state.companies = companies;
  },
  // deleted items
  [REMOVE_ITEM](state, depsId) {
    state.departments = state.departments.filter((deps) => deps?.id !== depsId);
    state.extraData.total = state.extraData?.total - 1;
  },
  // insert new item to the store
  [INSERT_ITEM](state, newItem) {
    state.departments?.unshift(newItem);
    state.extraData.total = state?.extraData?.total + 1;
  },
  // set all items into store
  [UPDATE_DEPARTMENTS](state, data) {
    state.departments = data;
  },
  // set the extra data of items in to store
  [SET_EXTRA_DATA](state, {extraData, key}) {
    if (key === 'all') {
      state.extraData.total = extraData.total;
    }
    state.extraData.activeTotal = extraData.activeTotal;
    state.extraData.inactiveTotal = extraData.inactiveTotal;
    state.extraData.deletedTotal = extraData.deletedTotal;
    state.extraData.blockedTotal = extraData.blockedTotal;
    state.extraData.pendingTotal = extraData.pendingTotal;
  },
  // toggle api
  [TOGGLE_API_CALLING](state, value) {
    state.isApiCalling = value
  }, 
}