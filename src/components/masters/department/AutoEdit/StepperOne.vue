<template v-slot:general>
  <v-form ref="departmentForm" lazy-validation id="departmentForm">
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
              :label="$tr('label_required', $tr('countries'))"
              :placeholder="$tr('choose_item',$tr('countries'))"
              item-value="id"
              item-text="name"
              type="autocomplete"
              class="me-md-4 mb-md-2 mb-0"
              name="country_id"
              :country="true"
              :error-message="countryErrorMessage"
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
              :label="$tr('label_required', $tr('companies'))"
              :placeholder="$tr('choose_item',$tr('companies'))"
              v-model.trim="$v.department.company_id.$model"
              :rules="DepartmentRules.companyRule($v.department, $root)"
              item-value="id"
              item-text="name"
              type="autocomplete"
              class="me-md-4 mb-md-2 mb-0"
              name="company_id"
              has-logo
              :error-message="companyErrorMessage"
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
  </v-form>
</template>
<script>
import Edit from "../../../design/Edit";
import CloseBtn from "~/components/design/Dialog/CloseBtn";

import CustomInput from "../../../design/components/CustomInput.vue";
import FormBtn from "../../../design/components/FormBtn.vue";
import SelectedItem from "../../../design/components/SelectedItem.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import DepartmentValidations from "../../../../validations/department-validations";
import DoneMessage from "../../../design/components/DoneMessage";

export default {
  components: {
    CloseBtn,
    Edit,
    CustomInput,
    FormBtn,
    SelectedItem,
    DoneMessage,
  },
  props: {
    autoEditData: {
      require: true,
      type: Object,
    },
  },
  data() {
    return {
      countryErrorMessage: "",
      companyErrorMessage: "",
      DepartmentRules: DepartmentValidations.rules,
      isCompanySelected: false,
      formKey: 0,
      selectedCompanies: this.autoEditData.companies,
      selectedCountries: this.autoEditData.companies.map((c) => c.countries)[0],
      isNameDataLoaded: false,
      department: {
        company_id:
          this.autoEditData.companies[this.autoEditData.companies.length - 1]
            .id,
        country_id: this.autoEditData.companies.map((c) => c.countries)[0][
          this.autoEditData.companies.map((c) => c.countries)[0].length - 1
        ].id,
      },
    };
  },
  validations: {
    department: DepartmentValidations.validations.department,
  },
  methods: {
    ...mapActions({
      fetchCountries: "departments/fetchCountries",
      fetchCompanies: "departments/fetchCompanies",
      fetchCompaniesOfCountries: "departments/fetchCompaniesOfCountries",
    }),
    setNull(data) {
      this.selectedCompanies = data.companies;
      this.selectedCountries = data.companies.map((c) => c.countries)[0];
      this.department.country_id =
        this.selectedCountries[this.selectedCountries.length - 1].id;
      this.department.company_id =
        this.selectedCompanies[this.selectedCompanies.length - 1].id;
      this.$refs.departmentForm.resetValidation();
    },
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
          this.selectedCountries[this.selectedCountries.length - 1]?.id;
        this.fetchCompaniesOfCountries(this.selectedCountries.map((c) => c.id));
        if (this.selectedCompanies.length != 0) {
          this.department.company_id =
            this.selectedCompanies[this.selectedCompanies.length - 1]?.id;
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
        this.selectedCompanies[this.selectedCompanies.length - 1]?.id;
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
    isStepOneDataValid() {
      let isStepOneDataValid =
        this.selectedCountries.length > 0 && this.selectedCompanies.length > 0;
      return isStepOneDataValid === true;
    },
    /** General Section */
    checkGeneralValidation() {
      const isGenerateValid = this.isStepOneDataValid();
      if (isGenerateValid) {
        this.$refs.departmentForm.resetValidation();
        // this.$emit("onNextPageResult");
        return true
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
        return false
      }
    },
    validateForm() {
      this.$refs.departmentForm.validate();
      this.$v.department.$touch();
    },
    getGeneralForm() {
      return this.selectedCompanies;
    },
  },
  computed: {
    ...mapGetters({
      countries: "departments/countries",
      companies: "departments/companies",
    }),
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
  },
  async mounted() {
    await this.fetchCompaniesOfCountries(
      this.selectedCountries.map((c) => c.id)
    );
    await this.fetchCountries();
    await this.fetchCompanies();
  },
};
</script>

<style>
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
  top: 33%;
  padding: 0rem !important;
  position: absolute !important;
  color: red;
}
</style>
