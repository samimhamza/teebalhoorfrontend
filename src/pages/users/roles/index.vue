<template>
  <v-container fluid class="pa-0">
    <ProgressBar v-if="showProgressBar" />
    <v-dialog v-model="columnDialog" persistent width="1300" class="rounded-0">
      <CustomizeColumn
        @closeDialog="columnDialog = false"
        @saveChanges="saveColumnSetting($event)"
        :tableHeader="$_.cloneDeep(headers)"
        :custom_columns="$_.cloneDeep(selected_column)"
        :categoryHeader="$_.cloneDeep(category)"
        :key="dialogKey"
        page_name="roles"
      />
    </v-dialog>
    <v-dialog v-model="roleFilter" persistent max-width="1300" width="1300">
      <RolesFilter
        @close="onFilter"
        :departments="getDepartments"
        @getRecord="getRecord"
        v-if="roleFilter"
        :prevFilterData="filterData"
      />
    </v-dialog>
    <v-dialog v-model="showProfile" persistent width="1300" scrollable>
      <RoleProfile
        @onEdit="onEdit"
        :profileData="profileData"
        :key="profileKey"
        :dialog.sync="showProfile"
        v-if="$isInScope('roles-view')"
      />
    </v-dialog>
    <v-dialog
      v-model="autoEditDialog"
      persistent
      width="1300"
      scrollable
      v-if="$isInScope('roles-update')"
    >
      <TeamAutoEdit
        role
        :autoEditData="getRoleWithMetaData"
        @close="autoEditDialog = false"
        @toggleProgressBar="toggleProgressBar"
        v-if="autoEditDialog"
      />
    </v-dialog>

    <!-- Team / Role Bulk Upload -->
    <v-dialog v-model="teamRoleBulkUpload" width="1300">
      <Dialog
        persistent
        max-width="1300"
        @closeDialog="teamRoleBulkUpload = false"
      >
        <TeamRoleBulkUpload team_or_rule="role" v-if="teamRoleBulkUpload" />
      </Dialog>
    </v-dialog>
    <v-dialog
      v-model="editDialog"
      persistent
      width="1300"
      scrollable
      v-if="$isInScope('roles-update')"
    >
      <TeamEdit
        role
        ref="edit_dialog"
        @toggleProgressBar="toggleProgressBar"
        :editData="getRoleWithMetaData[0]"
        @close="editDialog = false"
        v-if="editDialog"
      />
    </v-dialog>
    <v-dialog
      v-model="registerDialog"
      persistent
      width="1300"
      scrollable
      v-if="$isInScope('roles-create')"
    >
      <Dialog @closeDialog="toggleTeamRoleRegistration">
        <TeamRoleRegistration
          ref="team_role_registration"
          role
          @close="toggleTeamRoleRegistration"
          @toggleProgressBar="toggleProgressBar"
          :tabKey="tabItems[tabIndex].key"
        />
      </Dialog>
    </v-dialog>
    <v-row no-gutters>
      <v-col cols="12">
        <PageHeader
          :Icon="breadcrumb[1].icon"
          :Title="breadcrumb[1].text"
          :Breadcrumb="breadcrumb"
        />
      </v-col>
      <v-col cols="12">
        <PageFilters
          ref="pageTableRef"
          :selected_header.sync="selected_header"
          :downloadContent="roles"
          :downloadDialog="downloadDialog"
          :filename="$tr('role_list')"
          :noteTitle="noteTitle"
          :content.sync="content"
          :contentT.sync="contentData"
          :selectedOption.sync="type"
          @onDownload="toggleDownload"
          @search="searchRole"
          @onFilter="onFilter"
          @unSelect="unSelect"
          @searchAgain="searchAgain"
          @onTypeChange="onTypeChange"
          @onColumn="
            () => {
              this.dialogKey++;
              this.columnDialog = true;
            }
          "
          :show-add-note="$isInScope('roles-create')"
          :show-bulk-upload="$isInScope('roles-create')"
          :showDownload="$isInScope('roles-view')"
          @onBulkUpload="onTeamRoleBulkUpload"
        >
          <CustomButton
            @click="registerDialog = true"
            icon="fa-plus"
            text="create_role"
            type="primary"
          />
        </PageFilters>
      </v-col>
      <v-col cols="12">
        <PageActions
          :showView="$isInScope('roles-view')"
          :showEdit="$isInScope('roles-update')"
          :showAutoEdit="$isInScope('roles-update')"
          :showBlock="$isInScope('roles-update')"
          :showDelete="$isInScope('roles-delete')"
          :showSelect="$isInScope('roles-update')"
          :showApply="$isInScope('roles-update')"
          :tabKey="tabItems[tabIndex].key"
          :selectedItems.sync="selectedItems"
          :tab-key.sync="tabItems[tabIndex].key"
          :showReasonDialog.sync="showReasonDialog"
          @onSubmit="onSubmit"
          @onApply="onApply"
          @onAutoEdit="onAutoEdit"
          @onDelete="onDelete"
          @onBlock="onBlock"
          @onView="onView"
          @onEdit="onEdit"
          :reasons="allReasons"
        />
      </v-col>
      <v-col cols="12">
        <DataTable
          ref="tableRef"
          v-model="selectedItems"
          :headers="selected_header"
          :items="roles"
          :loading="apiCalling"
          @click:row="onRowClicked"
          :ItemsLength="getTotal(getTabKey())"
          @onTablePaginate="onTableChanges"
        >
          <template slot="customHeader">
            <v-row class="mx-0">
              <v-col cols="12 pa-0">
                <v-tabs
                  v-model="tabIndex"
                  height="40"
                  background-color="primary"
                  active-class="active-background"
                  show-arrows
                  dark
                >
                  <client-only>
                    <v-tab v-for="(item, i) in tabItems" :key="i" class="px-3">
                      <span
                        :class="`${
                          item.isSelected ? 'selected' : 'not-selected'
                        } tab-icon`"
                      >
                        <v-icon left small class="me-1">{{ item.icon }}</v-icon>
                      </span>
                      <p
                        :class="`${
                          item.isSelected ? 'selected' : 'not-selected'
                        } tab-title text-capitalize mb-0`"
                      >
                        {{ item.text }}
                      </p>
                      <v-chip
                        class="ms-1 tab-chip"
                        :color="item.isSelected ? 'primary' : 'white'"
                        :text-color="item.isSelected ? 'white' : 'primary'"
                        small
                        v-text="getTotal(tabItems[i].key)"
                      />
                    </v-tab>
                  </client-only>
                </v-tabs>
              </v-col>
            </v-row>
          </template>
          <template v-slot:[`item.code`]="{ item }">
            <span
              class="mx-1 primary--text font-weight-bold"
              @click="() => viewSelectedRole(item)"
            >
              {{ item.code }}
            </span>
          </template>
        </DataTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ProgressBar from "~/components/common/ProgressBar";
import PageHeader from "~/components/design/PageHeader";
import PageFilters from "~/components/design/PageFilters";
import PageActions from "~/components/design/PageActions";
import DataTable from "~/components/design/DataTable";
import Roles from "../../../configs/pages/roles";
import CustomButton from "~/components/design/components/CustomButton";
import TeamRoleRegistration from "~/components/users/team/TeamRoleRegistration.vue";
import RoleProfile from "~/components/users/roles/RoleProfile.vue";
import Dialog from "~/components/design/Dialog/Dialog";
import CustomizeColumn from "~/components/customizeColumn/CustomizeColumn.vue";
import TeamAutoEdit from "~/components/users/team/TeamAutoEdit.vue";
import TeamEdit from "~/components/users/team/TeamEdit.vue";
import HandleException from "~/helpers/handle-exception";
import Alert from "~/helpers/alert";
import RolesFilter from "~/components/users/roles/RolesFilter.vue";
import TeamRoleBulkUpload from "~/components/users/TeamRoleBulkUpload";
import ColumnHelper from "~/helpers/column-helper";

export default {
  meta: {
    hasAuth: true,
    scope: "roles-view",
  },
  async asyncData({ store }) {
    await store.dispatch("customColumns/fetchCustomColumns", {
      view_name: "roles",
    });
    await store.dispatch("roles/fetchItems", {
      key: "all",
      options: this?.filterData,
    });
    await store.dispatch("departments/fetchDepartments", {
      key: "all",
      searchData: null,
    });
  },
  name: "Role",
  components: {
    RoleProfile,
    Dialog,
    CustomButton,
    DataTable,
    PageActions,
    PageFilters,
    PageHeader,
    ProgressBar,
    TeamRoleRegistration,
    CustomizeColumn,
    TeamEdit,
    RolesFilter,
    TeamAutoEdit,
    TeamRoleBulkUpload,
  },

  data() {
    return {
      getLabels: [],
      category: Roles(this).category,
      tabItems: Roles(this).tabItems,
      headers: Roles(this).headers,
      breadcrumb: Roles(this).breadcrumb,
      noteTitle: this.$tr("add_role_note"),
      registerDialog: false,
      tabIndex: 0,

      // Profile
      showProfile: false,
      profileKey: 0,
      profileData: {},

      // Page actions
      showReasonDialog: false,
      selectedStatus: "",
      itemIds: [],
      allReasons: [],

      roleData: {},
      downloadDialog: false,

      selectedItems: [],
      tabIndex: 0,

      // auto edit
      editTeamItems: [],
      isAutoEdit: false,
      editDialog: false,
      autoEditDialog: false,
      // for custom columns
      dialogKey: 0,
      columnDialog: false,
      selected_column: [],
      selected_header: [],

      showProgressBar: false,
      autoEdit: false,
      editKey: 0,
      autoEditData: [],

      rolesEdit: false,
      rolesEditKey: 0,
      editData: {},
      roleFilter: false,
      filterData: "",
      type: 1,
      content: [],
      contentData: "",
      teamRoleBulkUpload: false,
    };
  },
  computed: {
    ...mapGetters({
      getTranslations: "translations/getTranslations",
      apiCalling: "roles/isApiCalling",
      custom_columns: "customColumns/get_custom_columns",
      roles: "roles/getItems",
      getTotal: "roles/getTotal",
      getReasons: "reasons/get_reason",
      getDepartments: "departments/getDepartments",
      getRoleWithMetaData: "filterData/getrolesWithMetaData",
    }),
  },
  watch: {
    tabIndex: function (value) {
      this.selectedItems = [];
      this.checkSelectedTab(value);
      this.fetchRoles({
        key: this.getTabKey(),
        options: {
          ...this.filterData,
          type: this.type,
          content: this.content,
          contentData: this.contentData,
        },
      });
    },
  },
  async created() {
    //customize columns
    if (process.client) {
      const response = await ColumnHelper.getselectedHeader(
        this.headers,
        this.custom_columns
      );
      this.selected_header = response.selected_header;
      this.selected_column = this.selected_header.map((row) => row.id);
      this.category = await ColumnHelper.getCategoryValue(
        this.selected_header,
        this.category
      );
    }
    if (process.client) {
      this.last_header_update = this._.clone(this.selected_header);
    }
    this.$root.$on("getData", (data) => {
      this.filterData = data;
    });

    try {
      const sub_system = "Roles";
      const response = await this.$axios.get(`labels/id`, {
        params: { sub_system: sub_system },
      });
      this.allLabels = response?.data?.labels;
    } catch (error) {
      if (error?.response?.status === 404 && !error?.response?.data?.result) {
        this.$toastr.w(this.$tr("sub_system_not_found"));
      }
    }
  },

  methods: {
    ...mapActions({
      fetchTranslations: "translations/fetchTranslations",
      fetchRoleMetaData: "filterData/fetchRoleMetaDataForEdit",
      fetchcountries: "countries/fetchCountriesWithCompanies",

      fetchRoles: "roles/fetchItems",
      removeRole: "roles/removeItem",
      insertRole: "roles/insertNewItem",
    }),
    onTeamRoleBulkUpload() {
      this.teamRoleBulkUpload = !this.teamRoleBulkUpload;
    },
    viewSelectedRole(item) {
      this.profileData = item;
      this.profileKey++;
      this.showProfile = true;
    },

    onView() {
      if (this.selectedItems.length === 1) {
        this.profileData = this.selectedItems[0];
        this.profileKey++;
        this.showProfile = true;
      } else {
        this.$toastr.w(this.$tr("view_item_max_limit_text"));
      }
    },

    onFilter() {
      this.roleFilter = !this.roleFilter;
    },

    toggleDownload() {
      this.downloadDialog = !this.downloadDialog;
    },

    onItemsSelect(items) {
      this.selectedItems = items;
    },

    onTableChanges(options) {
      const newOptions = {
        ...options,
        ...this.filterData,
        type: this.type,
        content: this.content,
        contentData: this.contentData,
      };
      this.fetchRoles({ key: this.getTabKey(), options: newOptions });
    },

    checkSelectedTab(value) {
      this.tabItems = this.tabItems.map((item, index) => {
        index === value ? (item.isSelected = 1) : (item.isSelected = 0);
        return item;
      });
    },

    onRowClicked(item) {
      let items = new Set(this.selectedItems);
      items.has(item) ? items.delete(item) : items.add(item);
      this.selectedItems = Array.from(items);
    },

    //     *************      Change Status       ******************
    async onBlock() {
      this.selectedStatus = "blocked";
      this.getTabKey() === "pending"
        ? this.noReasonSubmit()
        : await this.fetchAllReasons();
    },

    async fetchAllReasons() {
      this.showProgressBar = true;
      try {
        const response = await this.$axios.get(
          `reasons/id?type=${this.selectedStatus}&sub_system=Roles`
        );
        this.allReasons = response?.data?.reasons;
        this.showReasonDialog = true;
      } catch (error) {
        if (error?.response?.status === 404 && !error?.response?.data?.result) {
          this.showReasonDialog = false;
          this.$toastr.w(this.$tr("sub_system_not_found"));
        }
      }
      this.showProgressBar = false;
    },

    async onApply(selectedStatus) {
      this.selectedStatus = selectedStatus;
      if (this.getTabKey() === "pending") {
        Alert.removeDialogAlert(
          this,
          () => this.noReasonSubmit(),
          "",
          "yes_sure"
        );
      } else {
        await this.fetchAllReasons();
      }
    },

    async noReasonSubmit() {
      try {
        this.showProgressBar = true;
        const itemId = this.selectedItems[0]?.id;
        const data = {
          item_id: itemId,
          status: this.selectedStatus,
          type: "pending",
        };

        const response =
          this.selectedStatus == "removed"
            ? await this.$axios.delete(`roles/${this.itemIds}`)
            : await this.$axios.post("roles/changeStatus", data);

        if (response?.status === 200 && response?.data?.result) {
          Alert.successAlert(this, "successfully_" + this.selectedStatus);
          this.fetchRecentDataAndClearSelected();
        } else {
          this.$toastr.e(this.$tr("something_went_wrong"));
        }
      } catch (error) {
        if (error?.response?.status === 406 && !error?.response?.data?.result) {
          this.$toastr.e(this.$tr("not_allowed_to_change_status"));
        } else {
          HandleException.handleApiException(this, error);
        }
      }
      this.showProgressBar = false;
    },

    async onSubmit(reasonId) {
      this.showReasonDialog = false;
      try {
        this.showProgressBar = true;
        const itemId = this.selectedItems[0]?.id;
        const data = {
          item_id: itemId,
          status: this.selectedStatus,
          reason_id: reasonId,
          type: "status",
        };

        const response =
          this.selectedStatus == "removed"
            ? await this.$axios.delete(
                `roles/${this.itemIds}?reasonId=${reasonId}`
              )
            : await this.$axios.post("roles/changeStatus", data);

        if (response?.status === 200 && response?.data?.result) {
          Alert.successAlert(this, "successfully_" + this.selectedStatus);
          this.fetchRecentDataAndClearSelected();
        } else {
          this.$toastr.e(this.$tr("something_went_wrong"));
        }
      } catch (error) {
        if (error?.response?.status === 406 && !error?.response?.data?.result) {
          this.$toastr.e(this.$tr("not_allowed_to_change_status"));
        } else {
          HandleException.handleApiException(this, error);
        }
      }
      this.showProgressBar = false;
    },

    async onDelete(ids) {
      this.selectedStatus = "removed";
      this.itemIds = ids;
      this.getTabKey() === "pending" ||
      this.getTabKey() === "deleted" ||
      this.getTabKey() === "removed"
        ? this.noReasonSubmit()
        : await this.fetchAllReasons();
    },

    fetchRecentDataAndClearSelected() {
      this.selectedItems = [];
      this.itemIds = [];
      this.selectedStatus = "";
      this.fetchRoles({
        key: this.getTabKey(),
        options: {
          ...this.filterData,
          type: this.type,
          content: this.content,
          contentData: this.contentData,
        },
      });
    },

    // customize columns: start=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    //customize columns: called from child
    saveColumnSetting(data) {
      if (data.close_form) {
        this.columnDialog = false;
      }
      this.selected_header = data.selected_header;
      this.selected_column = data.selected_header.map((row) => row.id);
      this.category = ColumnHelper.getCategoryValue(
        data.selected_header,
        this.category
      );
    },
    // customize columns: end=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    // get tab key
    getTabKey() {
      return this.tabItems[this.tabIndex]?.key;
    },

    async onEdit() {
      if (this.selectedItems.length > 1) {
        this.$toastr.w(this.$tr("edit_item_max_limit_text"));
      } else {
        this.toggleProgressBar();
        await this.fetchRoleMetaData([this.selectedItems[0].id]);
        await this.fetchcountries();
        this.editDialog = !this.editDialog;
        this.toggleProgressBar();
      }
    },

    async onAutoEdit() {
      this.toggleProgressBar();
      await this.fetchRoleMetaData(this.selectedItems.map((item) => item.id));
      await this.fetchcountries();
      this.autoEditDialog = !this.autoEditDialog;
      this.toggleProgressBar();
    },

    toggleProgressBar() {
      this.showProgressBar = !this.showProgressBar;
    },
    toggleTeamRoleRegistration() {
      this.registerDialog = !this.registerDialog;
      this.$refs.team_role_registration.resetAll();
    },
    // =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    async searchRole() {
      if (this.type == 1) {
        try {
          const data = {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
          };
          const response = await this.$axios.post("roles/searchRole", data);
          this.selectData(response);
        } catch (error) {}
      } else if (this.type == 0) {
        this.getRecord(this.filterData);
      }
    },
    onTypeChange() {
      this.selectedItems = [];
    },
    selectData(response) {
      if (response.status === 200) {
        const data = response.data;
        if (data != null) {
          this.removeRole(data.id);
          this.insertRole(data);
          this.selectedItems?.unshift(data);
          this.$refs.tableRef.selected?.unshift(data);
        }
      } else {
        this.$refs.pageTableRef.clearInput();
      }
    },

    searchAgain() {
      this.getRecord(this.filterData);
    },

    async getRecord(filterData) {
      try {
        const data = {
          key: this.getTabKey(),
          options: {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
            department_id: filterData.department_id,
            created_date: filterData.created_date,
            updated_date: filterData.updated_date,
            name: filterData.name,
            include: filterData.include,
            roles_ids: filterData.roles_ids,
          },
        };
        const res = await this.fetchRoles(data);
      } catch (error) {
        if (error.response.status === 401) {
          redirect("/auth/signin");
        } else {
          console.error(error.response.statusText);
        }
      }
    },
    unSelect(key) {
      this.selectedItems = this.selectedItems.filter(
        (data) => data.code !== key
      );
    },
  },
};
</script>

<style scoped></style>
