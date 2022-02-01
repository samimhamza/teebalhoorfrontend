<template>
  <v-form
    :key="currentIndex"
    lazy-validation
    ref="labelEditForm"
    @submit.prevent="onSubmit"
  >
    <Edit
      :is-icon="false"
      :icon-or-logo="''"
      :headers="headers"
      :title="title"
      :topIcon="topIcon"
      :tableName="tableName"
      :showTitle="false"
      :isLoading="isLoading"
      :is-submitting="isSubmitting"
      :is-auto-edit="isAutoEdit"
      :totals="editItems.length"
      :current-index="currentIndex"
      ref="editRef"
      @onValidate="() => {}"
      @onSubmit="onSubmit"
      @close="closeDialog"
      @onItemChange="onItemChange"
      @onSave="onSave"
      @OnSaveAndNext="onSaveAndNext"
    >
      <template v-slot:step1>
        <div>
          <div class="topTitle mb-3">
            <h1
              class="text-center text-h4 font-weight-bold border-bottom pb-2 pt-1 text-uppercase"
              style="color: #58595b"
            >
              {{ $tr("general") }}
            </h1>
          </div>
          <div class="pl-3 pa-1">
            <div class="d-flex flex-column flex-md-row">
              <div class="w-full">
                <CustomInput
                  :items="label.subSystems"
                  v-model="label.subSystem"
                  :error-messages="subSystemErrors"
                  @blur="touchSubSystem"
                  :label="$tr('label_required', $tr('sub_system'))"
                  type="autocomplete"
                  item-text="name"
                  item-value="id"
                  :placeholder="$tr('choose_item',$tr('sub_systems'))"
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
              <template v-for="(sub, index) in label.selectedSubSystems">
                <SelectedItem
                  @close="removeSubSystem(index)"
                  :key="index"
                  :title="$tr(sub.name)"
                />
              </template>
            </div>
            <div class="w-full pt-1">
              <CustomInput label="color" />
              <v-text-field
                dense
                style="border: 2px solid var(--input-border-color)"
                v-model.trim="$v.label.color.$model"
                hide-details
                class="ma-0 pa-0"
                solo
              >
                <template v-slot:append>
                  <v-menu
                    top
                    nudge-bottom="105"
                    nudge-left="16"
                    :close-on-content-click="false"
                  >
                    <template v-slot:activator="{ on }">
                      <div
                        v-on="on"
                        v-for="(color, index) in colors"
                        :key="index"
                        @click="
                          () => {
                            indexKey = index;
                            label.color = color;
                          }
                        "
                        :style="`cursor: pointer;
                            height: 26px;
                            width: 26px;
                            margin: 0 0.3rem;
                            borderRadius: 4px;
                            transition: border-radius 200ms ease-in-out; background-color: ${colors[index]};`"
                      >
                        <v-icon
                          v-if="colors[index] === label.color"
                          style="padding: 0 0.1rem"
                          color="white"
                        >
                          mdi-circle-medium</v-icon
                        >
                      </div>
                    </template>
                    <v-card elevation="0">
                      <v-card-text class="pa-0">
                        <v-color-picker
                          @input="checkColor"
                          v-model.trim="$v.label.color.$model"
                          flat
                        />
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </template>
              </v-text-field>
            </div>

            <div class="w-full pt-4">
              <CustomInput
                :label="$tr('label_required',$tr('label'))"
                type="textfield"
                v-model.trim="$v.label.label.$model"
                :rules="labelRule($v.label.label)"
              />
            </div>

            <div class="w-full pt-4 pb-0">
              <CustomInput
                :label="$tr('label_required',$tr('title'))"
                type="textarea"
                v-model.trim="$v.label.title.$model"
                :rules="titleRule($v.label.title)"
              />
            </div>
            <div class="w-full pt-0">
              <v-checkbox
                v-model.trim="$v.label.status.$model"
                label="archive_this_label"
              ></v-checkbox>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:step2>
        <div class="topDiv">
          <DoneMessage
            :title="$tr('item_all_set', $tr('label'))"
            :subTitle="$tr('you_can_access_your_item', $tr('label'))"
          />
        </div>
      </template>
    </Edit>
  </v-form>
</template>

<script>
import { mapActions } from "vuex";

import Edit from "../design/Edit.vue";
import HandleException from "../../helpers/handle-exception";
import Alert from "../../helpers/alert";
import DoneMessage from "../design/components/DoneMessage";
import CustomInput from "../design/components/CustomInput.vue";
import FormBtn from "../design/components/FormBtn.vue";
import SelectedItem from "../design/components/SelectedItem";
import { minLength, required } from "vuelidate/lib/validators";

export default {
  name: "EditLabel",
  components: {
    DoneMessage,
    Edit,
    CustomInput,
    FormBtn,
    SelectedItem,
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
    subSystems: {
      type: Array,
      required: true,
    },
  },
  data() {
    const firstIndex = 0;
    return {
      currentIndex: firstIndex,
      topIcon: "mdi-account",
      tableName: this.$tr("label"),
      headers: [
        { icon: "fa-user", title: "general", slotName: "step1" },
        { icon: "fa-thumbs-up", title: "done", slotName: "step2" },
      ],

      label: {
        subSystems: this.subSystems,
        selectedSubSystems: [],
        subSystem: "",
        title: "",
        status: "",
        label: "",
        color: "",
      },
      indexKey: 0,
      colors: [
        "#5A89E1",
        "#60B1DC",
        "#62C5A0",
        "#9BCD66",
        "#EACB59",
        "#EC6051",
        "#D64643",
        "#9981E1",
        "#D177B3",
        "#E5E1E9",
        "#9DE1AF",
        "#333942",
      ],
      subSystemErrors: "",
      isLoading: false,
      isSubmitting: false,
      title: this.$tr("labels") + this.$tr(" ") + this.$tr("title"),
    };
  },

  validations: {
    label: {
      title: { required, minLength: minLength(2) },
      label: { required, minLength: minLength(2) },
      status: {},
      color: { required },
    },
  },

  created() {
    this.setLabel(this.editItems[0]);
  },


  methods: {
    ...mapActions({
      updateItem: "labels/updateItem",
    }),

    checkColor() {
      this.colors[this.indexKey] = this.label.color;
    },

    addSubSystem() {
      if (this.label.subSystem == "") {
        this.touchSubSystem();
        return;
      } else {
        this.label.selectedSubSystems.push(
          this.label.subSystems.find(
            (ele) => ele.id === this.label.subSystem
          )
        );
        var set = new Set(this.label.selectedSubSystems);
        this.label.selectedSubSystems = Array.from(set);
        this.label.subSystem = "";
        this.touchSubSystem();
      }
    },
    removeSubSystem(index) {
      this.label.selectedSubSystems.splice(index, 1);
      this.touchSubSystem();
    },

    touchSubSystem() {
      this.subSystemErrors =
        this.label.selectedSubSystems.length === 0
          ? this.$tr("item_is_required",this.$tr('sub_system'))
          : "";
    },

    closeDialog() {
      this.$emit("update:editDialog", false);
      this.$emit("update:isAutoEdit", false);
    },

    setLabel(data) {
      this.label.id = data?.id;
      this.label.title = data?.title;
      this.label.color = data?.color;
      this.label.label = data?.label;
      this.label.status = data?.status === "archive" ? true : false;
      this.label.selectedSubSystems = data?.sub_systems.map((row) => {
        const item = this.label.subSystems.find((sub) => sub.id === row.id);
        return item;
      });
    },

    async onItemChange(actionType) {
      if (actionType === "next") {
        const index = this.currentIndex + 1;
        if (index < this.editItems.length) {
          this.setLabel(this.editItems[index]);
          this.currentIndex = index;
        }
      } else if (actionType === "back") {
        const index = this.currentIndex - 1;
        if (index >= 0) {
          this.setLabel(this.editItems[index]);
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

    async onSubmit(canNext = "canNext") {
      this.$refs.labelEditForm.validate();
      this.touchSubSystem();
      this.$v.label.$touch();
      if (!this.$v.label.$invalid && !this.subSystemErrors) {
        const data = {
          id: this.label.id,
          color: this.label.color,
          status: this.label.status ? "archive" : "live",
          title: this.label.title,
          label: this.label.label,
          subSystems: this.label.selectedSubSystems.map((row) => {
            return row.id;
          }),
        };
        await this.updateRecord(data, canNext);
      } else {
        this.$toastr.w(this.$tr("please_fill_all_fields_correctly"));
      }
    },

    async updateRecord(data, canNext) {
      this.isSubmitting = true;
      try {
        const response = await this.$axios.put("labels/id", data);
        this.isSubmitting = false;
        if (response?.status === 200 && response?.data?.result) {
          if (canNext === "onSaveAndNext") {
            if (this.currentIndex < this.editItems.length) {
              Alert.successAlert(this, this.$tr("successfully_updated"));
              this.onItemChange("next");
            }
          } else if (canNext === "canNext") {
            this.$refs.editRef.nextForce();
          } else {
            Alert.successAlert(this, this.$tr("successfully_updated"));
          }
          this.updateItem(response?.data?.data);
        } else {
          this.$toastr.w(this.$tr("something_went_wrong"));
        }
      } catch (error) {
        this.isSubmitting = false;
        HandleException.handleApiException(this, error);
      }
    },

    titleRule(title) {
      return [
        (_) => title.required || this.$tr("required", this.$tr("title")),
        (_) =>
          title.minLength ||
          this.$tr("min_length", this.$tr("title"), this.$tr("5")),
      ];
    },
    labelRule(label) {
      return [
        (_) =>
          label.required || this.$tr("item_is_required", this.$tr("label")),
        (_) =>
          label.minLength ||
          this.$tr("min_length", this.$tr("label"), this.$tr("5")),
      ];
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
