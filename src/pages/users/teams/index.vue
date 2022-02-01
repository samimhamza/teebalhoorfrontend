<template>
  <v-container fluid class="pa-0">
    <v-dialog v-model="columnDialog" persistent width="1300" class="rounded-0">
      <CustomizeColumn
        @closeDialog="columnDialog = false"
        @saveChanges="saveColumnSetting($event)"
        :tableHeader="$_.cloneDeep(headers)"
        :custom_columns="$_.cloneDeep(selected_column)"
        :categoryHeader="$_.cloneDeep(category)"
        page_name="teams"
        :key="dialogKey"
      />
    </v-dialog>
    <v-dialog
      v-model="profileDialog"
      persistent
      width="1300"
      class="custom-v-dialog"
      v-if="$isInScope('teams-view')"
    >
      <TeamProfile
        @onEdit="editSelectedTeam"
        :profileData="teamData"
        :key="profileKey"
        :dialog.sync="profileDialog"
      />
    </v-dialog>
    <v-dialog
      v-model="autoEditDialog"
      persistent
      width="1300"
      scrollable
      v-if="$isInScope('teams-update')"
    >
      <TeamAutoEdit
        v-if="autoEditDialog"
        :autoEditData="getTeamWithMetaData"
        @close="autoEditDialog = false"
        @toggleProgressBar="toggleProgressBar"
      />
    </v-dialog>

    <!-- Team / Role Bulk Upload -->
    <v-dialog v-model="teamRoleBulkUpload" width="1300">
      <Dialog
        persistent
        max-width="1300"
        @closeDialog="teamRoleBulkUpload = false"
      >
        <TeamRoleBulkUpload v-if="teamRoleBulkUpload" />
      </Dialog>
    </v-dialog>

    <v-dialog
      v-model="editDialog"
      persistent
      width="1300"
      scrollable
      max-height="800px"
      v-if="$isInScope('teams-update')"
    >
      <TeamEdit
        ref="edit_dialog"
        @toggleProgressBar="toggleProgressBar"
        :editData="getTeamWithMetaData[0]"
        @close="editDialog = false"
        v-if="editDialog"
      />
    </v-dialog>
    <v-dialog
      v-model="TeamFilter"
      persistent
      max-width="1300"
      width="1300"
      v-if="$isInScope('teams-view')"
    >
      <TeamFilter
        @close="onFilter"
        v-if="TeamFilter"
        :prevFilterData="filterData"
        :departments="getDepartments"
        @getRecord="getRecord"
      />
    </v-dialog>
    <v-dialog
      v-model="registerDialog"
      persistent
      width="1300"
      scrollable
      v-if="$isInScope('teams-create')"
    >
      <Dialog @closeDialog="toggleTeamRoleRegistration">
        <TeamRoleRegistration
          ref="team_role_registration"
          @close="toggleTeamRoleRegistration"
          @toggleProgressBar="toggleProgressBar"
          :tabKey="tabItems[tabIndex].key"
        />
      </Dialog>
    </v-dialog>
    <v-row no-gutters>
      <ProgressBar v-if="showProgressBar" />

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
          :downloadContent="getTeams"
          @onDownload="() => (downloadDialog = !downloadDialog)"
          :downloadDialog="downloadDialog"
          :filename="$tr('team_list')"
          @onColumn="
            () => {
              this.dialogKey++;
              this.columnDialog = true;
            }
          "
          note-title="add_team_note"
          :content.sync="content"
          :contentT.sync="contentData"
          :selectedOption.sync="type"
          @onFilter="onFilter"
          @unSelect="unSelect"
          @search="searchTeam"
          @searchAgain="searchAgain"
          :show-add-note="$isInScope('teams-create')"
          :show-bulk-upload="$isInScope('teams-create')"
          @onTypeChange="onTypeChange"
          :showDownload="$isInScope('teams-view')"
          @onBulkUpload="onTeamRoleBulkUpload"
        >
          <CustomButton
            @click="registerDialog = true"
            icon="fa-plus"
            text="create_team"
            type="primary"
            v-if="$isInScope('teams-create')"
          />
        </PageFilters>
      </v-col>
      <v-col cols="12">
        <PageActions
          :showView="$isInScope('teams-view')"
          :showEdit="$isInScope('teams-update')"
          :showAutoEdit="$isInScope('teams-update')"
          :showBlock="$isInScope('teams-update')"
          :showDelete="$isInScope('teams-delete')"
          :showSelect="$isInScope('teams-update')"
          :showApply="$isInScope('teams-update')"
          :selectedItems="selectedItems"
          :tab-key.sync="tabItems[tabIndex].key"
          @onView="onView"
          @onEdit="onEdit"
          @onAutoEdit="onAutoEdit"
          @onDelete="onDelete"
          @onApply="onApply"
          @onSubmit="onSubmit"
          @onBlock="onBlock"
          :reasons="allReasons"
          :showReasonDialog.sync="showReasonDialog"
        />
      </v-col>
      <v-col cols="12">
        <DataTable
          v-model="selectedItems"
          ref="tableRef"
          :headers="selected_header"
          :items="getTeams"
          :loading="apiCalling"
          @click:row="onRowClicked"
          :ItemsLength="getTotal(tabItems[tabIndex].key)"
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

          <!----------    DATATABLE Countries SECTION        ---------->
          <template v-slot:[`item.department_company_country`]="{ item }">
            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span
                    v-bind="attrs"
                    v-on="on"
                    style="white-space: nowrap"
                    class="primary--text"
                  >
                    {{ $tr("countries") }}
                  </span>
                </template>
                <div v-if="item.department_company_country">
                  <div v-if="item.department_company_country.length > 0">
                    <p
                      v-for="country in getTeamsCountries(
                        item.department_company_country
                      )"
                      :key="country.index"
                      class="pb-0 mb-0"
                    >
                      {{ country }}
                    </p>
                  </div>
                  <div v-else>
                    <p class="pb-0 mb-0">{{ $tr("noCountry") }}</p>
                  </div>
                </div>
              </v-tooltip>
            </div>
          </template>
          <template v-slot:[`item.code`]="{ item }">
            <span
              @click="() => viewSelectedTeam(item)"
              class="mx-1 primary--text font-weight-bold"
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
import ProgressBar from "~/components/common/ProgressBar.vue";
import PageHeader from "~/components/design/PageHeader.vue";
import PageFilters from "~/components/design/PageFilters";
import PageActions from "~/components/design/PageActions";
import DataTable from "~/components/design/DataTable";
import Teams from "~/configs/pages/teams";
import CustomButton from "~/components/design/components/CustomButton";
import TeamRoleRegistration from "~/components/users/team/TeamRoleRegistration.vue";
import TeamProfile from "~/components/users/team/TeamProfile.vue";
import Dialog from "~/components/design/Dialog/Dialog";
import CustomizeColumn from "~/components/customizeColumn/CustomizeColumn.vue";
import TeamAutoEdit from "~/components/users/team/TeamAutoEdit.vue";
import TeamFilter from "~/components/users/team/TeamFilter.vue";
import TeamEdit from "~/components/users/team/TeamEdit.vue";
import HandleException from "~/helpers/handle-exception";
import Alert from "../../../helpers/alert";
import TeamRoleBulkUpload from "~/components/users/TeamRoleBulkUpload";
import ColumnHelper from "~/helpers/column-helper";

export default {
  meta: {
    hasAuth: true,
    scope: "teams-view",
  },
  async asyncData({ store }) {
    await store.dispatch("customColumns/fetchCustomColumns", {
      view_name: "teams",
    });

    await store.dispatch("teams/fetchTeams", {
      key: "all",
      options: {
        ...this?.filterData,
        type: this?.type,
        content: this?.content,
        contentData: this?.contentData,
      },
    });
    await store.dispatch("departments/fetchDepartments", {
      key: "all",
      searchData: null,
    });
  },
  name: "Team",
  components: {
    TeamProfile,
    Dialog,
    CustomButton,
    DataTable,
    PageActions,
    PageFilters,
    PageHeader,
    ProgressBar,
    TeamRoleRegistration,
    CustomizeColumn,
    TeamAutoEdit,
    TeamFilter,
    TeamEdit,
    TeamRoleBulkUpload,
  },

  data() {
    return {
      category: Teams(this).category,
      tabItems: Teams(this).tabItems,
      headers: Teams(this).headers,
      breadcrumb: Teams(this).breadcrumb,
      registerDialog: false,
      profileDialog: false,

      // Profile
      profileKey: 0,
      teamData: {},

      selectedItems: [],
      tabIndex: 0,
      downloadDialog: false,
      // for custom columns
      dialogKey: 0,
      columnDialog: false,
      selected_column: [],
      selected_header: [],
      showProgressBar: false,
      type: 1,
      content: [],
      contentData: "",

      downloadDialog: false,

      // auto edit
      editTeamItems: [],
      isAutoEdit: false,
      editDialog: false,
      autoEditDialog: false,

      // Page actions
      showReasonDialog: false,
      selectedStatus: "",
      itemIds: [],
      allReasons: [],

      TeamFilter: false,
      filterData: "",

      autoEdit: false,
      editKey: 0,
      autoEditData: [],
      teamEdit: false,
      teamEditKey: 0,
      teamRoleBulkUpload: false,
    };
  },

  computed: {
    ...mapGetters({
      getTranslations: "translations/getTranslations",
      apiCalling: "teams/isApiCalling",
      getTeams: "teams/getTeams",
      getTotal: "teams/getTotal",
      custom_columns: "customColumns/get_custom_columns",
      getReasons: "reasons/get_reason",
      getDepartments: "departments/getDepartments",
      getTeamWithMetaData: "filterData/getteamsWithMetaData",
    }),
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
    this.$root.$on("getData", (data) => {
      this.filterData = data;
    });
  },
  watch: {
    tabIndex: function (value) {
      this.selectedItems = [];
      this.checkSelectedTab(value);
      this.fetchTeams({
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

  methods: {
    ...mapActions({
      fetchTranslations: "translations/fetchTranslations",
      fetchTeamMetaData: "filterData/fetchTeamMetaDataForEdit",
      fetchTeams: "teams/fetchTeams",
      removeTeam: "teams/removeItem",
      insertTeam: "teams/insertNewItem",
      fetchcountries: "countries/fetchCountriesWithCompanies",
    }),
    onTeamRoleBulkUpload() {
      this.teamRoleBulkUpload = !this.teamRoleBulkUpload;
    },
    viewSelectedTeam(item) {
      this.teamData = item;
      this.profileDialog = true;
      this.profileKey++;
    },

    onView() {
      if (this.selectedItems.length === 1) {
        this.teamData = this.selectedItems[0];
        this.profileDialog = true;
        this.profileKey++;
      } else {
        this.$toastr.w(this.$tr("view_item_max_limit_text"));
      }
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
          `reasons/id?type=${this.selectedStatus}&sub_system=Teams`
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
            ? await this.$axios.delete(`teams/${this.itemIds}`)
            : await this.$axios.post("teams/changeStatus", data);

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
                `teams/${this.itemIds}?reasonId=${reasonId}`
              )
            : await this.$axios.post("teams/changeStatus", data);

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
      this.fetchTeams({
        key: this.getTabKey(),
        options: {
          ...this.filterData,
          type: this.type,
          content: this.content,
          contentData: this.contentData,
        },
      });
    },

    onRowClicked(item) {
      let items = new Set(this.selectedItems);
      items.has(item) ? items.delete(item) : items.add(item);
      this.selectedItems = Array.from(items);
    },

    toggleDownloadPopup() {
      this.downloadDialog = !this.downloadDialog;
    },

    onTableChanges(options) {
      const newOptions = {
        ...options,
        ...this.filterData,
        type: this.type,
        content: this.content,
        contentData: this.contentData,
      };
      let data = {
        key: this.getTabKey(),
        options: newOptions,
      };
      this.fetchTeams(data);
    },

    checkSelectedTab(value) {
      this.tabItems = this.tabItems.map((item, index) => {
        index === value ? (item.isSelected = 1) : (item.isSelected = 0);
        return item;
      });
    },

    getTabKey() {
      return this.tabItems[this.tabIndex]?.key;
    },

    onFilter() {
      this.TeamFilter = !this.TeamFilter;
    },
    async searchTeam() {
      if (this.type == 1) {
        try {
          const data = {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
          };
          const response = await this.$axios.post("teams/searchTeam", data);
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
          this.removeTeam(data.id);
          this.insertTeam(data);
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
            team_ids: filterData.team_ids,
          },
        };
        const res = await this.fetchTeams(data);
      } catch (error) {
        if (error.response.status === 401) {
          redirect("/auth/signin");
        } else {
          console.error(error.response.statusText);
        }
      }
    },

    async editSelectedTeam(item) {
      this.toggleProgressBar();
      await this.fetchTeamMetaData([item.id]);
      this.editDialog = !this.editDialog;
      this.toggleProgressBar();
      this.profileDialog = false;
    },

    async onEdit() {
      if (this.selectedItems.length > 1) {
        this.$toastr.w(this.$tr("edit_item_max_limit_text"));
      } else {
        this.toggleProgressBar();
        await this.fetchTeamMetaData([this.selectedItems[0].id]);
        await this.fetchcountries();
        this.editDialog = !this.editDialog;
        this.toggleProgressBar();
      }
    },
    async onAutoEdit() {
      this.toggleProgressBar();
      await this.fetchTeamMetaData(this.selectedItems.map((item) => item.id));
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

    getTeamsCountries(data) {
      const countrySet = new Set();
      const companySet = new Set();
      const departmentSet = new Set();
      data.forEach((dep) => {
        departmentSet.add(dep.name);
        dep.companies.forEach((com) => {
          companySet.add(com.name);
          com.countries.forEach((count) => {
            countrySet.add(count.name);
          });
        });
      });
      return Array.from(countrySet);
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
      }
      this.selected_header = data.selected_header;
      this.selected_column = data.selected_header.map((row) => row.id);
      this.category = ColumnHelper.getCategoryValue(
        data.selected_header,
        this.category
      );
    },
    // =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  },
};
</script>

<style scoped>
.custom-v-dialog {
  overflow-y: visible;
}
</style>
