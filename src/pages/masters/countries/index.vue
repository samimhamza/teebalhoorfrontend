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
        page_name="countries"
      />
    </v-dialog>

    <v-dialog
      v-model="countryFilter"
      persistent
      max-width="1300"
      width="1300"
      v-if="$isInScope('countries-view')"
    >
      <CountryFilter @close="onFilter" v-if="countryFilter" :prevFilterData="filterData" @getRecord="getRecord" />
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
          ref="pageFilterRef"
          :selected_header.sync="selected_header"
          :downloadContent="Countries"
          :downloadDialog="downloadDialog"
          :filename="$tr('countries')"
          :show-add-note="true"
          :content.sync="content"
          :contentT.sync="contentData"
          :selectedOption.sync="type"
          @onFilter="onFilter"
          @unSelect="unSelect"
          :showFilter="true"
          :showDownload="$isInScope('countries-view')"
          note-title="add_country_note"
          @search="searchCountries"
          @searchAgain="searchAgain"
          @onKeyUp="onKeyUp"
          @onDownload="toggleDownload"
          @onToggleSearchType="onToggleSearchType"
          @onTypeChange="onTypeChange"
          @onColumn="
            () => {
              dialogKey++;
              columnDialog = true;
            }
          "
          @onBulkUpload="uploadDialog = true"
        />
      </v-col>
      <v-col cols="12">
        <PageActions
          :selectedItems="selectedItems"
          :tab-key.sync="tabItems[tabIndex].key"
          @onSubmit="onSubmit"
          @onBlock="onBlock"
          :showReasonDialog.sync="showReasonDialog"
          :showAutoEdit="false"
          :reasons="allReasons"
          :showTracing="false"
          :showEdit="false"
          :showView="false"
          :showDelete="false"
          :showBlock="$isInScope('countries-update')"
          :showSelect="$isInScope('countries-update')"
          :showApply="$isInScope('countries-update')"
          @onApply="onApply"
        />
      </v-col>
      <v-col cols="12">
        <DataTable
          :key="tableKey"
          v-model="selectedItems"
          :headers="selected_header"
          :ItemsLength="getTotals(tabItems[tabIndex].key)"
          :items="Countries"
          :loading="apiCalling"
          @click:row="onRowClicked"
          @current-data="currentData"
          @onTablePaginate="onTableChanges"
          ref="countryTableRef"
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
          <template v-slot:[`item.code`]="{ item }">
            <span class="mx-1 primary--text font-weight-bold">
              {{ item.code }}
            </span>
          </template>
          <template v-slot:[`item.iso2`]="{ item }">
            <FlagIcon :flag="item.iso2.toLowerCase()" :round="true" />
          </template>
          <template v-slot:[`item.timezones`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span
                  v-bind="attrs"
                  v-on="on"
                  style="white-space: nowrap"
                  class="primary--text"
                >
                  {{ $tr("timezones") }}
                </span>
              </template>
              <div
                v-for="(timezone, key) in JSON.parse(item.timezones)"
                :key="key"
              >
                <span class="pe-1">{{ timezone.zoneName }},</span>
                <span class="pe-1">{{ timezone.gmtOffsetName }},</span>
                <span class="pe-1">{{ timezone.abbreviation }},</span>
                <span class="pe-1">{{ timezone.tzName }}</span>
              </div>
            </v-tooltip>
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
import Countries from "../../../configs/pages/countries";
import ProgressBar from "../../../components/common/ProgressBar";
import PageHeader from "../../../components/design/PageHeader";
import PageFilters from "../../../components/design/PageFilters";
import PageActions from "../../../components/design/PageActions";
import DataTable from "../../../components/design/DataTable";
import CustomButton from "../../../components/design/components/CustomButton";
import CustomizeColumn from "../../../components/customizeColumn/CustomizeColumn.vue";

// import Bulk upload component
import BulkUpload from "../../../components/common/BulkUpload";
import readXlsxFile from "read-excel-file";
import FlagIcon from "../../../components/common/FlagIcon.vue";
import CountryFilter from "../../../components/countries/CountryFilter.vue";
import ColumnHelper from "~/helpers/column-helper";

export default {
  meta: {
    hasAuth: true,
    scope: "countries-view",
  },
  name: "countries",
  components: {
    ProgressBar,
    IconButton,
    CustomCard,
    currentItems: [],
    CustomButton,
    DataTable,
    PageActions,
    PageFilters,
    PageHeader,
    CustomizeColumn,
    BulkUpload,
    FlagIcon,
    CountryFilter,
  },

  async asyncData({ store }) {
    await store.dispatch("countries/fetchCountries", {
      key: "all",
      countriesHasCompanies: "true",
      ...this?.filterData,
      type: this?.type,
      content: this?.content,
      contentData: this?.contentData,
    });
    await store.dispatch("customColumns/fetchCustomColumns", {
      view_name: "countries",
    });
  },

  data() {
    return {
      category: Countries(this).category,
      headers: Countries(this).headers,
      breadcrumb: Countries(this).breadcrumb,
      tabItems: Countries(this).tabItems,
      type: 1,
      selectedItems: [],
      showProgress: false,
      tableKey: 0,
      tabIndex: 0,
      statuses: ["active", "blocked"],

      // page actions
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
      // Bulk upload flag
      uploadDialog: false,
      files: null,
      bulkData: [],
      type: 1,
      content: [],
      contentData: "",
      filterData: {},
      countryFilter: false,
    };
  },
  computed: {
    ...mapGetters({
      getTranslations: "translations/getTranslations",
      Countries: "countries/getCountries",
      itemsTotal: "countries/itemsTotal",
      apiCalling: "countries/isApiCalling",
      getTotals: "countries/getTotal",
      custom_columns: "customColumns/get_custom_columns",
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
  methods: {
    ...mapActions({
      fetchTranslations: "translations/fetchTranslations",
      fetchCountries: "countries/fetchCountries",
      changeRecordStatus: "countries/changeRecordStatus",
      blockRecord: "countries/blockRecord",
      deleteRecord: "countries/deleteRecord",
      fetchReasons: "reasons/fetchReason",
      deleteItem: "countries/deleteItem",
      insertNewItem: "countries/insertNewItem",
    }),
    // Bulk upload methods
    timezoneJsonParse(data) {
      return JSON.parse(data.timezones);
    },
    onFilter() {
      this.countryFilter = !this.countryFilter;
    },
    onDownload() {
      const url = "http://localhost:8000/excelFiles/countries.xlsx";
      window.location.href = url;
    },
    onUpload(file) {
      readXlsxFile(file).then((data) => {
        this.bulkData = data;
        try {
          this.$axios
            .post(`bulk-upload-countries`, {
              data: this.bulkData,
            })
            .then((data) => {
              this.uploadDialog = false;
              this.files = null;
            });
        } catch (error) {
          console.log(error);
        }
      });
    },
    prepareData(datas) {},
    checkSelectedTab(value) {
      this.tabItems = this.tabItems.map((item, index) => {
        index === value ? (item.isSelected = 1) : (item.isSelected = 0);
        return item;
      });
    },

    toggleDownload() {
      this.downloadDialog = !this.downloadDialog;
    },

    onTableChanges(options) {
      let data = {
        ...options,
        ...this.filterData,
        type: this.type,
        content: this.content,
        contentData: this.contentData,
      };
      data.key = this.getTabKey();
      data.countriesHasCompanies = true;
      data.countriesHasCompanies = "true";
      this.fetchCountries(data);
    },

    getTabKey() {
      return this.tabItems[this.tabIndex]?.key;
    },
    currentData(e) {
      this.currentItems = e;
    },

    onToggleSearchType(query_option) {
      // console.log(query_option);
    },

    async onKeyUp(query) {
      // this.toggleShowProgress();
      try {
        const response = await this.$axios.get(`countries`, { query });
        if (response?.status === 200 && response?.data?.result) {
          console.log(response?.data?.data);
        } else {
          this.$toastr.e(this.$tr("something_went_wrong"));
        }
      } catch (error) {
        HandleException.handleApiException(this, error);
      }
      // this.toggleShowProgress();
    },
    cantChangeStatusInTabs(tabKey) {
      return this.tabItems[this.tabIndex].key === tabKey;
    },
    onApply(selectedStatus) {
      if (
        this.cantChangeStatusInTabs("deleted") &&
        this.statuses.includes(selectedStatus)
      ) {
        Alert.blockChangeStatusAlert(
          this,
          "cant_change_record_status_in_delete_tab",
          "restricted"
        );
        return;
      }
      if (
        this.cantChangeStatusInTabs("blocked") &&
        selectedStatus === "active"
      ) {
        Alert.blockChangeStatusAlert(
          this,
          "cant_make_status_active_in_block_tab",
          "restricted"
        );
        return;
      }
      this.changeRecordStatus({ selectedStatus, payload: this });
    },

    // onBlock() {
    //   this.blockRecord(this);
    // },
    onDelete() {
      if (this.tabItems[this.tabIndex].key === "deleted") {
        Alert.cannotForceDeleteItem(this);
        return;
      }
      this.deleteRecord(this);
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

    onTypeChange() {
      this.selectedItems = [];
    },

    onSearch(term) {
      this.searchQuery = term;
    },
    async searchCountries() {
      if (this.type == 1) {
        try {
          const data = {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
          };
          const response = await this.$axios.post(
            "countries/searchCountry",
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
          this.$refs.countryTableRef.selected?.unshift(data);
        }
      } else {
        this.$refs.pageFilterRef.clearInput();
      }
    },
    searchAgain() {
      this.getRecord(this.filterData);
    },
    async getRecord(filterData) {
      try {
        const data = {
          key: this.getTabKey(),
          countriesHasCompanies: true,
          type: this.type,
          content: this.content,
          contentData: this.contentData,
          name: filterData.name,
          currency_name: filterData.currency_name,
          region: filterData.region,
          subregion: filterData.subregion,
          capital: filterData.capital,
          national: filterData.national,
          created_date: filterData.created_date,
          updated_date: filterData.updated_date,
          include: filterData.include,
          ids: filterData.ids,
        };
        const res = await this.fetchCountries(data);
      } catch (error) {
        if (error.response.status === 401) {
          redirect("/auth/signin");
        } else {
          console.error(error.response.statusText);
        }
      }
    },
    onRowClicked(item) {
      let items = new Set(this.selectedItems);
      items.has(item) ? items.delete(item) : items.add(item);
      this.selectedItems = Array.from(items);
    },

    // ************    Status Evolutions   **************
    fetchRecentDataAndClearSelected() {
      this.selectedItems = [];
      this.itemIds = [];
      this.selectedStatus = "";
      this.fetchCountries({
        key: this.getTabKey(),
        countriesHasCompanies: "true",
        ...this.filterData,
        type: this.type,
        content: this.content,
        contentData: this.contentData,
      });
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
          `reasons/id?type=${this.selectedStatus}&sub_system=Countries`
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
            ? await this.$axios.delete(`countries/${this.itemIds}`)
            : await this.$axios.post("countries/changeStatus", data);

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

        const response = await this.$axios.post("countries/changeStatus", data);
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
  },
  watch: {
    tabIndex: function (index) {
      this.checkSelectedTab(index);
      this.fetchCountries({
        key: this.getTabKey(),
        countriesHasCompanies: "true",
        ...this.filterData,
        type: this.type,
        content: this.content,
        contentData: this.contentData,
      });
      this.selectedItems = [];
      this.selectedStatus = null;
    },
  },
};
</script>

<style scoped></style>
