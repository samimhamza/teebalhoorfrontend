<template>
  <v-container fluid class="pa-0">
    <v-dialog v-model="columnDialog" persistent width="1300" class="rounded-0">
      <CustomizeColumn
        @closeDialog="columnDialog = false"
        @saveChanges="saveColumnSetting($event)"
        :tableHeader="$_.cloneDeep(headers)"
        :custom_columns="$_.cloneDeep(selected_column)"
        :categoryHeader="$_.cloneDeep(category)"
        :key="dialogKey"
        page_name="projects"
      />
    </v-dialog>
    <!-- Company Bulk Upload -->
    <v-dialog v-model="companyBulkUpload" width="1300">
      <Dialog
        persistent
        max-width="1300"
        @closeDialog="companyBulkUpload = false"
      >
        <CompanyBulkUpload
          :countries="getCountries"
          :labels="getLabels"
          :systems="getSystems"
          :tabKey="getTabKey()"
          v-if="companyBulkUpload"
        />
      </Dialog>
    </v-dialog>
    <!--    Register Company Section -->
    <v-dialog
      v-model="registerDialog"
      persistent
      width="1300"
      class="max-height-register-model"
      scrollable
      v-if="$isInScope('companies-create')"
    >
      <Dialog @closeDialog="closeRegisterDialog">
        <RegisterCompany
          :countries="getCountries"
          :labels="getLabels"
          :systems="getSystems"
          ref="registerCompany"
        />
      </Dialog>
    </v-dialog>
    <ProgressBar v-if="showProgressBar" />
    <!-- Company Profile Section -->
    <v-dialog
      v-model="showProfile"
      persistent
      width="1300"
      scrollable
      v-if="$isInScope('companies-view')"
    >
      <CompanyProfile
        :dialog.sync="showProfile"
        @onEdit="editSelectedCompany"
        :profileData="profileData"
      />
    </v-dialog>
    <v-dialog
      v-model="autoEdit"
      persistent
      width="1300"
      scrollable
      max-height="800px"
      v-if="$isInScope('companies-update')"
    >
      <CompanyAutoEdit
        v-if="autoEdit"
        :autoEditData="autoEditData"
        :countries="getCountries"
        :labels="getLabels"
        :systems="getSystems"
      />
    </v-dialog>

    <v-dialog
      v-model="companyEdit"
      @toggleProgressBar="toggleProgressBar"
      persistent
      width="1300"
      scrollable
      v-if="$isInScope('companies-update')"
    >
      <CompanyEdit
        :key="companyEditKey"
        :autoEditData="editData"
        :selectedItems="selectedItems"
        :countries="getCountries"
        :labels="getLabels"
        :systems="getSystems"
      />
    </v-dialog>
    <v-dialog
      v-model="companyFilter"
      persistent
      max-width="1300"
      width="1300"
      v-if="$isInScope('companies-view')"
    >
      <CompanyFilter
        @close="onFilter"
        :countries="getCountries"
        :labels="getLabels"
        :systems="getSystems"
        v-if="companyFilter"
        :prevFilterData="filterData"
        @getRecord="getRecord"
      />
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
          ref="pageFilterRef"
          :selected_header.sync="selected_header"
          :downloadContent="companies"
          :downloadDialog="downloadDialog"
          :filename="'companies'"
          :content.sync="content"
          :contentT.sync="contentData"
          :selectedOption.sync="type"
          @onDownload="toggleDownload"
          @onFilter="onFilter"
          @unSelect="unSelect"
          @search="searchProject"
          @searchAgain="searchAgain"
          @onBulkUpload="onCompanyBulkUpload"
          @onColumn="
            () => {
              dialogKey++;
              columnDialog = true;
            }
          "
          note-title="buttons.add_project_note"
          :show-add-note="$isInScope('companies-create')"
          :show-bulk-upload="$isInScope('companies-create')"
          :showDownload="$isInScope('companies-view')"
        >
          <CustomButton
            v-if="$isInScope('companies-create')"
            icon="fa-plus"
            @click="registerDialog = true"
            :text="$tr('create_company')"
            type="primary"
          />
        </PageFilters>
      </v-col>
      <v-col cols="12">
        <PageActions
          :showView="$isInScope('companies-view')"
          :showEdit="$isInScope('companies-update')"
          :showAutoEdit="$isInScope('companies-update')"
          :showDelete="$isInScope('companies-delete')"
          :showBlock="$isInScope('companies-update')"
          :showSelect="$isInScope('companies-update')"
          :showApply="$isInScope('companies-update')"
          :selectedItems.sync="selectedItems"
          :tab-key.sync="tabItems[tabIndex].key"
          @onView="onView"
          @onAutoEdit="onAutoEdit"
          @onDelete="onDelete"
          @onApply="onApply"
          @onSubmit="onSubmit"
          @onBlock="onBlock"
          :reasons="allReasons"
          :showReasonDialog.sync="showReasonDialog"
          @onEdit="onEdit"
        />
      </v-col>
      <v-col cols="12">
        <DataTable
          ref="projectTableRef"
          :headers="selected_header"
          :items="companies"
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
                        v-text="getTotals(tabItems[i].key)"
                      />
                    </v-tab>
                  </client-only>
                </v-tabs>
              </v-col>
            </v-row>
          </template>
          <template v-slot:[`item.created_by`]="{ item }">
            {{
              item.created_by
                ? item.created_by.firstname + item.created_by.lastname
                : ""
            }}
          </template>
          <template v-slot:[`item.updated_by`]="{ item }">
            {{
              item.updated_by
                ? item.updated_by.firstname + item.updated_by.lastname
                : ""
            }}
          </template>
          <template v-slot:[`item.label`]="{ item }">
            {{ item.label ? item.label.title : "" }}
          </template>
          <template v-slot:[`item.code`]="{ item }">
            <span
              @click="() => viewSelectedCompany(item)"
              class="mx-1 primary--text font-weight-bold"
            >
              {{ item.code }}
            </span>
          </template>
        </DataTable>

        <h1></h1>
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
import CompanyAutoEdit from "../../../components/companies/CompanyAutoEdit.vue";
import CustomButton from "../../../components/design/components/CustomButton.vue";
import DataTable from "../../../components/design/DataTable.vue";
import Dialog from "../../../components/design/Dialog/Dialog.vue";
import PageActions from "../../../components/design/PageActions.vue";
import PageFilters from "../../../components/design/PageFilters.vue";
import PageHeader from "../../../components/design/PageHeader.vue";
import CompanyEdit from "../../../components/companies/CompanyEdit.vue";
import CompanyFilter from "../../../components/companies/CompanyFilter.vue";
import CompanyProfile from "../../../components/masters/CompanyProfile.vue";
import RegisterCompany from "../../../components/companies/RegisterCompany.vue";
import Projects from "../../../configs/pages/projects";
import HandleException from "~/helpers/handle-exception";
import Alert from "../../../helpers/alert";
import ProgressBar from "../../../components/common/ProgressBar.vue";
import CustomizeColumn from "../../../components/customizeColumn/CustomizeColumn.vue";
import CompanyBulkUpload from "../../../components/companies/CompanyBulkUpload";
import ColumnHelper from "~/helpers/column-helper";

export default {
  meta: {
    hasAuth: true,
    scope: "companies-view",
  },
  async asyncData({ store }) {
    await store.dispatch("customColumns/fetchCustomColumns", {
      view_name: "projects",
    });
    await store.dispatch("companies/fetchCompanies", {
      key: "all",
      // options: {
      //   ...this?.filterData,
      //   type: this?.type,
      //   content: this?.content,
      //   contentData: this?.contentData,
      // },
    });
    await store.dispatch("countries/fetchAscCountries");
    await store.dispatch("systems/fetchItems", "systems");
  },
  components: {
    CompanyFilter,
    ProgressBar,
    PageActions,
    CustomButton,
    CompanyProfile,
    CompanyEdit,
    PageHeader,
    PageFilters,
    RegisterCompany,
    Dialog,
    DataTable,
    CompanyAutoEdit,
    CustomizeColumn,
    CompanyBulkUpload,
  },

  data() {
    return {
      getLabels: [],
      category: Projects(this).category,
      headers: Projects(this).headers,
      tabItems: Projects(this).tabItems,
      breadcrumb: Projects(this).breadcrumb,
      selectedItems: [],
      showProgress: false,
      tableKey: 0,
      tabIndex: 0,
      selectedStatus: null,
      options: {},
      companyBulkUpload: false,
      //register section
      registerDialog: false,

      downloadDialog: false,

      // profile section
      showProfile: false,

      // for custom columns
      dialogKey: 0,
      columnDialog: false,

      // Page actions
      showReasonDialog: false,
      selectedStatus: "",
      itemIds: [],
      allReasons: [],

      // Logo Overly
      isPreview: false,
      timer: null,

      selected_column: [],
      selected_header: [],
      showProgressBar: false,
      autoEdit: false,
      editKey: 0,
      autoEditData: [],
      selectedItems: [],
      type: 1,
      content: [],
      contentData: "",

      companyFilter: false,
      filterData: "",
      profileData: {},

      companyEdit: false,
      companyEditKey: 0,
      editData: {},
      bulkUploadDialog: false,
    };
  },

  watch: {
    tabIndex: function (value) {
      this.checkSelectedTab(value);
      this.fetchCompanies({
        key: this.getTabKey(),
        options: {
          ...this?.filterData,
          type: this?.type,
          content: this?.content,
          contentData: this?.contentData,
        },
      });
    },
  },

  computed: {
    ...mapGetters({
      getTranslations: "translations/getTranslations",
      companies: "companies/getCompanies",
      itemsTotal: "companies/itemsTotal",
      apiCalling: "companies/isApiCalling",
      getTotals: "companies/getTotal",
      custom_columns: "customColumns/get_custom_columns",
      getCountries: "countries/getAscCountries",
      getSystems: "systems/items",
    }),
  },

  async mounted() {
    try {
      const sub_system = "Companies";
      const response = await this.$axios.get(`labels/id`, {
        params: { sub_system: sub_system },
      });
      this.getLabels = response?.data?.labels;
    } catch (error) {
      if (error?.response?.status === 404 && !error?.response?.data?.result) {
        this.$toastr.w(this.$tr("sub_system_not_found"));
      }
    }
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

    this.$root.$on("closeAutoEdit", this.toggleAutoEdit);
    this.$root.$on("closeEdit", this.toggleEdit);
    this.$root.$on("getData", (data) => {
      this.filterData = data;
    });
  },

  methods: {
    ...mapActions({
      fetchTranslations: "translations/fetchTranslations",
      fetchCompanies: "companies/fetchCompanies",
      changeRecordStatus: "projects/changeRecordStatus",
      fetchAscCountries: "countries/fetchAscCountries",
      fetchReasons: "reasons/fetchReason",
      deleteItem: "companies/deleteItem",
      insertNewItem: "companies/insertNewItem",
    }),
    onCompanyBulkUpload() {
      this.companyBulkUpload = !this.companyBulkUpload;
    },
    toggleProgressBar() {
      this.showProgressBar = !this.showProgressBar;
    },
    onItemsSelect(items) {
      this.selectedItems = items;
    },
    onTableChanges(options) {
      this.tableKey++;
      this.fetchCompanies({
        key: this.getTabKey(),
        options: options,
        options: {
          ...options,
          ...this.filterData,
          type: this.type,
          content: this.content,
          contentData: this.contentData,
        },
      });
    },
    closeRegisterDialog() {
      this.registerDialog = false;
      this.$refs.registerCompany.closeRegisterDialog();
    },
    checkSelectedTab(value) {
      this.tableKey++;
      this.selectedItems = [];
      this.tabItems = this.tabItems.map((item, index) => {
        index === value ? (item.isSelected = 1) : (item.isSelected = 0);
        return item;
      });
    },
    getTabKey() {
      return this.tabItems[this.tabIndex].key;
    },

    onView() {
      if (this.selectedItems.length == 1) {
        this.profileData = this.selectedItems[0];
        this.showProfile = true;
      } else {
        this.$toastr.w(this.$tr("view_item_max_limit_text"));
      }
    },

    //      ******************    Preview Logo      *******************
    async previewLogo() {
      let vm = this;
      vm.isPreview = false;
      if (vm.timer) {
        await clearTimeout(vm.timer);
        vm.timer = null;
      }
      vm.timer = await setTimeout(function () {
        vm.isPreview = true;
      }, 800);
    },

    async leaveMouse() {
      if (this.timer) {
        await clearTimeout(this.timer);
        this.isPreview = false;
        this.timer = null;
      }
    },

    toggleDownload() {
      this.downloadDialog = !this.downloadDialog;
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
          `reasons/id?type=${this.selectedStatus}&sub_system=Companies`
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
            ? await this.$axios.delete(`companies/${this.itemIds}`)
            : await this.$axios.post("companies/changeStatus", data);

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
                `companies/${this.itemIds}?reasonId=${reasonId}`
              )
            : await this.$axios.post("companies/changeStatus", data);

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
      this.fetchCompanies({
        key: this.getTabKey(),
        options: {
          ...this.filterData,
          type: this.type,
          content: this.content,
          contentData: this.contentData,
        },
      });
    },

    async viewSelectedCompany(item) {
      this.profileData = item;
      this.showProfile = true;
    },

    editSelectedCompany(item) {
      this.showProfile = false;
      this.companyEditKey++;
      this.editData = item;
      this.companyEdit = !this.companyEdit;
    },

    //customize columns: called from child
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

    onFilter() {
      this.companyFilter = !this.companyFilter;
    },
    async searchProject() {
      if (this.type == 1) {
        try {
          const data = {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
          };
          const response = await this.$axios.post(
            "companies/searchCompany",
            data
          );
          this.selectData(response);
        } catch (error) {}
      } else if (this.type == 0) {
        this.getRecord(this.filterData);
      }
    },
    selectData(response) {
      if (response.status === 200) {
        const data = response.data;
        if (data != null) {
          this.deleteItem(data.id);
          this.insertNewItem(data);
          this.selectedItems?.unshift(data);
          this.$refs.projectTableRef.selected?.unshift(data);
        }
      } else {
        this.$refs.pageFilterRef.clearInput();
      }
    },
    searchAgain() {
      this.getRecord(this.filterData);
    },
    onRowClicked(item) {
      let items = new Set(this.selectedItems);
      items.has(item) ? items.delete(item) : items.add(item);
      this.selectedItems = Array.from(items);
    },

    async getRecord(filterData) {
      try {
        const data = {
          key: this.getTabKey(),
          options: {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
            name: filterData.name,
            country_id: filterData.country_id,
            label_id: filterData.label_id,
            system_id: filterData.system_id,
            investment_type: filterData.investment_type,
            created_date: filterData.created_date,
            updated_date: filterData.updated_date,
            include: filterData.include,
            ids: filterData.ids,
          },
        };
        // this.apiCalling = true;
        const res = await this.fetchCompanies(data);
        // this.apiCalling = false;
      } catch (error) {
        if (error.response.status === 401) {
          redirect("/auth/signin");
        } else {
          console.error(error.response.statusText);
        }
      }
    },
    onAutoEdit() {
      this.editKey++;
      this.autoEditData = this.selectedItems;
      this.autoEdit = !this.autoEdit;
    },
    toggleAutoEdit() {
      // this.editKey++;
      this.autoEdit = !this.autoEdit;
      this.selectedItems = [];
    },
    onEdit() {
      this.companyEditKey++;
      this.editData = this.selectedItems[0];
      this.companyEdit = !this.companyEdit;
    },
    toggleEdit() {
      this.companyEditKey++;
      this.companyEdit = !this.companyEdit;
      this.selectedItems = [];
    },
    toggleBulkUpload() {
      this.bulkUploadDialog = !this.bulkUploadDialog;
    },
    unSelect(key) {
      this.selectedItems = this.selectedItems.filter(
        (data) => data.code !== key
      );
    },
    // =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  },
};
</script>
