<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <!-- customize column dialog -->
      <v-dialog
        v-model="columnDialog"
        persistent
        width="1300"
        class="rounded-0"
      >
        <client-only>
          <CustomizeColumn
            @closeDialog="columnDialog = false"
            @saveChanges="saveColumnSetting($event)"
            :tableHeader="$_.cloneDeep(headers)"
            :custom_columns="$_.cloneDeep(selected_column)"
            :categoryHeader="$_.cloneDeep(category)"
            :page_name="'reason_' + $route.params.slug"
            :key="dialogKey"
          />
        </client-only>
      </v-dialog>

      <ProgressBar v-if="showProgressBar" />
      <!-- register dialog -->
      <v-dialog
        v-model="registerDialog"
        persistent
        scrollable
        width="1300"
        v-if="$isInScope('reasons-create')"
      >
        <Dialog @closeDialog="registerDialog = false">
          <register-reason-status
            :subSystems="subSystems"
            :slug="slug"
            @closeDialog="registerDialog = false"
            :edit_data="selected"
            :key="key"
          />
        </Dialog>
      </v-dialog>
      <!-- profile dialog -->
      <v-dialog
        v-model="showProfile"
        persistent
        width="1300"
        scrollable
        v-if="$isInScope('reasons-view')"
      >
        <ReasonStatusProfile
          :key="profileKey"
          @onEdit="editSelectedReason"
          :profileData="profileData"
          :dialog.sync="showProfile"
        />
      </v-dialog>

      <!-- filter Dialog -->
      <v-dialog
        v-model="reasonFilter"
        persistent
        max-width="1300"
        width="1300"
        v-if="$isInScope('reasons-view')"
      >
        <ReasonStatusFilter
          v-if="reasonFilter"
          :prevFilterData="filterData"
          @onSubmit="getRecord"
          @getRecord="getRecord"
          @close="reasonFilter = false"
          :subSystems="subSystems"
          :slug="slug"
        />
      </v-dialog>

      <!-- edit dialog -->
      <v-dialog v-model="editDialog" persistent width="1300">
        <EditReasonStatus
          :subSystems="subSystems"
          :edit-dialog.sync="editDialog"
          :key="editKey"
          :editItems="editItems"
          :is-auto-edit.sync="isAutoEdit"
        />
      </v-dialog>
      <v-col cols="12">
        <PageHeader
          Icon="mdi-svg"
          Title="status_event_list"
          :Breadcrumb="breadcrumb"
        />
      </v-col>

      <v-col cols="12">
        <PageFilters
          ref="pageFilterRef"
          :selected_header.sync="headers"
          :downloadContent="status_event"
          @onDownload="toggleDownload"
          :downloadDialog="downloadDialog"
          :filename="$tr('status_event_list')"
          :showBulkUpload="true"
          :selectedOption.sync="type"
          @search="searchReason"
          @unSelect="unSelect"
          @searchAgain="searchAgain"
          :content.sync="content"
          :contentT.sync="contentData"
          @onFilter="onFilter"
          @onTypeChange="onTypeChange"
          @onColumn="
            () => {
              dialogKey++;
              columnDialog = true;
            }
          "
          :showDownload="$isInScope('reasons-view')"
        >
          <CustomButton
            @click="addReason"
            icon="fa-plus"
            text="add_status_event"
            type="primary"
          />
        </PageFilters>
      </v-col>

      <v-col cols="12">
        <PageActions
          :selectedItems="selected"
          :showSelect="false"
          :showBlock="false"
          :showApply="false"
          :showDelete="false"
          :defaultAction="false"
          @onView="onView"
          @onEdit="Edit"
          @onAutoEdit="autoEdit"
          :showView="$isInScope('reasons-view')"
          :showEdit="$isInScope('reasons-update')"
          :showAutoEdit="$isInScope('reason-update')"
        />
      </v-col>

      <v-col cols="12">
        <DataTable
          ref="tableRef"
          :headers="selected_header"
          :items="status_event"
          :ItemsLength="total"
          v-model="selected"
          @click:row="onRowClicked"
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
                        v-text="total"
                      />
                    </v-tab>
                  </client-only>
                </v-tabs>
              </v-col>
            </v-row>
          </template>

          <template v-slot:[`item.code`]="{ item }">
            <span
              @click="() => viewSelectedReason(item)"
              class="mx-1 primary--text font-weight-bold"
            >
              {{ item.code }}
            </span>
          </template>
          <template v-slot:[`item.title`]="{ item }">
            <v-tooltip bottom max-width="800">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" style="white-space: nowrap">
                  <span v-if="item.reason.title.length >= 90"
                    >{{ item.title.substring(0, 89) }} ...
                  </span>
                  <span v-else>{{ item.reason.title.substring(0, 89) }} </span>
                </span>
              </template>
              <span>{{ item.reason.title }}</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.types`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span
                  v-bind="attrs"
                  v-on="on"
                  style="white-space: nowrap"
                  class="primary--text"
                >
                  {{ $tr("types") }}
                </span>
              </template>
              <span v-for="type in item.reason_types" :key="type.id"
                >{{ type.type }} <br
              /></span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.sub_systems`]="{ item }">
            <span>{{ item.subsystem.name }} <br /></span>
          </template>
        </DataTable>
        <v-btn @click="fetchStatusEvent({ slug: slug })">get data</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProgressBar from "~/components/common/ProgressBar";
import PageHeader from "~/components/design/PageHeader";
import PageFilters from "~/components/design/PageFilters";
import PageActions from "~/components/design/PageActions";
import DataTable from "~/components/design/DataTable";
import Reasons from "~/configs/pages/reasons";
import CustomButton from "~/components/design/components/CustomButton.vue";
import { mapGetters, mapActions } from "vuex";
import Dialog from "~/components/design/Dialog/Dialog.vue";
import HandleException from "~/helpers/handle-exception";
import CustomizeColumn from "~/components/customizeColumn/CustomizeColumn.vue";
import RegisterReasonStatus from "../../../components/statusManagement/reasonStatus/RegisterReasonStatus.vue";
import ReasonStatusProfile from "../../../components/statusManagement/reasonStatus/ReasonStatusProfile.vue";
import EditReasonStatus from "../../../components/statusManagement/reasonStatus/EditReasonStatus.vue";
import ReasonStatusFilter from "../../../components/statusManagement/reasonStatus/ReasonStatusFilter.vue";
import ColumnHelper from "~/helpers/column-helper";

export default {
  meta: {
    hasAuth: true,
    scope: "reasons-view",
  },
  name: "reasons",
  async asyncData({ store, params }) {
    await store.dispatch("statusEvents/fetchStatusEvent", {
      slug: params.slug,
    });
    await store.dispatch("reasons/fetchReasons", {
      slug: params.slug,
    });

    await store.dispatch("customColumns/fetchCustomColumns", {
      view_name: "reason_" + params.slug,
    });
    return { slug: params.slug };
  },

  components: {
    CustomButton,
    DataTable,
    PageActions,
    PageFilters,
    PageHeader,
    ProgressBar,
    Dialog,
    CustomizeColumn,
    RegisterReasonStatus,
    ReasonStatusProfile,
    EditReasonStatus,
    ReasonStatusFilter,
  },

  data() {
    return {
      selected: [],
      tabItems: Reasons(this).tabItems,
      headers: Reasons(this).headers,
      breadcrumb: Reasons(this).breadcrumb,
      category: Reasons(this).category,
      registerDialog: false,
      showProgressBar: false,
      tabIndex: 0,
      key: 0,
      type: 1,
      content: [],
      contentData: "",
      subSystems: [],

      // for custom columns
      dialogKey: 0,
      columnDialog: false,

      showProgressBar: false,

      selected_column: [],
      selected_header: [],

      // Edit and Auto Edit
      editKey: 0,
      editItems: [],
      editDialog: false,
      isAutoEdit: false,
      reasonFilter: false,

      // Profile
      showProfile: false,
      profileData: {},
      profileKey: 0,

      downloadDialog: false,

      filterData: {},
    };
  },

  async validate({ params }) {
    return !params.slug ? false : true;
  },

  computed: {
    ...mapGetters({
      status_event: "statusEvents/get_status_event",
      total: "statusEvents/get_total",
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
    if (process.client) {
      this.$root.$on("getData", (data) => {
        this.filterData = data;
      });
    }
  },

  methods: {
    ...mapActions({
      fetchStatusEvent: "statusEvents/fetchStatusEvent",
      reason: "reasons/fetchStatusEvent",
      filterReasonStore: "reasons/filterReason",
      fetchStatusEventByID: "statusEvents/fetchStatusEventByID",
    }),

    // add or remove item from selected items
    onRowClicked(item) {
      let items = new Set(this.selected);
      items.has(item) ? items.delete(item) : items.add(item);
      this.selected = Array.from(items);
    },

    // =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>on pageination
    onTableChanges(options) {
      const data = {
        typeSearch: this?.type,
        content: this?.content,
        contentData: this?.contentData,
      };
      data.options = options;
      data.filterData = this.filterData;

      this.fetchStatusEvent(options);
    },

    toggleDownload() {
      this.downloadDialog = !this.downloadDialog;
    },

    async viewSelectedReason(item) {
      this.profileData = item;
      this.showProfile = true;
    },

    async fetchSubSystems() {
      // const element = [];
      try {
        const response = await this.$axios.get(
          `systems_sub_systems?system_name=${this.slug}`
        );
        if (response?.status === 200 && response?.data?.result) {
          this.subSystems = response?.data?.data;
        } else {
          this.$toastr.w(this.$tr("something_went_wrong"));
        }
      } catch (error) {
        if (error?.response?.status === 404 && !error?.response?.data?.result) {
          this.$toastr.w(this.$tr("sub_system_not_found"));
        } else {
          HandleException.handleApiException(this, error);
        }
      }
    },

    async addReason() {
      this.showProgressBar = true;
      if (this.subSystems.length === 0) {
        await this.fetchSubSystems();
      }
      this.key++;
      this.selected = [];
      this.registerDialog = true;
      this.showProgressBar = false;
    },
    async Edit() {
      console.log("edit called");
      this.showProgressBar = true;
      await this.fetchSubSystems();
      this.editKey++;
      this.editDialog = true;
      console.log("edit called", this.editDialog);
      this.editItems[0] = this._.clone(this.selected[0]);
      this.showProgressBar = false;
    },

    async editSelectedReason(item) {
      if (this.subSystems.length === 0) {
        await this.fetchSubSystems();
      }
      this.showProfile = false;
      this.editKey++;
      this.editItems[0] = this._.clone(item);
      this.editDialog = true;
    },

    async autoEdit() {
      this.showProgressBar = true;
      if (this.subSystems.length === 0) {
        await this.fetchSubSystems();
      }
      this.editDialog = true;
      this.editKey++;
      this.isAutoEdit = true;
      this.editItems = this.selected.map((row) => {
        return this._.clone(row);
      });
      this.showProgressBar = false;
    },

    onView() {
      this.profileKey++;
      if (this.selected.length == 1) {
        this.profileData = this.selected[0];
        this.showProfile = true;
      } else {
        this.$toastr.w(this.$tr("view_item_max_limit_text"));
      }
    },

    async searchReason() {
      if (this.type == 1) {
        try {
          const data = {
            typeSearch: this.type,
            content: this.content,
            contentData: this.contentData,
            slug: this.slug,
          };
          console.log(data.content);
          const response = await this.fetchStatusEventByID({ data });

          if (response != null) {
            this.onRowClicked(response);
          } else {
            this.$refs.pageFilterRef.clearInput();
          }
        } catch (error) {}
      } else if (this.type == 0) {
        this.getRecord(this.filterData);
      }
    },
    onTypeChange() {
      this.selected = [];
    },
    searchAgain() {
      this.getRecord(this.filterData);
    },
    async onFilter() {
      if (this.subSystems.length === 0) {
        await this.fetchSubSystems();
      }
      this.reasonFilter = !this.reasonFilter;
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
    searchAgain() {
      this.getRecord(this.filterData);
    },

    async getRecord(filterData) {
      try {
        const data = {
          slug: this.slug,
          typeSearch: this.type,
          content: this.content,
          contentData: this.contentData,
          subsystem: filterData.subsystem,
          type: filterData.type,
          reason: filterData.reason,
          created_date: filterData.created_date,
          include: filterData.include,
          reason_ids: filterData.reason_ids,
        };

        const res = await this.fetchStatusEvent(data);
      } catch (error) {
        console.log(error);
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
      // console.log(key);
      // console.log(this.selected);
      this.selected = this.selected.filter((data) => data.id == key);
    },
  },
  watch: {
    tabIndex: function (value) {
      this.fetchStatusEvent({
        data: {
          ...options,
          ...this?.filterData,
          typeSearch: this?.type,
          content: this?.content,
          contentData: this?.contentData,
        },
      });
    },
  },
};
</script>

<style scoped></style>
