<template>
  <AutoEdit
    :headers="headers"
    :autoEditData="autoEditData"
    :tableName="tableName"
    @getCurrent="setCurrent"
    :iconOrLogo="autoEditData[topCurrent].logo"
    :isIcon="false"
    ref="auto_edit"
    @changeTo="onChangeTo"
    @saveAandNext="onSaveAandNext"
    @save="onSave"
    :title="autoEditData[topCurrent].name"
    @next="onNext"
    @prev="onPrev"
    :showTitle="false"
    :isLoading="isDataLoaded"
    :isSubmitting="submittingOrvalidating"
  >
    <template v-slot:general>
      <StepperOne
        ref="stepperOne"
        :autoEditData="autoEditData[topCurrent]"
        @setCurrent="onSetCurrentStep"
        @onNextPageResult="onNextPageResult"
      />
    </template>
    <template v-slot:department>
      <StepperTwo
        ref="stepperTwo"
        :autoEditData="autoEditData[topCurrent]"
        @setCurrent="onSetCurrentStep"
        @onNextPageResult="onNextPageResult"
      />
    </template>
    <template v-slot:remark>
      <StepperThree
        ref="stepperThree"
        :autoEditData="autoEditData[topCurrent]"
        @onNextPageResult="onNextPageResult"
      />
    </template>
  </AutoEdit>
</template>
<script>
import AutoEdit from "../../../components/design/AutoEdit.vue";
import StepperOne from "./AutoEdit/StepperOne";
import StepperTwo from "./AutoEdit/StepperTwo";
import StepperThree from "./AutoEdit/StepperThree";
import DoneMessage from "../../design/components/DoneMessage.vue";
import CloseBtn from "~/components/design/Dialog/CloseBtn";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    CloseBtn,
    AutoEdit,
    StepperOne,
    StepperTwo,
    StepperThree,
    DoneMessage,
  },
  props: {
    autoEditData: {
      require: true,
      type: Array,
    },
    editKey: {
      type: Number,
    },
  },
  data() {
    return {
      submittingOrvalidating: false,
      isNameDataLoaded: false,
      back: false,
      topIcon: "mdi-account",
      tableName: this.$tr("department"),
      topCurrent: 0,
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
      ],
      isDataLoaded: false,
    };
  },
  methods: {
    ...mapActions({
      fetchDepartments: "departments/fetchDepartments",
    }),
    async onSave() {
      if (this.checkValidations()) {
        try {
          const department = this.prepareDepartment();
          this.isDataLoaded = true;
          this.submittingOrvalidating = true;
          const response = await this.$axios.put(
            `/departments/${department.id}`,
            department
          );
          if (response?.status == 200 && response?.data?.result) {
            this.$toastr.s(this.$tr("successfully_updated"));
            this.isDataLoaded = false;
            const res = await this.fetchDepartments({ key: "all" });
          } else {
            this.$toastr.e(response?.data);
            this.isDataLoaded = false;
          }
        } catch (error) {
          this.isDataLoaded = false;
        }
        this.submittingOrvalidating = false;
      } else {
        this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
      }
    },
    setCurrent(topCurrent) {
      this.topCurrent = topCurrent;
      this.$refs.stepperOne.setNull(this.autoEditData[topCurrent]);
      this.$refs.stepperTwo.setNull(this.autoEditData[topCurrent]);
      this.$refs.stepperThree.setNull(this.autoEditData[topCurrent]);
    },
    prepareDepartment() {
      let department = {
        id: this.autoEditData[this.topCurrent].id,
        name: this.$refs.stepperTwo.getDepartmentForm().name,
        industry_id: this.$refs.stepperTwo.getDepartmentForm().industry_id,
        logo: this.$refs.stepperTwo.getDepartmentForm().logo,
        label_id: this.$refs.stepperThree.getRemarksForm().label_id,
        note: this.$refs.stepperThree.getRemarksForm().note,
        company_ids: this.$refs.stepperOne.getGeneralForm().map((c) => c.id),
      };
      return department;
    },
    onSaveAandNext(next_page_index) {
      let department = this.prepareDepartment();
      this.updateForm(department, next_page_index);
    },
    checkValidations() {
      return (
        this.$refs.stepperOne.isStepOneDataValid() &&
        this.$refs.stepperTwo.isStepTwoDataValid() &&
        this.$refs.stepperThree.isStepThreeDataValid()
      );
    },
    async updateForm(department, next_page_index) {
      if (this.checkValidations()) {
        try {
          this.isDataLoaded = true;
          this.submittingOrvalidating = true;
          const response = await this.$axios.put(
            `/departments/${department.id}`,
            department
          );
          if (response?.status == 200 && response?.data?.result) {
            this.$toastr.s(this.$tr("successfully_updated"));
            if (this.autoEditData.length - 1 == next_page_index) {
              return;
            }
            this.$refs.auto_edit.saveAndNextResult();
            this.setCurrent(next_page_index);
            this.isDataLoaded = false;
          } else {
            this.$toastr.e(response?.data);
            this.isDataLoaded = false;
          }
        } catch (error) {
          this.isDataLoaded = false;
        }
        this.submittingOrvalidating = false;
      } else {
        this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
      }
    },
    onPrev() {
      this.$refs.auto_edit.prevPageResult();
    },
    onNextPageResult() {
      this.$refs.auto_edit.nextPageResult();
    },
    async onNext(currentStep) {
      switch (currentStep) {
        case 1:
          if (this.$refs.stepperOne.checkGeneralValidation()) {
            this.$refs.auto_edit.nextPageResult();
          }
          break;
        case 2:
          this.isDataLoaded = true;
          if (await this.$refs.stepperTwo.checkDepartmentValidations()) {
            this.$refs.auto_edit.nextPageResult();
          }

          this.isDataLoaded = false;
          break;
        case 3:
          if (this.$refs.stepperThree.checkRemarkValidations()) {
            this.$refs.auto_edit.nextPageResult();
          }
          break;
      }
    },
    async onChangeTo(step) {
      if (
        this.$refs.stepperOne.checkGeneralValidation() ||
        (await this.$refs.stepperTwo.checkDepartmentValidations()) ||
        this.$refs.stepperThree.checkRemarkValidations()
      ) {
        this.$refs.auto_edit.changeToResult(step);
      } else {
        this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
        // this.validateForm();
        return;
      }
    },

    onSetCurrentStep(current) {
      this.$refs.auto_edit.setCurrent(current);
    },
  },
};
</script>

<style>
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
</style>
