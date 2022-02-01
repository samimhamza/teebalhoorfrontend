import {
    SET_DATA,
  } from "./mutations";
  
  const actions = {
    async fetchJobPostTeam({ commit }, data) {
      try {
        const response = await this.$axios.get('job-post-team');
        if (response?.status === 200) {
          commit(SET_DATA, response?.data?.data);
        }
        return response;
      } catch (error) {
        return error;
      }
    },
  
  }
  
  export default actions
  