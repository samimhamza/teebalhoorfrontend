<template>
  <v-container fluid class="pa-0">
    <!-- customize column dialog -->
    <v-dialog v-model="columnDialog" persistent width="1300" class="rounded-0">
      <client-only>
        <CustomizeColumn
          @closeDialog="columnDialog = false"
          @saveChanges="saveColumnSetting($event)"
          :tableHeader="$_.cloneDeep(headers)"
          :custom_columns="$_.cloneDeep(selected_column)"
          :categoryHeader="$_.cloneDeep(category)"
          page_name="business_location"
          :key="dialogKey"
        />
      </client-only>
    </v-dialog>
    <!-- BusinessLocation Profile Section -->
    <v-dialog v-model="showProfile" persistent width="1300" scrollable>
      <business-location-profile
        :dialog.sync="showProfile"
        :profileData="profileData"
        @closeProfile="showProfile = false"
        @onEdit="onEdit"
      />
    </v-dialog>

    <!--    Register  Dialog-->
    <RegisterBusinessLocation
      v-if="registerDialog"
      :tableKey="tabItems[tabIndex].key"
      :registerDialog.sync="registerDialog"
    />

    <EditBusinessLocation
      v-if="editDialog"
      :tabKey="tabItems[tabIndex].key"
      :edit-dialog.sync="editDialog"
      :key="editKey"
      :editItems="editItems"
      :is-auto-edit.sync="isAutoEdit"
    />

    <v-dialog
      v-model="business_locations_filter"
      persistent
      max-width="1300"
      width="1300"
      v-if="$isInScope('business_locations-view')"
    >
      <BusinessLocationFilter @close="onFilter" v-if="business_locations_filter" :prevFilterData="filterData" @getRecord="getRecord" />
    </v-dialog>
    <v-row no-gutters>
      <ProgressBar v-if="showProgressBar" />
      <v-col cols="12">
        <PageHeader
          Icon="mdi-map-marker-radius"
          :Title="$tr('business_locations')"
          :Breadcrumb="breadcrumb"
        />
      </v-col>

      <v-col cols="12">
        <PageFilters
          :content.sync="content"
          :contentT.sync="contentData"
          :selectedOption.sync="type"
          @onFilter="onFilter"
          @unSelect="unSelect"
          @search="searchBusinessLocation"
          @searchAgain="searchAgain"
          show-add-note
          show-bulk-upload
          showDownload
          :selected_header="selected_header"
          :header.sync="headers"
          :downloadContent="getItems"
          :downloadDialog="downloadDialog"
          :filename="$tr('business_locations')"
          @onTypeChange="onTypeChange"
          @onDownload="
            () => {
              downloadDialog = !downloadDialog;
            }
          "
          ref="pageFilter"
          @onColumn="
            () => {
              dialogKey++;
              columnDialog = true;
            }
          "
        >
          <CustomButton
            @click="toggleRegisterDialog"
            icon="mdi-map-marker-plus"
            :text="$tr('create_business_location')"
            type="primary"
          />
        </PageFilters>
      </v-col>
      <v-col cols="12">
        <PageActions
          :selectedItems="selectedItems"
          :tab-key.sync="tabItems[tabIndex].key"
          @onEdit="onEdit"
          @onView="onView"
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
            <span v-if="item.status === 'inactive'">Deactive</span>
            <span v-else>{{ item.status }}</span>
          </template>

          <template v-slot:[`item.code`]="{ item }">
            <span
              @click="() => viewSelectedBusinessLocattion(item)"
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
import PageHeader from "~/components/design/PageHeader";
import PageFilters from "~/components/design/PageFilters";
import PageActions from "~/components/design/PageActions";
import DataTable from "~/components/design/DataTable";
import ProgressBar from "~/components/common/ProgressBar";
import CustomButton from "~/components/design/components/CustomButton";
import BusinessLocations from "~/configs/pages/business_locations";
import RegisterBusinessLocation from "~/components/masters/business_locations/RegisterBusinessLocation";
import EditBusinessLocation from "~/components/masters/business_locations/EditBusinessLocation";
import CustomizeColumn from "../../components/customizeColumn/CustomizeColumn.vue";
import Alert from "../../helpers/alert";
import ColumnHelper from "~/helpers/column-helper";

import BusinessLocationFilter from "~/components/masters/business_locations/BusinessLocationFilter";
import BusinessLocationProfile from "../../components/masters/business_locations/BusinessLocationProfile.vue";
export default {
  meta: {
    hasAuth: true,
    scope: "business_locations-view",
  },
  async asyncData({ store }) {
    await store.dispatch("customColumns/fetchCustomColumns", {
      view_name: "business_location",
    });
    await store.dispatch("business_locations/fetchItems", { key: "all" });
  },

  components: {
    BusinessLocationProfile,
    RegisterBusinessLocation,
    EditBusinessLocation,
    CustomButton,
    ProgressBar,
    DataTable,
    PageActions,
    PageFilters,
    PageHeader,
    CustomizeColumn,
    BusinessLocationFilter,
  },
  computed: {
    ...mapGetters({
      apiCalling: "business_locations/isApiCalling",
      getTotals: "business_locations/getTotal",
      getItems: "business_locations/getItems",
    }),
  },

  data() {
    return {
      category: BusinessLocations(this).category,
      headers: BusinessLocations(this).headers,
      tabItems: BusinessLocations(this).tabItems,
      breadcrumb: BusinessLocations(this).breadcrumb,
      selectedItems: [],
      tabIndex: 0,

      // insert section
      showProgressBar: false,
      registerDialog: false,

      //edit section
      editItems: [],
      editDialog: false,
      editKey: 0,
      isAutoEdit: false,

      // for custom columns
      dialogKey: 0,
      columnDialog: false,
      selected_column: [],
      selected_header: [],
      showProgressBar: false,
      // profile section
      showProfile: false,
      profileData: {},
      // Page actions
      showReasonDialog: false,
      selectedStatus: "",
      itemIds: [],
      allReasons: [],

      downloadDialog: false,
      business_locations_filter: false,
      filterData: "",
      type: 1,
      content: [],
      contentData: "",
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
      getTranslations: "translations/getTranslations",
      apiCalling: "business_locations/isApiCalling",
      getTotals: "business_locations/getTotal",
      getItems: "business_locations/getItems",
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
    // vuex state methods
    ...mapActions({
      fetchTranslations: "translations/fetchTranslations",
      fetchItems: "business_locations/fetchItems",
      insertItem: "business_locations/insertNewItem",
      deleteItem: "business_locations/deleteItem",
    }),

    onFilter() {
      this.business_locations_filter = !this.business_locations_filter;
    },
    onTypeChange() {
      this.selectedItems = [];
    },

    async searchBusinessLocation() {
      if (this.type == 1) {
        try {
          const data = {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
          };
          const response = await this.$axios.post(
            "business-locations/search",
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
          this.insertItem(data);
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
    async getRecord(filterData) {
      try {
        const data = {
          key: this.getTabKey(),
          options: {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
            country_id: filterData.country_id,
            company_id: filterData.company_id,
            created_date: filterData.created_date,
            updated_date: filterData.updated_date,
            name: filterData.name,
            include: filterData.include,
            ids: filterData.ids,
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

    // fired on auto edit button clicked to edit multiple business locations
    async onAutoEdit() {
      if (this.selectedItems.length > 0) {
        this.editItems = [];
        const itemIds = this.selectedItems.map((item) => item.id);
        const items = await this.fetchBusinessLocation(itemIds);
        if (items) {
          this.editItems = items;
          this.editDialog = true;
          this.isAutoEdit = true;
          this.editKey++;
          this.selectedItems = [];
        }
      }
    },

    //view
    onView() {
      this.showProfile = true;
      this.profileData = this.selectedItems[0];
      // console.log(this.profileData);
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

    // get item by code
    async viewSelectedBusinessLocattion(item) {
      this.profileData = item;
      this.showProfile = true;
    },

    // fired on edit button clicked to edit business locations
    async onEdit() {
      if (this.selectedItems.length > 0) {
        this.editItems = [];
        const itemId = this.selectedItems[0].id;
        const items = await this.fetchBusinessLocation(itemId);
        if (items) {
          this.editItems[0] = items[0];
          this.editDialog = true;
          this.editKey++;
          this.selectedItems.splice(0, 1);
        }
      }
    },

    // fetch business locations details
    async fetchBusinessLocation(businessLocationId) {
      try {
        this.showProgressBar = true;
        const url = `business-locations/${businessLocationId}?details=true`;
        const response = await this.$axios.get(url);
        const items = response?.data?.data;
        const filteredItems = [];

        for (const item of items) {
          const selectedCountries = [];
          for (const country of item.company.countries) {
            selectedCountries.push(country);
          }

          item.selectedCountries = selectedCountries;
          filteredItems.push(item);
        }

        this.showProgressBar = false;
        return filteredItems;
      } catch (e) {
        this.$toastr.e(this.$tr("something_went_wrong"));
        this.showProgressBar = false;
      }
    },

    // toggle register dialog
    toggleRegisterDialog() {
      this.registerDialog = !this.registerDialog;
    },

    // add or remove item from selected items
    onRowClicked(item) {
      let items = new Set(this.selectedItems);
      items.has(item) ? items.delete(item) : items.add(item);
      this.selectedItems = Array.from(items);
    },

    // fired on table changes
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

    // return table tab key
    getTabKey() {
      return this.tabItems[this.tabIndex]?.key;
    },

    // active selected tab item when tab changed
    checkSelectedTab(value) {
      this.tabItems = this.tabItems.map((item, index) => {
        index === value ? (item.isSelected = 1) : (item.isSelected = 0);
        return item;
      });
    },

    // BEGIN::     ******************      Change Status      ******************
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
          `reasons/id?type=${this.selectedStatus}&sub_system=Business Locations`
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
            ? await this.$axios.delete(`business-locations/${this.itemIds}`)
            : await this.$axios.post("business-locations/change-status", data);

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
                `business-locations/${this.itemIds}?reasonId=${reasonId}`
              )
            : await this.$axios.post("business-locations/change-status", data);

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
    unSelect(key) {
      this.selectedItems = this.selectedItems.filter(
        (data) => data.code !== key
      );
    },

    // END::     ******************      Change Status      ******************
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
};
</script>
