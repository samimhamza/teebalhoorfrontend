<template>
  <v-form lazy-validation ref="reasonForm" @submit.prevent="submitForm">
    <CustomStepper
      @onNext="changeStepper"
      @onChangeTo="onChangeTo"
      :is-submitting="isLoading"
      ref="customStepper"
      :headers="steppers"
      :canNext="true"
      @close="closeForm"
      @submit="onSubmit"
      :reloadReason="true"
      @reloadReason="fetchReasons({ slug: slug, no_system: true })"
    >
      <template v-slot:step1>
        <div class="d-flex flex-column flex-md-row">
          <div class="w-full">
            <CustomInput
              :items="subSystems"
              v-model="subSystem"
              :error-messages="subSystemErrors"
              @blur="touchSubSystem"
              :label="$tr('label_required', $tr('sub_system'))"
              type="autocomplete"
              item-text="name"
              item-value="name"
              :placeholder="$tr('choose_item', $tr('sub_system'))"
              class="me-md-4 mb-md-2 mb-0"
            />
          </div>
          <div class="w-100">
            <FormBtn
              @click="addSubSystem"
              title="add_plus"
              class="mt-md-4 mb-2"
            />
          </div>
        </div>
        <div class="selected d-flex flex-wrap">
          <template v-for="(sub, index) in reason.selectedSubSystems">
            <SelectedItem
              @close="removeSubSystem(index)"
              :key="index"
              :title="sub.name"
            />
          </template>
        </div>
        <div class="d-flex flex-column flex-md-row">
          <div class="w-full">
            <CustomInput
              :items="types"
              v-model="type"
              @blur="touchType"
              :error-messages="typeErrors"
              :label="$tr('label_required', $tr('types'))"
              type="autocomplete"
              item-text="type"
              item-value="id"
              :placeholder="$tr('choose_item', $tr('types'))"
              :loading="loadingAutocompleteData"
              class="me-md-4 mb-md-2 mb-0"
            />
          </div>
          <div class="w-100">
            <FormBtn @click="addType" title="add_plus" class="mt-md-4 mb-2" />
          </div>
        </div>
        <div class="selected d-flex flex-wrap">
          <template v-for="(type, index) in reason.selectedTypes">
            <SelectedItem
              @close="removeType(index)"
              :key="index"
              :title="type"
            />
          </template>
        </div>
      </template>
      <template v-slot:step2>
        <div class="d-flex flex-column flex-md-row">
          <div class="w-full">
            <CustomInput
              :items="reasons"
              v-model.trim="$v.title.$model"
              @blur="touchReason"
              :error-messages="reasonErrors"
              :label="$tr('label_required', $tr('reasons'))"
              type="autocomplete"
              item-text="title"
              item-value="id"
              :placeholder="$tr('choose_item', $tr('reasons'))"
              class="me-md-4 mb-md-2 mb-0"
            />
          </div>
          <div class="w-100">
            <FormBtn @click="addReason" title="add_plus" class="mt-md-4 mb-2" />
          </div>
        </div>
        <div class="selected d-flex flex-wrap">
          <template v-for="(res, index) in reason.selectedReasons">
            <v-alert
              :key="index"
              class="w-full"
              type="warning"
              transition="scroll-y-transition"
            >
              <v-row align="center">
                <v-col class="grow pa-0">
                  {{ res.title }}
                </v-col>
                <v-col class="shrink pa-0 me-2">
                  <v-icon style="cursor: pointer" @click="removeReason(index)"
                    >mdi-close</v-icon
                  >
                </v-col>
              </v-row>
            </v-alert>
          </template>
        </div>
      </template>
      <template v-slot:step3>
        <DoneMessage
          :title="$tr('item_all_set', $tr('status_event_list'))"
          :subTitle="$tr('you_can_access_your_item', $tr('status_event_list'))"
        />
      </template>
    </CustomStepper>
  </v-form>
</template>

<script>
import { minLength, required } from "vuelidate/lib/validators";
import CustomStepper from "~/components/design/FormStepper/CustomStepper";
import Reason from "~/configs/pages/reasons";
import CustomInput from "~/components/design/components/CustomInput";
import SelectedItem from "~/components/design/components/SelectedItem";
import FormBtn from "~/components/design/components/FormBtn";
import ManualPermission from "~/components/design/ManualPermission.vue";
import DoneMessage from "~/components/design/components/DoneMessage.vue";
import TextField from "~/components/common/TextField";
import { mapActions, mapGetters } from "vuex";
import HandleException from "~/helpers/handle-exception";
import CloseDialogButton from "~/components/common/buttons/CloseDialogButton";
import AutoComplete from "~/components/common/AutoComplete";

export default {
  name: "RegisterReason",
  components: {
    ManualPermission,
    TextField,
    CloseDialogButton,
    AutoComplete,
    CustomStepper,
    Reason,
    CustomInput,
    SelectedItem,
    FormBtn,
    DoneMessage,
  },
  props: {
    subSystems: {
      type: Array,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      steppers: [
        { icon: "fa-lock", title: "general", slotName: "step1" },
        { icon: "fa-comment", title: "reason", slotName: "step2" },
        { icon: "fa-thumbs-up", title: "done", slotName: "step3" },
      ],
      types: [],

      reason: {
        selectedSubSystems: [],
        selectedReasons: [],
        selectedTypes: [],
      },
      subSystem: "",
      type: "",
      title: "",
      reasonErrors: "",
      typeErrors: "",
      subSystemErrors: "",
      loadingAutocompleteData: false,
    };
  },
  async fetch() {
    await this.fetchReasons({ slug: this.slug });
  },
  validations: {
    title: { required, minLength: minLength(2) },
  },

  computed: {
    ...mapGetters({
      get_status_event: "reasons/get_status_event",
      reasons: "reasons/get_reasons",
    }),
  },

  methods: {
    ...mapActions({
      fetchReasons: "reasons/fetchReasons",
      fetchStatusEvent: "statusEvents/fetchStatusEvent",
      fetchTypesAccordingToSybSystem:
        "statusEvents/fetchTypesAccordingToSybSystem",
    }),

    // *********************  INSERTION METHODS GOES HERE   ***********************
    async onSubmit() {
      this.isLoading = true;
      this.$refs.reasonForm.validate();
      this.touchType();
      this.touchSubSystem();
      this.touchReason();
      this.$v.$touch();
      if (!this.reasonErrors && !this.typeErrors && !this.subSystemErrors) {
        await this.insertRecord();
        this.isLoading = false;
      } else {
        this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
        this.isLoading = false;
      }
    },

    async insertRecord() {
      let data = {
        reason: this.reason.selectedReasons.map((row) => {
          return row.id;
        }),
        type: this.reason.selectedTypes,
        subsystem: this.reason.selectedSubSystems[0].id,
      };
      try {
        const response = await this.$axios.post("status_events", data);
        if (response?.status === 201 && response?.data?.result) {
          this.resetForm();
          this.$refs.customStepper.setCurrent(3);
          await this.fetchStatusEvent({ slug: this.slug });
        } else {
          this.$toastr.e(this.$tr("something_went_wrong"));
        }
      } catch (error) {
        HandleException.handleApiException(this, error);
      }
    },

    resetForm() {
      (this.typeErrors = ""), (this.subSystemErrors = "");
      this.reasonErrors = "";
      this.reason.selectedTypes = [];
      this.reason.selectedSubSystems = [];
      this.reason.selectedReasons = [];
      this.$refs.reasonForm?.resetValidation();
    },
    closeDialog() {
      this.resetForm();
      this.$refs.customStepper.fillMore();
    },
    addType() {
      if (this.type == "") {
        this.touchType();
        return;
      } else {
        this.reason.selectedTypes.push(
          this.types.find((ele) => ele == this.type)
        );
        var set = new Set(this.reason.selectedTypes);
        this.reason.selectedTypes = Array.from(set);
        this.touchType();
        this.type = "";
      }
    },
    removeType(index) {
      this.reason.selectedTypes.splice(index, 1);
      this.type = "";
      this.touchType();
    },

    async addSubSystem() {
      if (this.subSystem == "") {
        this.touchSubSystem();

        return;
      } else {
        this.loadingAutocompleteData = true;
        const response = await this.$axios.get("subsystems", {
          params: { subsystem: this.subSystem },
        });
        this.types = response.data;
        this.loadingAutocompleteData = false;
        this.reason.selectedSubSystems = [
          this.subSystems.find((ele) => ele.name == this.subSystem),
        ];
        this.reason.selectedTypes = [];

        this.subSystem = "";
        this.touchSubSystem();
      }
    },

    removeSubSystem(index) {
      this.reason.selectedSubSystems.splice(index, 1);
      this.types = [];
      this.touchSubSystem();
    },

    addReason() {
      if (this.title == "") {
        this.touchReason();
        return;
      } else {
        this.reason.selectedReasons.push(
          this.reasons.find((row) => row.id === this.title)
        );
        var set = new Set(this.reason.selectedReasons);
        this.reason.selectedReasons = Array.from(set);
        this.title = "";
        this.touchReason();
      }
    },

    removeReason(index) {
      this.reason.selectedReasons.splice(index, 1);
    },

    touchSubSystem() {
      this.subSystemErrors =
        this.reason.selectedSubSystems.length === 0
          ? this.$tr("item_is_required", this.$tr("sub_system"))
          : "";
    },

    touchType() {
      this.typeErrors =
        this.reason.selectedTypes.length === 0
          ? this.$tr("item_is_required", this.$tr("type"))
          : "";
    },

    touchReason() {
      this.reasonErrors =
        this.reason.selectedReasons.length === 0
          ? this.$tr("item_is_required", this.$tr("reason"))
          : "";
    },

    titleRule(title) {
      return [
        (_) => title.required || this.$tr("required", this.$tr("title")),
        (_) =>
          title.minLength ||
          this.$tr("min_length", this.$tr("title"), $tr("2")),
      ];
    },

    closeForm() {},

    // **************************  VALIDATIONS METHODS GOES EHER   **********************************

    isStepOneDataValid() {
      return !this.typeErrors && !this.subSystemErrors;
    },

    isStepTwoDataValid() {
      return !this.$v.$invalid;
    },

    changeStepper(step) {
      this.$refs.reasonForm.validate();
      this.touchType();
      this.touchSubSystem();
      this.$v.$touch();
      switch (step) {
        case 2:
          {
            if (!this.isStepOneDataValid()) {
              this.$refs.customStepper.prev();
              return;
            } else {
              this.$refs.reasonForm.resetValidation();
            }
          }
          break;
        case 3:
          {
            if (!this.isStepTwoDataValid()) {
              this.touchReason();
              this.$refs.reasonForm.validate();
              this.$refs.customStepper.prev();
              return;
            } else {
              this.$refs.reasonForm.resetValidation();
            }
          }
          break;
        default:
          break;
      }
    },

    onChangeTo(step) {
      switch (step) {
        case 2:
          {
            if (this.isStepOneDataValid()) {
              this.$refs.reasonForm.validate();
              this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
              this.$refs.customStepper.prev();
              return;
            }
          }
          break;
        case 3: {
          if (this.isStepTwoDataValid()) {
            if (this.isStepOneDataValid()) {
              this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
              this.$refs.reasonForm.validate();
              this.$refs.customStepper.setCurrent(1);
              return;
            } else {
              this.$refs.reasonForm.validate();
              this.$refs.customStepper.setCurrent(2);
              return;
            }
          } else {
            this.$refs.reasonForm.resetValidation();
            this.$refs.customStepper.setCurrent(3);
            return;
          }
        }
        default:
          break;
      }
      this.$refs.reasonForm.resetValidation();
    },
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
</style>
