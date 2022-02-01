<template>
  <div>
    <v-dialog v-model="showReasonDialog" persistent width="800" scrollable>
      <v-card :color="$vuetify.theme.dark ? 'black' : '#f9fafd'">
        <v-card-title class="py-1">
          <v-app-bar-title>
            <span class="custom-dialog-title">{{ $tr("reasons") }}</span>
          </v-app-bar-title>
          <v-spacer />
          <CloseBtn @click="closeDialog" />
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-card elevation="0" class="ma-3 mt-0 w-full mb-5">
              <div class="text-center pt-2">
                <h2
                  class="text-uppercase"
                  style="letter-spacing: 4px !important"
                >
                  {{ $tr("reasons") }}
                </h2>
              </div>
              <v-divider class="gray lighten-3 mt-1 mb-2"></v-divider>

              <v-form ref="form" lazy-validation @submit.prevent="onSubmit">
                <v-row class="pt-3 ps-3">
                  <v-col cols="12" class="py-0">
                    <CustomInput
                      :items="reasons"
                      v-model="reason_id"
                      :label="$tr('label_required', $tr('reasons'))"
                      :error-messages="reasonIdErrors"
                      @input="$v.reason_id.$touch()"
                      @blur="$v.reason_id.$touch()"
                      type="autocomplete"
                      item-text="title"
                      item-value="reason_id"
                      :placeholder="$tr('choose_item', $tr('reasons'))"
                      class="me-md-4 mb-md-2 mb-0"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card>
            <v-card elevation="0" class="mx-3 pa-2 w-full mt-5">
              <TextButton
                type="secondary"
                class="ms-1 float-right"
                :text="$tr('cancel')"
                @click="closeDialog"
              >
              </TextButton>
              <TextButton
                type="primary"
                class="float-right"
                :text="$tr('submit')"
                @click="onSubmit"
              >
              </TextButton>
            </v-card>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-card class="w-full mb-2 px-2 py-1" elevation="1" outlined>
      <h4 class="title ma-0 mb-2">{{ $tr("actions") }}</h4>
      <div class="d-flex justify-center flex-wrap">
        <CustomButton
          v-if="showTracing"
          @click="onTracing"
          icon="fa-eye"
          text="toggle_tracing"
          type="dark"
          :class="`${selectedItems.length > 0 ? '' : 'customDisabled'}`"
        />
        <CustomButton
          v-if="showView"
          @click="onView"
          icon="fa-eye"
          text="view"
          type="dark"
          :class="`${selectedItems.length > 0 ? '' : 'customDisabled'}`"
        />
        <CustomButton
          v-if="showEdit"
          icon="fa-user-edit"
          text="edit"
          type="primary-darken2"
          @click="onEdit"
          :class="`${selectedItems.length > 0 ? '' : 'customDisabled'}`"
        />
        <CustomButton
          v-if="showAutoEdit"
          icon="fa-cog"
          text="auto_edit"
          type="primary-darken1"
          @click="onAutoEdit"
          :class="`${selectedItems.length > 0 ? '' : 'customDisabled'}`"
        />
        <CustomButton
          v-if="showBlock"
          icon="fa-times-circle"
          text="block"
          type="danger"
          @click="onBlock"
          :class="`${selectedItems.length > 0 ? '' : 'customDisabled'}`"
        />
        <CustomButton
          v-if="showDelete"
          icon="fa-trash"
          text="delete"
          type="danger2"
          @click="onDelete"
          :class="`${selectedItems.length > 0 ? '' : 'customDisabled'}`"
        />
        <!-- add class customDisabled to disable the select -->
        <div
          v-if="showSelect"
          style="width: 140px !important; margin: 0.16rem 0.16rem"
          :class="`${selectedItems.length > 0 ? '' : 'customDisabled'}`"
        >
          <v-select
            class="customSelect"
            v-model="selectedStatus"
            :items="statusItems"
            :placeholder="$tr('select_status')"
            dense
            outlined
            item-value="id"
            item-text="name"
            :menu-props="{ bottom: true, offsetY: true }"
            hide-details="auto"
          >
            <template v-slot:[`selection`]="{ item }">
              <div>
                {{ $tr(item.name) }}
              </div>
            </template>
            <template v-slot:[`item`]="{ item }">
              <v-list-item-content>
                <div>
                  <v-list-item-title v-html="`${$tr(item.name)}`">
                  </v-list-item-title>
                </div>
              </v-list-item-content>
            </template>
          </v-select>
        </div>
        <CustomButton
          v-if="showApply"
          icon="fa-check"
          text="apply"
          type="primary"
          @click="onApply"
          :class="`${selectedItems.length > 0 ? '' : 'customDisabled'}`"
        />
      </div>
    </v-card>
  </div>
</template>
<script>
import CustomButton from "./components/CustomButton.vue";
import CustomInput from "./components/CustomInput.vue";
import CloseBtn from "./Dialog/CloseBtn.vue";
import Alert from "../../helpers/alert";
import TextButton from "../../components/common/buttons/TextButton.vue";

import { required } from "vuelidate/lib/validators";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    TextButton,
    CustomButton,
    CustomInput,
    CloseBtn,
  },
  props: {
    isLanguage: {
      type: Boolean,
      required: false,
      default: false,
    },
    reasons: {
      type: Array,
      required: false,
    },

    showReasonDialog: {
      type: Boolean,
      required: false,
    },

    statusItems: {
      default: () => [
        { id: "active", name: "active" },
        { id: "inactive", name: "inactive" },
      ],
    },
    tabKey: {
      type: String,
      default: "all",
    },
    showTracing: {
      type: Boolean,
      default: false,
      required: false,
    },

    showView: {
      type: Boolean,
      default: true,
    },
    showEdit: {
      type: Boolean,
      default: true,
    },
    showAutoEdit: {
      type: Boolean,
      default: true,
    },

    showSelect: {
      type: Boolean,
      default: true,
    },
    showBlock: {
      type: Boolean,
      default: true,
    },
    showDelete: {
      type: Boolean,
      default: true,
    },
    showApply: {
      type: Boolean,
      default: true,
    },
    selectedItems: {
      type: Array,
    },
    defaultAction: {
      type: Boolean,
      default: true,
    },
    isLog: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      selectedStatus: "",
      reason_id: "",
    };
  },
  validations() {
    return {
      reason_id: { required },
    };
  },

  computed: {
    ...mapGetters({
      getTotals: "languages/getTotal",
    }),

    reasonIdErrors() {
      const errors = [];
      if (!this.$v.reason_id.$dirty) return errors;
      !this.$v.reason_id.required &&
        errors.push(this.$tr("please_select_one_option"));
      return errors;
    },
  },
  methods: {
    onTracing() {
      if (this.selectedItems[0].tracing_status && this.tabKey === "active") {
        this.$toastr.e(this.$tr("user_is_already_in_tracing_status"));
        return;
      }
      if (this.tabKey === "active" || this.tabKey === "tracing") {
        if (this.selectedItems?.length != 1) {
          Alert.removeLimitAlert(
            this,
            "please_select_an_item_first",
            "restricted"
          );
          return false;
        } else {
          Alert.removeDialogAlert(
            this,
            () => this.$emit("onTracing"),
            "",
            this.tabKey === "tracing" ? "yes_untrace" : "yes_trace"
          );
        }
      } else {
        Alert.removeLimitAlert(
          this,
          "you_can_toggle_tracing_from_active_and_tracing_tab",
          "restricted"
        );
        return;
      }
    },

    // do view  action
    onView() {
      if (this.selectedItems?.length < 1) {
        Alert.removeLimitAlert(
          this,
          "please_select_an_item_first",
          "restricted"
        );
        return false;
      }
      this.$emit("onView");
    },

    onSubmit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$emit("onSubmit", this.reason_id);
        this.reason_id = "";
        this.$v.reason_id.$reset();
      }
    },

    closeDialog() {
      this.$v.$reset();
      this.$emit("update:showReasonDialog", false);
    },

    // do apply action
    onApply() {
      if (this.isLanguage) {
        if (
          this.selectedStatus === "active" &&
          this.selectedItems[0]?.translatedCount !==
            this.getTotals("totalWords")
        ) {
          this.$toastr.e(
            this.$tr("can_not_active_language_unless_completely_translated")
          );
          return;
        }
      }

      if (this.canDoOperation()) {
        if (this.selectedStatus?.length < 1) {
          Alert.chooseStatus(this);
          return;
        }
        if (
          (this.tabKey === "active" && this.selectedStatus === "active") ||
          (this.tabKey === "inactive" && this.selectedStatus === "inactive") ||
          (this.tabKey === "live" && this.selectedStatus === "live") ||
          (this.tabKey === "archive" && this.selectedStatus === "archive")
        ) {
          this.$toastr.e(this.$tr("record_is_already_in_desired_status"));
        } else {
          this.$emit("onApply", this.selectedStatus);
        }
      }
    },

    // do remove action
    onDelete() {
      if (this.canDoOperation()) {
        const app = this;
        if (this.tabKey === "deleted" || this.tabKey === "removed") {
          Alert.removeDialogAlert(
            this,
            () => {
              const selectedIds = app.selectedItems.map((item) => item?.id);
              this.$emit("onDelete", selectedIds);
            },
            "swal_remove_text"
          );
        } else {
          Alert.removeDialogAlert(this, () => {
            const selectedIds = app.selectedItems.map((item) => item?.id);
            this.$emit("onDelete", selectedIds[0]);
          });
        }
      }
    },

    // do edit action
    onEdit() {
      if (this.tabKey === "all" && this.defaultAction) {
        Alert.removeLimitAlert(
          this,
          "cant_do_operation_on_all_tab",
          "restricted"
        );
        return;
      }
      if (this.selectedItems?.length > 1) {
        Alert.removeLimitAlert(
          this,
          "please_select_an_item_first",
          "restricted"
        );
        return;
      }

      // if (this.canDoOperation()) {
      //   if (this.selectedItems?.length > 1) {
      //     Alert.removeLimitAlert(this, "alert.select_one_item", "restricted");
      //     return false;
      //   }
      // }
      this.$emit("onEdit");
    },

    // do auto edit action
    onAutoEdit() {
      if (this.selectedItems?.length < 1) {
        Alert.removeLimitAlert(this, "alert.select_item", "restricted");
        return;
      }
      if (this.tabKey === "all" && this.defaultAction) {
        Alert.removeLimitAlert(
          this,
          "cant_do_operation_on_all_tab",
          "restricted"
        );
        return;
      }
      this.$emit("onAutoEdit");
    },

    // do block action
    onBlock() {
      if (this.tabKey === "blocked") {
        this.$toastr.e(this.$tr("item_is_already_blocked"));
        return;
      } else {
        if (this.canDoOperation()) {
          Alert.removeDialogAlert(
            this,
            () => this.$emit("onBlock"),
            "",
            "yes_block"
          );
        }
      }
    },

    canDoOperation() {
      if (this.isLog) {
        return true;
      }
      if (this.tabKey === "tracing") {
        Alert.customAlert(
          this,
          "cant_change_status_in_tracing_tab",
          "restricted"
        );
        return false;
      }
      return this.defaultAction
        ? this.defaultOperation()
        : this.customOperation();
    },

    defaultOperation() {
      if (this.selectedItems?.length < 1) {
        Alert.removeLimitAlert(
          this,
          "please_select_an_item_first",
          "restricted"
        );
        return false;
      }
      if (this.tabKey === "all") {
        Alert.removeLimitAlert(
          this,
          "cant_do_operation_on_all_tab",
          "restricted"
        );
        return false;
      }

      if (
        this.selectedItems?.length > 1 &&
        (this.tabKey !== "deleted" || this.tabKey !== "removed")
      ) {
        Alert.removeLimitAlert(this, "select_only_one_item", "restricted");
        return false;
      }
      return true;
    },

    customOperation() {
      if (this.selectedItems?.length < 1) {
        Alert.removeLimitAlert(
          this,
          "please_select_an_item_first",
          "restricted"
        );
        return false;
      }
    },
  },
};
</script>
<style>
.customDisabled {
  opacity: 0.6 !important;
  pointer-events: none !important;
  cursor: not-allowed !important;
}
</style>
<style scoped>
.title,
.title2 {
  font-size: 1rem !important;
  line-height: 1rem !important;
}

.customSelect ::placeholder {
  color: black !important;
  font-weight: 500;
}

.theme--dark .customSelect ::placeholder {
  color: white !important;
}
</style>
