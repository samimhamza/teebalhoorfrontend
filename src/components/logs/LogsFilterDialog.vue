<template>
  <v-card class="userFilter">
    <v-card-title primary-title class="border">
      <span class="me-1">
        <v-icon>mdi-filter</v-icon>
      </span>
      <h2>{{ $tr("filter_activity") }}</h2>
      <v-spacer />
      <CloseBtn @click="closeDialog" class="title" />
    </v-card-title>

    <v-card-text>
      <v-form ref="userForm" lazy-validation>
        <v-row class="">
          <v-col cols="12" sm="4" class="pa-0">
            <v-row class="ma-0 pa-0">
              <v-col class="ma-0 pa-0">
                <v-card class="mx-auto rounded-0">
                  <div class="scroll">
                    <h2 class="text-center mt-1">
                      {{ $tr("select_filter") }}
                    </h2>
                    <v-col cols="12 pb-0 mb-0" class="">
                      <label class="subtitle-1">{{ $tr("sub_system") }}</label>
                      <v-autocomplete
                        v-model="form.subsystem"
                        :items="subsystems"
                        dense
                        filled
                        :placeholder="$tr('sub_system')"
                      ></v-autocomplete>
                    </v-col>

                    <v-col cols="12 pb-0 mb-0" class="">
                      <label class="subtitle-1">{{ $tr("event") }}</label>
                      <v-autocomplete
                        v-model="form.event"
                        :items="eventItems"
                        dense
                        filled
                        :placeholder="$tr('event')"
                      ></v-autocomplete>
                    </v-col>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12 ma-0 pa-0" sm="4">
            <v-row class="ma-0 pa-0">
              <v-col class="ma-0 pa-0">
                <v-card class="mx-auto rounded-0">
                  <div class="scroll">
                    <h2 class="text-center mt-1">
                      {{ $tr("date_filter") }}
                    </h2>

                    <v-col cols="12 pb-0 mb-0" class="">
                      <label class="subtitle-1">
                        {{ $tr("activity_date") }}</label
                      >
                      <v-menu
                        ref="dialog"
                        v-model="menu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="date"
                            :placeholder="$tr('activity_date')"
                            prepend-inner-icon="mdi-calendar"
                            readonly
                            filled
                            dense
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <template>
                          <div class="white pb-1" style="background: white">
                            <v-row justify="space-around" class="px-2">
                              <v-date-picker
                                v-model="form.startDate"
                                :max="form.endDate"
                                no-title
                              >
                              </v-date-picker>
                              <v-date-picker
                                v-model="form.endDate"
                                :min="form.startDate"
                                :show-current="currentDate(2)"
                                no-title
                              ></v-date-picker>
                            </v-row>
                          </div>
                        </template>

                        <div class="d-flex">
                          <v-spacer />
                          <v-btn
                            @click="onDateOkey"
                            small
                            color="primary"
                            class="stepper-btn"
                            :type="'button'"
                          >
                            {{ $tr("ok") }}
                          </v-btn>

                          <v-btn
                            @click="onCancelDate"
                            text
                            small
                            color="primary"
                            class="stepper-btn px-2 mx-2"
                          >
                            {{ $tr("cancel") }}
                          </v-btn>
                        </div>
                      </v-menu>
                    </v-col>

                    <v-col cols="12 py-0 my-0" class="">
                      <label class="subtitle-1">{{
                        $tr("activity_time")
                      }}</label>
                      <v-menu
                        ref="dialog2"
                        v-model="menu2"
                        class="rounded-0"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="time"
                            :placeholder="$tr('activity_time')"
                            prepend-inner-icon="mdi-clock-time-four-outline"
                            readonly
                            filled
                            dense
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <template>
                          <div class="pb-1 white" style="background: white">
                            <v-row justify="space-around" class="px-3 mb-2">
                              <v-time-picker
                                class="rounded-0"
                                format="ampm"
                                v-model="form.startTime"
                                :max="form.endTime"
                              ></v-time-picker>
                              <v-time-picker
                                class="rounded-0"
                                format="ampm"
                                v-model="form.endTime"
                                :min="form.startTime"
                              >
                              </v-time-picker>
                            </v-row>
                            <div class="d-flex">
                              <v-spacer />
                              <v-btn
                                @click="onOkayClicked"
                                small
                                color="primary"
                                class="stepper-btn"
                                :type="'button'"
                              >
                                {{ $tr("ok") }}
                              </v-btn>

                              <v-btn
                                @click="onCancelClicked"
                                text
                                small
                                color="primary"
                                class="stepper-btn px-2 mx-2"
                              >
                                {{ $tr("cancel") }}
                              </v-btn>
                            </div>
                          </div>
                        </template>
                      </v-menu>
                    </v-col>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12 pa-0 ma-0" sm="4">
            <v-row class="ma-0 pa-0">
              <v-col class="ma-0 pa-0">
                <v-card class="mx-auto rounded-0">
                  <div class="scroll">
                    <h2 class="text-center mt-1">
                      {{ $tr("specifiec_filter") }}
                    </h2>
                    <v-col cols="12" class="">
                      <label class="subtitle-1">{{ $tr("user_id") }}</label>
                      <v-text-field
                        placeholder="1000100"
                        v-model="user_id"
                        @keyup.enter="addId"
                        filled
                        dense
                        class="mb-0 pb-0"
                      >
                      </v-text-field>
                      <div
                        class="id-container mt-1 pt-0 d-flex align-center flex-wrap mb-1 pt-1"
                      >
                        <div
                          v-for="id in form.user_ids"
                          :key="id.key"
                          class="user-ids d-inline-block"
                        >
                          <v-chip
                            close
                            small
                            color="primary"
                            class="ms-1 mb-1"
                            @click:close="clearId(id)"
                          >
                            {{ id }}
                          </v-chip>
                        </div>
                      </div>
                      <v-btn-toggle
                        v-model="form.include"
                        rounded
                        class="pa-0 ma-0 float-right"
                        mandatory
                      >
                        <v-btn
                          @click="form.include = 0"
                          active-class="primary white--text"
                          x-small
                        >
                          {{ $tr("include_caps") }}
                        </v-btn>
                        <v-btn
                          @click="form.include = 1"
                          active-class="error white--text"
                          x-small
                        >
                          {{ $tr("exclude_caps") }}
                        </v-btn>
                      </v-btn-toggle>
                      <div class="float-none"></div>
                    </v-col>

                    <v-col cols="12 py-0 my-0" class="">
                      <label class="subtitle-1">{{ $tr("username") }}</label>
                      <v-text-field
                        :placeholder="$tr('username')"
                        v-model.trim="form.username"
                        filled
                        dense
                      ></v-text-field>
                    </v-col>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <div class="d-flex flex-row-reverse mt-2">
          <TextButton
            type="secondary"
            class="ms-1 float-right"
            :text="$tr('cancel')"
            @click="cancel"
          >
          </TextButton>
          <TextButton
            type="danger"
            class="ms-1 float-right"
            :text="$tr('clear_filter_button')"
            @click="clear"
          >
          </TextButton>
          <TextButton
            type="primary"
            class="float-right"
            :text="$tr('submit')"
            @click="onSubmit"
          >
          </TextButton>
        </div>
        <!-- <div class="d-flex flex-row-reverse mt-2">
          <v-btn color="primary" @click="onSubmit" class="ms-1"
            >{{ $tr("filter_button") }}
          </v-btn>
          <v-btn color="error" @click="clear"
            >{{ $tr("clear_filter_button") }}
          </v-btn>
          <v-btn text class="button" @click="cancel"
            >{{ $tr("cancel") }}
          </v-btn>
        </div> -->
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import TextField from "../common/TextField";
import { mapGetters, mapActions } from "vuex";
import CloseBtn from "~/components/design/Dialog/CloseBtn";
import RangePicker from "../users/RangePicker";
import Helper from "../../helpers/helpers";
import TextButton from '../common/buttons/TextButton.vue'

export default {
  name: "UserFilter",
  components: { CloseBtn, TextField, RangePicker, TextButton },
  props: {
    masterFilter: {
      type: Boolean,
      require: false,
    },
  },

  data() {
    return {
      subsystems: ["department", "user", "team"],
      eventItems: ["delete", "insert", "update", "block", "active"],

      date: "",
      time: "",
      user_id: "",
      form: {
        username: "",
        include: 0,
        user_ids: [],
        startTime: "",
        endTime: "",
        startDate: "",
        endDate: "",
        time: "",
        event: "",
        subsystem: "",
      },
      id: "",
      ids: [],

      input: "",
      tags: [],
      menu: false,
      menu2: false,
    };
  },
  created() {
    if (this.masterFilter) {
      this.subsystems = ["country", "department", "country"];
    }
  },
  computed: {
    ...mapGetters({
      countries: "countries/getAscCountries",
      companies: "companies/getCompanies",
      roles: "roles/getItems",
      teams: "teams/getTeams",
    }),
  },
  methods: {
    ...mapActions({
      getCountries: "countries/fetchAscCountries",
      getCompanies: "companies/fetchCompanies",
      getRoles: "roles/fetchItems",
      getTeams: "teams/fetchTeams",
    }),
    addId() {
      if (!this.form.user_ids.includes(this.user_id)) {
        this.form.user_ids.push(this.user_id);
      }
      this.user_id = "";
    },
    clearId(id) {
      this.form.user_ids = this.form.user_ids.filter(
        (element) => element !== id
      );
    },
    closeDialog() {
      this.$root.$emit("getData", this.form);
      this.$emit("getRecord", this.form);
      this.$emit("close");
    },
    updateFalse() {
      this.menu2 = false;
      this.form.updated_date = "";
    },
    createFalse() {
      this.menu = false;
      this.form.created_date = "";
    },
    async onSubmit() {
      this.$root.$emit("getData", this.form);
      await this.$emit("onSubmit", this.form);
      this.$emit("close");
    },
    async clear() {
      this.form = {
        username: "",
        include: 0,
        user_ids: [],
        startTime: "",
        endTime: "",
        startDate: "",
        endDate: "",
        time: "",
        event: "",
        subsystem: "",
      };
      await this.$root.$emit("getData", this.form);
      this.$emit("onSubmit", this.form);
    },
    cancel() {
      // this.$emit("close");
      this.form = {
        user_ids: [],
      };
      this.$emit("getData", this.form);
      this.$emit("getRecord", this.form);
      this.closeDialog();
    },

    getRangeData() {
      const startTime = Helper.convertTime(this, this.form.startTime);
      const endTime = Helper.convertTime(this, this.form.endTime);
      const data = {
        // type: this.type,
        startTime: startTime,
        endTime: endTime,
      };
      return data;
    },
    onDateOkey() {
      this.menu = false;
      this.date = this.form.startDate + " , " + this.form.endDate;
    },
    onCancelDate() {
      this.menu = false;
      this.date = "";
    },

    onCancelClicked() {
      (this.menu2 = false), (this.time = "");
    },
    onOkayClicked() {
      this.menu2 = false;
      let formatedTime = this.getRangeData();
      this.time = formatedTime.startTime + " - " + formatedTime.endTime;
    },

    // return current date + 1 month
    currentDate(defaultMonth = 1) {
      const date = new Date();

      let year = date.getFullYear();
      let month = date.getMonth() + defaultMonth;

      if (month < 10) {
        month = "0" + month;
      }
      let parsedData = `${year}-${month}-01`;
      return parsedData;
    },
  },
};
</script>

<style scoped>
.userFilter .title {
  color: #b6c1d2 !important;
}
.button {
  color: #b6c1d2 !important;
}
.subtitle-1 {
  color: #8d9296;
}
.border {
  border-bottom: 0.5px solid #ece9e9;
}
div.scroll {
  width: 100%;
  max-height: 350px !important;
  height: 350px;
  overflow-y: scroll !important;
}
.show-cursor {
  cursor: pointer;
}
.id-container {
  min-height: 40px;
  max-height: 100px;
  overflow-y: scroll !important;
  width: 100%;
  border: 0.5px solid #ece9e9;
  border-radius: 4px;
}
</style>
<style>
/* Auto Complete Style Light theme */
.userFilter
  .v-input.v-input--is-dirty.v-input--dense.theme--light.v-select.v-autocomplete.v-text-field--filled {
  /* background: rgb(189 221 246 / 40%) !important; */
  background-color: var(--v-primary-base);
}
.userFilter .v-input.v-input--dense.theme--light.v-select.v-autocomplete {
  background: #dbe7ff;
}
.userFilter
  .v-input.v-input--is-dirty.v-input--dense.theme--light.v-select.v-autocomplete
  .v-input__slot
  input {
  color: white !important;
  font-weight: bold;
}
.userFilter
  .v-input.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder.v-select.v-autocomplete
  .v-select__slot
  input::placeholder {
  color: var(--v-primary-base);
  font-weight: bold;
}
.userFilter
  .v-input.v-input--is-dirty.v-input--dense.theme--light.v-select.v-autocomplete.v-text-field--filled
  .v-select__slot
  .v-input__append-inner
  .v-input__icon
  .v-icon,
.v-input.v-input--is-dirty.v-input--dense.theme--light.v-select.v-autocomplete.v-text-field--filled.v-select--is-menu-active
  .v-select__slot
  .v-input__append-inner
  .v-input__icon
  .v-icon {
  color: white !important;
}
.userFilter
  .v-input.v-input--dense.theme--light.v-select.v-autocomplete.v-text-field--filled
  .v-select__slot
  .v-input__append-inner
  .v-input__icon
  .v-icon,
.v-input.v-input--dense.theme--light.v-select.v-autocomplete.v-text-field--filled.v-select--is-menu-active
  .v-select__slot
  .v-input__append-inner
  .v-input__icon
  .v-icon {
  color: var(--v-primary-base);
}
/* End Of Auto Complete Light Theme */

.userFilter .v-input.v-input--dense.theme--light.v-text-field--placeholder {
  background: #dbe7ff;
}
.userFilter
  .v-input.v-input--dense.theme--light.v-text-field--placeholder
  .v-input__slot
  .v-input__prepend-inner
  .v-input__icon
  .v-icon {
  color: var(--v-primary-base);
}
.userFilter
  .v-input.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot
  input::placeholder {
  color: var(--v-primary-base);
  font-weight: bold;
}
.userFilter
  .v-input.v-input--is-label-active.v-input--is-dirty.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot
  input {
  color: white !important;
  font-weight: bold;
}
.userFilter
  .v-input.v-input--is-label-active.v-input--is-dirty.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder {
  background-color: var(--v-primary-base);
}
.userFilter
  .v-input.v-input--is-label-active.v-input--is-dirty.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot
  .v-input__prepend-inner
  .v-input__icon
  .v-icon {
  color: white !important;
}
.userFilter
  .v-input.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--placeholder.v-select.v-autocomplete
  .v-input__slot {
  border-radius: 4px !important;
}
.userFilter
  .v-input.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--placeholder.v-select.v-autocomplete
  .v-input__slot::before,
.userFilter
  .v-input--is-focused.v-input.v-input--dense.theme--light.v-text-field.v-select.v-autocomplete
  .v-input__slot::after {
  display: none !important;
}
.userFilter
  .v-input.v-input--is-label-active.v-input--is-dirty.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder {
  background-color: var(--v-primary-base);
}
.userFilter
  .v-input.v-input--is-label-active.v-input--is-dirty.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot
  input {
  color: white !important;
  font-weight: bold;
}
.userFilter
  .v-input.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot
  input::placeholder {
  color: var(--v-primary-base);
  font-weight: bold;
}
.userFilter
  .v-input--is-dirty.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--placeholder
  .v-input__slot {
  border-radius: 4px !important;
}
.userFilter
  .v-input--is-dirty.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--placeholder
  .v-input__slot::before,
.userFilter
  .v-input.v-input--is-label-active.v-input--is-dirty.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot::after {
  display: none !important;
}
.userFilter
  .v-input.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot::before,
.userFilter
  .v-input.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot::after {
  display: none !important;
}
.userFilter
  .v-input.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--placeholder
  .v-input__slot::before,
.userFilter
  .v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot::after {
  display: none !important;
}
.userFilter .v-text-field--filled {
  border-radius: 4px;
}
.userFilter
  .v-input.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--placeholder
  .v-input__slot {
  margin: 0;
}
.userFilter
  .v-input--dense.theme--light.v-text-field.v-text-field--placeholder
  .v-text-field__details {
  display: none;
}
</style>
