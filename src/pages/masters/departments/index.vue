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
        page_name="departments"
      />
    </v-dialog>
    <v-dialog
      v-model="departmentFilter"
      persistent
      max-width="1300"
      width="1300"
      v-if="$isInScope('departments-view')"
    >
      <DepartmentFilter @close="onFilter" v-if="departmentFilter" :prevFilterData="filterData" @getRecord="getRecord" />
    </v-dialog>
    <!-- Department Bulk Upload -->
    <v-dialog v-model="departmentBulkUpload" width="1300">
      <Dialog
        persistent
        max-width="1300"
        @closeDialog="departmentBulkUpload = false"
      >
        <DepartmentBulkUpload
          v-if="departmentBulkUpload"
          :tabKey="getTabKey()"
        />
      </Dialog>
    </v-dialog>
    <v-dialog
      v-model="autoEdit"
      persistent
      width="1300"
      scrollable
      max-height="800px"
      v-if="$isInScope('departments-update')"
    >
      <DepartmentAutoEdit
        :key="editKey"
        :autoEditData.sync="autoEditData"
        @closeAutoEdit="toggleAutoEdit"
      />
    </v-dialog>
    <v-dialog
      v-model="departmentEdit"
      persistent
      width="1300"
      scrollable
      max-height="800px"
      :key="departmentEditKey"
      v-if="$isInScope('departments-update')"
    >
      <DepartmentEdit
        :key="departmentEditKey"
        :autoEditData.sync="editData"
        @onCloseDialog="toggleEdit"
      />
    </v-dialog>

    <v-dialog
      persistent
      v-model="showProfile"
      width="1300"
      class="rounded-0 custom-v-dialog"
      v-if="$isInScope('departments-view')"
    >
      <DepartmentProfile
        style="overflow-y: hidden"
        :department="departmentData"
        :dialog.sync="showProfile"
        @onEdit="editSelectedDepartment"
        @toggleShowProgress="toggleShowProgress"
      />
    </v-dialog>
    <!--    Display Register Dialog -->
    <v-dialog
      v-model="departmentRegisterDialog"
      width="1300"
      v-if="$isInScope('departments-create')"
    >
      <Dialog @closeDialog="departmentRegisterDialog = false">
        <Create
          @onToggleShowProgress="toggleShowProgress"
          @onCloseDialog="toggleDepartmentRegisterDialog"
          v-if="departmentRegisterDialog"
        />
      </Dialog>
    </v-dialog>
    <v-row no-gutters>
      <ProgressBar v-if="showProgress" />
      <v-col cols="12">
        <PageHeader
          :Icon="breadcrumb[1].icon"
          :Title="breadcrumb[1].text"
          :Breadcrumb="breadcrumb"
        />
      </v-col>
      <v-col cols="12">
        <PageFilters
          :selected_header.sync="selected_header"
          :downloadContent="getDepartments"
          :downloadDialog="downloadDialog"
          :filename="$tr('departments')"
          :content.sync="content"
          :contentT.sync="contentData"
          :selectedOption.sync="type"
          @onDownload="toggleDownload"
          @onFilter="onFilter"
          @unSelect="unSelect"
          @search="searchDepartment"
          @searchAgain="searchAgain"
          @onBulkUpload="onDepartmentBulkUpload"
          @onTypeChange="onTypeChange"
          @onColumn="
            () => {
              dialogKey++;
              columnDialog = true;
            }
          "
          ref="pageFilterRef"
          :show-bulk-upload="$isInScope('departments-create')"
          :showDownload="$isInScope('departments-view')"
          note-title="buttons.add_department_note"
        >
          <CustomButton
            @click="toggleDepartmentRegisterDialog"
            icon="fa-user-plus"
            :text="$tr('create_item', $tr('department'))"
            type="primary"
            v-if="$isInScope('departments-create')"
          />
        </PageFilters>
      </v-col>
      <!-- Department Profile -->

      <v-col cols="12">
        <!-- :selectedItems="selectedItems" -->
        <PageActions
          :tabKey="tabItems[tabIndex].key"
          @onApply="onApply"
          @onDelete="onDelete"
          @onBlock="onBlock"
          @onView="onView"
          @onAutoEdit="onAutoEdit"
          @onEdit="onEdit"
          :selectedItems.sync="selectedItems"
          :tab-key.sync="tabItems[tabIndex].key"
          @onSubmit="onSubmit"
          :reasons="allReasons"
          :showReasonDialog.sync="showReasonDialog"
          :showView="$isInScope('departments-view')"
          :showEdit="$isInScope('departments-update')"
          :showAutoEdit="$isInScope('departments-update')"
          :showDelete="$isInScope('departments-delete')"
          :showBlock="$isInScope('departments-update')"
          :showSelect="$isInScope('departments-update')"
          :showApply="$isInScope('departments-update')"
        />
      </v-col>
      <v-col cols="12">
        <DataTable
          v-model="selectedItems"
          :key="tableKey"
          :headers="selected_header"
          :loading="apiCalling"
          @onTablePaginate="onTableChanges"
          ref="departmentTableRef"
          :items="getDepartments"
          :ItemsLength="getTotals(tabItems[tabIndex].key)"
          @click:row="onRowClicked"
          :defaultCountry="false"
        >
          <template slot="customHeader">
            <v-row class="mx-0">
              <v-col cols="12" class="pa-0">
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
          <template v-slot:[`item.industry`]="{ item }">
            {{ item.industry ? item.industry.name : "" }}
          </template>
          <template v-slot:[`item.code`]="{ item }">
            <span
              @click="() => viewSelectedDepartment(item)"
              class="mx-1 primary--text font-weight-bold"
            >
              {{ item.code }}
            </span>
          </template>
          <template v-slot:[`item.note`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" style="white-space: nowrap">
                  {{ getSubString(item.note) }}
                </span>
              </template>
              <span>{{ item.note }}</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.countries`]="{ item }">
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
                <div v-if="item.companies.map((c) => c.countries)[0]">
                  <div
                    v-if="item.companies.map((c) => c.countries)[0].length > 0"
                  >
                    <p
                      v-for="country in item.companies.map(
                        (c) => c.countries
                      )[0]"
                      :key="country.index"
                      class="pb-0 mb-0"
                    >
                      {{ country.name }}
                    </p>
                  </div>
                  <div v-else>
                    <p class="pb-0 mb-0">{{ $tr("no_country") }}</p>
                  </div>
                </div>
              </v-tooltip>
            </div>
          </template>
        </DataTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomCard from "../../../components/common/CustomCard";
import IconButton from "../../../components/common/buttons/IconButton";
import HandleException from "~/helpers/handle-exception";
import Alert from "~/helpers/alert";
import { mapActions, mapGetters } from "vuex";
import Departments from "../../../configs/pages/departments";
import ProgressBar from "../../../components/common/ProgressBar";
import PageHeader from "../../../components/design/PageHeader";
import PageFilters from "../../../components/design/PageFilters";
import PageActions from "../../../components/design/PageActions";
import DataTable from "../../../components/design/DataTable";
import CustomButton from "../../../components/design/components/CustomButton";
import Create from "../../../components/masters/department/Create";
import DepartmentFilter from "../../../components/masters/department/DepartmentFilter";
import Dialog from "../../../components/design/Dialog/Dialog.vue";
import CustomizeColumn from "../../../components/customizeColumn/CustomizeColumn.vue";
import DepartmentAutoEdit from "../../../components/masters/department/DepartmentAutoEdit";
import DepartmentEdit from "../../../components/masters/department/DepartmentEdit";
import DepartmentProfile from "./DepartmentProfile";
import DepartmentBulkUpload from "../../../components/masters/department/DepartmentBulkUpload";
import ColumnHelper from "~/helpers/column-helper";

export default {
  meta: {
    hasAuth: true,
    scope: "departments-view",
  },
  async asyncData({ store }) {
    await store.dispatch("customColumns/fetchCustomColumns", {
      view_name: "departments",
    });
  },
  name: "departments",
  components: {
    DepartmentProfile,
    ProgressBar,
    IconButton,
    CustomCard,
    CustomButton,
    DataTable,
    PageActions,
    PageFilters,
    PageHeader,
    DepartmentFilter,
    Create,
    Dialog,
    CustomizeColumn,
    DepartmentAutoEdit,
    DepartmentEdit,
    DepartmentBulkUpload,
  },
  data() {
    return {
      category: Departments(this).category,
      headers: Departments(this).headers,
      breadcrumb: Departments(this).breadcrumb,
      tabItems: Departments(this).tabItems,
      selectedItems: [],
      showProgress: false,
      tableKey: 0,
      tabIndex: 0,
      options: {},
      type: 1,
      content: [],
      contentData: "",
      departmentRegisterDialog: false,
      isEditDepartment: false,
      editableDepartment: {},
      departmentFilter: false,
      filterData: {},
      profileDialog: false,
      // Page actions
      showReasonDialog: false,
      selectedStatus: "",
      itemIds: [],
      allReasons: [],
      downloadDialog: false,

      // for custom columns
      dialogKey: 0,
      columnDialog: false,
      selected_column: [],
      selected_header: [],
      showProgressBar: false,

      autoEdit: false,
      editKey: 0,
      autoEditData: [],
      departmentEdit: false,
      departmentEditKey: 0,
      editData: {},
      departmentData: null,
      showProfile: false,
      viewKey: 0,
      departmentBulkUpload: false,
    };
  },
  computed: {
    ...mapGetters({
      getDepartments: "departments/getDepartments",
      itemsTotal: "departments/itemsTotal",
      apiCalling: "departments/isApiCalling",
      getTotals: "departments/getTotal",
      custom_columns: "customColumns/get_custom_columns",
      countries: "departments/countries",
      projects: "departments/projects",
      roles: "departments/roles",
      companies: "departments/companies",
      getTranslations: "translations/getTranslations",
    }),
  },
  methods: {
    ...mapActions({
      changeRecordStatus: "departments/changeRecordStatus",
      blockRecord: "departments/blockRecord",
      deleteRecord: "departments/deleteRecord",
      fetchDepartments: "departments/fetchDepartments",
      removeDepartment: "departments/deleteItem",
      insertDepartemnt: "departments/insertNewItem",
      fetchProjects: "departments/fetchProjects",
      fetchTranslations: "translations/fetchTranslations",
    }),
    onDepartmentBulkUpload() {
      this.departmentBulkUpload = !this.departmentBulkUpload;
    },
    getSubString(value, length = 20) {
      let subText = value?.substring(0, length);
      if (value?.length > length) {
        subText += "...";
      }
      return subText;
    },
    viewSelectedDepartment(country) {
      this.departmentData = country;
      this.showProfile = !this.showProfile;
      this.viewKey++;
    },
    onTypeChange() {
      this.selectedItems = [];
    },

    async searchDepartment() {
      //if the type is (ID)
      if (this.type == 1) {
        try {
          const data = {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
          };
          this.$store.commit("departments/TOGGLE_API_CALLING", true);
          const res = await this.$axios.post(
            "departments/search-department",
            data
          );
          this.$store.commit("departments/TOGGLE_API_CALLING", false);
          this.selectData(res);
        } catch (error) {}
      }
      //if type is selected is content
      else if (this.type == 0) {
        this.getRecord(this.filterData);
      }
    },
    selectData(response) {
      if (response.status === 200) {
        const data = response.data;
        if (data != null) {
          this.removeDepartment(data.id);
          this.insertDepartemnt(data);
          this.selectedItems?.unshift(data);
          this.$refs.departmentTableRef.selected?.unshift(data);
        }
      } else {
        this.$refs.pageFilterRef.clearInput();
      }
    },

    async getRecord(filterData) {
      try {
        const data = {
          key: this.getTabKey(),
          searchData: {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
            name: filterData.name,
            country_id: filterData.country_id,
            company_id: filterData.company_id,
            created_date: filterData.created_date,
            updated_date: filterData.updated_date,
            department_ids: filterData.department_ids,
            include: filterData.include,
          },
        };
        const res = this.fetchDepartments(data);
      } catch (error) {}
    },
    getTabKey() {
      return this.tabItems[this.tabIndex].key;
    },
    // fired when on view button clicked
    onView() {
      if (this.selectedItems?.length > 1) {
        this.$toastr.i(this.$tr("select_only_one_item"));
        return;
      }
      if (this.selectedItems?.length === 0) {
        this.$toastr.i(this.$tr("please_select_an_item_first"));
        return;
      }
      this.viewSelectedDepartment(this.selectedItems[0]);
    },
    checkSelectedTab(value) {
      this.tabItems = this.tabItems.map((item, index) => {
        index === value ? (item.isSelected = 1) : (item.isSelected = 0);
        return item;
      });
    },
    onFilter() {
      this.departmentFilter = !this.departmentFilter;
    },

    searchAgain() {
      this.getRecord(this.filterData);
    },
    // register department dialog toggle
    toggleDepartmentRegisterDialog() {
      this.editableDepartment = {};
      this.isEditDepartment = false;
      this.departmentRegisterDialog = !this.departmentRegisterDialog;
    },

    onTableChanges(options) {
      let data = {
        key: this.getTabKey(),
        searchData: {
          ...options,
          ...this.filterData,
          type: this.type,
          content: this.content,
          contentData: this.contentData,
        },
      };
      // this.options.key = this.getTabKey();
      this.fetchDepartments(data);
    },

    cantChangeStatusInTabs(tabKey) {
      return this.tabItems[this.tabIndex].key === tabKey;
    },

    onRowClicked(item) {
      let items = new Set(this.selectedItems);
      items.has(item) ? items.delete(item) : items.add(item);
      this.selectedItems = Array.from(items);
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
          `reasons/id?type=${this.selectedStatus}&sub_system=Departments`
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
            ? await this.$axios.delete(`departments/${this.itemIds}`)
            : await this.$axios.post("departments/changeStatus", data);

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
                `departments/${this.itemIds}?reasonId=${reasonId}`
              )
            : await this.$axios.post("departments/changeStatus", data);

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
      this.fetchDepartments({
        key: this.getTabKey(),
        searchData: {
          ...this.filterData,
          type: this.type,
          content: this.content,
          contentData: this.contentData,
        },
      });
    },

    resetUpdateData() {
      this.isEdit = false;
      this.editRole = null;
      this.editPermissions = [];
      this.editKey++;
    },
    toggleShowProgress() {
      this.showProgress = !this.showProgress;
    },

    onSearch(term) {
      this.searchQuery = term;
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

    onAutoEdit() {
      if (this.selectedItems?.length == 0) {
        this.$toastr.i(this.$tr("please_select_a_record_first"));
        return;
      }
      this.editKey++;
      this.autoEditData = this.selectedItems;
      this.autoEdit = !this.autoEdit;
    },

    editSelectedDepartment(item) {
      this.showProfile = false;
      this.departmentEditKey++;
      this.editData = item;
      this.departmentEdit = !this.departmentEdit;
    },

    onEdit() {
      if (this.selectedItems?.length == 0) {
        this.$toastr.i(this.$tr("please_select_a_record_first"));
        return;
      }
      if (this.selectedItems?.length > 1) {
        this.$toastr.i(this.$tr("cant_do_operation_on_all_tab"));
        return;
      }
      this.departmentEditKey++;
      this.editData = this.selectedItems[0];
      this.departmentEdit = !this.departmentEdit;
    },
    toggleEdit() {
      this.selectedItems = [];
      this.departmentEditKey++;
      this.departmentEdit = !this.departmentEdit;
    },
    toggleAutoEdit() {
      this.selectedItems = [];
      this.editKey++;
      this.autoEdit = !this.autoEdit;
    },
    unSelect(key) {
      this.selectedItems = this.selectedItems.filter(
        (data) => data.code !== key
      );
    },
  },
  watch: {
    tabIndex: function (index) {
      this.checkSelectedTab(index);
      this.fetchDepartments({
        key: this.getTabKey(),
        searchData: {
          ...this.filterData,
          type: this.type,
          content: this.content,
          contentData: this.contentData,
        },
      });
      this.selectedItems = [];
      this.selectedStatus = null;
    },
  },
  async created() {
    this.fetchDepartments({
      key: this.getTabKey(),
      // searchData: {
      //   ...this?.filterData,
      //   type: this?.type,
      //   content: this?.content,
      //   contentData: this?.contentData,
      // },
    });
    this.$root.$on("getData", this.getRecord);
    this.$root.$on("getData", (data) => {
      this.filterData = data;
    });
    this.$root.$on("closeAutoEdit", this.toggleAutoEdit);
    this.$root.$on("closeEdit", this.toggleEdit);

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
  },
};
</script>

<style scoped>
.custom-v-dialog {
  overflow-y: visible;
}
</style>
