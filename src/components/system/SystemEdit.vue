<template>
  <Edit
    :headers="headers"
    :autoEditData="editData"
    :iconOrLogo="editData.logo"
    :isIcon="false"
    :isSubmitting="isSaving"
    @onSubmit="onSubmit"
    @close="closeDialog"
    :tableName="this.$tr('system')"
    :hasLogo="true"
  >
    <template v-slot:name1>
      <div class="topDiv">
        <div class="topTitle">
          <h1
            class="text-center text-h4 font-weight-bold border-bottom py-2 text-uppercase"
            style="color: #58595b"
          >
            {{ $tr("general") }}
          </h1>
        </div>

        <div class="mb-6 mx-3">
          <CustomLogoInput
            @onLogoChanged="onLogoChanged"
            :defaultIcon="system.logo"
          />
        </div>

        <div class="d-flex flex-column flex-md-row my-3 mx-3">
          <div class="w-full">
            <CustomInput
              :label="$tr('label_required', $tr('systems'))"
              placeholder="system"
              type="textfield"
              v-model="system.name"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:name2>
      <div class="topDiv">
        <div class="topTitle">
          <h1
            class="text-center text-h4 font-weight-bold border-bottom py-2 text-uppercase"
            style="color: #58595b"
          >
            {{ $tr("sub_system") }}
          </h1>
        </div>
      </div>
      <div class="d-flex flex-column flex-md-row my-3 mx-3">
        <div class="w-full">
          <div v-for="(sys, k) in subSystem" :key="k">
            <div class="d-flex flex-column flex-md-row">
              <div class="w-full">
                <CustomInput
                  :label="$tr('label_required', $tr('sub_system'))"
                  v-model="sys.name"
                  placeholder="sub_system"
                  type="textfield"
                  class="me-md-4 mb-md-2 mb-0"
                />
              </div>
              <div class="w-100">
                <FormBtn
                  @click="addNewRow"
                  title="+"
                  class="mt-md-4 mb-2 mr-2"
                />
              </div>
              <div class="w-100" v-if="subSystem.length >= 2">
                <FormBtn @click="deleteRow(k)" title="-" class="mt-md-4 mb-2" />
              </div>
            </div>
            <div class="d-flex flex-column flex-md-row">
              <div class="w-full">
                <CustomInput
                  :items="getActions"
                  v-model="sys.current"
                  :label="$tr('label_required', $tr('actions'))"
                  type="autocomplete"
                  :placeholder="$tr('choose_item', $tr('actions'))"
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
              <template v-for="(action, index) in sys.actions">
                <SelectedItem
                  @close="removeAction(k, index)"
                  :key="index"
                  :title="action.name"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Edit>
</template>

<script>
import Edit from "../design/Edit.vue";
import CustomInput from "../design/components/CustomInput.vue";
import SelectedItem from "../design/components/SelectedItem.vue";
import FormBtn from "../design/components/FormBtn.vue";
import HandleException from "~/helpers/handle-exception";
import CustomLogoInput from "../design/components/CustomLogoInput";

import { mapGetters } from "vuex";

export default {
  components: {
    Edit,
    CustomInput,
    SelectedItem,
    FormBtn,
    CustomLogoInput,
  },
  props: {
    editData: {
      require: true,
      type: Object,
    },
  },
  data() {
    return {
      headers: [
        { icon: "fa-info", title: "general", slotName: "name1" },
        { icon: "fa-info", title: "sub_system", slotName: "name2" },
      ],

      isSaving: false,

      subSystem: [],
      system: {
        id: this.editData.id,
        name: this.editData.name,
        logo: this.editData.logo,
      },
    };
  },

  created() {
    this.editData.sub_systems.forEach((ele) => {
      let temp1 = [];
      let temp2 = [];
      ele.actions.forEach((row) => {
        temp1.push({ name: row.name, id: row.id });
        temp2.push(row.id);
      });
      this.subSystem.push({
        current: "",
        name: ele.name,
        id: ele.id,
        actions: temp1,
        actionIds: temp2,
      });
    });
  },

  computed: {
    ...mapGetters({
      getActions: "actions_store/items",
    }),
  },
  methods: {
    onLogoChanged(logoPath) {
      this.system.logo = logoPath;
    },

    async onSubmit() {
      // this.$refs.permissionForm.validate()
      // this.$v.permission.$touch()
      // if (!this.$v.permission.$invalid) {
      this.isSaving = true;
      await this.updateRecord();
      this.isSaving = false;
      // } else {
      //     this.$toastr.e(this.$tr("please_fill_all_fields_correctly"))
      // }
    },

    async updateRecord() {
      this.system.subSystem = this.subSystem;
      const formData = new FormData();
      formData.append("id", this.system.id);
      formData.append("name", this.system.name);
      formData.append("logo", this.system.logo);
      formData.append("isUpdate", true);
      formData.append("subSystem", JSON.stringify(this.system.subSystem));
      try {
        const response = await this.$axios.post("/systems", formData);
        if (response?.status === 200 && response?.data?.result) {
          // this.updateItem(response?.data?.data)
          // this.$toastr.s(this. $tr("successfully_updated"))
          // this.$v.permission.$reset()
          // this.$refs.permissionForm.reset()
          // this.$refs.permissionForm.resetValidation()
          // this.closeDialog()
        } else {
          this.$toastr.e(this.$tr("something_went_wrong"));
        }
      } catch (error) {
        HandleException.handleApiException(this, error);
      }
    },

    removeAction(k, index) {
      this.subSystem[k].actions.splice(index, 1);
      this.subSystem[k].actionIds.splice(index, 1);
    },

    addAction(k) {
      let vm = this;
      let repeated = false;
      vm.subSystem[k].actions.forEach((row) => {
        if (row.id == vm.subSystem[k].current) {
          repeated = true;
        }
      });

      if (!repeated) {
        var current_id = vm.getActions.find(
          (ele) => ele.id == vm.subSystem[k].current
        );
        vm.subSystem[k].actions.push(current_id);
        vm.subSystem[k].actionIds.push(current_id.id);
      } else {
        this.$toastr.w(this.$tr("item_already_added_to_list"));
      }
    },

    deleteRow(index) {
      this.subSystem.splice(index, 1);
    },

    addNewRow() {
      this.subSystem.push({
        id: "",
        current: "",
        name: "",
        actions: [],
        actionIds: [],
      });
    },

    closeDialog() {
      this.$emit("update:editDialog", false);
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
