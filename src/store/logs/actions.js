import { includes, isInteger, toInteger } from "lodash";
import { SET_DATA } from "./mutations";
import { SET_NAME } from "./mutations";

const actions = {
  // fetch all users from database
  async fetchLogs({ commit }) {
    try {
      const response = await this.$axios.get("logs");
      if (response?.status === 200) {
        commit(SET_DATA, response?.data?.logs);
      }
    } catch (error) {
      console.log("errrooorr", error);
    }
  },
  async searchLogByDate({ commit }, date) {
    try {
      const response = await this.$axios.get("logs/" + date);
      console.log(response.data);
      if (response?.status === 200) {
        commit(SET_DATA, response?.data?.logs);
      }
    } catch (error) {}
  },

  async fetchFilteredActivities({ commit }, data) {
    try {
      const response = await this.$axios.get("filter_logs", { params: data });
      let activities = response?.data?.logs;
      //start Time
      let startTime = data.startTime;
      let startDate = new Date();
      if (startTime != "") {
        let startHour = toInteger(startTime.slice(0, 2));
        let startMinute = toInteger(startTime.slice(3, 5));
        //set time to 24 hour format
        startDate.setHours(startHour, startMinute, 0);
        console.log(startDate);
      }

      //end Time
      let endTime = data.endTime;
      let endDate = new Date();
      if (endTime != "") {
        let endHour = toInteger(endTime.slice(0, 2));
        let endMinute = toInteger(endTime.slice(3, 5));
        endDate.setHours(endHour, endMinute, 0);
        console.log(endDate);
      }

      let date = new Date();
      if (startTime != "" && endTime != "") {
        activities = activities.filter((log) => {
          let hour = toInteger(log.time.slice(0, 3));
          let minute = toInteger(log.time.slice(4, 6));
          date.setHours(hour, minute, 0);

          if (
            startDate.getTime() < date.getTime() &&
            date.getTime() < endDate.getTime()
          ) {
            return log;
          }
        });
      }

      if (startTime != "" && endTime == "") {
        activities = activities.filter((log) => {
          let hour = toInteger(log.time.slice(0, 3));
          let minute = toInteger(log.time.slice(4, 6));
          date.setHours(hour, minute, 0);
          if (startDate.getTime() == date.getTime()) {
            return log;
          }
        });
      }
      if (startTime == "" && endTime != "") {
        activities = activities.filter((log) => {
          let hour = toInteger(log.time.slice(0, 3));
          let minute = toInteger(log.time.slice(4, 6));
          date.setHours(hour, minute, 0);
          if (endDate.getTime() == date.getTime()) {
            return log;
          }
        });
      }

      if (data.subsystem != "") {
        activities = activities.filter((log) => log.page == data.subsystem);
      }
      if (data.event != "") {
        activities = activities.filter((log) => log.event == data.event);
      }
      if (data.username != "") {
        activities = activities.filter((log) => log.username == data.username);
      }

      if (data.user_ids.length > 0) {
        activities = activities.filter((log) =>
          data.include == 0
            ? data.user_ids.includes(log.user_id)
            : !data.user_ids.includes(log.user_id)
        );
      }

      if (response?.status === 200) {
        commit(SET_DATA, activities);
      }
    } catch (error) {
      console.log("error", error);
    }
  },

  // insert new user into store
  insertUser({ commit }, user) {
    commit(INSERT_DATA, user);
  },
};

export default actions;
