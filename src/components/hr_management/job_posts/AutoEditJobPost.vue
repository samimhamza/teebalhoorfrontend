<template>
  <v-form
    :key="currentIndex"
    lazy-validation
    ref="jobPostUpdateFormRef"
    @submit.prevent="onSubmit"
  >
    <Edit
      :is-icon="false"
      :icon-or-logo="''"
      :headers="headers"
      :title="title"
      :showOnlyTitle="true"
      :showTitle="false"
      :topIcon="topIcon"
      :tableName="tableName"
      :isLoading="isLoading"
      :is-submitting="isSubmitting"
      :is-auto-edit="isAutoEdit"
      :totals="editItems.length"
      :current-index="currentIndex"
      ref="editRef"
      @onSubmit="onSubmit"
      @close="closeDialog"
      @onItemChange="onItemChange"
      @onSave="onSave"
      @OnSaveAndNext="onSaveAndNext"
      @onValidate="checkValidations"
      @onChangeTo="onChangeTo"
    >
      <template v-slot:step1>
        <div>
          <HeaderTitle class="mt-2" :title="$tr('general')" />
          <div class="ma-3">
            <v-row>
              <v-col cols="12" md="6" lg="6" class="py-0">
                <div class="w-full">
                  <CustomInput
                    @blur="$v.jobPost.department_id.$touch()"
                    :items="allDepartments"
                    :label="$tr('label_required', $tr('department'))"
                    :placeholder="$tr('choose_item', $tr('department'))"
                    v-model.trim="$v.jobPost.department_id.$model"
                    :rules="rules.validate($v.jobPost.department_id, $root, 'department')"
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
                    :rules="rules.validate($v.jobPost.occupation_id, $root, 'occupation')"
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
                :rules="rules.validate($v.jobPost.location, $root, 'location')"
                type="textfield"
              />
            </div>
            <div class="w-full">
              <Editor
                :key="editorKey"
                @blur="$v.jobPost.descriptions.$touch()"
                v-model.trim="$v.jobPost.descriptions.$model"
                :rules="rules.validate($v.jobPost.descriptions, $root, 'descriptions')"
                :label="$tr('label_required', $tr('descriptions'))"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-slot:step2>
        <div>
          <HeaderTitle class="mt-2" :title="$tr('specifications')" />
          <div class="ma-3">
            <div class="w-full">
              <CustomInput
                @blur="$v.jobPost.contract_type.$touch()"
                v-model.trim="$v.jobPost.contract_type.$model"
                :rules="rules.validate($v.jobPost.contract_type, $root, 'contract_type')"
                :items="schema.contract_types"
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
                :rules="rules.validate($v.jobPost.minimum_experience_level, $root, 'minimum_experience_level')"
                :items="schema.experience_levels"
                :label="$tr('label_required', $tr('minimum_experience_level'))"
                :placeholder="$tr('choose_item', $tr('minimum_experience_level'))"
                type="autocomplete"
                item-text="name"
                item-value="name"
              />
            </div>
            <div class="w-full">
              <CustomInput
                @blur="$v.jobPost.headcount.$touch()"
                v-model.trim="$v.jobPost.headcount.$model"
                :rules="rules.validate($v.jobPost.headcount, $root, 'headcount')"
                :label="$tr('label_required', $tr('headcount'))"
                type="number"
              />
            </div>
            <div class="w-full">
              <CustomInput
                @blur="$v.jobPost.is_remote.$touch()"
                v-model.trim="$v.jobPost.is_remote.$model"
                :rules="rules.validate($v.jobPost.is_remote, $root, 'is_remote')"
                :items="schema.is_remotes"
                :label="$tr('label_required', $tr('is_remote'))"
                :placeholder="$tr('choose_item', $tr('is_remote'))"
                type="autocomplete"
                item-text="name"
                item-value="value"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-slot:step3>
        <div>
          <HeaderTitle class="mt-2" :title="$tr('scores')" />
          <div class="ma-3">
            <v-row>
              <v-col cols="12" md="6" lg="6" class="py-0">
                <div class="w-full">
                  <CustomInput
                    @blur="validateSalaryMinMax('min')"
                    v-model.trim="$v.jobPost.min_salary.$model"
                    :rules="rules.validate($v.jobPost.min_salary, $root, 'minimum_salary')"
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
                    :rules="rules.validate($v.jobPost.max_salary, $root, 'maximum_salary')"
                    :label="$tr('label_required', $tr('maximum_salary'))"
                    :error-messages="schema.salaryMinMaxError"
                    type="number"
                  />
                </div>
              </v-col>
              <v-col cols="12" md="6" lg="6" class="py-0">
                <div class="w-full">
                  <CustomInput
                    @blur="$v.jobPost.currency_id.$touch()"
                    v-model.trim="$v.jobPost.currency_id.$model"
                    :rules="rules.validate($v.jobPost.currency_id, $root, 'currency')"
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
                    :rules="rules.validate($v.jobPost.salary_type, $root, 'salary_type')"
                    :items="schema.salary_types"
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
                :rules="rules.validate($v.jobPost.details, $root, 'details')"
                :label="$tr('label_required', $tr('details'))"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-slot:step4>
        <div>
          <HeaderTitle class="mt-2" :title="$tr('date')" />
          <div class="ma-3">
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
                  :rules="rules.validate($v.jobPost.open_date, $root, 'open_date')"
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
                  :rules="rules.validate($v.jobPost.close_date, $root, 'close_date')"
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
                  :rules="rules.validate($v.jobPost.expected_close_date, $root, 'expected_close_date')"
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
          </div>
        </div>
      </template>
      <template v-slot:step5>
        <DoneMessage
          :title="$tr('item_all_set', $tr('job_post'))"
          :subTitle="$tr('you_can_access_your_item', $tr('job_post'))"
        />
      </template>
    </Edit>
  </v-form>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Edit from '../../design/Edit.vue';
import HandleException from "~/helpers/handle-exception";
import Alert from "~/helpers/alert";
import DoneMessage from "../../design/components/DoneMessage";
import CustomInput from "../../design/components/CustomInput.vue";
import FormBtn from "../../design/components/FormBtn.vue";
import GlobalRules  from "~/helpers/vuelidate";
import JobPostValidations from '~/validations/hr_management/job-post-validations';
import Editor from '../../design/Editor.vue'
import HeaderTitle from '../../users/HeaderTitle.vue';
export default {
  name: "AutoEditJobPost",
  components: {
    DoneMessage,
    Edit,
    CustomInput,
    FormBtn,
    Editor,
    HeaderTitle
  },
  props: {
    editItems: {
      require: true,
      type: Array,
    },
    editDialog: {
      required: true,
      type: Boolean,
    },
    isAutoEdit: {
      required: false,
      type: Boolean,
    },
    allLabels: {
      type: Array,
      required: true
    },
    allCurrencies: {
      type: Array,
      required: true
    },
    allDepartments: {
      type: Array,
      required: true
    },
    allOccupations: {
      type: Array,
      required: true
    }
  },

  data() {
    const firstIndex = 0;
    return {
      currentIndex:       firstIndex,
      topIcon:            "mdi-account",
      tableName:          this.$tr("job_post"),

      headers:            JobPostValidations.steppers,
      rules:              GlobalRules,
      jobPost:            JobPostValidations.schema,
      schema:             JobPostValidations.schema,

      isLoading:          false,
      isSubmitting:       false,
      title:              '',
      editorKey:          0,
    };
  },

  validations: {
    jobPost: JobPostValidations.validations,
  },

  created() {
    this.setJobPostItems(this.editItems[0]);
  },

  methods: {
    ...mapActions({
      updateItem: "job_posts/updateItem",
    }),

    validateSalaryMinMax(name){
      name === 'min' ? this.$v.jobPost.min_salary.$touch() : this.$v.jobPost.max_salary.$touch();
      this.schema.salaryMinMaxError =  (this.jobPost.min_salary * 1 > this.jobPost.max_salary * 1 && !this.jobPost.max_salary.$invalid) ? this.$tr('maximum_salary_cant_be_less_than_minimum_salary') : '';
    },


    setJobPostItems(item) {
      const data      = this._.clone(item);
      this.title      = data.title;
      this.jobPost    = data;
    },


    closeDialog() {
      this.$emit("update:editDialog", false);
      this.$emit("update:isAutoEdit", false);
    },

    async onItemChange(actionType) {
      if (actionType === "next") {
        const index = this.currentIndex + 1;
        if (index < this.editItems.length) {
          this.setJobPostItems(this.editItems[index]);
          this.currentIndex = index;
        }
      } else if (actionType === "back") {
        const index = this.currentIndex - 1;
        if (index >= 0) {
          this.setJobPostItems(this.editItems[index]);
          this.currentIndex = index;
        }
      }
    },

    async onSaveAndNext() {
      await this.onSubmit("onSaveAndNext");
    },

    async onSave() {
      await this.onSubmit("can't");
    },


    async checkValidations(currentStep) {
      this.$refs.jobPostUpdateFormRef.validate();
      this.$v.jobPost.$touch();
      this.isLoading = true;
      switch (currentStep) {
        case 1: GlobalRules.isDataValid(this.$v.jobPost,  JobPostValidations.stepFields.step1) ? this.resetValidationAndNext() : this.isLoading = false; break;
        case 2: GlobalRules.isDataValid(this.$v.jobPost,  JobPostValidations.stepFields.step2) ? this.resetValidationAndNext() : this.isLoading = false; break;
        case 3: GlobalRules.isDataValid(this.$v.jobPost,  JobPostValidations.stepFields.step3) ? this.resetValidationAndNext() : this.isLoading = false; break;
        case 4: GlobalRules.isDataValid(this.$v.jobPost,  JobPostValidations.stepFields.step4) ? this.resetValidationAndNext() : this.isLoading = false; break;
        default: break;
      }
    },

    async onChangeTo(currentStep) {
      this.$refs.jobPostUpdateFormRef.validate();
      this.$v.jobPost.$touch();
      this.isLoading = true;
      switch (currentStep) {
        case 1: this.resetValidationAndNext(1); break;
        case 2: GlobalRules.isDataValid(this.$v.jobPost,  JobPostValidations.stepFields.step1) ? this.resetValidationAndNext(2) : this.isLoading = false; break;
        case 3: GlobalRules.isDataValid(this.$v.jobPost,  JobPostValidations.stepFields.step1) &&  GlobalRules.isDataValid(this.$v.jobPost,  JobPostValidations.stepFields.step2) ? this.resetValidationAndNext(3) : this.isLoading = false; break;
        case 4: GlobalRules.isDataValid(this.$v.jobPost,  JobPostValidations.stepFields.step1) && GlobalRules.isDataValid(this.$v.jobPost,  JobPostValidations.stepFields.step2) && GlobalRules.isDataValid(this.$v.jobPost,  JobPostValidations.stepFields.step3) ? this.resetValidationAndNext(4) : this.isLoading = false; break;
        default: break;
      }
    },

    resetValidationAndNext(step = ''){
      step !== '' ? this.$refs.editRef.setCurrent(step) : this.$refs.editRef.nextForce();
      this.$refs.jobPostUpdateFormRef.resetValidation();
      this.isLoading = false;
    },


    async onSubmit(canNext = "canNext") {
      let isStep4Valid = GlobalRules.isDataValid(this.$v.jobPost,  JobPostValidations.stepFields.step4);
      this.$refs.jobPostUpdateFormRef.validate();
      this.$v.jobPost.$touch();
      if (!this.$v.jobPost.$invalid && isStep4Valid) {
        await this.updateRecord(this.jobPost, canNext);
      } else {
        this.$toastr.w(this.$tr("please_fill_all_fields_correctly"));
      }
    },

    async updateRecord(data, canNext) {
      this.isSubmitting = true;
      try {
        const response = await this.$axios.put("job-posts/id", data);
        this.isSubmitting = false;
        if (response?.status === 200 && response?.data?.result) {
          if (canNext === "onSaveAndNext") {
            if (this.currentIndex < this.editItems.length) {
              Alert.successAlert(this, "successfully_updated");
              this.onItemChange("next");
            }
          } else if (canNext === "canNext") {
            this.$refs.editRef.nextForce();
          } else {
            Alert.successAlert(this, "successfully_updated");
          }
          this.updateItem(response?.data?.data);
          this.editorKey++;
        } else {
          this.$toastr.w(this.$tr("something_went_wrong"));
        }
      } catch (error) {
        this.isSubmitting = false;
        HandleException.handleApiException(this, error);
      }
    },
  },
};
</script>

