<template>
  <v-form
    :key="currentIndex"
    lazy-validation
    ref="reasonEditForm"
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
              class="
                text-center text-h4
                font-weight-bold
                border-bottom
                pb-2
                pt-1
                text-uppercase
              "
              style="color: #58595b"
            >
              {{ $tr("general") }}
            </h1>
          </div>
          <div class="pl-3 pa-1">
            <div class="w-full pb-3">
              <CustomInput
                label="title"
                type="textarea"
                v-model.trim="$v.reason.title.$model"
                :rules="titleRule($v.reason.title)"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-slot:step2>
        <div class="topDiv">
          <DoneMessage
            :title="$tr('item_all_set', $tr('reason'))"
            :subTitle="$tr('you_can_access_your_item', $tr('reason'))"
          />
        </div>
      </template>
    </Edit>
  </v-form>
</template>

<script>
import { mapActions } from "vuex";

import Edit from "~/components/design/Edit.vue";
import HandleException from "~/helpers/handle-exception";
import Alert from "~/helpers/alert";
import DoneMessage from "~/components/design/components/DoneMessage";
import CustomInput from "~/components/design/components/CustomInput.vue";
import FormBtn from "~/components/design/components/FormBtn.vue";
import SelectedItem from "~/components/design/components/SelectedItem";
import { minLength, required } from "vuelidate/lib/validators";

export default {
  name: "EditReason",
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
    slug: {
      type: String,
    },
  },
  data() {
    const firstIndex = 0;
    return {
      currentIndex: firstIndex,
      topIcon: "mdi-account",
      tableName: this.$tr("reason"),
      headers: [
        { icon: "fa-user", title: "general", slotName: "step1" },
        { icon: "fa-thumbs-up", title: "done", slotName: "step2" },
      ],

      reason: {
        title: "",
      },

      isLoading: false,
      isSubmitting: false,
      title: this.$tr("reason") + this.$tr(" ") + this.$tr("title"),
    };
  },

  validations: {
    reason: {
      title: { required, minLength: minLength(2) },
    },
  },

  created() {
    this.setReason(this.editItems[0]);
  },

  methods: {
    ...mapActions({
      updateItem: "reasons/updateReason",
      fetchReasons: "reasons/fetchReasons",
    }),
    closeDialog() {
      this.$emit("update:editDialog", false);
      this.$emit("update:isAutoEdit", false);
    },

    setReason(data) {
      this.reason.id = data?.id;
      this.reason.title = data?.title;
    },

    async onItemChange(actionType) {
      if (actionType === "next") {
        const index = this.currentIndex + 1;
        if (index < this.editItems.length) {
          this.setReason(this.editItems[index]);
          this.currentIndex = index;
        }
      } else if (actionType === "back") {
        const index = this.currentIndex - 1;
        if (index >= 0) {
          this.setReason(this.editItems[index]);
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
      this.$refs.reasonEditForm.validate();
      this.$v.reason.$touch();
      if (!this.$v.reason.$invalid) {
        const data = {
          id: this.reason.id,
          title: this.reason.title,
        };
        await this.updateRecord(data, canNext);
      } else {
        this.$toastr.w(this.$tr("please_fill_all_fields_correctly"));
      }
    },

    async updateRecord(data, canNext) {
      data.system_name = this.slug;
      this.isSubmitting = true;
      try {
        const response = await this.$axios.put("reasons/id", data);
        await this.fetchReasons({ slug: this.slug });
        this.isSubmitting = false;

        if (response?.status === 201 && response?.data?.result) {
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
          this.updateItem(response?.data?.status_event);
        } else {
          this.$toastr.w(this.$tr("something_went_wrong"));
          this.isSubmitting = false;
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
          this.$tr("min_length", this.$tr("title"), this.$tr("2")),
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
