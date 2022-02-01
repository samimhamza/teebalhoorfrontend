export const SET_DATA     = 'SET_DATA'
const mutations = {
  [SET_DATA](state, data) {
    state.jobPostTeam = data;
  },
}

export default mutations
