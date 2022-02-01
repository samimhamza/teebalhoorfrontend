<template>
  <v-card class="businessLocationFilter">
    <v-card-title primary-title class="border">
      <span class="me-1">
        <v-icon>mdi-filter</v-icon>
      </span>
      <h2>{{ $tr("filter_business_locations") }}</h2>
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
                      {{ $tr("specifiec_filter") }}
                    </h2>
                    <v-col cols="12 pb-0 mb-0">
                      <label class="subtitle-1">{{ $tr("country") }}</label>
                      <v-autocomplete
                        v-model="form.country_id"
                        :items="countries"
                        item-text="name"
                        item-value="id"
                        dense
                        filled
                        @change="selectCountry"
                        :placeholder="$tr('countries')"
                      >
                        <template v-slot:[`item`]="{ item }">
                          <v-list-item-content>
                            <div class="d-flex align-center">
                              <div class="me-1">
                                <FlagIcon
                                  :flag="item.iso2.toLowerCase()"
                                  round
                                />
                              </div>
                              <div>
                                <v-list-item-title
                                  v-html="`${item.name}`"
                                ></v-list-item-title>
                              </div>
                            </div>
                          </v-list-item-content>
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12 py-0 my-0">
                      <label class="subtitle-1">{{ $tr("company") }}</label>
                      <v-autocomplete
                        v-model="form.company_id"
                        :items="companies"
                        item-text="name"
                        item-value="id"
                        dense
                        filled
                        :placeholder="$tr('companies')"
                        :loading="isFetchingCompany"
                      >
                        <template v-slot:[`item`]="{ item }">
                          <v-list-item-content>
                            <div class="d-flex align-center">
                              <div class="me-1">
                                <v-avatar size="30">
                                  <img :src="item.logo" alt="" />
                                </v-avatar>
                              </div>
                              <div>
                                <v-list-item-title
                                  v-html="`${item.name}`"
                                ></v-list-item-title>
                              </div>
                            </div>
                          </v-list-item-content>
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12 py-0 my-0" class="">
                      <label class="subtitle-1">{{ $tr("name") }}</label>
                      <v-text-field
                        :placeholder="$tr('name')"
                        v-model.trim="form.name"
                        filled
                        dense
                      ></v-text-field>
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
                      <label class="subtitle-1">{{
                        $tr("select_created_date")
                      }}</label>
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
                            v-model="form.created_date"
                            :placeholder="$tr('select_created_date')"
                            prepend-inner-icon="mdi-calendar"
                            readonly
                            filled
                            dense
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="form.created_date" range>
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="createFalse()">
                            {{ $tr('cancel') }}
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.dialog.save(form.created_date)"
                          >
                            {{ $tr('ok') }}
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12 py-0 my-0" class="">
                      <label class="subtitle-1">{{ $tr("last_edited") }}</label>
                      <v-menu
                        ref="dialog2"
                        v-model="menu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="form.updated_date"
                            :placeholder="$tr('select_last_updated_date')"
                            prepend-inner-icon="mdi-calendar"
                            readonly
                            filled
                            dense
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="form.updated_date" range>
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="updateFalse()">
                            {{ $tr('cancel') }}
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.dialog2.save(form.updated_date)"
                          >
                            {{ $tr('ok') }}
                          </v-btn>
                        </v-date-picker>
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
                      {{ $tr("id_selection") }}
                    </h2>
                    <v-col cols="12" class="">
                      <label class="subtitle-1">{{ $tr("id") }}</label>
                      <v-text-field
                        placeholder="1000100"
                        v-model="id"
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
                          v-for="id in form.ids"
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
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import TextField from "../../common/TextField";
import { mapGetters, mapActions } from "vuex";
import CloseBtn from "~/components/design/Dialog/CloseBtn";
import FlagIcon from "../../common/FlagIcon.vue";
import TextButton from '../../common/buttons/TextButton.vue'

export default {
  name: "businessLocationFilter",
  components: { CloseBtn, TextField, FlagIcon, TextButton },
  props: {
    prevFilterData: {
      required: true
    }
  },
  data() {
    return {
      form: {
        country_id: "",
        company_id: "",
        created_date: "",
        updated_date: "",
        name: "",
        include: 0,
        ids: [],
      },
      id: "",

      input: "",
      tags: [],
      menu: false,
      menu2: false,
      isFetchingCompany: false,
    };
  },
  created() {
    if (this.countries?.length == 0) {
      this.getCountries();
    }
    if (this.companies?.length == 0) {
      this.getCompanies();
    }
    this.form = {
      name: this?.prevFilterData?.name ? this.prevFilterData?.name : "",
      include: this?.prevFilterData?.include ? this.prevFilterData?.include : 0,
      created_date: this?.prevFilterData?.created_date
        ? this.prevFilterData?.created_date
        : "",
      updated_date: this?.prevFilterData?.updated_date
        ? this.prevFilterData?.updated_date
        : "",
      country_id: this?.prevFilterData?.country_id
        ? this.prevFilterData?.country_id
        : "",
      company_id: this?.prevFilterData?.company_id
        ? this.prevFilterData?.company_id
        : "",
      ids:
        this?.prevFilterData?.ids?.length > 0
          ? this.prevFilterData?.ids
          : [],
    };
  },
  computed: {
    ...mapGetters({
      countries: "departments/countries",
      companies: "departments/companies",
    }),
  },
  methods: {
    ...mapActions({
      getCountries: "departments/fetchCountries",
      getCompanies: "departments/fetchCompanies",
      fetchCompaniesOfCountries: "departments/fetchCompaniesOfCountries",
    }),
    addId() {
      if (!this.form.ids.includes(this.id)) {
        this.form.ids.unshift(this.id);
      }
      this.id = "";
    },
    async selectCountry() {
      this.isFetchingCompany = true;
      await this.fetchCompaniesOfCountries([this.form.country_id]);
      this.isFetchingCompany = false;
    },
    clearId(id) {
      this.form.ids = this.form.ids.filter((element) => element !== id);
    },
    closeDialog() {
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
      this.$emit("getRecord", this.form);
      this.$emit("close");
    },
    clear() {
      this.id = "";
      this.form = {
        country_id: "",
        company_id: "",
        created_date: "",
        updated_date: "",
        name: "",
        include: 0,
        ids: [],
      };
      this.$root.$emit("getData", this.form);
      this.$emit("getRecord", this.form);
      this.getCompanies();
    },
    cancel() {
      this.id = "";
      this.form = {
        ids: [],
      };
      this.$root.$emit("getData", this.form);
      this.$emit("getRecord", this.form);
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.businessLocationFilter .title {
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
.businessLocationFilter
  .v-input.v-input--is-dirty.v-input--dense.theme--light.v-select.v-autocomplete.v-text-field--filled {
  /* background: rgb(189 221 246 / 40%) !important; */
  background-color: var(--v-primary-base);
}
.businessLocationFilter
  .v-input.v-input--dense.theme--light.v-select.v-autocomplete {
  background: #dbe7ff;
}
.businessLocationFilter
  .v-input.v-input--is-dirty.v-input--dense.theme--light.v-select.v-autocomplete
  .v-input__slot
  input {
  color: white !important;
  font-weight: bold;
}
.businessLocationFilter
  .v-input.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder.v-select.v-autocomplete
  .v-select__slot
  input::placeholder {
  color: var(--v-primary-base);
  font-weight: bold;
}
.businessLocationFilter
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
.businessLocationFilter
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

.businessLocationFilter
  .v-input.v-input--dense.theme--light.v-text-field--placeholder {
  background: #dbe7ff;
}
.businessLocationFilter
  .v-input.v-input--dense.theme--light.v-text-field--placeholder
  .v-input__slot
  .v-input__prepend-inner
  .v-input__icon
  .v-icon {
  color: var(--v-primary-base);
}
.businessLocationFilter
  .v-input.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot
  input::placeholder {
  color: var(--v-primary-base);
  font-weight: bold;
}
.businessLocationFilter
  .v-input.v-input--is-label-active.v-input--is-dirty.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot
  input {
  color: white !important;
  font-weight: bold;
}
.businessLocationFilter
  .v-input.v-input--is-label-active.v-input--is-dirty.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder {
  background-color: var(--v-primary-base);
}
.businessLocationFilter
  .v-input.v-input--is-label-active.v-input--is-dirty.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot
  .v-input__prepend-inner
  .v-input__icon
  .v-icon {
  color: white !important;
}
.businessLocationFilter
  .v-input.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--placeholder.v-select.v-autocomplete
  .v-input__slot {
  border-radius: 4px !important;
}
.businessLocationFilter
  .v-input.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--placeholder.v-select.v-autocomplete
  .v-input__slot::before,
.businessLocationFilter
  .v-input--is-focused.v-input.v-input--dense.theme--light.v-text-field.v-select.v-autocomplete
  .v-input__slot::after {
  display: none !important;
}
.businessLocationFilter
  .v-input.v-input--is-label-active.v-input--is-dirty.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder {
  background-color: var(--v-primary-base);
}
.businessLocationFilter
  .v-input.v-input--is-label-active.v-input--is-dirty.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot
  input {
  color: white !important;
  font-weight: bold;
}
.businessLocationFilter
  .v-input.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot
  input::placeholder {
  color: var(--v-primary-base);
  font-weight: bold;
}
.businessLocationFilter
  .v-input--is-dirty.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--placeholder
  .v-input__slot {
  border-radius: 4px !important;
}
.businessLocationFilter
  .v-input--is-dirty.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--placeholder
  .v-input__slot::before,
.businessLocationFilter
  .v-input.v-input--is-label-active.v-input--is-dirty.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot::after {
  display: none !important;
}
.businessLocationFilter
  .v-input.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot::before,
.businessLocationFilter
  .v-input.v-input--is-readonly.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot::after {
  display: none !important;
}
.businessLocationFilter
  .v-input.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--placeholder
  .v-input__slot::before,
.businessLocationFilter
  .v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--is-booted.v-text-field--enclosed.v-text-field--placeholder
  .v-input__slot::after {
  display: none !important;
}
.businessLocationFilter .v-text-field--filled {
  border-radius: 4px;
}
.businessLocationFilter
  .v-input.v-input--dense.theme--light.v-text-field.v-text-field--single-line.v-text-field--filled.v-text-field--placeholder
  .v-input__slot {
  margin: 0;
}
.businessLocationFilter
  .v-input--dense.theme--light.v-text-field.v-text-field--placeholder
  .v-text-field__details {
  display: none;
}
</style>
