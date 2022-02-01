export const SET_COUTRIES_WITH_COMPANIES = "SET_COUTRIES_WITH_COMPANIES";
export const SET_COMPANIES_OF_COUNTRIES = "SET_COMPANIES_OF_COUNTRIES";
export const SET_DEPARTMENTS_OF_COMPANIES = "SET_DEPARTMENTS_OF_COMPANIES";
export const SET_USERS_OF_COMAPNIES = "SET_USERS_OF_COMAPNIES";
export const REMOVE_COMPANIES = "REMOVE_COMPANIES";
export const REMOVE_DEPARTMENTS = "REMOVE_DEPARTMENTS";
export const REMOVE_ALL_COMPANIES = "REMOVE_ALL_COMPANIES";
export const REMOVE_ALL_DEPARTMENTS = "REMOVE_ALL_DEPARTMENTS";
export const SET_COUNTRY_LANGUAGES = "SET_COUNTRY_LANGUAGES";
export const SET_TEAMS_WITH_META_DATA = "SET_TEAMS_WITH_META_DATA";
export const SET_ROLES_WITH_META_DATA = "SET_ROLES_WITH_META_DATA";

export default {
  // Set country languages
  [SET_COUNTRY_LANGUAGES](state, languages) {
    state.countryLanguages = languages;
  },

  [SET_COUTRIES_WITH_COMPANIES](state, value) {
    state.countriesWithCompanies = value;
  },

  [SET_COMPANIES_OF_COUNTRIES](state, value) {
    state.companiesOfTheCountries = value;
  },

  [SET_DEPARTMENTS_OF_COMPANIES](state, value) {
    state.DepartmentsOfTheCompanies = value;
  },

  [SET_USERS_OF_COMAPNIES](state, value) {
    state.UsersOfCompanies = value;
  },

  [SET_TEAMS_WITH_META_DATA](state, value) {
    state.teamsWithMetaData = value;
  },
  [SET_ROLES_WITH_META_DATA](state, value) {
    state.rolesWithMetaData = value;
  },

  [REMOVE_COMPANIES](state, countryId) {
    state.companiesOftheCountries = state.companiesOftheCountries?.filter(
      (project) => {
        if (project?.country_id === countryId) {
          state.DepartmentsOftheCompanies =
            state.DepartmentsOftheCompanies?.filter(
              (department) => department?.project_id !== project?.id
            );
        }
        return project?.country_id !== countryId;
      }
    );
  },

  [REMOVE_DEPARTMENTS](state, projectId) {
    state.DepartmentsOftheCompanies = state.DepartmentsOftheCompanies?.filter(
      (department) => department?.project_id !== projectId
    );
  },

  [REMOVE_ALL_COMPANIES](state) {
    state.companiesOfTheCountries = [];
  },

  [REMOVE_ALL_DEPARTMENTS](state) {
    state.DepartmentsOfTheCompanies = [];
  },

  clearCountryLanguages(state) {
    state.countryLanguages = [];
  },
};
