<template>
  <v-container fluid class="py-0">
    <v-dialog
      v-model="downloadDialog"
      persistent
      width="1300"
      class="rounded-0"
    >
      <new-download-popup />
    </v-dialog>


    <v-dialog v-model="filterDialog" persistent width="1300" class="rounded-0">
      <LogsFilterDialog
        @close="filterDialog = false"
        @onSubmit="filterSubmit"
      />
    </v-dialog>
    <!-- column dialog -->
    <v-dialog v-model="columnDialog" persistent width="1300" class="rounded-0">
      <CustomizeColumn
        @closeDialog="columnDialog = false"
        @saveChanges="saveColumnSetting($event)"
        :tableHeader="$_.cloneDeep(headers)"
        :custom_columns="$_.cloneDeep(selected_column)"
        :categoryHeader="$_.cloneDeep(category)"
        :key="dialogKey"
        page_name="logs"
      />
    </v-dialog>
    <v-row>
      <v-col cols="12" class="pa-0">
        <PageHeader
          :Icon="breadcrumb_items[1].icon"
          :Title="breadcrumb_items[1].text"
          :Breadcrumb="breadcrumb_items"
        />
      </v-col>
      <!-- page filter -->

      <v-col cols="12" class="pa-0">
        <PageFilters
          ref="pageFilterRef"
          :selected_header.sync="$_.cloneDeep(category)"
          :downloadContent="filteredData"
          :filename="$tr('suppliers')"
          :content.sync="content"
          :contentT.sync="contentData"
          :selectedOption.sync="type"
          @onDownload="toggleDownload"
          @onFilter="onFilter"
          @search="searchLogsNew"
          @searchAgain="searchAgain"
          @onTypeChange="onTypeChange"
          @unSelect="unSelect"
          @onColumn="
            () => {
              dialogKey++;
              columnDialog = true;
            }
          "
        >
          <!-- <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              :label="$tr('search_date')"
              append-icon="mdi-calendar"
              class="ms-2"
              readonly
              outlined
              rounded
              dense
              hide-details=""
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" @input="getDate"></v-date-picker>
        </v-menu> -->
        </PageFilters>
      </v-col>

      <!-- end -->
      <v-col cols="12" class="pa-0">
        <v-card elevation="24">
          <v-card-text class="pa-0">
            <DataTable
              ref="tableRef"
              :key="key"
              :headers="selected_header"
              :items="filteredData"
              :search="search"
              show-select
              :ItemsLength="filteredData.length"
              :multi_select="false"
              v-model="selected"
              @click:row="onRowClicked"
              @onTablePaginate="onTableChanges"
            >
              <template v-slot:[`item.method`]="{ item }">
                <span :class="item.method == `DELETE` ? 'error--text' : ''">
                  {{ item.method }}</span
                >
              </template>
              <template v-slot:[`item.content`]="{ item }">
                <v-tooltip bottom max-width="500px">
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                      style="white-space: nowrap"
                      class="primary--text"
                    >
                      {{ $tr("contents") }}
                    </span>
                  </template>
                  <span>{{ item.content }}</span>
                </v-tooltip>
              </template>

              <template v-slot:[`item.user_id`]="{ item }">
                <span class="mx-1 primary--text font-weight-bold">
                  {{ item.user_id }}
                </span>
              </template>

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
                            {{ item.text }}
                          </p>
                          <v-chip
                            class="ms-1 tab-chip"
                            :color="item.isSelected ? 'primary' : 'white'"
                            :text-color="item.isSelected ? 'white' : 'primary'"
                            small
                            v-text="getTotalLength(item.key)"
                          />
                        </v-tab>
                      </client-only>
                    </v-tabs>
                  </v-col>
                </v-row>
              </template>
            </DataTable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <ProgressBar v-if="showProgressBar" />
  </v-container>
</template>

<script>
import RegisterUser from "~/components/users/RegisterUser";
import CustomizeColumn from "~/components/customizeColumn/CustomizeColumn.vue";
import draggable from "vuedraggable";
import LogsFilterAction from "~/components/logs/LogsFilterAction.vue";
import IconButton from "~/components/common/buttons/IconButton.vue";
import { mapGetters, mapActions } from "vuex";
import ProgressBar from "~/components/common/ProgressBar.vue";
import alert from "~/helpers/alert";
import CustomButton from "~/components/design/components/CustomButton.vue";
import DataTable from "~/components/design/DataTable.vue";
import PageActions from "~/components/design/PageActions.vue";
import PageHeader from "~/components/design/PageHeader.vue";
import LogsFilterDialog from "~/components/logs/LogsFilterDialog.vue";
import Logs from "~/configs/pages/logs";
import ColumnHelper from "~/helpers/column-helper";
import PageFilters from "../../../components/design/PageFilters.vue";

export default {
  meta: {
    hasAuth: true,
    scope: "user_activity-view",
  },
  components: {
    RegisterUser,
    CustomizeColumn,
    draggable,
    LogsFilterAction,
    IconButton,
    ProgressBar,
    CustomButton,
    DataTable,
    PageActions,
    PageHeader,
    LogsFilterDialog,
    PageFilters,
  },
  async asyncData({ store }) {
    await store.dispatch("logs/fetchLogs");
    await store.dispatch("customColumns/fetchCustomColumns", {
      view_name: "logs",
    });
  },
  data() {
    return {
      system_name: "users",
      selected: [],
      key: 0,
      showProgressBar: false,
      search: "",
      benched: 0,
      radioGroup: 1,
      view_name: "",
      columnDialog: false,
      dialogKey: 0,
      filterKey: 0,
downloadDialog:false,
      //breadcrumbs
      breadcrumb_items: Logs(this).breadcrumb_items_user,
      tabItems: Logs(this).tabItems_user,
      headers: Logs(this).headers,
      category: Logs(this).category,
      filteredData: [],

      // for column customizing
      selected_column: [],
      selected_header: [],
      //  tab
      tabIndex: 0,
      filterDialog: false,

      // search varibles

      type: 1,
      content: [],
      contentData: "",
    };
  },
  watch: {
    tabIndex: function (value) {
      this.filterFunction(this.tabItems[this.tabIndex].key, this.system_name);
      this.assignTotals(value);
    },
    selected: function () {},
  },
  computed: {
    // vuex state
    ...mapGetters({
      getTranslations: "translations/getTranslations",
      server_custom_columns: "customColumns/get_custom_columns",
      getTotals: "logs/getTotal",
      filename: "logs/get_file_name",
      filterLogs: "logs/filterLogs",
    }),
  },

  methods: {
    // vuex state methods
    ...mapActions({
      fetchTranslations: "translations/fetchTranslations",
      fetchCustomColumns: "custom_columns/fetchCustomColumns",
      searchByDate: "logs/searchLogByDate",
      refreshLog: "logs/searchLogByDate",
      fetchFilteredActivities: "logs/fetchFilteredActivities",
    }),

    // called from filter dialog
    async filterSubmit(data) {
      await this.fetchFilteredActivities(data);
      this.filterFunction(this.tabItems[this.tabIndex].key, this.system_name);
    },

    onTableChanges(options) {
      // this.fetchUserPagination(options);
    },

    // delete users activities
    async deleteLog() {
      var index = [];
      if (this.selected.length > 0) {
        this.selected.forEach((item) => {
          index.push(item.index);
        });
        try {
          this.showProgressBar = true;
          var response = await this.$axios.delete("/logs/" + index, {
            params: { date: this.filename },
          });
          if (response.data.result) {
            await this.refreshLog(this.filename);
            this.filterFunction("all", this.system_name);
            this.showProgressBar = false;
            this.selected = [];
            index = [];
            alert.removedSuccessAlert(this, this.$tr("removed_title"));
          } else {
            index = [];
            this.$toastr.e(this.$tr("could_not_delete"));
            this.showProgressBar = false;
          }
        } catch (err) {
          this.showProgressBar = false;
        }
      } else {
        this.$toastr.e(this.$tr("please_select_a_record_first"));
      }
    },

    assignTotals(value) {
      this.key++;
      this.tabItems = this.tabItems.map((item, index) => {
        index === value ? (item.isSelected = 1) : (item.isSelected = 0);
        return item;
      });
    },

    getSubString(value, length = 20) {
      let subText = value?.substring(0, length);
      if (value?.length > length) {
        subText += "...";
      }
      return subText;
    },

    getTotalLength(key) {
      return this.getTotals(key, this.system_name);
    },
    // filter from vuex
    filterFunction(tabKey, system) {
      this.filteredData = this.filterLogs(tabKey, system);
    },
    // filter by content and Id
    // searchLogs(form) {
    //   // 3521688759
    //   if (form.selectedOption == 1) {
    //     if(form.search ==''){

    //       this.search = form.search;
    //       return
    //     }
    //     var result;
    //     this.filteredData.forEach((element) => {
    //       if (element.user_id == form.search) {
    //         result = element;
    //       }
    //     });
    //     if (result != null) {
    //       this.filteredData = this.filteredData.filter(
    //         (data) => data.user_id !== result.user_id
    //       );
    //       this.filteredData?.unshift(result);
    //       this.selected = [result];
    //     } else {
    //       this.selected=[]
    //     }
    //   } else if (form.selectedOption == 0) {
    //     this.search = form.search;
    //   }
    // },

    // filter by Id
    // searchById(search) {
    //   // this.key++;
    //   this.search = search;
    //   // this.filterFunction(this.tabItems[this.tabIndex].key, this.system_name);
    // },

    async searchLogByDate(date) {
      this.showProgressBar = true;
      await this.searchByDate(date);
      this.showProgressBar = false;
      this.filterFunction(this.tabItems[this.tabIndex].key, this.system_name);
    },

    // this method is needed in each table used custom_columns

    // add or remove item from selected items
    onRowClicked(item) {
      let items = new Set(this.selected);
      items.has(item) ? items.delete(item) : items.add(item);
      this.selected = Array.from(items);
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

    //  New
    onFilter() {
      this.filterDialog = true;
    },
    searchLogsNew() {
      if (this.type == 1) {
        try {
          let result = [];
          this.filteredData.forEach((element) => {
            if (element.user_id == this.content[this.content.length - 1]) {
              result.unshift(element);
            }
          });

          if (result.length != 0) {
            result.forEach((element) => {
              this.filteredData = this.filteredData.filter(
                (data) => data.user_id !== element.user_id
              );
            });

            result.forEach((element) => {
              this.filteredData?.unshift(element);
              this.onRowClicked(element);
            });

            // this.selected = [result];
          } else {
            this.$refs.pageFilterRef.clearInput();
          }
        } catch (error) {}
      } else if (this.type == 0) {
        this.search = this.contentData;
      }
    },
    onTypeChange() {
      this.selected = [];
    },
    searchAgain() {
      this.search = this.contentData;
    },

    unSelect(key) {
      this.selected = this.selected.filter((data) => data.user_id !== key);
    },
    toggleDownload() {
      console.log("on download");
    },
  },
  async created() {
    //customize columns
    if (process.client) {
      const response = await ColumnHelper.getselectedHeader(
        this.headers,
        this.server_custom_columns
      );
      this.selected_header = response.selected_header;
      this.selected_column = this.selected_header.map((row) => row.id);
      this.category = await ColumnHelper.getCategoryValue(
        this.selected_header,
        this.category
      );
    }
    this.filterFunction(this.tabItems[this.tabIndex].key, this.system_name);
  },
};
</script>

<style scoped>
div.scroll {
  widows: 100%;
  max-height: 350px !important;
  height: 350px;
  overflow-y: scroll !important;
}

div.custom-border {
  border: 1px solid #757575;
  height: 20px !important;
}

.custom-item {
  cursor: pointer;
  height: 20px !important;
  min-height: 30px !important;
}

.custom-input {
  width: 12rem;
}

.customDisabled {
  opacity: 0.6 !important;
  pointer-events: none !important;
  cursor: not-allowed !important;
}
</style>
