<template>
  <v-form
    ref="departmentForm"
    lazy-validation
    @submit.prevent="onSubmit"
    id="departmentForm"
  >
    <CustomStepper
      :headers="stepper_header"
      @validate="validateStepper"
      @close="closeDialog"
      :canNext="false"
      ref="customStepper"
      @submit="onSubmit"
      :loading="isDataLoaded"
      :isSubmitting="isLoadingOrSubmitting"
    >
      <template v-slot:general>
        <div class="countries">
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
                ref="country_id"
                :country="true"
                name="country_id"
                :error-messages="countryErrorMessage"
              />
            </div>
            <div class="w-100">
              <FormBtn
                title="add_plus"
                class="mt-md-4 mb-2"
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
        <div class="companies">
          <div class="d-flex flex-column flex-md-row">
            <div class="w-full">
              <CustomInput
                v-model.trim="$v.department.company_id.$model"
                :rules="DepartmentRules.companyRule($v.department, $root)"
                :items="companies"
                :label="$tr('label_required', $tr('companies'))"
                :placeholder="$tr('choose_item',$tr('companies'))"
                item-value="id"
                item-text="name"
                logoName=""
                has-logo
                type="autocomplete"
                class="me-md-4 mb-md-2 mb-0"
                name="company_id"
                :error-messages="companyErrorMessage"
              />
            </div>
            <div class="w-100">
              <FormBtn
                title="add_plus"
                class="mt-md-4 mb-2"
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
              logoName=""
              :logo-url="item.logo"
            />
          </div>
        </div>
      </template>
      <template v-slot:department>
        <div>
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
      </template>
      <template v-slot:remark>
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
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="py-0" cols="12">
            <CustomInput
              :invalid="$v.department.note.$invalid"
              v-model.trim="$v.department.note.$model"
              :rules="DepartmentRules.noteRule($v.department, $root, 'note')"
              :label="$tr('label_required', $tr('note'))"
              placeholder="note"
              type="textarea"
              name="note"
            />
          </v-col>
        </v-row>
      </template>
      <template v-slot:done>
        <div class="d-flex justify-center">
          <done-message
            :title="$tr('item_all_set', $tr('department'))"
            :subTitle="$tr('you_can_access_your_item', $tr('department'))"
          />
        </div>
      </template>
    </CustomStepper>
  </v-form>
</template>
<script>
import CustomInput from "../../design/components/CustomInput.vue";
import FormBtn from "../../design/components/FormBtn.vue";
import SelectedItem from "../../design/components/SelectedItem.vue";
import CustomStepper from "../../design/FormStepper/CustomStepper.vue";
import { mapGetters, mapMutations, mapActions } from "vuex";
import DepartmentValidations from "../../../validations/department-validations";
import DoneMessage from "../../design/components/DoneMessage.vue";
import HandleException from "../../../helpers/handle-exception";
import Helpers from "../../../helpers/helpers";

export default {
  components: {
    CustomStepper,
    CustomInput,
    FormBtn,
    SelectedItem,
    DoneMessage,
  },
  data() {
    return {
      nameErrorMessage: "",
      industryErrorMessage: "",
      countryErrorMessage: "",
      companyErrorMessage: "",
      DepartmentRules: DepartmentValidations.rules,
      stepper_header: [
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
      isCompanySelected: false,
      selectedCompanies: [],
      selectedCountries: [],
      department: {
        name: "",
        country_id: "",
        company_id: "",
        label_id: "",
        industry_id: "",
        note: "",
      },
      isLoadingOrSubmitting: false,
      isDataLoaded: false,
      allLabels: [],
      allIndustries: [],
    };
  },
  validations: {
    department: DepartmentValidations.validations.department,
  },
  methods: {
    ...mapActions({
      fetchDepartments: "departments/getDepartmentsByKey",
      fetchCompaniesOfCountries: "departments/fetchCompaniesOfCountries",
      fetchCountries: "departments/fetchCountries",
    }),
    validateStepper(currentStep) {
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
        this.$refs.customStepper?.forceNext();
        this.$refs.departmentForm.resetValidation();
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
        this.$refs.customStepper?.forceNext();
        this.$refs.departmentForm.resetValidation();
      }
    },
    /** check remarkds validation */
    checkRemarkValidations() {
      const isStepThreeDataValid = this.isStepThreeDataValid();
      if (isStepThreeDataValid) {
        this.$refs.customStepper?.forceNext();
        this.$refs.departmentForm.resetValidation();
      }
    },
    resetForm() {
      this.$refs.departmentForm.reset();
      this.$refs.departmentForm.resetValidation();
      this.selectedCompanies = [];
      this.selectedCountries = [];
    },
    closeDialog() {
      this.resetForm();
      this.$emit("onCloseDialog");
    },
    isFormDataValid() {
      return this.$v.department.$invalid === false;
    },
    async insertRecord(department) {
      try {
        this.isLoadingOrSubmitting = true;
        const response = await this.$axios.post("/departments", department);
        if (response?.status === 201 && response?.data?.result) {
          this.resetForm();
          this.$refs.customStepper.forceNext();
        }
      } catch (error) {
        HandleException.handleApiException(this, error);
      }
      this.isDataLoaded = false;
      this.isLoadingOrSubmitting = false;
    },

    async onSubmit() {
      this.validateForm();
      if (this.isFormDataValid()) {
        this.isDataLoaded = true;
        const departmentData = this.department;
        departmentData.company_ids = this.selectedCompanies.map(
          (company) => company.id
        );
        let formData = Helpers.getFormData(departmentData);
        await this.insertRecord(formData);
        this.$refs.departmentForm.resetValidation();
      } else {
        this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
      }
    },
    ...mapMutations({
      set_companies: "departments/SET_COMPANIES",
    }),
    removeCountry(id) {
      this.selectedCountries = this.selectedCountries.filter(
        (i) => i.id !== id
      );
      this.selectedCompanies = this.selectedCompanies.filter((c) => {
        if (!c.countries.map((c) => c.id).includes(id)) {
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
      this.countryErrorMessage = "";
      this.selectedCountries.push(
        this.countries.find((c) => c?.id == this.department?.country_id)
      );
      await this.fetchCompaniesOfCountries([this.department?.country_id]);
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
      this.companyErrorMessage = "";
      this.selectedCompanies.push(
        this.companies.find((c) => c?.id == this.department.company_id)
      );
    },
    async checkNameUniqueness() {
      try {
        this.$v.department.$touch();
        const name = this.$v.department?.name.$model;
        const columns = { name: name };
        let url = "departments/check-uniqueness";
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
      let isStepTwoDataValid = this.$v.department.name.$invalid && this.$v.department.industry_id.$invalid;
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
    validateForm() {
      this.$refs.departmentForm.validate();
      this.$v.department.$touch();
    },
  },
  computed: {
    ...mapGetters({
      countries: "departments/countries",
      companies: "departments/companies",
    }),
  },
  async created() {
    if (this.countries.length == 0) {
      await this.fetchCountries();
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
  },
};
</script>

<style>
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
