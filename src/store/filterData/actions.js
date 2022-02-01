import {
  SET_COUTRIES_WITH_COMPANIES,
  SET_COMPANIES_OF_COUNTRIES,
  SET_DEPARTMENTS_OF_COMPANIES,
  SET_USERS_OF_COMAPNIES,
  SET_COUNTRY_LANGUAGES,
  SET_ROLES_WITH_META_DATA,
  SET_TEAMS_WITH_META_DATA,
  REMOVE_ALL_DEPARTMENTS,
  REMOVE_ALL_COMPANIES,
} from './mutations';

export default {
  async fetchCountriesWithCompanies({ commit }) {
    try {
      const response = await this.$axios.get('countries?withCompany');
      if (response?.status === 200) {
        commit(SET_COUTRIES_WITH_COMPANIES, response?.data);
      }
      return response;
    } catch (error) {
      return error;
    }
  },

  async fetchCountryLanguages({ commit }, countryId) {
    try {
      const response = await this.$axios.get(
        `languages?countryId=${countryId}`
      );
      if (response?.status === 200) {
        commit(SET_COUNTRY_LANGUAGES, response?.data?.data);
      }
      return response;
    } catch (error) {
      return error;
    }
  },

  async fetchCompaniesOfCountries({ commit }, country_ids) {
    country_ids = Array.from(country_ids);
    try {
      const response = await this.$axios.get('companies?itemsPerPage=-1', {
        params: { country_ids },
      });
      if (response?.status === 200) {
        commit(SET_COMPANIES_OF_COUNTRIES, response?.data.companies);
      }
      return response;
    } catch (error) {
      return error;
    }
  },

  async fetchDepartmentsOfCompanies({ commit }, company_ids) {
    company_ids = Array.from(company_ids);
    try {
      const response = await this.$axios.get('departments?itemsPerPage=-1', {
        params: { company_ids },
      });
      if (response?.status === 200) {
        commit(SET_DEPARTMENTS_OF_COMPANIES, response?.data.departments);
      }
      return response;
    } catch (error) {
      return error;
    }
  },

  async fetchUsersOfCompanies({ commit }, company_ids) {
    company_ids = Array.from(company_ids);
    try {
      const response = await this.$axios.get('users', {
        params: { company_ids },
      });
      if (response?.status === 200) {
        commit(SET_USERS_OF_COMAPNIES, response?.data.users);
      }
      return response;
    } catch (error) {
      return error;
    }
  },

  async fetchTeamMetaDataForEdit({ commit }, team_ids) {
    try {
      const response = await this.$axios.get('teams?team_meta_data=true', {
        params: { team_ids },
      });
      if (response?.status === 200) {
        // const teams = response?.data?.data;

        // const filteredTeams = [];
        // for (const team of teams) {
        //   const selectedSystemsSet = new Set();
        //   const selectedSubSystemsSet = new Set();
        //   const companiesSet = [];
        //   const companiesSystems = [];

        //   // parse teams and teams departments
        //   for (const departments of team.departments) {
        //     // parse departments company
        //     for (const companies of departments.companies) {
        //       // parse company systems
        //       for (const system of companies.systems) {
        //         let isFound = companiesSystems.find(
        //           (item) => item.id === system.id
        //         );
        //         if (!isFound) {
        //           companiesSystems.push(system);
        //         }
        //       }
        //     }
        //   }

        //   // parse company systems
        //   for (const permission of team.permissions) {
        //     selectedSubSystemsSet.add(
        //       `${permission.sub_system.system_id}|${permission?.sub_system_id}`
        //     );
        //     const parsedPermission = `${permission.sub_system.system_id}|${permission?.sub_system_id}|${permission?.action_id}`;
        //     selectedSystemsSet.add(parsedPermission);
        //   }

        //   team.companiesSystems = companiesSystems;
        //   team.selectedSystems = Array.from(selectedSystemsSet);
        //   team.selectedSubSystems = Array.from(selectedSubSystemsSet);
        //   team.selectedCompanies = companiesSet;
        //   // let timeRange = JSON.parse(team.time_range);
        //   // team.actualTimeRange = timeRange;
        //   // const to = this.$tr('to');
        //   // if (timeRange) {
        //   //   const startTime = Helper.convertTime(this, timeRange.startRange);
        //   //   const endTime = Helper.convertTime(this, timeRange.endRange);
        //   //   timeRange = `${startTime} ${to} ${endTime}`;
        //   // }

        //   // let dateRange = JSON.parse(team.date_range);
        //   // team.actualDateRange = dateRange;
        //   // if (dateRange) {
        //   //   const startDate = Helper.convertTime(this, dateRange.startRange);
        //   //   const endDate = Helper.convertTime(this, dateRange.endRange);
        //   //   dateRange = `${startDate} ${to} ${endDate}`;
        //   // }

        //   // team.date_range = dateRange;
        //   // team.time_range = timeRange;

        //   filteredTeams.push(team);
        // }

        commit(SET_TEAMS_WITH_META_DATA, response?.data?.data);
      }
      return response;
    } catch (error) {
      return error;
    }
  },

  async fetchRoleMetaDataForEdit({ commit }, role_ids) {
    try {
      const response = await this.$axios.get('roles?role_meta_data=true', {
        params: { role_ids },
      });
      if (response?.status === 200) {
        commit(SET_ROLES_WITH_META_DATA, response?.data?.data);
      }
      return response;
    } catch (error) {
      return error;
    }
  },

  // remove departments and companies
  clearCompanyDepartment({ commit }) {
    commit(REMOVE_ALL_COMPANIES);
    commit(REMOVE_ALL_DEPARTMENTS);
  },
};
