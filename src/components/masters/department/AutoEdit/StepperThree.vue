<template v-slot:remark>
  <v-form ref="departmentForm" lazy-validation>
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
          :label="$tr('label_required',$tr('label'))"
          :placeholder="$tr('choose_item',$tr('label'))"
          type="autocomplete"
          name="label_id"
          class="px-4"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0" cols="12">
        <CustomInput
          :invalid="$v.department.note.$invalid"
          v-model.trim ="$v.department.note.$model"
          :rules="DepartmentRules.noteRule($v.department, $root,'note')"
          label ="note"
          placeholder="note"
          type  ="textarea"
          name="note"
          class="px-4"
        />
      </v-col>
    </v-row>
    </div>
  </v-form>
</template>
<script>
import Edit from "../../../design/Edit";
import CloseBtn from "~/components/design/Dialog/CloseBtn";

import CustomInput from "../../../design/components/CustomInput.vue";
import FormBtn from "../../../design/components/FormBtn.vue";
import SelectedItem from "../../../design/components/SelectedItem.vue";
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
      allLabels: [],
      DepartmentRules: DepartmentValidations.rules,
      formKey: 0,
      isNameDataLoaded: false,
      department: {
        label_id: this.autoEditData.label_id,
        note: this.autoEditData.note,
      },
      filePath: this.autoEditData.logo,
    };
  },
  validations: {
    department: DepartmentValidations.validations.department,
  },
  methods: {
    setNull(data) {
      this.department.label_id = data.label_id;
      this.department.note = data.note;
    },
    resetForm() {
      this.$refs.departmentForm.reset();
      this.$refs.departmentForm.resetValidation();
      this.selectedCompanies = [];
      this.selectedCountries = [];
      this.isDataSubmitted = false;
    },
    closeDialog() {
      this.$emit("onCloseDialog");
    },
    /** check remarkds validation */
    checkRemarkValidations(){
      const isStepThreeDataValid =
        this.isStepThreeDataValid();
      if(isStepThreeDataValid){
        // this.$emit("onNextPageResult");
        this.$refs.departmentForm.resetValidation();
        return true
      }else {
        return false;
      }
    },
    isFormDataValid() {
      return this.$v.department.$invalid === false;
    },
    isStepThreeDataValid() {
      let isStepFourDataValid =
        this.$v.department.label_id.$invalid ||
        this.$v.department.note.$invalid;
      return isStepFourDataValid == false;
    },
    validateForm() {
      this.$refs.departmentForm.validate();
      this.$v.department.$touch();
    },
    getRemarksForm() {
      return this.department;
    },
  },

  async mounted() {
    try {
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
  top: 33%;
  padding: 0rem !important;
  position: absolute !important;
  color: red;
}
</style>
