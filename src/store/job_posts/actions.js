import {
    SET_DATA,
    INSERT_DATA,
    UPDATE_DATA,
    TOGGLE_API_CALLING,
    SET_EXTRA_DATA,
    SET_DATA_ATTACHMENT,
    SET_DATA_JENERAL_NOTE,
    SET_DATA_CANDIDATE_NOTE,
} from "./mutations";

const actions = {
    async fetchJobPosts({ commit }, data) {
        try {
            commit(TOGGLE_API_CALLING, true);
            const response = await this.$axios.get(`job-posts?key=${data.key}`, {
                params: data.options,
            });
            if (response ?.status === 200) {
                commit(TOGGLE_API_CALLING, false);
                commit(SET_DATA, response ?.data ?.data);
                const { data, ...extraData } = response ?.data;
                commit(SET_EXTRA_DATA, extraData);
            }
            return response;
        } catch (error) {
            commit(TOGGLE_API_CALLING, false);
            return error;
        }
    },

    insertNewItem({ commit }, item) {
        commit(INSERT_DATA, item)
    },

    updateItem({ commit }, item) {
        commit(UPDATE_DATA, item);
    },

    // attachments
    async fetchJobAttachment({ commit }, data) {
        try {

            commit(TOGGLE_API_CALLING, true);
            const response = await this.$axios.post(`job-posts/get-job-attachment`, data);
            if (response ?.status === 200) {
                commit(TOGGLE_API_CALLING, false);
                // console.log("response");
                // console.log(response ?.data ?.data.data);

                commit(SET_DATA_ATTACHMENT, response?.data?.data.data);

            }
            return response ?.data ?.data.data;
        } catch (error) {
            commit(TOGGLE_API_CALLING, false);
            return error;
        }
    },

 

    //General job  Notes
     async fetchGeneralJobNote({ commit }, data) {
        try {

            commit(TOGGLE_API_CALLING, true);
            console.log(data);
            const response= await this.$axios.get('note-posts/JobGeneralNote', {
                params: data
            });
 
            if (response ?.status === 200) {
                commit(TOGGLE_API_CALLING, false);
                console.log("response");
                console.log(response ?.data ?.data);

                commit(SET_DATA_JENERAL_NOTE, response ?.data ?.data[0]);

            }
            return response ?.data ?.data[0];
        } catch (error) {
            console.log("error");
            console.log(error);
            commit(TOGGLE_API_CALLING, false);
            return error;
        }
    },

    //Candidate job  Notes
    async fetchCandidateJobNote({ commit }, data) {
        try {
            commit(TOGGLE_API_CALLING, true);
            const response= await this.$axios.get('note-posts/JobCandidateNote', {
                params: data
            });
            console.log('data',response.data);
            // if (response ?.status === 200) {
            //     commit(TOGGLE_API_CALLING, false);
            //     console.log(response?.data?.data[0]?.candidate); 
            //     this.candidate=[ response?.data?.data[0]?.candidate.firstname];
            //     this.candidate_id= response?.data?.data[0]?.candidate.id;

            //     commit(SET_DATA_CANDIDATE_NOTE,  response?.data?.data);

            // }
            // return response ?.data ?.data[0];
        } catch (error) {
            commit(TOGGLE_API_CALLING, false);
            return error;
        }
    },

      

}

export default actions