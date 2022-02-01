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
        page_name="languages"
      />
    </v-dialog>
    <v-dialog
      v-model="addLanguageDialog"
      width="1300"
      persistent
      v-if="$isInScope('languages-create')"
    >
      <Dialog @closeDialog="toggleAddLanguage">
        <AddLanguage ref="addLanguage" />
      </Dialog>
    </v-dialog>
    <v-dialog
      v-model="languageFilter"
      persistent
      max-width="1300"
      width="1300"
      v-if="$isInScope('languages-view')"
    >
      <LanguageFilter @close="onFilter" v-if="languageFilter" :prevFilterData="filterData" @getRecord="getRecord" />
    </v-dialog>
    <!-- Add Bulk upload Dialog -->
    <v-row no-gutters>
      <ProgressBar v-if="showProgress" />
      <v-col cols="12">
        <PageHeader
          Icon="mdi-earth"
          Title="languages"
          :Breadcrumb="breadcrumb"
        />
      </v-col>
      <v-col cols="12">
        <PageFilters
          ref="pageFilterRef"
          :selected_header.sync="download_header"
          :downloadContent="download_content"
          :downloadDialog="downloadDialog"
          :filename="$tr('languages')"
          :show-add-note="true"
          :content.sync="content"
          :contentT.sync="contentData"
          :selectedOption.sync="type"
          @unSelect="unSelect"
          :show-bulk-upload="false"
          :showFilter="true"
          :showDownload="$isInScope('languages-view')"
          @search="searchLanguages"
          @searchAgain="searchAgain"
          @onKeyUp="onKeyUp"
          @onDownload="toggleDownload"
          @onFilter="onFilter"
          @onToggleSearchType="onToggleSearchType"
          @onTypeChange="onTypeChange"
          @onColumn="
            () => {
              dialogKey++;
              columnDialog = true;
            }
          "
          @onBulkUpload="uploadDialog = true"
        >
          <CustomButton
            v-if="$isInScope('languages-create')"
            @click="toggleAddLanguage"
            icon="fa-plus"
            :text="$tr('create_item', $tr('language'))"
            type="primary"
          />
        </PageFilters>
      </v-col>
      <v-col cols="12">
        <PageActions
          :selectedItems="selectedItems"
          :tab-key.sync="tabItems[tabIndex].key"
          @onSubmit="onSubmit"
          @onBlock="onBlock"
          @onDelete="onDelete"
          :reasons="allReasons"
          :isLanguage="true"
          :showReasonDialog.sync="showReasonDialog"
          :showAutoEdit="false"
          :showTracing="false"
          :showEdit="false"
          :showView="false"
          :showBlock="$isInScope('languages-update')"
          :showSelect="$isInScope('languages-update')"
          :showApply="$isInScope('languages-update')"
          @onApply="onApply"
        />
      </v-col>
      <v-col cols="12">
        <DataTable
          :key="tableKey"
          v-model="selectedItems"
          :headers="selected_header"
          :ItemsLength="getTotals(tabItems[tabIndex].key)"
          :items="languages"
          :loading="apiCalling"
          @click:row="onRowClicked"
          @current-data="currentData"
          @onTablePaginate="onTableChanges"
          ref="languageRef"
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
            <nuxt-link :to="`/languages/${item.code}`">
              <span class="mx-1 primary--text font-weight-bold">
                {{ item.code }}
              </span>
            </nuxt-link>
          </template>
          <template v-slot:[`item.translatedCount`]="{ item }">
            <span class="mx-1">
              {{ item.translatedCount }} / {{ getTotals("totalWords") }}
            </span>
          </template>
          <template v-slot:[`item.frontendCount`]="{ item }">
            <span class="mx-1">
              {{ item.frontendCount }} / {{ getTotals("frontendWords") }}
            </span>
          </template>
          <template v-slot:[`item.backendCount`]="{ item }">
            <span class="mx-1">
              {{ item.backendCount }} / {{ getTotals("backendWords") }}
            </span>
          </template>
          <template v-slot:[`item.percentage`]="{ item }">
            <span class="mx-1">
              {{
                Number.parseFloat(
                  (
                    (item.translatedCount / getTotals("totalWords")) *
                    100
                  ).toFixed(2)
                )
              }}%
            </span>
          </template>
          <template v-slot:[`item.country_language.country.iso2`]="{ item }">
            <nuxt-link :to="`/languages/${item.code}`">
              <FlagIcon
                :flag="
                  item.country_language
                    ? item.country_language.country.iso2.toLowerCase()
                    : ''
                "
                :round="true"
              />
            </nuxt-link>
          </template>
        </DataTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import HandleException from "~/helpers/handle-exception";
import Alert from "~/helpers/alert";
import { mapActions, mapGetters } from "vuex";
import Languages from "~/configs/pages/languages";
import ProgressBar from "~/components/common/ProgressBar";
import PageHeader from "~/components/design/PageHeader";
import PageFilters from "~/components/design/PageFilters";
import PageActions from "~/components/design/PageActions";
import DataTable from "~/components/design/DataTable";
import CustomButton from "~/components/design/components/CustomButton";
import CustomizeColumn from "~/components/customizeColumn/CustomizeColumn.vue";
// devMaster
import Dialog from "~/components/design/Dialog/Dialog.vue";
import AddLanguage from "~/components/languages/AddLanguage.vue";

// import Bulk upload component
import BulkUpload from "~/components/common/BulkUpload";
import readXlsxFile from "read-excel-file";
import FlagIcon from "~/components/common/FlagIcon.vue";
import LanguageFilter from "~/components/languages/LanguageFilter.vue";
import ColumnHelper from "~/helpers/column-helper";

export default {
  meta: {
    hasAuth: true,
    scope: "languages-view",
  },
  name: "languages",
  components: {
    Dialog,
    AddLanguage,
    ProgressBar,
    currentItems: [],
    CustomButton,
    DataTable,
    PageActions,
    PageFilters,
    PageHeader,
    CustomizeColumn,
    BulkUpload,
    FlagIcon,
    LanguageFilter,
  },

  async asyncData({ store }) {
    await store.dispatch("customColumns/fetchCustomColumns", {
      view_name: "languages",
    });
    await store.dispatch("languages/fetchLanguages", {
      key: "all",
      ...this?.filterData,
      type: this?.type,
      content: this?.content,
      contentData: this?.contentData,
    });
    await store.dispatch("customColumns/fetchCustomColumns", {
      view_name: "languages",
    });
  },
  data() {
    return {
      category: Languages(this).category,
      headers: Languages(this).headers,
      breadcrumb: Languages(this).breadcrumb,
      tabItems: Languages(this).tabItems,
      // devmaster
      addLanguageDialog: false,

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
      download_header: [],
      download_content: [],

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
      languageFilter: false,

      filterData: "",
    };
  },
  computed: {
    ...mapGetters({
      getTranslations: "translations/getTranslations",
      languages: "languages/getLanguages",
      itemsTotal: "languages/itemsTotal",
      apiCalling: "languages/isApiCalling",
      getTotals: "languages/getTotal",
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
      fetchLanguages: "languages/fetchLanguages",
      deleteItem: "languages/deleteItem",
      insertNewItem: "languages/insertNewItem",
    }),
    toggleAddLanguage() {
      this.addLanguageDialog = !this.addLanguageDialog;
      if (!this.addLanguageDialog) {
        this.$refs.addLanguage.reset();
      }
    },

    onTypeChange() {
      this.selectedItems = [];
    },

    onFilter() {
      this.languageFilter = !this.languageFilter;
    },
    // Bulk upload methods
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

    checkSelectedTab(value) {
      this.tabItems = this.tabItems.map((item, index) => {
        index === value ? (item.isSelected = 1) : (item.isSelected = 0);
        return item;
      });
    },

    async toggleDownload() {
      this.download_header = [
        { id: 1, text: "Code", value: "code" },
        { id: 2, text: "Name", value: "name" },
        { id: 3, text: "Native", value: "native" },
        { id: 4, text: "Translated", value: "translatedCount" },
        { id: 5, text: "Percentage", value: "percentage" },
        { id: 6, text: "Status", value: "status" },
        { id: 7, text: "Created By", value: "created_by" },
        { id: 8, text: "Updated By", value: "updated_by" },
      ];
      this.showProgressBar = true;
      this.download_content = await this.languages.map((row) => {
        const item = {
          code: row.code,
          name: row?.country_language?.language?.name,
          native: row?.country_language?.language?.native,
          translatedCount:
            row?.translatedCount + " / " + this.getTotals("totalWords"),
          percentage:
            (row?.translatedCount / this.getTotals("totalWords")) * 100 + "%",
          status: row?.status,
          updated_by: row?.updated_by,
          created_by: row?.created_by,
        };
        return item;
      });
      this.showProgressBar = false;
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
      this.fetchLanguages(data);
    },

    getTabKey() {
      return this.tabItems[this.tabIndex]?.key;
    },
    currentData(e) {
      this.currentItems = e;
    },

    onToggleSearchType(query_option) {
      console.log(query_option);
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

    async onDelete(ids) {
      if (this.getTabKey() === "active" && this.getTotals("active") <= 1) {
        this.$toastr.w(this.$tr("at_least_one_langauge_should_be_active"));
      } else {
        this.selectedStatus = "removed";
        this.itemIds = ids;
        this.getTabKey() === "pending" ||
        this.getTabKey() === "deleted" ||
        this.getTabKey() === "removed"
          ? this.noReasonSubmit()
          : await this.fetchAllReasons();
      }
    },

    toggleShowProgress() {
      this.showProgress = !this.showProgress;
    },

    onSearch(term) {
      this.searchQuery = term;
    },

    async searchLanguages() {
      if (this.type == 1) {
        try {
          const data = {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
          };
          const response = await this.$axios.post(
            "languages_translated/searchLanguage",
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
          this.$refs.languageRef.selected?.unshift(data);
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

    // ************    Status Evolutions   **************
    fetchRecentDataAndClearSelected() {
      this.selectedItems = [];
      this.itemIds = [];
      this.selectedStatus = "";
      this.fetchLanguages({
        key: this.getTabKey(),
        ...this.filterData,
        type: this.type,
        content: this.content,
        contentData: this.contentData,
      });
    },

    async onBlock() {
      if (this.getTabKey() === "active" && this.getTotals("active") <= 1) {
        this.$toastr.w(this.$tr("at_least_one_langauge_should_be_active"));
      } else {
        this.selectedStatus = "blocked";
        this.getTabKey() === "pending"
          ? this.noReasonSubmit()
          : await this.fetchAllReasons();
      }
    },

    async fetchAllReasons() {
      this.showProgressBar = true;
      try {
        const response = await this.$axios.get(
          `reasons/id?type=${this.selectedStatus}&sub_system=Languages`
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
      if (this.getTabKey() === "active" && this.getTotals("active") <= 1) {
        this.$toastr.w(this.$tr("at_least_one_langauge_should_be_active"));
      } else {
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
            ? await this.$axios.delete(`languages_translated/${this.itemIds}`)
            : await this.$axios.post("languages_translated/changeStatus", data);

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
                `languages_translated/${this.itemIds}?reasonId=${reasonId}`
              )
            : await this.$axios.post("languages_translated/changeStatus", data);

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
    async getRecord(filterData) {
      try {
        const data = {
          key: this.getTabKey(),
          type: this.type,
          content: this.content,
          contentData: this.contentData,
          name: filterData.name,
          native: filterData.native,
          created_date: filterData.created_date,
          updated_date: filterData.updated_date,
          include: filterData.include,
          ids: filterData.ids,
        };
        const res = await this.fetchLanguages(data);
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
      this.fetchLanguages({
        key: this.getTabKey(),
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
