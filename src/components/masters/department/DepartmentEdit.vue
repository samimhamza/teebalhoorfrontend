<template>
  <v-form
    ref="departmentForm"
    lazy-validation
    id="departmentForm"
    @submit.prevent=""
  >
    <edit
      :headers="headers"
      :autoEditData="autoEditData"
      :tableName="tableName"
      @close="closeDialog"
      ref="edit_stepper"
      :iconOrLogo="autoEditData.logo"
      :isIcon="false"
      @onValidate="changeStepper"
      @onSubmit="onSubmit"
      :isLoading="isDataLoaded"
      :isSubmitting="isLoadingOrSubmitting"
      :showTitle="false"
    >
      <template v-slot:general>
        <div class="topDiv">
          <div class="topTitle mb-3">
            <h1
              class="text-center text-h4 font-weight-bold border-bottom pb-2 pt-1 text-uppercase"
              style="color: #58595b"
            >
              {{ $tr("general") }}
            </h1>
          </div>
          <div class="countries mx-1 pl-3 pa-1">
            <div class="d-flex flex-column flex-md-row">
              <div class="w-full">
                <CustomInput
                  :items="countries"
                  :invalid="$v.department.country_id.$invalid"
                  v-model.trim="$v.department.country_id.$model"
                  :rules="DepartmentRules.countryRule($v.department, $root)"
                  :placeholder="$tr('choose_item',$tr('countries'))"
                  item-value="id"
                  item-text="name"
                  :label="$tr('label_required', $tr('countries'))"
                  type="autocomplete"
                  class="me-md-4 mb-md-2 mb-0"
                  name="country_id"
                  :country="true"
                  :error-messages="countryErrorMessage"
                />
              </div>
              <div class="w-100">
                <FormBtn
                  title="add_plus"
                  class="mt-md-4 mb-2 top-minus-4"
                  @click="addCountry"
                />
              </div>
            </div>
            <div class="countriesselected d-flex flex-wrap">
              <SelectedItem
                v-for="item in selectedCountries"
                :key="item.id"
                @close="removeCountry(item.id)"
                :title="item.name"
                :flag="item.iso2.toLowerCase()"
              />
            </div>
          </div>
          <br />
          <div class="comapnies mx-1 pl-3 pa-1">
            <div class="d-flex flex-column flex-md-row">
              <div class="w-full">
                <CustomInput
                  :items="companies"
                  :placeholder="$tr('choose_item',$tr('companies'))"
                  :label="$tr('label_required', $tr('companies'))"
                  v-model.trim="$v.department.company_id.$model"
                  :rules="DepartmentRules.companyRule($v.department, $root)"
                  item-value="id"
                  item-text="name"
                  has-logo
                  type="autocomplete"
                  class="me-md-4 mb-md-2 mb-0"
                  name="company_id"
                  :country="false"
                  :error-messages="companyErrorMessage"
                />
              </div>
              <div class="w-100">
                <FormBtn
                  title="add_plus"
                  class="mt-md-4 mb-2 top-minus-4"
                  @click="addCompany"
                />
              </div>
            </div>
            <div class="selected d-flex flex-wrap">
              <SelectedItem
                v-for="item in selectedCompanies"
                :key="item.id"
                @close="removeCompany(item.id)"
                :title="item.name"
                :logo-url="item.logo"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-slot:department>
        <div class="topDiv">
          <div class="topTitle">
            <h1
              class="text-center text-h4 font-weight-bold border-bottom py-2 text-uppercase"
              style="color: #58595b"
            >
              {{ $tr("department") }}
            </h1>
          </div>
          <div class="department mx-1 pl-3 pa-1">
            <div class="w-full">
              <CustomInput
                :invalid="$v.department.name.$invalid"
                v-model.trim="$v.department.name.$model"
                :rules="DepartmentRules.nameRule($v.department, $root, 'name')"
                :label="$tr('item_name_required', $tr('department'))"
                :placeholder="$tr('item_name', $tr('department'))"
                :error-messages="nameErrorMessage"
                type="textfield"
                name="name"
              />
            </div>
            <div class="w-full mt-2">
              <CustomInput
                v-model.trim="$v.department.industry_id.$model"
                :invalid="$v.department.industry_id.$invalid"
                :items="allIndustries"
                item-value="id"
                item-text="name"
                :rules="DepartmentRules.industryRule($v.department, $root)"
                :label="$tr('label_required', $tr('industry'))"
                :placeholder="$tr('choose_item', $tr('industry'))"
                type="autocomplete"
                name="industry_id"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-slot:remark>
        <div class="topDiv" style="overflow-x: hidden">
          <div class="topTitle">
            <h1
              class="text-center text-h4 font-weight-bold border-bottom py-2 text-uppercase"
              style="color: #58595b"
            >
              {{ $tr("remarks") }}
            </h1>
          </div>
          <v-row>
            <v-col sm="12" md="6" class="py-0" cols="12">
              <CustomInput
                :invalid="$v.department.label_id.$invalid"
                v-model.trim="$v.department.label_id.$model"
                :rules="DepartmentRules.labelRule($v.department, $root)"
                :items="allLabels"
                item-value="id"
                item-text="title"
                :label="$tr('label_required', $tr('label'))"
                :placeholder="$tr('choose_item',$tr('label'))"
                type="autocomplete"
                name="label_id"
                class="px-4"
                :error-messages="labelErrorMessage"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="py-0" cols="12">
              <CustomInput
                :error-messages="noteErrorMessage"
                :invalid="$v.department.note.$invalid"
                v-model.trim="$v.department.note.$model"
                :rules="DepartmentRules.noteRule($v.department, $root, 'note')"
                :label="$tr('label_required', $tr('note'))"
                placeholder="note"
                type="textarea"
                name="note"
                class="px-4"
              />
            </v-col>
          </v-row>
        </div>
      </template>
      <template v-slot:done>
        <div class="d-flex justify-center">
          <done-message
            :title="$tr('item_all_set', $tr('department'))"
            :subTitle="$tr('you_can_access_your_item', $tr('department'))"
          />
        </div>
      </template>
    </edit>
  </v-form>
</template>

<script>
import CloseBtn from "~/components/design/Dialog/CloseBtn";

import CustomInput from "../../design/components/CustomInput.vue";
import FormBtn from "../../design/components/FormBtn.vue";
import SelectedItem from "../../design/components/SelectedItem.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import DepartmentValidations from "../../../validations/department-validations";
import DoneMessage from "../../design/components/DoneMessage.vue";
import Edit from "../../design/Edit.vue";
import HandleException from "../../../helpers/handle-exception";

export default {
  components: {
    CloseBtn,
    CustomInput,
    FormBtn,
    SelectedItem,
    DoneMessage,
    Edit,
  },
  props: {
    autoEditData: {
      require: true,
      type: Object,
    },
  },
  data() {
    return {
      nameErrorMessage: "",
      labelErrorMessage: "",
      noteErrorMessage: "",
      countryErrorMessage: "",
      companyErrorMessage: "",
      isLoadingOrSubmitting: false,
      isDataLoaded: false,
      allLabels: [],
      allIndustries: [],
      DepartmentRules: DepartmentValidations.rules,
      isCompanySelected: false,
      selectedCompanies: [],
      selectedCountries: [],
      isNameDataLoaded: false,
      department: {
        id: this.autoEditData.id,
        name: this.autoEditData.name,
        label_id: this.autoEditData.label_id,
        industry_id: this.autoEditData.industry_id,
        company_id:
          this.autoEditData.companies[this.autoEditData.companies.length - 1]
            .id,
        country_id: this.autoEditData.companies.map((c) => c.countries)[0][
          this.autoEditData.companies.map((c) => c.countries).length - 1
        ].id,
        note: this.autoEditData.note,
        logo: this.autoEditData.logo,
      },
      tableName: this.$tr("department"),
      isNameDublicate: false,
      headers: [
        {
          icon: "fa-info-circle",
          title: "general",
          slotName: "general",
        },
        {
          icon: "fa-lock",
          title: "department",
          slotName: "department",
        },
        {
          icon: "fa-comment-dots",
          title: "remarks",
          slotName: "remark",
        },
        {
          icon: "fa-thumbs-up",
          title: "done",
          slotName: "done",
        },
      ],
    };
  },
  validations: {
    department: DepartmentValidations.validations.department,
  },
  methods: {
    ...mapActions({
      fetchCountries: "departments/fetchCountries",
      fetchCompanies: "departments/fetchCompanies",
      fetchDepartments: "departments/getDepartmentsByKey",
      fetchCompaniesOfCountries: "departments/fetchCompaniesOfCountries",
    }),
    closeDialog() {
      this.$emit("onCloseDialog");
    },
    isFormDataValid() {
      return this.$v.department.$invalid;
    },
    async editRecord(department) {
      try {
        this.isLoadingOrSubmitting = true;
        this.isDataLoaded = true;
        const response = await this.$axios.put(
          `/departments/${this.department.id}`,
          department
        );
        if (response?.status == 200 && response?.data?.result) {
          this.$toastr.s(this.$tr("successfully_updated"));
          this.isDataLoaded = false;
          const res = this.fetchDepartments({ key: "all" });
          this.$refs.edit_stepper.nextForce();
        } else {
          this.$toastr.e(response?.data);
          this.isDataLoaded = false;
        }
      } catch (error) {
        this.isDataLoaded = false;
      }
      this.isLoadingOrSubmitting = false;
      // this.$emit("close");
    },
    onSubmit() {
      this.validateForm();
      if (!this.isFormDataValid()) {
        let formData = {
          id: this.department.id,
          name: this.department.name,
          company_ids: this.selectedCompanies.map((c) => c.id),
          note: this.department.note,
          label_id: this.department.label_id,
          industry_id: this.department.industry_id,
        };
        this.editRecord(formData);
        this.$refs.departmentForm.resetValidation();
      } else {
        this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
        if (this.$v.department.label_id.$invalid) {
          this.$v.department.$touch();
          this.labelErrorMessage = this.$tr(
            "item_is_required",
            this.$tr("label")
          );
        }
        if (this.$v.department.note.$invalid) {
          this.$v.department.$touch();
          this.noteErrorMessage = this.$tr(
            "item_is_required",
            this.$tr("note")
          );
        }
      }
    },
    ...mapMutations({
      set_companies: "departments/SET_COMPANIES",
    }),
    removeCountry(country_id) {
      this.selectedCountries = this.selectedCountries.filter(
        (i) => i.id !== country_id
      );
      this.selectedCompanies = this.selectedCompanies.filter((c) => {
        if (!c.countries.map((c) => c.id).includes(country_id)) {
          return c;
        }
      });
      if (this.selectedCompanies.length == 0) {
        this.department.company_id = null;
      }
      if (this.selectedCountries.length != 0) {
        this.department.country_id =
          this.selectedCountries[this.selectedCountries.length - 1].id;
        this.fetchCompaniesOfCountries(this.selectedCountries.map((c) => c.id));
        if (this.selectedCompanies.length != 0) {
          this.department.company_id =
            this.selectedCompanies[this.selectedCompanies.length - 1].id;
        }
        return;
      }
      this.$v.department.country_id.$model = null;
    },
    removeCompany(id) {
      this.selectedCompanies = this.selectedCompanies.filter((c) => c.id != id);
      if (this.selectedCompanies.length != 0) {
        this.department.company_id =
          this.selectedCompanies[this.selectedCompanies.length - 1].id;
        return;
      }
      this.$v.department.company_id.$model = null;
    },
    isCountryAlreadySelected() {
      return this.selectedCountries.find(
        (c) => c.id == this.department.country_id
      );
    },
    isCompanyAlreadySelected() {
      return this.selectedCompanies.find(
        (c) => c.id == this.department.company_id
      );
    },
    async addCountry() {
      if (this.isCountryAlreadySelected()) {
        this.$toastr.e(this.$tr("item_already_selected", this.$tr("country")));
        return;
      }
      if (this.$v.department.country_id.$invalid) {
        this.$v.department.country_id.$model = null;
        return;
      }
      this.selectedCountries.push(
        this.countries.find((c) => c.id == this.department.country_id)
      );
      this.fetchCompaniesOfCountries([this.department.country_id]);
      this.department.company_id =
        this.selectedCompanies[this.selectedCompanies.length - 1].id;
    },
    async addCompany() {
      if (this.isCompanyAlreadySelected()) {
        this.$toastr.e(this.$tr("item_already_selected", this.$tr("company")));
        return;
      }
      if (this.$v.department.company_id.$invalid) {
        this.$v.department.company_id.$model = null;
        return;
      }
      this.selectedCompanies.push(
        this.companies.find((c) => c.id == this.department.company_id)
      );
    },

    validateForm() {
      this.$refs.departmentForm.validate();
      this.$v.department.$touch();
    },
    changeStepper(currentStep) {
      switch (currentStep) {
        case 1:
          this.checkGeneralValidation();
          break;
        case 2:
          this.checkDepartmentValidations();
          break;
        case 3:
          this.checkRemarkValidations();
          break;
      }
    },
    /** General Section */
    checkGeneralValidation() {
      const isGenerateValid = this.isStepOneDataValid();
      if (isGenerateValid) {
        this.$refs.departmentForm.resetValidation();
        this.$refs.edit_stepper.nextForce();
      } else {
        if (this.selectedCountries.length == 0) {
          this.countryErrorMessage = this.$tr(
            "item_is_required",
            this.$tr("country")
          );
        }
        if (this.selectedCompanies.length == 0) {
          this.companyErrorMessage = this.$tr(
            "item_is_required",
            this.$tr("company")
          );
        } else {
          this.companyErrorMessage = "";
          this.countryErrorMessage = "";
          this.$refs.departmentForm.resetValidation();
        }
      }
    },
    /** check department validation */
    async checkDepartmentValidations() {
      const isStepTwoDataValid = await this.isStepTwoDataValid();
      if (isStepTwoDataValid) {
        this.$refs.edit_stepper.nextForce();
        this.$refs.departmentForm.resetValidation();
      }
    },
    /** check remarkds validation */
    checkRemarkValidations() {
      const isStepThreeDataValid = this.isStepThreeDataValid();
      if (isStepThreeDataValid) {
        this.$refs.edit_stepper.nextForce();
        this.$refs.departmentForm.resetValidation();
      }
    },
    async checkNameUniqueness() {
      try {
        this.$v.department.$touch();
        const name = this.$v.department?.name.$model;
        const id = this.department.id;
        const columns = { name: name };
        let url = `departments/check-uniqueness?id=${id}`;
        const response = await this.$axios.post(url, columns);
        return {
          isNameAlreadyExists: response?.data?.name,
        };
      } catch (error) {
        HandleException.handleApiException(this, error);
        return false;
      }
    },
    async isStepTwoDataValid() {
      this.validateForm();
      let isStepTwoDataValid = this.$v.department.name.$invalid || this.$v.department.industry_id.$invalid;
      if (!isStepTwoDataValid) {
        this.isDataLoaded = true;
        const res = await this.checkNameUniqueness();
        isStepTwoDataValid = res.isNameAlreadyExists;
        if (isStepTwoDataValid) {
          this.nameErrorMessage = this.$tr(
            "item_already_exists",
            this.$tr("department")
          );
        } else {
          this.nameErrorMessage = "";
        }
        this.isDataLoaded = false;
      }
      return !isStepTwoDataValid;
    },
    isStepOneDataValid() {
      let isStepOneDataValid =
        this.selectedCountries.length > 0 && this.selectedCompanies.length > 0;
      return isStepOneDataValid === true;
    },
    isStepThreeDataValid() {
      let isStepFourDataValid =
        this.$v.department.label_id.$invalid ||
        this.$v.department.note.$invalid;
      return !isStepFourDataValid;
    },
  },
  computed: {
    ...mapGetters({
      countries: "departments/countries",
      companies: "departments/companies",
    }),
  },
  async mounted() {
    if (this.countries.length == 0) {
      this.fetchCountries();
    }

    try {
      const res = await this.$axios.get('industries');
      this.allIndustries = res?.data?.data;
      const response = await this.$axios.get(
        `labels/id?sub_system=Departments`
      );
      this.allLabels = response?.data?.labels;
    } catch (error) {
      if (error?.response?.status === 404 && !error?.response?.data?.result) {
        this.$toastr.w(this.$tr("item_not_found", this.$tr("sub_system")));
      }
    }

    this.selectedCountries = this._.clone(
      this.autoEditData.companies.map((c) => c.countries)[0]
    );
    this.selectedCompanies = this._.clone(this.autoEditData.companies);
    this.department.company_id =
      this.selectedCompanies[this.selectedCompanies.length - 1].id;
    this.department.country_id =
      this.selectedCountries[this.selectedCountries.length - 1].id;
    this.fetchCompaniesOfCountries(this.selectedCountries.map((c) => c.id));
  },
  watch: {
    autoEditData: {
      handler: function (data) {
        this.selectedCompanies = this.autoEditData?.companies;
        this.selectedCountries = this.autoEditData?.companies.map(
          (c) => c.countries
        )[0];
        this.department.country_id = this._.clone(
          this.selectedCountries[this.selectedCountries.length - 1].id
        );
        this.department.company_id = this._.clone(
          this.selectedCompanies[this.selectedCompanies.length - 1].id
        );
        this.fetchCompaniesOfCountries(this.selectedCountries.map((c) => c.id));
      },
    },
    "department.label_id": {
      handler() {
        if (!this.$v.department.label_id.$invalid) {
          this.labelErrorMessage = "";
        }
      },
      deep: true,
    },
    "department.note": {
      handler() {
        if (!this.$v.department.note.$invalid) {
          this.noteErrorMessage = "";
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.custom-logo {
  background-repeat: no-repeat;
  background-size: cover !important;
  background-position: center;
  background: #edf2f9;
}
.custom-logo .v-file-input__text {
  height: 110px;
  opacity: 0;
}
.custom-logo .v-input__slot fieldset {
  border-style: dashed !important;
}
.custom-logo .v-input__slot {
  min-height: 200px !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.upload-first-p {
  font-size: 18px;
  color: var(--upload-input-first-p);
  letter-spacing: 0.5px;
}
.upload-second-p {
  color: var(--input-border-color);
  line-height: 1.5;
}
.custom-logo .v-input__prepend-inner {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.main-Card {
  background-color: #f9fafd !important;
}
.main-Card .title {
  color: #b6c1d2 !important;
}
.main-Card .v-stepper .v-stepper__header .v-stepper__step__step {
  display: none !important;
}
.main-Card .v-stepper__step.v-stepper__step--active .v-stepper__label .v-btn {
  background-color: var(--v-primary-base);
  color: white;
}
.dublicate-name {
  top: -34% !important;
  padding: 0rem !important;
  position: relative !important;
  color: red;
}
.v-progress-circular {
  margin-top: 2rem;
  margin-left: 0rem;
  margin-right: 2rem;
}

.avatar {
  height: 110px;
  width: 110px;
  background-color: var(--gray-cyan);
  border: 2px solid var(--gray-cyan);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.avatar .v-icon {
  color: var(--color-white);
  font-size: 60px;
}

.custom-file .v-file-input__text {
  height: 110px;
  opacity: 0;
}

.custom-file .v-input__slot fieldset {
  border-style: dashed !important;
}

.custom-file .v-input__slot {
  display: flex;
  justify-content: center;
  align-items: center;
}

.upload-first-p {
  font-size: 18px;
  color: var(--upload-input-first-p);
  letter-spacing: 0.5px;
}

.upload-second-p {
  color: var(--input-border-color);
  line-height: 1.5;
}

.custom-file .v-input__prepend-inner {
  position: absolute;
}

.dublicate-name {
  top: -32% !important;
  padding: 0rem !important;
  position: relative !important;
  color: red;
}
.v-progress-circular {
  margin-top: 2rem;
  margin-left: 0rem;
  margin-right: 2rem;
}
</style>
