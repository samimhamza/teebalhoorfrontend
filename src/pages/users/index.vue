<template>
  <v-container fluid class="pa-0">
    <ProgressBar v-if="showProgressBar" />
    <!--    Register User Dialog-->
    <v-dialog
      v-model="userRegisterDialog"
      width="1300"
      persistent
      v-if="$isInScope('users-create')"
    >
      <Dialog @closeDialog="closeRegisterDialog">
        <RegisterUser
          :tableKey="tabItems[tabIndex].key"
          ref="registerUserDialog"
        />
      </Dialog>
    </v-dialog>

    <!--    Register User Dialog-->
    <v-dialog
      v-model="permissionDialog"
      width="1300"
      content-class="hide-scroll"
      persistent
    >
      <Dialog @closeDialog="togglePermissionsDialog" style="height: inherit">
        <StaticPermission
          :key="permissionKey"
          :scheduleTypeProps="permissionUser.schedule_type"
          :selectedSubSystemsProps="permissionUser.selectedSubSystems"
          :selectedActionsProps="permissionUser.selectedSystems"
          :selectedCompanySystemsProps="permissionUser.companiesSystems"
          :allCompaniesProps="permissionUser.selectedCompanies"
          :selectedTeamsProps="permissionUser.selectedTeams"
          :selectedRolesProps="permissionUser.selectedRoles"
          :selectedCompaniesProps="permissionUser.selectedCompanies"
          :allTeamsProps="permissionUser.companyDepartmentsTeams"
          :timeRangeProps="permissionUser.time_range"
          :dateRangeProps="permissionUser.date_range"
          :actualTimeRangeProps="permissionUser.actualTimeRange"
          :actualDateRangeProps="permissionUser.actualDateRange"
          :isSubmitting="isUpdatingPermissions"
          showButtons
          showTabs
          @submit="updateUserPermisions"
          @onClose="togglePermissionsDialog"
        />
      </Dialog>
    </v-dialog>

    <v-dialog v-model="columnDialog" persistent width="1300" class="rounded-0">
      <client-only>
        <CustomizeColumn
          @closeDialog="columnDialog = false"
          @saveChanges="saveColumnSetting($event)"
          :tableHeader="$_.cloneDeep(headers)"
          :custom_columns="$_.cloneDeep(selected_column)"
          :categoryHeader="$_.cloneDeep(category)"
          page_name="users"
          :key="dialogKey"
        />
      </client-only>
    </v-dialog>

    <v-dialog
      v-model="UserFilter"
      persistent
      max-width="1300"
      width="1300"
      v-if="$isInScope('users-view')"
    >
      <UserFilter @close="onFilter" v-if="UserFilter" :prevFilterData="filterData" @getRecord="getRecord" />
    </v-dialog>
    <v-dialog
      v-model="showProfile"
      persistent
      width="1300"
      scrollable
      v-if="$isInScope('users-view')"
    >
      <UserProfile
        @editPermissions="onEdit"
        :user="userData"
        :dialog.sync="showProfile"
      />
    </v-dialog>
    <!-- User Bulk Upload -->
    <v-dialog v-model="userBulkUpload" width="1300">
      <Dialog persistent max-width="1300" @closeDialog="userBulkUpload = false">
        <UserBulkUpload v-if="userBulkUpload" />
      </Dialog>
    </v-dialog>
    <!--  User Edit Section    -->

    <v-dialog
      v-model="editDialog"
      persistent
      width="1300"
      v-if="$isInScope('users-update')"
    >
      <UserEdit
        :tabKey="tabItems[tabIndex].key"
        :edit-dialog.sync="editDialog"
        :key="editUserKey"
        :editItems="editUserItems"
        :is-auto-edit.sync="isAutoEdit"
      />
    </v-dialog>

    <v-row no-gutters>
      <v-col cols="12">
        <PageHeader
          :Icon="breadcrumb[1].icon"
          :Title="breadcrumb[1].text"
          :Breadcrumb="breadcrumb"
        >
          <template slot="button">
            <CustomButton
              v-if="$isInScope(['users-view', 'roles-view'], true)"
              :icon="
                this.onlineVisible
                  ? 'mdi-chevron-triple-up'
                  : 'mdi-chevron-triple-down'
              "
              class="toggle-online-user"
              text=""
              @click="() => toggleVisibleOnlineUsers()"
            />
          </template>
          <template
            slot="content"
            v-if="$isInScope(['users-view', 'roles-view'], true)"
          >
            <UserAnalytics2 :visible.sync="onlineVisible" ref="userAnalytic" />
          </template>
        </PageHeader>
      </v-col>

      <v-col cols="12">
        <PageFilters
          :content.sync="content"
          :selected_header.sync="selected_header"
          :downloadContent="getItems"
          :downloadDialog="downloadDialog"
          :filename="$tr('users')"
          :show-add-note="$isInScope('users-create')"
          :show-bulk-upload="$isInScope('users-create')"
          :showDownload="$isInScope('users-view')"
          :contentT.sync="contentData"
          :selectedOption.sync="type"
          ref="pageFilter"
          @onDownload="toggleDownloadPopup"
          @onBulkUpload="onUserBulkUpload"
          @onTypeChange="onTypeChange"
          @onFilter="onFilter"
          @unSelect="unSelect"
          @search="searchUser"
          @onColumn="
            () => {
              this.dialogKey++;
              this.columnDialog = true;
            }
          "
          @searchAgain="searchAgain"
          note-title="add_user_note"
        >
          <CustomButton
            v-if="$isInScope('users-create')"
            @click="toggleUserRegisterDialog"
            icon="fa-user-plus"
            :text="$tr('create_item', $tr('user'))"
            type="primary"
          />
        </PageFilters>
      </v-col>
      <v-col cols="12">
        <PageActions
          :showTracing="true"
          :showView="$isInScope('users-view')"
          :showEdit="$isInScope('users-update')"
          :showAutoEdit="$isInScope('users-update')"
          :showDelete="$isInScope('users-delete')"
          :showBlock="$isInScope('users-update')"
          :showSelect="$isInScope('users-update')"
          :showApply="$isInScope('users-update')"
          :selectedItems="selectedItems"
          :tab-key.sync="tabItems[tabIndex].key"
          @onDelete="deleteUser"
          @onTracing="onTracing"
          @onView="onView"
          @onApply="toggleUserStatus"
          @onAutoEdit="onAutoEdit"
          @onEdit="onEdit"
          @onSubmit="onSubmit"
          @onBlock="onBlock"
          :reasons="allReasons"
          :showReasonDialog.sync="showReasonDialog"
        />
      </v-col>
      <v-col cols="12">
        <DataTable
          ref="tableRef"
          :headers="selected_header"
          :items="getItems"
          :ItemsLength="getTotals(tabItems[tabIndex].key)"
          v-model="selectedItems"
          :loading="apiCalling"
          @onTablePaginate="onTableChanges"
          @click:row="onRowClicked"
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
                        {{ $tr(item.text) }}
                      </p>
                      <v-chip
                        class="ms-1 tab-chip"
                        :color="item.isSelected ? 'primary' : 'white'"
                        :text-color="item.isSelected ? 'white' : 'primary'"
                        small
                        v-text="getTotals(item.key)"
                      />
                    </v-tab>
                  </client-only>
                </v-tabs>
              </v-col>
            </v-row>
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <span v-if="item.status === 'inactive'">{{ $tr("deactive") }}</span>
            <span v-else>{{ $tr(item.status) }}</span>
          </template>

          <template v-slot:[`item.tracing_status`]="{ item }">
            <span>
              {{ item.tracing_status ? $tr("yes") : $tr("no") }}
            </span>
          </template>

          <template v-slot:[`item.teams`]="{ item }">
            <span
              v-for="(team, index) in item.teams"
              :key="team.id"
              v-if="index < 3"
            >
              {{ `${team.name} ${index === 0 ? "" : index < 3 ? "," : ""}` }}
            </span>
            <span v-else-if="index === 2"> ... </span>
          </template>

          <template v-slot:[`item.projects`]="{ item }">
            <span
              v-for="(project, index) in item.projects"
              :key="project.id"
              v-if="index < 3"
            >
              {{ `${project.name} ${index === 0 ? "" : index < 3 ? "," : ""}` }}
            </span>
            <span v-else-if="index === 2"> ... </span>
          </template>

          <template v-slot:[`item.roles`]="{ item }">
            <span
              style="white-space: nowrap"
              v-for="(role, index) in item.roles"
              :key="role.id"
              v-if="index < 3"
            >
              {{ `${role.name} ${index === 0 ? "" : index < 3 ? "," : ""}` }}
            </span>
            <span v-else-if="index === 2"> ... </span>
          </template>

          <template v-slot:[`item.code`]="{ item }">
            <span
              @click="() => viewSelectedUser(item.id)"
              class="mx-1 primary--text font-weight-bold"
            >
              {{ item.code }}
            </span>
          </template>
        </DataTable>
      </v-col>
    </v-row>
    <br />
    <br />
    <br />
    <br />
    <br />
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import PageHeader from "../../components/design/PageHeader";
import PageFilters from "../../components/design/PageFilters";
import PageActions from "../../components/design/PageActions";
import UserAnalytics2 from "../../components/users/UserAnalytics";
import DataTable from "../../components/design/DataTable";
import HandleException from "~/helpers/handle-exception";
import Alert from "../../helpers/alert";
import Helper from "../../helpers/helpers";
import ProgressBar from "../../components/common/ProgressBar";
import UserFilter from "../../components/users/UserFilter.vue";
import CustomButton from "../../components/design/components/CustomButton";
import Dialog from "../../components/design/Dialog/Dialog.vue";
import UserProfile from "../../components/users/UserProfile";
import StaticPermission from "../../components/users/StaticPermission";
import RegisterUser from "../../components/users/RegisterUser.vue";
import UserEdit from "../../components/users/UserEdit.vue";
import CustomizeColumn from "../../components/customizeColumn/CustomizeColumn.vue";
import DownloadPopUp from "../../components/common/DownloadPopUp.vue";
import Users from "../../configs/pages/users";
import UserBulkUpload from "../../components/users/UserBulkUpload";
import ColumnHelper from "~/helpers/column-helper";

export default {
  meta: {
    hasAuth: true,
    scope: "users-view",
  },

  async asyncData({ store }) {
    await store.dispatch("customColumns/fetchCustomColumns", {
      view_name: "users",
    });
    await store.dispatch("users/fetchItems", {
      key: "all",
      options: {
        ...this?.filterData,
        type: this?.type,
        content: this?.content,
        contentData: this?.contentData,
      },
    });
  },
  components: {
    UserProfile,
    RegisterUser,
    CustomButton,
    ProgressBar,
    DataTable,
    PageActions,
    PageFilters,
    PageHeader,
    UserAnalytics2,
    UserFilter,
    Dialog,
    CustomizeColumn,
    DownloadPopUp,
    UserEdit,
    StaticPermission,
    UserBulkUpload,
  },
  data() {
    return {
      category: Users(this).category,
      headers: Users(this).headers,
      tabItems: Users(this).tabItems,
      breadcrumb: Users(this).breadcrumb,
      selectedItems: [],
      tabIndex: 0,

      // register user properties
      isEditUser: false,
      registerUserKey: 0,
      editableUser: {},
      userRegisterDialog: false,
      showProfile: false,
      userData: {},
      viewKey: 0,

      // user permission section
      permissionDialog: false,
      permissionKey: 0,
      isUpdatingPermissions: false,
      permissionUser: {},

      //bulk updload
      bulkUploadDialog: false,
      userBulkUpload: false,

      // User Edit Section
      isAutoEdit: false,
      editDialog: false,
      editUserKey: 0,
      editUserItems: [],

      // for custom columns
      dialogKey: 0,
      columnDialog: false,
      selected_column: [],
      selected_header: [],
      showProgressBar: false,

      // Page actions
      showReasonDialog: false,
      selectedStatus: "",
      userIds: [],
      allReasons: [],

      type: 1,
      content: [],
      contentData: "",
      firstname: "",
      lastname: "",
      address: "",
      language: "",

      onlineVisible: false,
      UserFilter: false,
      filterData: {},
      editKey: 0,
      autoEdit: false,
      userAutoEditData: [],

      userEditKey: 0,
      userEdit: false,
      editData: {},
      downloadDialog: false,
    };
  },
  watch: {
    tabIndex: function (value) {
      this.selectedItems = [];
      this.checkSelectedTab(value);
      this.fetchItems({
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
  computed: {
    ...mapGetters({
      apiCalling: "users/isApiCalling",
      getTotals: "users/getTotal",
      getItems: "users/getItems",
      custom_columns: "customColumns/get_custom_columns",
      getTranslations: "translations/getTranslations",
    }),
  },

  methods: {
    // vuex state methods
    ...mapActions({
      fetchCustomColumns: "customColumns/fetchCustomColumns",
      fetchUserPagination: "users/paginateItems",
      fetchItems: "users/fetchItems",
      fetchItemsNew: "users/fetchItemsNew",
      insertUser: "users/insertNewItem",
      removeUser: "users/deleteItem",
      fetchTranslations: "translations/fetchTranslations",
    }),
    onFilter() {
      this.UserFilter = !this.UserFilter;
    },
    onUserBulkUpload() {
      this.userBulkUpload = !this.userBulkUpload;
    },
    async searchUser() {
      if (this.type == 1) {
        try {
          const data = {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
          };
          const response = await this.$axios.post("users/searchUser", data);
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
          this.removeUser(data.id);
          this.insertUser(data);
          this.selectedItems?.unshift(data);
          this.$refs.tableRef.selected?.unshift(data);
        }
      } else {
        this.$refs.pageFilter.clearInput();
      }
    },
    searchAgain() {
      this.getRecord(this.filterData);
    },
    checkSelectedTab(value) {
      this.tabItems = this.tabItems.map((item, index) => {
        index === value ? (item.isSelected = 1) : (item.isSelected = 0);
        return item;
      });
    },

    // add or remove item from selected items
    onRowClicked(item) {
      let items = new Set(this.selectedItems);
      items.has(item) ? items.delete(item) : items.add(item);
      this.selectedItems = Array.from(items);
    },

    onTableChanges(options) {
      this.fetchItems({
        key: this.getTabKey(),
        options: {
          ...options,
          ...this.filterData,
          type: this.type,
          content: this.content,
          contentData: this.contentData,
        },
      });
    },

    async getRecord(filterData) {
      try {
        const data = {
          key: this.getTabKey(),
          options: {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
            country_id: filterData.country_id,
            current_country_id: filterData.current_country_id,
            role_id: filterData.role_id,
            team_id: filterData.team_id,
            company_id: filterData.company_id,
            created_date: filterData.created_date,
            updated_date: filterData.updated_date,
            firstname: filterData.firstname,
            lastname: filterData.lastname,
            address: filterData.address,
            username: filterData.username,
            include: filterData.include,
            user_ids: filterData.user_ids,
          },
        };
        const res = await this.fetchItems(data);
      } catch (error) {
        if (error.response.status === 401) {
          redirect("/auth/signin");
        } else {
          console.error(error.response.statusText);
        }
      }
    },
    onTracing() {
      this.selectedStatus = "tracing";
      this.onSubmit(1, true);
    },

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
          `reasons/id?type=${this.selectedStatus}&sub_system=Users`
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

    // fired when on view button clicked
    onView() {
      if (this.selectedItems?.length > 1) {
        this.$toastr.i(this.$tr("select_only_one_item"));
        return;
      }
      const userId = this.selectedItems[0]?.id;
      this.viewSelectedUser(userId);
    },

    // fired on auto edit button clicked to edit multiple users
    async onAutoEdit() {
      if (this.getTabKey() === "tracing") {
        Alert.customAlert(
          this,
          "cant_change_record_status_in_tracing_tab",
          "restricted"
        );
        return;
      }
      if (this.selectedItems.length > 0) {
        this.editUserItems = [];
        const userIds = this.selectedItems.map((user) => user.id);
        const fetchedUser = await this.fetchUserDetails(userIds);
        if (fetchedUser) {
          this.editUserItems = fetchedUser;
          this.isAutoEdit = true;
          this.editDialog = !this.editDialog;
          this.editUserKey++;
          this.selectedItems = [];
        }
      }
    },

    async editSelectedUser(user) {
      this.editUserItems = [];
      const fetchedUser = await this.fetchUserDetails(user.id);
      if (fetchedUser) {
        this.editUserItems[0] = fetchedUser[0];
        this.editDialog = !this.editDialog;
        this.editUserKey++;
        this.selectedItems.splice(0, 1);
      }
    },

    // fired on edit button clicked to edit user
    async onEdit() {
      if (this.getTabKey() === "tracing") {
        Alert.customAlert(
          this,
          "cant_change_record_status_in_tracing_tab",
          "restricted"
        );
        return;
      }
      if (this.selectedItems.length > 0) {
        this.editUserItems = [];
        const user = this.selectedItems[0];

        const fetchedUser = await this.fetchUserDetails(user.id);
        if (fetchedUser) {
          this.editUserItems[0] = fetchedUser[0];
          this.editDialog = !this.editDialog;
          this.editUserKey++;
          this.selectedItems.splice(0, 1);
        }
      }
    },

    // fetch use details
    async fetchUserDetails(userIds) {
      try {
        this.showProgressBar = true;
        const response = await this.$axios.get(`users/details/${userIds}`);
        const users = response?.data?.data;
        const filteredUsers = [];
        for (const user of users) {
          const departmentsSet = [];
          const countriesSet = [];
          const selectedSystemsSet = new Set();
          const selectedSubSystemsSet = new Set();
          const companiesSet = [];
          const rolesSet = [];
          const teamsSet = [];
          const companiesSystems = [];
          const companyDepartmentTeams = [];

          // parse teams and teams departments
          for (const userTeam of user.teams) {
            if (!this.isExitsIn(userTeam.id, teamsSet)) teamsSet.push(userTeam);
            for (const department of userTeam.departments) {
              if (!this.isExitsIn(department.id, departmentsSet))
                departmentsSet.push(department);
            }
          }

          // parse user roles
          for (const userRole of user.roles) {
            if (!this.isExitsIn(userRole.id, rolesSet)) rolesSet.push(userRole);
          }

          for (const userCompany of user.companies) {
            // parse company department temas
            for (const department of userCompany.departments) {
              // parse company department temas
              for (const team of department.teams) {
                if (!this.isExitsIn(team.id, companyDepartmentTeams))
                  companyDepartmentTeams.push(team);
              }
            }

            // parse company systems
            for (const system of userCompany.systems) {
              if (!this.isExitsIn(system.id, companiesSystems))
                companiesSystems.push(system);
            }

            // parse company countries
            for (const country of userCompany.countries) {
              if (!this.isExitsIn(country.id, countriesSet))
                countriesSet.push(country);
            }

            if (!this.isExitsIn(userCompany.id, companiesSet))
              companiesSet.push({
                id: userCompany.id,
                logo: userCompany.logo,
                name: userCompany.name,
              });

            // parse company systems
            for (const permission of user.permissions) {
              selectedSubSystemsSet.add(
                `${permission.sub_system.system_id}|${permission?.sub_system_id}`
              );
              const parsedPermission = `${permission.sub_system.system_id}|${permission?.sub_system_id}|${permission?.action_id}`;
              selectedSystemsSet.add(parsedPermission);
            }
          }

          user.selectedDepartments = departmentsSet;
          user.companyDepartmentsTeams = companyDepartmentTeams;
          user.selectedCountries = countriesSet;
          user.companiesSystems = companiesSystems;
          user.selectedSystems = Array.from(selectedSystemsSet);
          user.selectedSubSystems = Array.from(selectedSubSystemsSet);
          user.selectedCompanies = companiesSet;
          user.selectedRoles = rolesSet;
          user.selectedTeams = teamsSet;
          user.permission_type = "manually";
          user.isPermissionsSkipped = true;
          let timeRange = JSON.parse(user.time_range);
          user.actualTimeRange = timeRange;
          const to = this.$tr("to");
          if (timeRange) {
            const startTime = Helper.convertTime(this, timeRange.startRange);
            const endTime = Helper.convertTime(this, timeRange.endRange);
            timeRange = `${startTime} ${to} ${endTime}`;
          }

          let dateRange = JSON.parse(user.date_range);
          user.actualDateRange = dateRange;
          if (dateRange) {
            const startDate = Helper.convertTime(this, dateRange.startRange);
            const endDate = Helper.convertTime(this, dateRange.endRange);
            dateRange = `${startDate} ${to} ${endDate}`;
          }

          user.date_range = dateRange;
          user.time_range = timeRange;

          user.generate_password = true;
          user.email_password = true;
          user.change_password = user.change_password !== 0;
          filteredUsers.push(user);
        }

        this.showProgressBar = false;
        return filteredUsers;
      } catch (e) {
        this.$toastr.e(this.$tr("something_went_wrong"));
        this.showProgressBar = false;
      }
    },

    isExitsIn(id, items) {
      for (const item of items) {
        if (item.id === id) {
          return true;
        }
      }
      return false;
    },

    // register user dialog toggle
    toggleUserRegisterDialog() {
      this.registerUserKey++;
      this.editableUser = {};
      this.isEditUser = false;
      this.userRegisterDialog = !this.userRegisterDialog;
    },

    // toggle user view dialog to show user details
    toggleViewDialog() {
      this.viewKey++;
      this.showProfile = !this.showProfile;
    },
    toggleAutoEdit() {
      this.editKey++;
      this.autoEdit = !this.autoEdit;
    },

    toggleEdit() {
      this.userEditKey++;
      this.userEdit = !this.userEdit;
    },

    // shows user details
    async viewSelectedUser(userId) {
      try {
        this.showProgressBar = true;
        const response = await this.$axios.get(`/users/${userId}`);
        this.userData = response?.data?.data;
        this.showProfile = true;
        this.viewKey++;
      } catch (error) {
        HandleException.handleApiException(this, error);
      }
      this.showProgressBar = false;
    },

    // change user status from server
    async toggleUserStatus(selectedStatus) {
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
      const itemId = this.selectedItems[0]?.id;

      try {
        this.showProgressBar = true;
        const data = {
          item_id: itemId,
          status: this.selectedStatus,
          type: "pending",
        };

        const response =
          this.selectedStatus == "removed"
            ? await this.$axios.delete(`users/${this.itemIds}`)
            : await this.$axios.post("users/changeStatus", data);

        if (response?.status === 200 && response?.data?.result) {
          Alert.successAlert(this, "successfully_" + this.selectedStatus);
          this.fetchRecentDataAndClearSelected();
        } else {
          this.$toastr.e(this.$tr("something_went_wrong"));
        }
      } catch (error) {
        if (error?.response?.status === 307 && !error?.response?.data?.result) {
          this.$toastr.e(this.$tr("user_has_no_permission"));
          this.askToAddPermissions(itemId);
        } else if (
          error?.response?.status === 406 &&
          !error?.response?.data?.result
        ) {
          this.$toastr.e(this.$tr("not_allowed_to_change_status"));
        } else {
          HandleException.handleApiException(this, error);
        }
      }
      this.showProgressBar = false;
    },

    // ask to add permissions
    askToAddPermissions(userId) {
      Alert.confirmAlert(
        this,
        () => this.editPermissions(userId),
        "",
        "info",
        "add_new_permissions"
      );
    },

    // update user permissions
    async updateUserPermisions(selectedPermisions) {
      try {
        this.isUpdatingPermissions = true;
        const user = this.permissionUser;
        const url = `users?update-permissions=true&user-id=${user.id}`;
        const systems = selectedPermisions.permissions;
        const { permissions, ...data } = selectedPermisions;
        data.permissions = systems;
        const permissionData = Helper.getFormData(data);
        const response = await this.$axios.post(url, permissionData);
        this.isUpdatingPermissions = false;
        if (response.status === 200 && response.data?.result) {
          this.togglePermissionsDialog();
          Alert.successAlert(this, "successfully_updated");
        } else {
          this.$toastr.w(this.$tr("something_went_wrong"));
        }
      } catch (error) {
        this.isUpdatingPermissions = false;
        HandleException.handleApiException(this, error);
      }
    },

    // open permission dialog to edit user permissions
    async editPermissions(userId) {
      const fetchedUser = await this.fetchUserDetails(userId);
      if (fetchedUser) {
        this.permissionUser = fetchedUser[0];
        this.permissionKey++;
        this.togglePermissionsDialog();
      }
    },

    // toggle permission dialog
    togglePermissionsDialog() {
      if (this.permissionDialog) {
        this.permissionUser = {};
      }
      this.permissionDialog = !this.permissionDialog;
    },

    async onSubmit(reasonId, isTracing = false) {
      this.showReasonDialog = false;
      try {
        this.showProgressBar = true;
        const userId = this.selectedItems[0]?.id;
        const statusData = {
          item_id: userId,
          status: this.selectedStatus,
          reason_id: reasonId,
          type: "status",
        };

        const tracingData = {
          item_id: userId,
          type: "tracing",
          tracing_status: this.getTabKey() === "active" ? 1 : 0,
        };
        if (this.getTabKey() === "tracing") {
          this.selectedStatus = "untracing";
        }
        const userData = isTracing ? tracingData : statusData;

        const response =
          this.selectedStatus == "removed"
            ? await this.$axios.delete(
                `users/${this.userIds}?reasonId=${reasonId}`
              )
            : await this.$axios.post("users/changeStatus", userData);
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
    // delete and force delete users from server
    async deleteUser(ids) {
      this.selectedStatus = "removed";
      this.userIds = ids;
      this.getTabKey() === "pending" ||
      this.getTabKey() === "deleted" ||
      this.getTabKey() === "removed"
        ? this.noReasonSubmit()
        : await this.fetchAllReasons();
    },

    getTabKey() {
      return this.tabItems[this.tabIndex]?.key;
    },

    fetchRecentDataAndClearSelected() {
      this.selectedItems = [];
      this.userIds = [];
      this.selectedStatus = "";
      this.fetchItems({
        key: this.getTabKey(),
        options: {
          ...this.filterData,
          type: this.type,
          content: this.content,
          contentData: this.contentData,
        },
      });
    },

    getSubString(value, length = 20) {
      let subText = value?.substring(0, length);
      if (value?.length > length) {
        subText += "...";
      }
      return subText;
    },
    toggleVisibleOnlineUsers() {
      this.onlineVisible = !this.onlineVisible;
      this.$refs.userAnalytic.userAnalyticsToggleVisible();
    },

    toggleDownloadPopup() {
      this.downloadDialog = !this.downloadDialog;
    },

    // close register dialog
    closeRegisterDialog() {
      this.userRegisterDialog = false;
      this.$refs.registerUserDialog.close();
    },
    unSelect(key) {
      this.selectedItems = this.selectedItems.filter(
        (data) => data.code !== key
      );
    },
    //customize columns: called from child
    saveColumnSetting(data) {
      if (data.close_form) {
        this.columnDialog = false;
        console.log("close form", data.close_form);
      }
      this.selected_header = data.selected_header;
      this.selected_column = data.selected_header.map((row) => row.id);
      this.category = ColumnHelper.getCategoryValue(
        data.selected_header,
        this.category
      );
    },
  },

  async created() {
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
    this.$root.$on("getData", (data) => {
      this.filterData = data;
    });
  },
};
</script>
<style>
.hide-scroll {
  overflow-y: unset !important;
  height: 90% !important;
}

.active-background {
  background-color: white;
  color: #3b3939 !important;
  font-weight: bolder;
}

.toggle-online-user {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 20px;
}

@media only screen and (min-width: 800px) {
  .toggle-online-user {
    right: unset;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
