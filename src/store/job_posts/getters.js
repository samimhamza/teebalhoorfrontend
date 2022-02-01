import state from "./state";

const getters = {
  getJobPosts:  (state) => [...state.jobPosts],
  isApiCalling: (state) => state.isApiCalling,
  getJobAttachment:(state)=>state.jobAttachments,
  getJobGeneralNote:(state)=>state.jobJeneralNote,
  getJobCandidateNote:(state)=>state.jobCandidateNote,

  getTotal: (state) => (tabKey) => {
    switch (tabKey) {
      case "active":
        return state.extraData?.activeTotal || 0;
      case "completed":
        return state.extraData?.completedTotal || 0;
      case "cancelled":
        return state.extraData?.cancelledTotal || 0;
      case "expired":
        return state.extraData?.expiredTotal || 0;
      case "onhold":
          return state.extraData?.onholdTotal || 0;
      case "all":
        return state.extraData?.allTotal || 0;
      case "removed":
        return state.extraData?.removedTotal || 0;
      default: return state.extraData?.allTotal || 0;
    }
  },

}

export default getters
