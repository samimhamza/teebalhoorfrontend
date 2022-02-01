export const SET_DATA = 'SET_DATA'
export const INSERT_DATA = 'INSERT_DATA'
export const UPDATE_DATA = 'UPDATE_DATA'
export const SET_TOTAL = 'SET_TOTAL'
export const TOGGLE_API_CALLING = "TOGGLE_API_CALLING";
export const SET_EXTRA_DATA = "SET_EXTRA_DATA";
export const SET_DATA_ATTACHMENT = "SET_DATA_ATTACHMENT";
export const SET_DATA_JENERAL_NOTE = "SET_DATA_JENERAL_NOTE";
export const SET_DATA_CANDIDATE_NOTE = "SET_DATA_CANDIDATE_NOTE";

const mutations = {
    // job attachment
    [SET_DATA_ATTACHMENT](state, data) {
        state.jobAttachments = data;
    },

    //General Note
    [SET_DATA_JENERAL_NOTE](state, data) {
        state.jobJeneralNote = data;
    },

    //Candidate Note
    [SET_DATA_CANDIDATE_NOTE](state, data) {
        state.jobCandidateNote = data;
    },

    [SET_TOTAL](state, data) {
        state.total = data;
    },

    [SET_DATA](state, data) {
        state.jobPosts = data;
    },

    [INSERT_DATA](state, data) {
        state.jobPosts ?.unshift(data);
        state.extraData.allTotal = state.extraData ?.allTotal + 1;
        state.extraData.onholdTotal = state.extraData ?.onholdTotal + 1;
    },

    [UPDATE_DATA](state, updatedItem) {
        state.jobPosts = state.jobPosts ?.map((item) => {
            if (item ?.id === updatedItem ?.id) {
                return updatedItem;
            }
            return item;
        });
    },


    [SET_EXTRA_DATA](state, extraData) {
        state.extraData = extraData;
    },

    [TOGGLE_API_CALLING](state, value) {
        state.isApiCalling = value;
    },

}

export default mutations