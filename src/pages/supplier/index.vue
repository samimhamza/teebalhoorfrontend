<template>
  <v-container fluid class="pa-0">
    <!-- column dialog -->
    <v-dialog v-model="columnDialog" persistent width="1300" class="rounded-0">
      <CustomizeColumn
        @closeDialog="columnDialog = false"
        @saveChanges="saveColumnSetting($event)"
        :tableHeader="$_.cloneDeep(headers)"
        :custom_columns="$_.cloneDeep(selected_column)"
        :categoryHeader="$_.cloneDeep(category)"
        :key="dialogKey"
        page_name="suppliers"
      />
    </v-dialog>
    <!-- Supplier Profile Section -->
    <v-dialog
      v-model="showProfile"
      persistent
      width="1300"
      scrollable
      v-if="$isInScope('suppliers-view')"
    >
      <SupplierProfile
        :dialog.sync="showProfile"
        :profileData="profileData"
        :key="key"
        @closeProfile="showProfile = false"
        @onEdit="onEdit"
      />
    </v-dialog>
    <!--    Supplier Register Dialog-->
    <v-dialog
      v-model="supplierRegisterDialog"
      width="1300"
      persistent
      v-if="$isInScope('suppliers-create')"
    >
      <Dialog @closeDialog="close">
        <supplierRegister ref="supplierRegisterDialog" />
      </Dialog>
    </v-dialog>

    <v-dialog
      v-model="SupplierFilterDialog"
      persistent
      max-width="1300"
      width="1300"
    >
      <SupplierFilter @close="onFilter" @getRecord="getRecord" />
    </v-dialog>
    <v-dialog
      v-model="editDialog"
      persistent
      width="1300"
      v-if="$isInScope('suppliers-update')"
    >
      <EditSupplier
        :edit-dialog.sync="editDialog"
        :key="editKey"
        :allCompanies="allCompanies"
        :allLabels="allLabels"
        :allCountries="allCountries"
        :allSourcers="allSourcers"
        :editItems="editItems"
        :is-auto-edit.sync="isAutoEdit"
      />
    </v-dialog>

    <v-container fluid class="pa-0">
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
            :downloadContent="suppliers"
            :downloadDialog="downloadDialog"
            :filename="$tr('suppliers')"
            :content.sync="content"
            :contentT.sync="contentData"
            :selectedOption.sync="type"
            @onDownload="toggleDownload"
            @onFilter="onFilter"
            @search="searchSupplier"
            @searchAgain="searchAgain"
            @onBulkUpload="toggleBulkUpload"
            @onTypeChange="onTypeChange"
            @unSelect="unSelect"
            @onColumn="
              () => {
                dialogKey++;
                columnDialog = true;
              }
            "
            note-title="add_project_note"
            :show-add-note="$isInScope('suppliers-create')"
            :show-bulk-upload="$isInScope('suppliers-create')"
            :showDownload="$isInScope('suppliers-view')"
          >
            <CustomButton
              icon="fa-plus"
              @click="supplierRegisterDialog = true"
              text="Add_supplier"
              type="primary"
            />
          </PageFilters>
        </v-col>
        <v-col cols="12">
          <PageActions
            :showView="$isInScope('suppliers-view')"
            :showEdit="$isInScope('suppliers-update')"
            :showAutoEdit="$isInScope('suppliers-update')"
            :showDelete="$isInScope('suppliers-delete')"
            :showBlock="$isInScope('suppliers-update')"
            :showSelect="$isInScope('suppliers-update')"
            :showApply="$isInScope('suppliers-update')"
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
            v-model="selectedItems"
            :headers="selected_header"
            :key="tableKey"
            :loading="apiCalling"
            @click:row="onRowClicked"
            ref="supplierTableRef"
            :items="suppliers"
            :ItemsLength="getTotals(getTabKey())"
            @select="onItemsSelect"
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
                      <v-tab
                        v-for="(item, i) in tabItems"
                        :key="i"
                        class="px-3"
                      >
                        <span
                          :class="`${
                            item.isSelected ? 'selected' : 'not-selected'
                          } tab-icon`"
                        >
                          <v-icon left small class="me-1">{{
                            item.icon
                          }}</v-icon>
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

            <template v-slot:[`item.code`]="{ item }">
              <span
                @click="() => viewSelectedSupplier(item)"
                class="mx-1 primary--text font-weight-bold"
              >
                {{ item.code }}
              </span>
            </template>
            <template v-slot:[`item.email`]="{ item }">
              <span class="primary--text">
                <a :href="`mailto:${item.email}`">{{ item.email }}</a>
              </span>
            </template>
            <template v-slot:[`item.website`]="{ item }">
              <span class="primary--text">
                <a :href="item.website" target="_blank"> {{ item.website }} </a>
              </span>
            </template>
            <template v-slot:[`item.label`]="{ item }">
              <span v-if="item.label">
                {{ item.label.title }}
              </span>
            </template>
            <template v-slot:[`item.supplierLogo`]="{ item }">
              <v-avatar :size="30" color="blue-grey darken-3">
                <span class="white--text text-h6 pa-1">
                  {{
                    item.supplier_name
                      ? item.supplier_name[0].toUpperCase()
                      : ""
                  }}
                </span>
              </v-avatar>
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
  </v-container>
</template>

<script>
import SupplierProfile from "../../components/supplier/SupplierProfile";
import { mapActions, mapGetters } from "vuex";
import CustomButton from "../../components/design/components/CustomButton.vue";
import DataTable from "../../components/design/DataTable.vue";
import Dialog from "../../components/design/Dialog/Dialog.vue";
import PageActions from "../../components/design/PageActions.vue";
import PageFilters from "../../components/design/PageFilters.vue";
import PageHeader from "../../components/design/PageHeader.vue";
import Suppliers from "../../configs/pages/suppliers";
import HandleException from "~/helpers/handle-exception";
import Alert from "../../helpers/alert";
import ProgressBar from "../../components/common/ProgressBar.vue";
import CustomizeColumn from "../../components/customizeColumn/CustomizeColumn.vue";
import EditSupplier from "../../components/supplier/EditSupplier.vue";
import supplierRegister from "../../components/supplier/supplierRegister.vue";
import SupplierFilter from "../../components/supplier/SupplierFilter.vue";
import ColumnHelper from "~/helpers/column-helper";

export default {
  meta: {
    hasAuth: true,
    scope: "suppliers-view",
  },
  async asyncData({ store }) {
    await store.dispatch("customColumns/fetchCustomColumns", {
      view_name: "suppliers",
    });
    await store.dispatch("suppliers/fetchSuppliers", {
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
    EditSupplier,
    ProgressBar,
    PageActions,
    CustomButton,
    PageHeader,
    PageFilters,
    Dialog,
    DataTable,
    CustomizeColumn,
    ProgressBar,
    SupplierProfile,
    supplierRegister,
    SupplierFilter,
  },

  data() {
    return {
      supplierRegisterDialog: false,
      category: Suppliers(this).category,
      headers: Suppliers(this).headers,
      tabItems: Suppliers(this).tabItems,
      breadcrumb: Suppliers(this).breadcrumb,
      selectedItems: [],
      showProgress: false,
      tableKey: 0,
      tabIndex: 0,
      selectedStatus: null,
      options: {},
      key: 0,

      //register section
      registerDialog: false,

      downloadDialog: false,

      // profile section
      showProfile: false,

      // for custom columns
      dialogKey: 0,
      columnDialog: false,
      selected_column: [],
      selected_header: [],
      showProgressBar: false,

      // Page actions
      showReasonDialog: false,
      selectedStatus: "",
      itemIds: [],
      allReasons: [],

      // Edit and Auto Edit
      editData: {},
      editKey: 0,
      editDialog: false,
      isAutoEdit: false,
      editItems: [],
      allSourcers: [],
      allLabels: [],
      allCountries: [],
      allCompanies: [],

      autoEdit: false,
      editKey: 0,
      selectedItems: [],
      type: 1,
      content: [],
      contentData: "",
      SupplierFilterDialog: false,
      filterData: {},
      profileData: {},

      bulkUploadDialog: false,
      selectedsupplier: [],
    };
  },

  watch: {
    tabIndex: function (value) {
      let data = {
        ...this.filterData,
        type: this.type,
        content: this.content,
        contentData: this.contentData,
      };
      this.checkSelectedTab(value);
      this.fetchSuppliers({ key: this.getTabKey(), options: data });
    },
  },

  computed: {
    ...mapGetters({
      getTranslations: "translations/getTranslations",
      suppliers: "suppliers/getSuppliers",
      itemsTotal: "suppliers/itemsTotal",
      apiCalling: "suppliers/isApiCalling",
      getTotals: "suppliers/getTotal",
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
    closecoldialog() {
      this.columnDialog = true;
    },
    onView() {
      this.showProfile = true;
      this.profileData = this.selectedItems[0];
    },
    ...mapActions({
      fetchTranslations: "translations/fetchTranslations",
      fetchSuppliers: "suppliers/fetchSuppliers",
      fetchCompanies: "companies/fetchCompanies",
      changeRecordStatus: "projects/changeRecordStatus",
      fetchAscCountries: "countries/fetchAscCountries",
      fetchCountries: "countries/fetchCountries",
      fetchReasons: "reasons/fetchReason",
      deleteItem: "suppliers/deleteItem",
      insertNewItem: "suppliers/insertNewItem",
    }),
    toggleProgressBar() {
      this.showProgressBar = !this.showProgressBar;
    },
    onItemsSelect(items) {
      this.selectedsupplier = items;
    },
    onTableChanges(options) {
      let data = {
        ...options,
        ...this.filterData,
        type: this.type,
        content: this.content,
        contentData: this.contentData,
      };

      this.fetchSuppliers({ key: this.getTabKey(), options: data });
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
        this.key++;
        this.showProfile = true;
      } else {
        this.$toastr.w(this.$tr("view_item_max_limit_text"));
      }
    },

    close() {
      var isInserted = this.$refs.supplierRegisterDialog.closeForm();

      if (isInserted) {
        let data = {
          ...this.filterData,
          type: this.type,
          content: this.content,
          contentData: this.contentData,
        };

        this.fetchSuppliers({ key: "all", options: data });
      }
      this.supplierRegisterDialog = false;
    },
    onFilter() {
      this.SupplierFilterDialog = !this.SupplierFilterDialog;
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
          `reasons/id?type=${this.selectedStatus}&sub_system=Suppliers`
        );
        this.allReasons = response?.data?.reasons;
        this.showReasonDialog = true;
      } catch (error) {
        if (error?.response?.status === 404 && !error?.response?.data?.result) {
          this.$toastr.w(this.$tr("sub_system_not_found"));
          this.showReasonDialog = false;
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
            ? await this.$axios.delete(`suppliers/${this.itemIds}`)
            : await this.$axios.post("suppliers/changeStatus", data);

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
                `suppliers/${this.itemIds}?reasonId=${reasonId}`
              )
            : await this.$axios.post("suppliers/changeStatus", data);

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
      let data = {
        ...this.filterData,
        type: this.type,
        content: this.content,
        contentData: this.contentData,
      };

      this.fetchSuppliers({ key: this.getTabKey(), options: data });
    },

    async viewSelectedSupplier(item) {
      this.profileData = item;
      this.showProfile = true;
    },

    goToWebsite(link) {},

    editSelectedSupplier(item) {
      this.showProfile = false;
      this.supplierEditKey++;
      this.editData = item;
      this.supplierEdit = !this.supplierEdit;
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
    // customize columns: end =========================================================================================
    async searchSupplier() {
      if (this.type == 1) {
        try {
          const data = {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
          };
          const response = await this.$axios.post(
            "suppliers/searchSupplier",
            data
          );
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
          this.deleteItem(data.id);
          this.insertNewItem(data);
          this.selectedItems?.unshift(data);
          this.$refs.supplierTableRef.selected?.unshift(data);
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
            supply_type: filterData.supply_type,
            legal_type: filterData.legal_type,
            commercial_type: filterData.commercial_type,
            prepration_period: filterData.prepration_period,
            country_type: filterData.country_type,
            created_date: filterData.created_date,
            updated_date: filterData.updated_date,
            supplier_ids: filterData.supplier_ids,
            include: filterData.include,
            supplier_name: filterData.supplier_name,
            supplier_trading_name: filterData.supplier_trading_name,
          },
        };
        const res = await this.fetchSuppliers(data);
      } catch (error) {
        this.$toastr.w(error);
      }
    },
    async onAutoEdit() {
      await this.fetchNeccessaryData();
      this.isAutoEdit = true;
      this.editKey++;
      this.editDialog = true;
      this.editItems = this._.clone(this.selectedItems);
      this.selectedItems = [];
    },

    async fetchNeccessaryData() {
      this.showProgressBar = true;
      if (
        this.allSourcers.length === 0 ||
        this.allCountries.length === 0 ||
        this.allLabels.length === 0 ||
        this.allCompanies.length === 0
      ) {
        try {
          const response = await this.$axios.get("suppliers/id");
          if (response?.status === 200 && response?.data?.result) {
            this.allCompanies = response?.data?.allCompanies;
            this.allLabels = response?.data?.allLabels;
            this.allSourcers = response?.data?.allSourcers;
            this.allCountries = response?.data?.allCountries;
          } else {
            this.$toastr.e(this.$tr("something_went_wrong"));
          }
        } catch (error) {
          HandleException.handleApiException(this, error);
        }
      }
      this.showProgressBar = false;
    },
    async onEdit() {
      await this.fetchNeccessaryData();
      this.editKey++;
      this.editDialog = true;
      this.editItems[0] = this._.clone(this.selectedItems[0]);
      this.selectedItems = [];
    },

    toggleBulkUpload() {
      this.bulkUploadDialog = !this.bulkUploadDialog;
    },

    bulk_upload() {},
    unSelect(key) {
      this.selectedItems = this.selectedItems.filter(
        (data) => data.code !== key
      );
    },
    // =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  },
};
</script>
<style scoped>
a,
a:hover,
a:focus,
a:active {
  text-decoration: none;
  color: inherit;
}
</style>
