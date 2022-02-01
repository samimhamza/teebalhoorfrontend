<template>
  <v-container fluid class="pa-0">
    <ProgressBar v-if="showProgressBar" />
    <JobProfile
      :showProfile.sync="showProfile"
      @close="closeProfile"
      :profileData="profileData"
    />

    <!-- Customize Column Section -->
    <v-dialog v-model="columnDialog" persistent width="1300" class="rounded-0">
      <client-only>
        <!-- <CustomizeColumn
          @closeDialog="columnDialog = false"
          @saveChanges="saveChanges($event)"
          :tableHeader="$_.cloneDeep(headers)"
          :custom_columns="$_.clone(local_custom_columns)"
          :category="$_.cloneDeep(category)"
          page_name="business_location"
          :key="dialogKey"
        /> -->
      </client-only>
    </v-dialog>

    <!-- Profile Section -->

    <!-- Register  Section  -->
    <RegisterJobPost
      v-if="registerDialog"
      :registerDialog.sync="registerDialog"
      :allCurrencies="allCurrencies"
      :allLabels="allLabels"
      :allOccupations="allOccupations"
      :allDepartments="allDepartments"
      @closeDialog="registerDialog = false"
    />

    <v-dialog
      v-model="editDialog"
      persistent
      width="1300"
      v-if="$isInScope('labels-update')"
    >
      <AutoEditJobPost
        :edit-dialog.sync="editDialog"
        :key="editKey"
        :allCurrencies="allCurrencies"
        :allLabels="allLabels"
        :allOccupations="allOccupations"
        :allDepartments="allDepartments"
        :editItems="editItems"
        :is-auto-edit.sync="isAutoEdit"
      />
    </v-dialog>

    <!-- Page Filter and Page actions Section -->
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
          :selected_header.sync="selected_header"
          :content.sync="content"
          :contentT.sync="contentData"
          :selectedOption.sync="type"
          @onFilter="onFilter"
          @unSelect="unSelect"
          @searchAgain="searchAgain"
          show-add-note
          show-bulk-upload
          showDownload
          :header.sync="headers"
          :downloadContent="getItems"
          :downloadDialog="downloadDialog"
          :filename="$tr('job_posts')"
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
            :text="$tr('create_item', $tr('job_post'))"
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

          <template v-slot:[`item.descriptions`]="{ item }">
            <v-menu offset-y open-on-hover :close-on-content-click="false" min-width="400" max-width="800">
            <template v-slot:activator="{ on, attrs }">
              <span
                style="white-space: nowrap"
                v-bind="attrs"
                v-on="on"
                class="mb-1"
              >
                <span class="primary--text">{{ $tr('view_item', $tr('descriptions'))}}</span>
              </span>
            </template>
              <v-card class="pb-2">
                <v-card-title class="pt-1 pb-0">
                  <v-app-bar-title>
                    <span class="custom-dialog-title">{{ $tr("descriptions") }}</span>
                  </v-app-bar-title>
                  <v-spacer />
                </v-card-title>
                  <v-divider class="mt-1"></v-divider>
                <v-card-text>
                  <span  v-html="item.descriptions"></span>
                </v-card-text>
            </v-card>
          </v-menu>
          </template>
          <template v-slot:[`item.details`]="{ item }">
            <v-menu offset-y open-on-hover :close-on-content-click="false" min-width="400" max-width="1000">
            <template v-slot:activator="{ on, attrs }">
              <span
                style="white-space: nowrap"
                v-bind="attrs"
                v-on="on"
                class="mb-1"
              >
                <span class="primary--text">{{ $tr('view_item', $tr('details'))}}</span>
              </span>
            </template>
              <v-card class="pb-2">
                <v-card-title class="pt-1 pb-0">
                  <v-app-bar-title>
                    <span class="custom-dialog-title">{{ $tr("details") }}</span>
                  </v-app-bar-title>
                  <v-spacer />
                </v-card-title>
                  <v-divider class="mt-1"></v-divider>
                <v-card-text>
                  <span  v-html="item.details"></span>
                </v-card-text>
            </v-card>
          </v-menu>
          </template>

          <template v-slot:[`item.reference`]="{ item }">
            <v-tooltip bottom max-width="800" v-if="item.reference">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" style="white-space: nowrap">
                  <span v-if="item.reference.length >= 30"
                    >{{ item.reference.substring(0, 29) }} ...
                  </span>
                  <span v-else>{{ item.reference.substring(0, 29) }} </span>
                </span>
              </template>
              <span>{{ item.reference }}</span>
            </v-tooltip>
          </template>

          <template v-slot:[`item.office_address`]="{ item }">
            <v-tooltip bottom max-width="800" v-if="item.office_address">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" style="white-space: nowrap">
                  <span v-if="item.office_address.length >= 30"
                    >{{ item.office_address.substring(0, 29) }} ...
                  </span>
                  <span v-else
                    >{{ item.office_address.substring(0, 29) }}
                  </span>
                </span>
              </template>
              <span>{{ item.office_address }}</span>
            </v-tooltip>
          </template>

          <template v-slot:[`item.company_id`]="{ item }">
            <span v-if="item.company"> {{ item.company.name }}</span>
          </template>

          <template v-slot:[`item.department_id`]="{ item }">
            <span v-if="item.department"> {{ item.department.name }}</span>
          </template>

          <template v-slot:[`item.occupation_id`]="{ item }">
            <span v-if="item.occupation"> {{ item.occupation.name }}</span>
          </template>

          <template v-slot:[`item.is_remote`]="{ item }">
            <span> {{ item.is_remote ? "Yes" : "No" }}</span>
          </template>

          <template v-slot:[`item.is_published`]="{ item }">
            <span> {{ item.is_published ? "Yes" : "No" }}</span>
          </template>
          <template v-slot:[`item.is_pinned`]="{ item }">
            <span> {{ item.is_pinned ? "Yes" : "No" }}</span>
          </template>
          <template v-slot:[`item.code`]="{ item }">
            <span
              @click="() => viewSelectedJobPost(item)"
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
import JobPosts from "~/configs/pages/hr_management/job_posts";
import RegisterJobPost from "~/components/hr_management/job_posts/RegisterJobPost";
import CustomizeColumn from "../../../components/customizeColumn/CustomizeColumn.vue";
import JobProfile from "~/components/jobs/JobProfile.vue";
import Alert from "../../../helpers/alert";
import Dialog from "../../../components/design/Dialog/Dialog.vue";
import HandleException from "~/helpers/handle-exception";
import AutoEditJobPost from "../../../components/hr_management/job_posts/AutoEditJobPost.vue";
import CloseBtn from '../../../components/design/Dialog/CloseBtn.vue'
export default {
  async asyncData({ store }) {
    await store.dispatch("customColumns/fetchCustomColumns", {
      view_name: "labels",
    });
    await store.dispatch("job_posts/fetchJobPosts", { key: "all" });
  },

  components: {
    Dialog,
    RegisterJobPost,
    CustomButton,
    ProgressBar,
    DataTable,
    PageActions,
    PageFilters,
    PageHeader,
    CustomizeColumn,
    JobProfile,
    AutoEditJobPost,
    CloseBtn
  },

  data() {
    return {
      category: JobPosts(this).category,
      headers: JobPosts(this).headers,
      tabItems: JobPosts(this).tabItems,
      breadcrumb: JobPosts(this).breadcrumb,

      selectedItems: [],
      tabIndex: 0,

      // Insert Section
      showProgressBar: false,
      registerDialog: false,

      // Edit and Auto Edit
      editItems: [],
      editDialog: false,
      editKey: 0,
      isAutoEdit: false,

      // for custom columns
      dialogKey: 0,
      columnDialog: false,
      local_custom_columns: [],
      selected_header: [],
      last_columns_update: [],
      last_header_update: [],
      showProgressBar: false,
      // profile section
      showProfile: false,
      // Page actions
      showReasonDialog: false,
      selectedStatus: "",
      itemIds: [],
      allReasons: [],

      allDepartments: [],
      allLabels: [],
      allCurrencies: [],
      allOccupations: [],

      downloadDialog: false,
      jobPostFilter: false,
      filterData: "",
      type: 1,
      content: [],
      contentData: "",
      profileData: {},
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
      apiCalling: "job_posts/isApiCalling",
      getTotals: "job_posts/getTotal",
      getItems: "job_posts/getJobPosts",
      custom_columns: "customColumns/get_custom_columns",
    }),
  },
  async created() {
    if (process.client) {
      this.local_custom_columns = this._.clone(this.custom_columns);
    }
    this.getselectedHeader();
    this.getCategory();
    if (process.client) {
      this.last_header_update = this._.clone(this.header);
    }
    this.$root.$on("getData", (data) => {
      this.filterData = data;
    });
  },

  methods: {
    // vuex state methods
    ...mapActions({
      fetchItems: "job_posts/fetchJobPosts",
      insertItem: "job_posts/insertNewItem",
      deleteItem: "job_posts/deleteItem",
    }),

    onClose(){

    },

    onFilter() {
      this.jobPostFilter = !this.jobPostFilter;
    },
    async searchBusinessLocation() {
      if (this.type == 1) {
        try {
          const data = {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
          };
          const response = await this.$axios.post("job-posts/search", data);
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

    onView() {
      if (this.selectedItems.length == 1) {
        this.profileData = this.selectedItems[0];
        this.showProfile = true;
      } else {
        this.$toastr.w(this.$tr("view_item_max_limit_text"));
      }
    },
    closeProfile(value) {
      if (value == false) {
        this.showProfile = false;
      }
    },

    // get item by code
    async viewSelectedJobPost(item) {
      this.profileData = item;
      this.showProfile = true;
    },

    async onEdit() {
      this.showProgressBar = true;
      await this.fetchNecessaryData();
      this.editKey++;
      this.editItems[0] = this.assignEditData(
        this._.clone(this.selectedItems)
      )[0];
      this.editDialog = true;
      this.isAutoEdit = false;
      this.showProgressBar = false;
    },

    async onAutoEdit() {
      if (this.selectedItems.length > 0) {
        await this.fetchNecessaryData();
        this.editKey++;
        this.showProgressBar = true;
        this.editItems = [];
        this.editItems = this.assignEditData(this._.clone(this.selectedItems));
        this.editDialog = true;
        this.isAutoEdit = true;
        this.showProgressBar = false;
      }
    },

    assignEditData(item) {
      let data = item.map((row) => {
        return {
          id: row.id,
          title:
            row.occupation?.name?.length > 15
              ? row.occupation?.name.substr(0, 15) + "..."
              : row.occupation?.name,
          department_id: row.department_id,
          occupation_id: row.occupation_id,
          location: row.location,
          descriptions: row.descriptions,

          contract_type: row.contract_type,
          minimum_experience_level: row.minimum_experience_level,
          headcount: row.headcount,
          is_remote: row.is_remote,

          min_salary: row.min_salary,
          max_salary: row.max_salary,
          currency_id: row.currency_id,
          salary_type: row.salary_type,
          details: row.details,

          expected_close_date: row.expected_close_date,
          close_date: row.close_date,
          open_date: row.open_date,
        };
      });
      return data;
    },

    async fetchNecessaryData() {
      this.showProgressBar = true;
      if (
        this.allDepartments.length === 0 ||
        this.allOccupations.length === 0 ||
        this.allLabels.length === 0 ||
        this.allCurrencies.length === 0
      ) {
        try {
          const response = await this.$axios.get("job-posts/id");
          if (response?.status === 200 && response?.data?.result) {
            this.allCurrencies = response?.data?.allCurrencies;
            this.allLabels = response?.data?.allLabels;
            this.allOccupations = response?.data?.allOccupations;
            this.allDepartments = response?.data?.allDepartments;
          } else {
            this.$toastr.e(this.$tr("something_went_wrong"));
          }
        } catch (error) {
          HandleException.handleApiException(this, error);
        }
      }
      this.showProgressBar = false;
    },

    // toggle register dialog
    async toggleRegisterDialog() {
      await this.fetchNecessaryData();
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

    // customize columns: start=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // called from chiled save column changes
    saveChanges(data) {
      this.columnDialog = false;
      this.local_custom_columns = data.selected_columns;
      this.selected_header = data.selected_header;
      this.last_columns_update = data.selected_columns;
      this.last_header_update = data.selected_header;
      this.category.forEach((i) => {
        i.value = 0;
      });
      this.getCategory();
    },

    // this method is needed in each table used custom_columns
    getselectedHeader() {
      if (this.local_custom_columns.length > 0) {
        this.headers.forEach((i) => {
          this.local_custom_columns.forEach((j) => {
            if (i.id == j) {
              this.selected_header.push(i);
            }
          });
        });
        if (process.client) {
          this.last_columns_update = this._.clone(this.local_custom_columns);
        }
      } else {
        this.selected_header = this.headers;
        this.headers.forEach((row) => {
          this.local_custom_columns.push(row.id);
        });
        if (process.client) {
          this.last_columns_update = this._.clone(this.local_custom_columns);
        }
      }
    },

    getCategory() {
      this.selected_header.forEach((i) => {
        this.category.forEach((j) => {
          if (i.category_id == j.category_id) {
            j.value++;
          }
          if (j.category_id == 0) {
            j.value = this.selected_header.length;
          }
        });
      });
    },
    // customize columns: end=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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
          `reasons/id?type=${this.selectedStatus}&sub_system=Job Posts`
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
            ? await this.$axios.delete(`job-posts/${this.itemIds}`)
            : await this.$axios.post("job-posts/change-status", data);

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
                `job-posts/${this.itemIds}?reasonId=${reasonId}`
              )
            : await this.$axios.post("job-posts/change-status", data);

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
  },
};
</script>
