<template>
  <v-form
    ref="systemForm"
    lazy-validation
    @submit.prevent="onSubmit"
    id="systemForm"
  >
    <CustomStepper
      @onNext="changeStepper"
      @onChangeTo="onChangeTo"
      ref="customStepper"
      :headers="steppers"
      :canNext="true"
      @close="closeForm"
      @submit="onSubmit"
    >
      <template v-slot:step1>
        <div class="mb-6">
          <CustomLogoInput @onLogoChanged="onLogoChanged" />
        </div>

        <div>
          <CustomInput
            :label="$tr('label_required', $tr('systems'))"
            placeholder="system_name"
            type="textfield"
            :invalid="$v.system.name.$invalid"
            v-model.trim="$v.system.name.$model"
            :rules="SystemRules.nameRule($v.system, $root)"
          />
        </div>
      </template>
      <template v-slot:step2>
        <div>
          <div v-for="(sys, k) in $v.system.subSystem.$each.$iter" :key="k">
            <div class="d-flex flex-column flex-md-row">
              <div class="w-full">
                <CustomInput
                  v-model="sys.name.$model"
                  :rules="subSystemNameRule(sys)"
                  :label="$tr('label_required', $tr('sub_system'))"
                  placeholder="sub_system"
                  type="textfield"
                  class="me-md-4 mb-md-2 mb-0"
                />
              </div>
              <div class="w-100">
                <FormBtn
                  @click="addNewRow"
                  title="add_plus"
                  class="mt-md-4 mb-2 mr-2"
                />
              </div>
              <div class="w-100" v-if="system.subSystem.length >= 2">
                <FormBtn @click="deleteRow(k)" title="-" class="mt-md-4 mb-2" />
              </div>
            </div>
            <div class="d-flex flex-column flex-md-row">
              <div class="w-full">
                <CustomInput
                  :items="getActions"
                  v-model="sys.current.$model"
                  :rules="subSystemCurrentRule(sys)"
                  :label="$tr('label_required', $tr('actions'))"
                  type="autocomplete"
                  item-text="name"
                  item-value="id"
                  :placeholder="$tr('choose_item',$tr('actions'))"
                  class="me-md-4 mb-md-2 mb-0"
                />
              </div>
              <div class="w-100">
                <FormBtn
                  @click="addAction(k)"
                  title="add_plus"
                  class="mt-md-4 mb-2"
                />
              </div>
            </div>
            <div class="selected d-flex flex-wrap">
              <template v-for="(action, index) in sys.actions.$model">
                <SelectedItem
                  @close="removeAction(k, index)"
                  :key="index"
                  :title="action.name"
                />
              </template>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:step3>
        <DoneMessage
          :title="$tr('item_all_set', $tr('systems'))"
          :subTitle="$tr('you_can_access_your_item', $tr('systems'))"
        />
      </template>
    </CustomStepper>
  </v-form>
</template>

<script>
import CustomStepper from "../design/FormStepper/CustomStepper";
import System from "../../configs/pages/system";
import CustomInput from "../design/components/CustomInput";
import SelectedItem from "../design/components/SelectedItem";
import FormBtn from "../design/components/FormBtn";
import ManualPermission from "../design/ManualPermission.vue";
import DoneMessage from "../design/components/DoneMessage.vue";
import TextField from "~/components/common/TextField";
import { mapActions, mapGetters } from "vuex";
import HandleException from "~/helpers/handle-exception";
import CloseDialogButton from "../common/buttons/CloseDialogButton";
import AutoComplete from "../common/AutoComplete";
import SystemValidations from "../../validations/system-validations";
import CustomLogoInput from "../design/components/CustomLogoInput";

export default {
  name: "SystemRegistration",
  components: {
    ManualPermission,
    CustomLogoInput,
    TextField,
    CloseDialogButton,
    AutoComplete,
    CustomStepper,
    System,
    CustomInput,
    SelectedItem,
    FormBtn,
    DoneMessage,
  },
  props: {},

  data() {
    return {
      steppers: System(this).steppers,
      SystemRules: SystemValidations.rules,
      subSystemNameRule: SystemValidations.subSystemNameRule,
      subSystemCurrentRule: SystemValidations.subSystemCurrentRule,
      system: SystemValidations.schema,
    };
  },

  validations: {
    system: SystemValidations.validations,
  },

  computed: {
    ...mapGetters({
      getActions: "actions_store/items",
    }),
  },

  methods: {
    ...mapActions({
      insertNewItem: "systems/insertNewItem",
      updateItem: "systems/updateItem",
    }),

    onLogoChanged(logoPath) {
      this.$v.system.logo.$model = logoPath;
    },

    // *********************  INSERTION METHODS GOES HERE   ***********************
    async onSubmit() {
      this.validateForm();
      if (!this.$v.system.$invalid) {
        this.$emit("onToggleShowProgress");
        await this.insertRecord();
        this.$emit("onToggleShowProgress");
      } else {
        this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
      }
    },

    async insertRecord() {
      const formData = new FormData();
      formData.append("name", this.system.name);
      formData.append("logo", this.system.logo);
      formData.append("subSystem", JSON.stringify(this.system.subSystem));
      try {
        const response = await this.$axios.post("/systems", formData);

        if (response?.status === 201 && response?.data?.result) {
          this.resetForm();
          this.$refs.customStepper.setCurrent(3);
          this.insertNewItem(response?.data?.data);
        } else {
          this.$toastr.e(this.$tr("something_went_wrong"));
        }
      } catch (error) {
        HandleException.handleApiException(this, error);
      }
    },

    resetForm() {
      this.$v.system.$reset();
      this.$refs.systemForm.reset();
      this.$refs.systemForm.resetValidation();
    },

    removeAction(k, index) {
      this.system.subSystem[k].actions.splice(index, 1);
      this.system.subSystem[k].actionIds.splice(index, 1);
      // if(this.system.subSystem[k].actions.length == 0){
      //   this.$v.system.subSystem.$each[k].current.$model = '';
      // }
    },

    addAction(k) {
      let vm = this;
      let repeated = false;
      if (
        vm.system.subSystem[k].current == "" ||
        !vm.system.subSystem[k].current
      ) {
        return;
      }
      vm.system.subSystem[k].actions.forEach((row) => {
        if (row.id == vm.system.subSystem[k].current) {
          repeated = true;
        }
      });

      if (!repeated) {
        var current_id = vm.getActions.find(
          (ele) => ele.id == vm.system.subSystem[k].current
        );
        vm.system.subSystem[k].actions.push(current_id);
        vm.system.subSystem[k].actionIds.push(current_id.id);
      } else {
        this.$toastr.w(this.$tr("item_already_added_to_list"));
      }
    },

    deleteRow(index) {
      this.system.subSystem.splice(index, 1);
    },

    addNewRow() {
      this.system.subSystem.push({
        current: "",
        name: "",
        actions: [],
        actionIds: [],
      });
    },

    closeForm() {},

    // **************************  VALIDATIONS METHODS GOES EHER   **********************************
    validateForm() {
      this.$refs.systemForm.validate();
      this.$v.system.$touch();
    },

    isStepOneDataValid() {
      return !this.$v.system.name.$invalid && !this.$v.system.logo.$invalid;
    },

    isStepTwoDataValid() {
      return !this.$v.system.subSystem.$invalid;
    },

    changeStepper(step) {
      switch (step) {
        case 2:
          {
            if (!this.isStepOneDataValid()) {
              this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
              this.validateForm();
              this.$refs.customStepper.prev();
              return;
            } else {
              this.$refs.systemForm.resetValidation();
            }
          }
          break;
        case 3:
          {
            if (!this.isStepTwoDataValid()) {
              this.validateForm();
              this.$refs.customStepper.prev();
              return;
            } else {
              this.$refs.systemForm.resetValidation();
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
            if (!this.isStepOneDataValid()) {
              this.validateForm();
              this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
              this.$refs.customStepper.prev();
              return;
            }
          }
          break;
        case 3: {
          if (!this.isStepTwoDataValid()) {
            if (!this.isStepOneDataValid()) {
              this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
              this.validateForm();
              this.$refs.customStepper.setCurrent(1);
              return;
            } else {
              this.validateForm();
              this.$refs.customStepper.setCurrent(2);
              return;
            }
          } else {
            this.$refs.systemForm.resetValidation();
            this.$refs.customStepper.setCurrent(3);
            return;
          }
        }
        default:
          break;
      }
      this.$refs.systemForm.resetValidation();
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
