<template v-slot:department>
  <v-form ref="departmentForm" lazy-validation>
    <div class="topDiv">
      <div class="topTitle">
        <h1
          class="text-center text-h4 font-weight-bold border-bottom py-2 text-uppercase"
          style="color: #58595b"
        >
          {{ $tr("department") }}
        </h1>
      </div>
      <div class="department mx-1 pl-3">
        <div class="mt-3">
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
import CustomLogoInput from "../../../design/components/CustomLogoInput.vue";
import HandleException from "../../../../helpers/handle-exception";

export default {
  components: {
    CloseBtn,
    Edit,
    CustomInput,
    FormBtn,
    SelectedItem,
    CustomLogoInput,
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
      nameErrorMessage: '',
      DepartmentRules: DepartmentValidations.rules,
      selectedCompanies: [],
      selectedCountries: [],
      isNameDataLoaded: false,
      isNameDublicate: false,
      allIndustries: [],
      department: {
        name: this.autoEditData.name,
        industry_id: this.autoEditData.industry_id,
        id: this.autoEditData.id,
      },
      isLabelSelected: false,
    };
  },
  validations: {
    department: DepartmentValidations.validations.department,
  },

  async mounted() {
    try {
      const response = await this.$axios.get('industries');
      this.allIndustries = response?.data?.data;
    } catch (error) {
      this.$toastr.e(this.$tr("something_went_wrong"));
    }
  },


  methods: {
    setNull(data) {
      this.$v.department.name.$model = data?.name;
      this.$v.department.industry_id.$model = data?.industry_id;
      this.$refs.departmentForm.resetValidation();
    },
    /** check department validation */
    async checkDepartmentValidations(){
      const isStepTwoDataValid =
        await this.isStepTwoDataValid();
      if (isStepTwoDataValid) {
        // this.$emit("onNextPageResult");
        this.$refs.departmentForm.resetValidation();
        return true
      }else{
        return false
      }
    },
    async checkNameUniqueness(){
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
        if(!isStepTwoDataValid){
          this.isDataLoaded = true;
          const res = await this.checkNameUniqueness();
          isStepTwoDataValid = res.isNameAlreadyExists;
          if (isStepTwoDataValid) {
            this.nameErrorMessage = this.$tr(
              "item_already_exists",
              this.$tr("department")
            );
          }
          else {
            this.nameErrorMessage = "";
          }
          this.isDataLoaded = false;
        }
      return !isStepTwoDataValid;
    },
    validateForm() {
      this.$refs.departmentForm.validate();
      this.$v.department.$touch();
    },
    getDepartmentForm() {
      return {
        name: this.department.name,
        industry_id: this.department.industry_id
      };
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
  top: 36%;
  padding: 0rem !important;
  position: absolute !important;
  color: red;
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
