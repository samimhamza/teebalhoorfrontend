<template>
  <div>
    <v-dialog
      v-model="registerDialog"
      persistent
      scrollable
      width="1300"
      v-if="$isInScope('labels-create')"
    >
      <Dialog @closeDialog="$emit('update:registerDialog', false)">
        <v-form
          lazy-validation
          ref="jobPostRegisterFormRef"
          @submit.prevent="submitForm"
        >
          <CustomStepper
            :headers="steppers"
            @close="closeStepper"
            :canNext="false"
            @validate="validateStepper"
            :is-submitting="isLoading"
            @submit="submitForm"
            ref="customStepperRef"
            :loading="isLoading"
          >
            <template v-slot:step1>
              <v-row>
                <v-col cols="12" md="6" lg="6" class="py-0">
                  <div class="w-full">
                    <CustomInput
                      @blur="$v.jobPost.department_id.$touch()"
                      :items="allDepartments"
                      :label="$tr('label_required', $tr('department'))"
                      :placeholder="$tr('choose_item', $tr('department'))"
                      v-model.trim="$v.jobPost.department_id.$model"
                      :rules="
                        validate($v.jobPost.department_id, $root, 'department')
                      "
                      type="autocomplete"
                      item-text="name"
                      item-value="id"
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="6" lg="6" class="py-0">
                  <div class="w-full">
                    <CustomInput
                      @blur="$v.jobPost.occupation_id.$touch()"
                      :items="allOccupations"
                      :label="$tr('label_required', $tr('occupation'))"
                      :placeholder="$tr('choose_item', $tr('occupation'))"
                      v-model.trim="$v.jobPost.occupation_id.$model"
                      :rules="
                        validate($v.jobPost.occupation_id, $root, 'occupation')
                      "
                      type="autocomplete"
                      item-text="name"
                      item-value="id"
                    />
                  </div>
                </v-col>
              </v-row>
              <div class="w-full">
                <CustomInput
                  @blur="$v.jobPost.location.$touch()"
                  :label="$tr('label_required', $tr('location'))"
                  v-model.trim="$v.jobPost.location.$model"
                  :rules="validate($v.jobPost.location, $root, 'location')"
                  type="textfield"
                />
              </div>
              <div class="w-full">
                <Editor
                  :key="editorKey"
                  v-model.trim="$v.jobPost.descriptions.$model"
                  :rules="
                    validate($v.jobPost.descriptions, $root, 'descriptions')
                  "
                  :label="$tr('label_required', $tr('descriptions'))"
                />
              </div>
            </template>
            <template v-slot:step2>
              <div class="w-full">
                <CustomInput
                  @blur="$v.jobPost.contract_type.$touch()"
                  v-model.trim="$v.jobPost.contract_type.$model"
                  :rules="
                    validate($v.jobPost.contract_type, $root, 'contract_type')
                  "
                  :items="jobPost.contract_types"
                  :label="$tr('label_required', $tr('contract_type'))"
                  :placeholder="$tr('choose_item', $tr('contract_type'))"
                  type="autocomplete"
                  item-text="name"
                  item-value="name"
                />
              </div>
              <div class="w-full">
                <CustomInput
                  @blur="$v.jobPost.minimum_experience_level.$touch()"
                  v-model.trim="$v.jobPost.minimum_experience_level.$model"
                  :rules="
                    validate(
                      $v.jobPost.minimum_experience_level,
                      $root,
                      'minimum_experience_level'
                    )
                  "
                  :items="jobPost.experience_levels"
                  :label="
                    $tr('label_required', $tr('minimum_experience_level'))
                  "
                  :placeholder="
                    $tr('choose_item', $tr('minimum_experience_level'))
                  "
                  type="autocomplete"
                  item-text="name"
                  item-value="name"
                />
              </div>
              <div class="w-full">
                <CustomInput
                  @blur="$v.jobPost.headcount.$touch()"
                  v-model.trim="$v.jobPost.headcount.$model"
                  :rules="validate($v.jobPost.headcount, $root, 'headcount')"
                  :label="$tr('label_required', $tr('headcount'))"
                  type="number"
                />
              </div>
              <div class="w-full">
                <CustomInput
                  @blur="$v.jobPost.is_remote.$touch()"
                  v-model.trim="$v.jobPost.is_remote.$model"
                  :rules="validate($v.jobPost.is_remote, $root, 'is_remote')"
                  :items="jobPost.is_remotes"
                  :label="$tr('label_required', $tr('is_remote'))"
                  :placeholder="$tr('choose_item', $tr('is_remote'))"
                  type="autocomplete"
                  item-text="name"
                  item-value="value"
                />
              </div>
            </template>
            <template v-slot:step3>
              <v-row>
                <v-col cols="12" md="6" lg="6" class="py-0">
                  <div class="w-full">
                    <CustomInput
                      @blur="validateSalaryMinMax('min')"
                      v-model.trim="$v.jobPost.min_salary.$model"
                      :rules="
                        validate($v.jobPost.min_salary, $root, 'minimum_salary')
                      "
                      :label="$tr('label_required', $tr('minimum_salary'))"
                      type="number"
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="6" lg="6" class="py-0">
                  <div class="w-full">
                    <CustomInput
                      @blur="validateSalaryMinMax('max')"
                      @input="validateSalaryMinMax('max')"
                      v-model.trim="$v.jobPost.max_salary.$model"
                      :rules="
                        validate($v.jobPost.max_salary, $root, 'maximum_salary')
                      "
                      :label="$tr('label_required', $tr('maximum_salary'))"
                      :error-messages="jobPost.salaryMinMaxError"
                      type="number"
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="6" lg="6" class="py-0">
                  <div class="w-full">
                    <CustomInput
                      @blur="$v.jobPost.currency_id.$touch()"
                      v-model.trim="$v.jobPost.currency_id.$model"
                      :rules="
                        validate($v.jobPost.currency_id, $root, 'currency')
                      "
                      :items="allCurrencies"
                      :label="$tr('label_required', $tr('currency'))"
                      :placeholder="$tr('choose_item', $tr('currency'))"
                      type="autocomplete"
                      :currency="true"
                      item-text="name"
                      item-value="id"
                    />
                  </div>
                </v-col>
                <v-col cols="12" md="6" lg="6" class="py-0">
                  <div class="w-full">
                    <CustomInput
                      @blur="$v.jobPost.salary_type.$touch()"
                      v-model.trim="$v.jobPost.salary_type.$model"
                      :rules="
                        validate($v.jobPost.salary_type, $root, 'salary_type')
                      "
                      :items="jobPost.salary_types"
                      :label="$tr('label_required', $tr('salary_type'))"
                      :placeholder="$tr('choose_item', $tr('salary_type'))"
                      type="autocomplete"
                      item-text="name"
                      item-value="name"
                    />
                  </div>
                </v-col>
              </v-row>
              <div class="w-full">
                <Editor
                  v-model.trim="$v.jobPost.details.$model"
                  :rules="validate($v.jobPost.details, $root, 'details')"
                  :label="$tr('label_required', $tr('details'))"
                />
              </div>
            </template>
            <template v-slot:step4>
              <div class="w-full">
                <CustomInput
                  :label="$tr('label_required', $tr('open_date'))"
                  type="label"
                />
                <v-menu
                  v-model="jobPost.showOpenDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      @blur="$v.jobPost.open_date.$touch()"
                      v-model.trim="$v.jobPost.open_date.$model"
                      :rules="
                        validate($v.jobPost.open_date, $root, 'open_date')
                      "
                      class="custom-input"
                      :placeholder="$tr('date_format')"
                      v-bind="attrs"
                      v-on="on"
                      dense
                      readonly
                      outlined
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    no-title
                    @input="jobPost.showOpenDate = false"
                    v-model.trim="$v.jobPost.open_date.$model"
                  >
                  </v-date-picker>
                </v-menu>
              </div>
              <div class="w-full">
                <CustomInput
                  :label="$tr('label_required', $tr('close_date'))"
                  type="label"
                />
                <v-menu
                  v-model="jobPost.showCloseDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      @blur="$v.jobPost.close_date.$touch()"
                      v-model.trim="$v.jobPost.close_date.$model"
                      :rules="
                        validate($v.jobPost.close_date, $root, 'close_date')
                      "
                      class="custom-input"
                      :placeholder="$tr('date_format')"
                      v-bind="attrs"
                      v-on="on"
                      dense
                      readonly
                      outlined
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    no-title
                    @input="jobPost.showCloseDate = false"
                    v-model.trim="$v.jobPost.close_date.$model"
                  >
                  </v-date-picker>
                </v-menu>
              </div>
              <div class="w-full">
                <CustomInput
                  :label="$tr('label_required', $tr('expected_close_date'))"
                  type="label"
                />
                <v-menu
                  v-model="jobPost.showExpectedCloseDate"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      @blur="$v.jobPost.expected_close_date.$touch()"
                      v-model.trim="$v.jobPost.expected_close_date.$model"
                      :rules="
                        validate(
                          $v.jobPost.expected_close_date,
                          $root,
                          'expected_close_date'
                        )
                      "
                      class="custom-input"
                      :placeholder="$tr('date_format')"
                      v-bind="attrs"
                      v-on="on"
                      dense
                      readonly
                      outlined
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    no-title
                    @input="jobPost.showExpectedCloseDate = false"
                    v-model.trim="$v.jobPost.expected_close_date.$model"
                  >
                  </v-date-picker>
                </v-menu>
              </div>
            </template>
            <template v-slot:step5>
              <DoneMessage
                :title="$tr('item_all_set', $tr('job_post'))"
                :subTitle="$tr('you_can_access_your_item', $tr('job_post'))"
              />
            </template>
          </CustomStepper>
        </v-form>
      </Dialog>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import CustomStepper from "../../../components/design/FormStepper/CustomStepper.vue";
import HandleException from "~/helpers/handle-exception";
import CustomInput from "../..//design/components/CustomInput.vue";
import FormBtn from "../../design/components/FormBtn.vue";
import SelectedItem from "../../design/components/SelectedItem";
import DoneMessage from "../../design/components/DoneMessage.vue";
import GlobalRules from "~/helpers/vuelidate";
import JobPostValidations from "~/validations/hr_management/job-post-validations";
import Edit from "../../design/Edit.vue";
import Editor from "../../design/Editor.vue";
import Dialog from "../../design/Dialog/Dialog.vue";
export default {
  name: "RegisterJobPost",
  components: {
    CustomInput,
    FormBtn,
    SelectedItem,
    CustomStepper,
    DoneMessage,
    Edit,
    Editor,
    Dialog,
  },

  props: {
    allLabels: {
      type: Array,
      required: true,
    },
    allCurrencies: {
      type: Array,
      required: true,
    },
    allDepartments: {
      type: Array,
      required: true,
    },
    allOccupations: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      steppers: JobPostValidations.steppers,
      validate: GlobalRules.validate,
      jobPost: JSON.parse(JSON.stringify(JobPostValidations.schema)),
      isLoading: false,
      registerDialog: true,
      editorKey: 0,
    };
  },

  validations: {
    jobPost: JobPostValidations.validations,
  },
  methods: {
    ...mapActions({
      insertNewItem: "job_posts/insertNewItem",
    }),

    validateSalaryMinMax(name) {
      name === "min"
        ? this.$v.jobPost.min_salary.$touch()
        : this.$v.jobPost.max_salary.$touch();
      this.jobPost.salaryMinMaxError =
        this.jobPost.min_salary * 1 > this.jobPost.max_salary * 1 &&
        !this.jobPost.max_salary.$invalid
          ? this.$tr("maximum_salary_cant_be_less_than_minimum_salary")
          : "";
    },

    async validateStepper(currentStep) {
      console.log("HEHEHHEHEHE");
      this.$refs.jobPostRegisterFormRef.validate();
      this.$v.jobPost.$touch();
      this.isLoading = true;
      switch (currentStep) {
        case 1:
          GlobalRules.isDataValid(
            this.$v.jobPost,
            JobPostValidations.stepFields.step1
          )
            ? this.resetValidationAndNext()
            : (this.isLoading = false);
          break;
        case 2:
          GlobalRules.isDataValid(
            this.$v.jobPost,
            JobPostValidations.stepFields.step2
          )
            ? this.resetValidationAndNext()
            : (this.isLoading = false);
          break;
        case 3:
          GlobalRules.isDataValid(
            this.$v.jobPost,
            JobPostValidations.stepFields.step3
          )
            ? this.resetValidationAndNext()
            : (this.isLoading = false);
          break;
        default:
          break;
      }
    },

    resetValidationAndNext() {
      this.$refs.customStepperRef?.forceNext();
      this.$refs.jobPostRegisterFormRef.resetValidation();
      this.isLoading = false;
    },

    async submitForm() {
      this.$refs.jobPostRegisterFormRef.validate();
      this.$v.jobPost.$touch();
      let isStep4Valid = GlobalRules.isDataValid(
        this.$v.jobPost,
        JobPostValidations.stepFields.step4
      );
      if (!this.$v.jobPost.$invalid && isStep4Valid) {
        this.isLoading = true;
        await this.insertRecord(this.jobPost);
        this.isLoading = false;
      } else {
        this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
      }
    },

    async insertRecord(data) {
      try {
        const response = await this.$axios.post("job-posts", data);
        if (response?.status === 201 && response?.data?.result) {
          this.insertNewItem(response?.data?.data);
          this.resetForm();
          this.$refs.customStepperRef.forceNext();
        } else {
          this.$toastr.e(this.$tr("something_went_wrong"));
        }
      } catch (error) {
        HandleException.handleApiException(this, error);
      }
    },

    resetForm() {
      this.jobPost = JSON.parse(JSON.stringify(JobPostValidations.schema));
      this.$v.jobPost.$reset();
      this.$refs.jobPostRegisterFormRef.reset();
      this.$refs.jobPostRegisterFormRef.resetValidation();
      this.editorKey++;
    },

    closeStepper() {
      this.resetForm();
      this.$refs.customStepperRef.fillMore();
    },
  },
};
</script>
