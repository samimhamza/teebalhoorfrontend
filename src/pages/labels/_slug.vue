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
            :page_name="'label_' + $route.params.slug"
            :key="dialogKey"
          />
        </client-only>
      </v-dialog>

      <!-- /** filter label dialog */ -->

      <v-dialog v-model="filterDialog" persistent width="1300">
        <labelFilter
          :subSystems="subSystems"
          @close="filterDialog = false"
          @getRecord="getRecord"
          v-if="filterDialog"
          :prevFilterData="filterData"
          @closeDialog="filterDialog = false"
        />
      </v-dialog>

      <!-- /**end filter dialog */ -->

      <ProgressBar v-if="showProgressBar" />
      <v-dialog
        v-model="registerDialog"
        persistent
        scrollable
        width="1300"
        v-if="$isInScope('labels-create')"
      >
        <Dialog @closeDialog="registerDialog = false">
          <RegisterLabel
            :subSystems="subSystems"
            @closeDialog="registerDialog = false"
            :edit_data="selectedItems"
            :key="key"
          />
        </Dialog>
      </v-dialog>

      <v-dialog
        v-model="showProfile"
        persistent
        width="1300"
        scrollable
        v-if="$isInScope('labels-view')"
      >
        <LabelProfile
          :key="profileKey"
          @onEdit="editSelectedLabel"
          :profileData="profileData"
          :dialog.sync="showProfile"
        />
      </v-dialog>

      <v-dialog
        v-model="editDialog"
        persistent
        width="1300"
        v-if="$isInScope('labels-update')"
      >
        <EditLabel
          :subSystems="subSystems"
          :edit-dialog.sync="editDialog"
          :key="editKey"
          :editItems="editItems"
          :is-auto-edit.sync="isAutoEdit"
        />
      </v-dialog>
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
          :downloadContent="labels"
          @onDownload="toggleDownload"
          :downloadDialog="downloadDialog"
          :filename="$tr('labels')"
          :showBulkUpload="true"
          @search="searchLabel"
          @searchAgain="searchAgain"
          @unSelect="unSelect"
          @onTypeChange="onTypeChange"
          :selectedOption.sync="type"
          :content.sync="content"
          :contentT.sync="contentData"
          @onFilter="onFilter"
          @onColumn="
            () => {
              dialogKey++;
              columnDialog = true;
            }
          "
          :show-bulk-upload="$isInScope('labels-create')"
          :showDownload="$isInScope('labels-view')"
        >
          <CustomButton
            @click="addLabel"
            icon="fa-plus"
            text="add_label"
            type="primary"
          />
        </PageFilters>
      </v-col>
      <v-col cols="12">
        <PageActions
          :selectedItems.sync="selectedItems"
          :tab-key.sync="tabItems[tabIndex].key"
          :showBlock="false"
          @onView="onView"
          @onEdit="Edit"
          @onDelete="onDelete"
          @onAutoEdit="autoEdit"
          @onApply="onApply"
          @onSubmit="onSubmit"
          :reasons="allReasons"
          :showReasonDialog.sync="showReasonDialog"
          :statusItems="[
            { id: 'archive', name: 'archive' },
            { id: 'live', name: 'live' },
          ]"
          :showView="$isInScope('labels-view')"
          :showEdit="$isInScope('labels-update')"
          :showAutoEdit="$isInScope('labels-update')"
          :showDelete="$isInScope('labels-delete')"
          :showSelect="$isInScope('labels-update')"
          :showApply="$isInScope('labels-update')"
        />
      </v-col>
      <v-col cols="12">
        <DataTable
          v-model="selectedItems"
          :headers="selected_header"
          :key="tableKey"
          :loading="apiCalling"
          @click:row="onRowClicked"
          :items="labels"
          :ItemsLength="getTotals(getTabKey())"
          @onTablePaginate="onTableChanges"
          ref="dataTableRef"
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
              @click="() => viewSelectedLabel(item)"
              class="mx-1 primary--text font-weight-bold"
            >
              {{ item.code }}
            </span>
          </template>
          <template v-slot:[`item.title`]="{ item }">
            <v-tooltip bottom max-width="800">
              <template v-slot:activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on" style="white-space: nowrap">
                  <span v-if="item.title.length >= 90"
                    >{{ item.title.substring(0, 89) }} ...
                  </span>
                  <span v-else>{{ item.title.substring(0, 89) }} </span>
                </span>
              </template>
              <span>{{ item.title }} </span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.sub_systems`]="{ item }">
            <v-tooltip bottom v-if="item.sub_systems">
              <template v-slot:activator="{ on, attrs }">
                <span
                  v-bind="attrs"
                  v-on="on"
                  style="white-space: nowrap"
                  class="primary--text"
                >
                  {{ $tr("sub_systems") }}
                </span>
              </template>
              <span v-for="sub in item.sub_systems" :key="sub.id"
                >{{ sub.name }} <br
              /></span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.label`]="{ item }">
            <div class="d-flex align-center">
              <div>{{ item.label }}</div>

              <svg
                id="Layer_1"
                height="13"
                class="ms-1"
                style="transform: scaleX(-1)"
                :fill="item.color"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 434.76793 294.202"
              >
                <path
                  d="M148.4,303.52l86.238,94.641a67.39788,67.39788,0,0,0,49.84,21.84h239.12a44.93217,44.93217,0,0,0,44.801-44.801l-.00391-201.6a44.93211,44.93211,0,0,0-44.801-44.801h-239.68a68.7035,68.7035,0,0,0-49.281,21.281l-86.242,92.957c-15.68,16.801-15.68,43.121,0,60.48Z"
                  transform="translate(-135.13112 -127.29898)"
                  style="
                    stroke: #fff;
                    stroke-miterlimit: 10;
                    stroke-width: 20px;
                  "
                />
              </svg>
            </div>
          </template>
        </DataTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProgressBar from "../../components/common/ProgressBar";
import PageHeader from "../../components/design/PageHeader";
import PageFilters from "../../components/design/PageFilters";
import PageActions from "../../components/design/PageActions";
import DataTable from "../../components/design/DataTable";
import Labels from "../../configs/pages/labels";
import CustomButton from "../../components/design/components/CustomButton.vue";
import { mapGetters, mapActions } from "vuex";
import Dialog from "../../components/design/Dialog/Dialog.vue";
import LabelProfile from "../../components/labels/LabelProfile.vue";
import RegisterLabel from "../../components/labels/RegisterLabel.vue";
import EditLabel from "../../components/labels/EditLabel.vue";
import HandleException from "../../helpers/handle-exception";
import CustomizeColumn from "../../components/customizeColumn/CustomizeColumn.vue";
import labelFilter from "../../components/labels/labelFilter.vue";
import ColumnHelper from "~/helpers/column-helper";
import Alert from "../../helpers/alert";

export default {
  meta: {
    hasAuth: true,
    scope: "labels-view",
  },
  name: "labels",
  async asyncData({ store, params }) {
    await store.dispatch("customColumns/fetchCustomColumns", {
      view_name: "label_" + params.slug,
    });
    await store.dispatch("labels/fetchLabels", {
      slug: params.slug,
      key: "all",
    });
    //  options: {
    //     ...this?.filterData,
    //     type: this?.type,
    //     content: this?.content,
    //     contentData: this?.contentData,
    //   },
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
    LabelProfile,
    RegisterLabel,
    EditLabel,
    CustomizeColumn,
    labelFilter,
  },

  data() {
    return {
      selectedItems: [],
      tabItems: Labels(this).tabItems,
      headers: Labels(this).headers,
      breadcrumb: Labels(this).breadcrumb,
      category: Labels(this).category,
      registerDialog: false,
      tabIndex: 0,
      key: 0,
      showProgressBar: false,
      type: 1,
      content: [],
      contentData: "",
      subSystems: [],

      // Page actions
      showReasonDialog: false,
      selectedStatus: "",
      itemIds: [],
      allReasons: [],

      // for custom columns
      dialogKey: 0,
      columnDialog: false,
      selected_column: [],
      selected_header: [],
      showProgressBar: false,
      tableKey: 0,

      // Edit and Auto Edit
      editKey: 0,
      editItems: [],
      editDialog: false,
      isAutoEdit: false,

      // Profile
      showProfile: false,
      profileData: {},
      profileKey: 0,
      downloadDialog: false,

      // filter
      filterDialog: false,
      filterData: {},
    };
  },

  async validate({ params }) {
    return !params.slug ? false : true;
  },

  computed: {
    // get labels from getters
    ...mapGetters({
      getTranslations: "translations/getTranslations",
      getTotals: "labels/getTotal",
      labels: "labels/getLabels",
      apiCalling: "labels/isApiCalling",
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

  watch: {
    tabIndex: function (value) {
      this.checkSelectedTab(value);
      let data = {
        ...this.filterData,
        type: this.type,
        content: this.content,
        contentData: this.contentData,
      };
      this.fetchLabels({
        key: this.getTabKey(),
        slug: this.slug,
        options: data,
      });
    },
  },

  methods: {
    ...mapActions({
      fetchTranslations: "translations/fetchTranslations",
      fetchLabels: "labels/fetchLabels",
      fetchLabelsByID: "labels/fetchLabelsByID",
    }),

    checkSelectedTab(value) {
      this.tableKey++;
      this.selectedItems = [];
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
      this.fetchLabels({
        key: this.getTabKey(),
        options: {
          ...options,
          ...this.filterData,
          type: this.type,
          content: this.content,
          contentData: this.contentData,
        },
        slug: this.slug,
      });
    },

    getTabKey() {
      return this.tabItems[this.tabIndex].key;
    },

    toggleDownload() {
      this.downloadDialog = !this.downloadDialog;
    },
    unSelect(key) {
      this.selectedItems = this.selectedItems.filter(
        (data) => data.code !== key
      );
    },

    async viewSelectedLabel(item) {
      this.profileData = item;
      this.showProfile = true;
    },

    async fetchSubSystems() {
      const element = [];
      try {
        const response = await this.$axios.get(
          `systems_sub_systems?system_name=${this.slug}`
        );
        if (response?.status === 200 && response?.data?.result) {
          const subs = response?.data?.data;
          let i = 0;
          for (let index = 0; index < subs.length; index++) {
            if (
              !(subs[index].name == "Labels" || subs[index].name == "Reasons")
            ) {
              element[i] = subs[index];
              i++;
            }
          }
          this.subSystems = element;
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

    //     *************      Change Status       ******************
    async fetchAllReasons() {
      this.showProgressBar = true;
      try {
        const response = await this.$axios.get(
          `reasons/id?type=${this.selectedStatus}&sub_system=Labels (${this.slug})`
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
      await this.fetchAllReasons();
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
            ? await this.$axios.delete(`labels/${this.itemIds}`)
            : await this.$axios.post("labels/changeStatus", data);

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
                `labels/${this.itemIds}?reasonId=${reasonId}`
              )
            : await this.$axios.post("labels/changeStatus", data);
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
      this.getTabKey() === "deleted" || this.getTabKey() === "removed"
        ? this.noReasonSubmit()
        : await this.fetchAllReasons();
    },

    fetchRecentDataAndClearSelected() {
      this.selectedItems = [];
      this.itemIds = [];
      this.selectedStatus = "";
      this.fetchLabels({
        key: this.getTabKey(),
        slug: this.slug,
        options: this.filterData,
      });
    },

    async addLabel() {
      this.showProgressBar = true;
      if (this.subSystems.length === 0) {
        await this.fetchSubSystems();
      }
      this.key++;
      this.selectedItems = [];
      this.registerDialog = true;
      this.showProgressBar = false;
    },
    async Edit() {
      this.showProgressBar = true;
      if (this.subSystems.length === 0) {
        await this.fetchSubSystems();
      }
      this.editKey++;
      this.editDialog = true;
      this.editItems[0] = this._.clone(this.selectedItems[0]);
      this.showProgressBar = false;
    },

    async editSelectedLabel(item) {
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
      this.editItems = this.selectedItems.map((row) => {
        return this._.clone(row);
      });
      this.showProgressBar = false;
    },

    onView() {
      this.profileKey++;
      if (this.selectedItems.length == 1) {
        this.profileData = this.selectedItems[0];
        this.showProfile = true;
      } else {
        this.$toastr.w(this.$tr("view_item_max_limit_text"));
      }
    },
    // **********************************search label *********************************
    async searchLabel() {
      // search by Id
      if (this.type == 1) {
        const data = {
          type: this.type,
          content: this.content,
          contentData: this.contentData,
        };
        var response = await this.fetchLabelsByID({
          key: this.getTabKey(),
          options: data,
          slug: this.slug,
        }); // this.content='',
        // this.contentData='',
        // this.type ==1?this.type=0:this.type=1;
        if (response != null) {
          this.onRowClicked(response);
        } else {
          this.$refs.pageFilterRef.clearInput();
        }
      } else if (this.type == 0) {
        this.getRecord(this.filterData);
      }
    },
    selectData(response) {},
    async searchAgain() {
      await this.getRecord(this.filterData);
    },
    onTypeChange() {
      this.selectedItems = [];
    },
    // customize columns: start=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // called from chiled save column changes

    async onFilter() {
      if (this.subSystems.length === 0) {
        await this.fetchSubSystems();
      }
      this.filterDialog = true;
    },
    async getRecord(filterData) {
      try {
        const data = {
          key: this.getTabKey(),
          slug: this.slug,
          options: {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
            subsystem: filterData.subsystem,
            title: filterData.title,
            created_date: filterData.created_date,
            include: filterData.include,
            label_ids: filterData.label_ids,
          },
        };

        this.fetchLabels(data);
      } catch (error) {
        this.$toastr.w(error);
      }
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
};
</script>
