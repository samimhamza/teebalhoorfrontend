<template>
  <div>
    <v-dialog v-model="model" width="1300" persistent>
      <Dialog @closeDialog="closeDialog">
        <v-form lazy-validation ref="candidateRegisterForm">
          <CustomStepper
            :headers="steppers"
            @close="close"
            :canNext="false"
            @validate="validateStepper"
            :is-submitting="isSubmitting"
            :loading="isLoading"
            ref="candidateStepperRef"
            @submit="insertSubmitForm"
          >
            <template v-slot:step1>
              <CandidateStepOne :candidate="$v.candidate" />
            </template>

            <template v-slot:step2>
              <CandidateStepTwo :candidate="$v.candidate" />
            </template>

            <template v-slot:step3>
              <CandidateStepThree :candidate="$v.candidate" />
            </template>

            <template v-slot:step4>
              <CandidateExperience
                :candidate="$v.candidate"
                :candidateSchema="candidate"
              />
            </template>

            <template v-slot:step5>
              <CandidateEducation
                :candidate="$v.candidate"
                :candidateSchema="candidate"
              />
            </template>

            <template v-slot:step6>
              <CandidateDependent
                :candidate="$v.candidate"
                :candidateSchema="candidate"
              />
            </template>

            <template v-slot:step7>
              <CandidateEmergencyContact
                :candidate="$v.candidate"
                :candidateSchema="candidate"
              />
            </template>

            <template v-slot:step8>
              <CandidateSkill
                :candidate="$v.candidate"
                :candidateSchema="candidate"
              />
            </template>
            <template v-slot:step9>
              <CandidateSocial
                :candidate="$v.candidate"
                :candidateSchema="candidate"
              />
            </template>

            <template v-slot:step10>
              <DoneMessage
                :title="$tr('item_all_set', $tr('candidate'))"
                :subTitle="$tr('you_can_access_your_item', $tr('candidate'))"
              />
            </template>
          </CustomStepper>
        </v-form>
      </Dialog>
    </v-dialog>
  </div>
</template>

<script>
import HandleException from "~/helpers/handle-exception";
import Dialog from "~/components/design/Dialog/Dialog.vue";
import CustomStepper from "~/components/design/FormStepper/CustomStepper";
import CustomInput from "~/components/design/components/CustomInput";
import DoneMessage from "~/components/design/components/DoneMessage.vue";
import CandidateStepOne from "./CandidateStepOne";
import CandidateStepTwo from "./CandidateStepTwo";
import CandidateStepThree from "./CandidateStepThree";
import CandidateExperience from "./CandidateExperience";
import CandidateEducation from "./CandidateEducation";
import CandidateDependent from "./CandidateDependent";
import CandidateSkill from "./CandidateSkill";
import CandidateSocial from "./CandidateSocial";
import CandidateEmergencyContact from "./CandidateEmergencyContact";
import Helpers from "~/helpers/helpers";
import CandidateValidations from "~/validations/hr_management/candidate-validations";
import { mapActions } from "vuex";

export default {
  components: {
    Dialog,
    CustomStepper,
    DoneMessage,
    CustomInput,
    CandidateStepOne,
    CandidateStepTwo,
    CandidateStepThree,
    CandidateExperience,
    CandidateEducation,
    CandidateDependent,
    CandidateEmergencyContact,
    CandidateSkill,
    CandidateSocial,
  },
  name: "RegisterCandidate",
  props: {
    registerDialog: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      allLabels: [],
      model: true,
      isLoading: false,
      isSubmitting: false,
      shouldGoesBack: false,
      rules: CandidateValidations.rules,
      steppers: CandidateValidations.steppers,
      candidate: JSON.parse(JSON.stringify(CandidateValidations.schema)),
    };
  },

  methods: {
    ...mapActions({
      fetchAllCountries: "countries/fetchAscCountries",
      fetchItems: "business_locations/fetchItems",
    }),
    // validate form and data
    async validateStepper(currentStep) {
      this.$refs.candidateRegisterForm.validate();
      this.$v.candidate.$touch();
      this.$refs.candidateStepperRef?.forceNext();
      console.log(this.candidate);
      console.log(this.$v.candidate);

      switch (currentStep) {
        case 1:

          break;
        case 2:
          break;
        default:
          break;
      }
    },

    // submit registration form
    async insertSubmitForm() {
      this.$refs.candidateRegisterForm.validate();
      this.$v.candidate.$touch();

      if (!this.$v.candidate.$invalid) {
        this.isSubmitting = true;

        this.isSubmitting = false;
      } else {
        this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
      }
    },

    // insert record into database
    async insertRecord(data) {
      try {
        const response = await this.$axios.post("candidates", data);
        if (response?.status === 201 && response?.data?.result) {
          this.$refs.candidateStepperRef.forceNext();
          this.clearAllPrevData();
        } else {
          this.$toastr.e(this.$tr("something_went_wrong"));
        }
      } catch (error) {
        if (error?.response?.status === 502) {
          this.$toastr.e(this.$tr("sending_email_failed"));
          return;
        }
        HandleException.handleApiException(this, error);
      }
    },

    // fetch items according to table name
    async fetchNessaryData(tableName) {
      try {
        const url = `data?table=${tableName}`;
        const response = await this.$axios.get(url);
        return response.data[tableName];
      } catch (error) {
        return null;
      }
    },

    // remove all previous data
    clearAllPrevData() {
      this.candidate = JSON.parse(JSON.stringify(CandidateValidations.schema));

      this.$v.candidate.$reset();
      this.$refs.candidateRegisterForm.reset();
      this.$refs.candidateRegisterForm.resetValidation();
      this.shouldGoesBack = true;
    },

    // close dialog
    close() {
      if (this.shouldGoesBack) {
        this.shouldGoesBack = false;
        this.$refs.candidateStepperRef.setCurrent(1);
      }
    },

    // close dialog
    closeDialog() {
      this.$emit("update:registerDialog", false);
    },
  },

  validations: {
    candidate: CandidateValidations.validations,
  },
};
</script>
