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
        page_name="systems"
      />
    </v-dialog>

    <v-row no-gutters>
      <ProgressBar v-if="showProgressBar" />
      <v-dialog
        v-model="profileDialog"
        persistent
        width="1300"
        scrollable
        v-if="$isInScope('systems-view')"
      >
        <SystemProfile
          :profileData="profileData"
          :dialog.sync="profileDialog"
        />
      </v-dialog>

      <v-dialog
        v-model="isEdit"
        persistent
        width="1300"
        scrollable
        v-if="$isInScope('systems-update')"
      >
        <SystemEdit
          :key="editKey"
          :editDialog.sync="isEdit"
          :editData="editData"
        />
      </v-dialog>
      <v-dialog
        v-model="registerDialog"
        persistent
        width="1300"
        scrollable
        v-if="$isInScope('systems-update')"
      >
        <Dialog @closeDialog="registerDialog = false">
          <SystemRegistration
            :isEdit="isEdit"
            @onToggleShowProgress="onToggleShowProgress"
            :editData="editData"
          />
        </Dialog>
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
          :selected_header.sync="headers"
          :downloadContent="tableItems"
          :downloadDialog="downloadDialog"
          :filename="$tr('systems')"
          :content.sync="content"
          :contentT.sync="contentData"
          :selectedOption.sync="type"
          :showFilter="false"
          @search="searchProject"
          @searchAgain="searchAgain"
          @onDownload="toggleDownload"
          @unSelect="unSelect"
          @onTypeChange="onTypeChange"
          @onColumn="
            () => {
              dialogKey++;
              columnDialog = true;
            }
          "
        >
          <CustomButton
            @click="registerDialog = true"
            icon="fa-plus"
            :text="$tr('create_item', $tr('system'))"
            type="primary"
          />
        </PageFilters>
      </v-col>
      <v-col cols="12">
        <PageActions
          @onView="onView"
          @onEdit="onEdit"
          :showSelect="false"
          :showBlock="false"
          :showApply="false"
          :showDelete="false"
          :defaultAction="false"
          :showAutoEdit="false"
          :selectedItems="selectedItems"
          @onAutoEdit="onAutoEdit"
          :showView="$isInScope('systems-view')"
          :showEdit="$isInScope('systems-update')"
        />
      </v-col>
      <v-col cols="12">
        <DataTable
          ref="tableRef"
          :headers="selected_header"
          :items="tableItems"
          :ItemsLength="itemsTotal"
          v-model="selectedItems"
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
                        v-text="itemsTotal"
                      />
                    </v-tab>
                  </client-only>
                </v-tabs>
              </v-col>
            </v-row>
          </template>
          <template v-slot:[`item.sub_systems`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span
                  v-bind="attrs"
                  v-on="on"
                  style="white-space: nowrap"
                  class="primary--text"
                >
                  {{ $tr("sub_system") }}
                </span>
              </template>
              <span v-for="sub in item.sub_systems" :key="sub.id"
                >{{ sub.name }} <br
              /></span>
            </v-tooltip>
          </template>

          <template v-slot:[`item.logo`]="{ item }">
            <v-avatar :size="30" color="blue-grey darken-3">
              <v-img class="pa-1" :src="item.logo"> </v-img>
            </v-avatar>
          </template>

          <!-- <template v-slot:[`item.id`]="{ item }">
            <span>{{ tableItems.indexOf(item) + 1 }}</span>
          </template> -->
          <template v-slot:[`item.code`]="{ item }">
            <span
              @click="() => viewSelectedSystem(item)"
              class="mx-1 primary--text font-weight-bold"
            >
              {{ item.code }}
            </span>
          </template>
        </DataTable>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ProgressBar from "../../../components/common/ProgressBar";
import PageHeader from "../../../components/design/PageHeader";
import PageFilters from "../../../components/design/PageFilters";
import PageActions from "../../../components/design/PageActions";
import DataTable from "../../../components/design/DataTable";
import System from "../../../configs/pages/system";
import CustomButton from "../../../components/design/components/CustomButton";
import CloseDialogButton from "../../../components/common/buttons/CloseDialogButton";
import TextField from "../../../components/common/TextField";
import AutoComplete from "../../../components/common/AutoComplete";
import SystemRegistration from "../../../components/system/SystemRegistration.vue";
import SystemProfile from "../../../components/system/SystemProfile.vue";
import Dialog from "../../../components/design/Dialog/Dialog";
import CustomizeColumn from "../../../components/customizeColumn/CustomizeColumn.vue";
import SystemEdit from "../../../components/system/SystemEdit.vue";
import ColumnHelper from "~/helpers/column-helper";

export default {
  meta: {
    hasAuth: true,
    scope: "systems-view",
  },

  async asyncData({ store }) {
    await store.dispatch("customColumns/fetchCustomColumns", {
      view_name: "systems",
    });
    await store.dispatch("systems/fetchItems");
    await store.dispatch("actions_store/fetchItems");
  },

  name: "System",
  components: {
    SystemProfile,
    Dialog,
    AutoComplete,
    TextField,
    CloseDialogButton,
    CustomButton,
    DataTable,
    PageActions,
    PageFilters,
    PageHeader,
    ProgressBar,
    SystemRegistration,
    CustomizeColumn,
    SystemEdit,
  },

  data() {
    return {
      category: System(this).category,
      tabItems: System(this).tabItems,
      headers: System(this).headers,
      breadcrumb: System(this).breadcrumb,
      registerDialog: false,
      profileDialog: false,

      // Profile
      showProfile: false,
      profileData: {},

      selectedItems: [],
      tabIndex: 0,
      // for custom columns
      dialogKey: 0,
      columnDialog: false,
      selected_column: [],
      selected_header: [],
      showProgressBar: false,
      type: 1,
      content: [],
      contentData: "",
      downloadDialog: false,
      systemFilter: "",
      filterData: "",

      autoEdit: false,
      autoEditData: [],
      teamEdit: false,
      systemEditKey: 0,
      editData: {},

      // Single Edit
      isEdit: false,
      editData: {},
      editKey: 0,
    };
  },

  computed: {
    ...mapGetters({
      getTranslations: "translations/getTranslations",
      tableItems: "systems/items",
      itemsTotal: "systems/itemsTotal",
      apiCalling: "systems/isApiCalling",
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
    this.$root.$on("closeAutoEdit", this.toggleAutoEdit);
    this.$root.$on("closeEdit", this.toggleEdit);
    this.$root.$on("getData", (data) => {
      this.filterData = data;
    });
  },

  methods: {
    ...mapActions({
      fetchTranslations: "translations/fetchTranslations",
      fetchItems: "systems/fetchItems",
      insertNewItem: "systems/insertNewItem",
      deleteItem: "systems/deleteItem",
      paginateItems: "systems/paginateItems",
    }),

    onView() {
      if (this.selectedItems.length == 1) {
        this.profileData = this.selectedItems[0];
        this.profileDialog = true;
      } else {
        this.$toastr.i(this.$tr("select_only_one_item"));
      }
    },

    async viewSelectedSystem(item) {
      this.profileData = item;
      this.showProfile = true;
    },

    onRowClicked(item) {
      let items = new Set(this.selectedItems);
      items.has(item) ? items.delete(item) : items.add(item);
      this.selectedItems = Array.from(items);
    },

    onItemsSelect(items) {
      this.selectedItems = items;
    },

    toggleDownload() {
      this.downloadDialog = !this.downloadDialog;
    },

    onFilter() {
      this.systemFilter = !this.systemFilter;
    },
    async searchProject() {
      if (this.type == 1) {
        try {
          const data = {
            type: this.type,
            content: this.content,
            contentData: this.contentData,
          };
          const response = await this.$axios.post("systems/searchSystem", data);
          this.selectData(response);
        } catch (error) {}
      } else if (this.type == 0) {
        this.fetchItems({
          type: this.type,
          content: this.content,
          contentData: this.contentData,
        });
        // this.getRecord(this.filterData);
      }
    },
    onTypeChange() {
      this.selectedItems = [];
    },
    selectData(response) {
      if (response.status === 200) {
        const data = response.data;
        this.deleteItem(data.id);
        this.insertNewItem(data);
        this.selectedItems?.unshift(data);
        this.$refs.tableRef.selected?.unshift(data);
      } else {
        this.$refs.pageFilterRef.clearInput();
      }
    },
    searchAgain() {
      this.fetchItems({
        type: this.type,
        content: this.content,
        contentData: this.contentData,
      });
      // this.getRecord(this.filterData);
    },
    async getRecord(filterData) {
      // try {
      //   const data = {
      //     tableTabKey: this.getTabKey(),
      //     searchData: {
      //       type: this.type,
      //       content: this.content,
      //       country_id: filterData.country_id,
      //       current_country_id: filterData.current_country_id,
      //       role_id: filterData.role_id,
      //       team_id: filterData.team_id,
      //       project_id: filterData.project_id,
      //       department_id: filterData.department_id,
      //       created_date: filterData.created_date,
      //       updated_date: filterData.updated_date,
      //       firstname: filterData.firstname,
      //       lastname: filterData.lastname,
      //       address: filterData.address,
      //       language: filterData.language,
      //       include: filterData.include,
      //       team_ids: filterData.team_ids,
      //     },
      //   };
      //   const res = await this.fetchItems(data);
      // } catch (error) {
      //   if (error.response.status === 401) {
      //     redirect("/auth/signin");
      //   } else {
      //     console.error(error.response.statusText);
      //   }
      // }
    },
    onAutoEdit() {
      this.editKey++;
      this.autoEditData = this.selectedItems;
      this.autoEdit = !this.autoEdit;
    },
    toggleAutoEdit() {
      this.editKey++;
      this.autoEdit = !this.autoEdit;
    },
    onEdit() {
      if (this.selectedItems.length == 1) {
        this.editKey++;
        this.editData = this.selectedItems[0];
        this.isEdit = !this.isEdit;
      } else {
        this.$toastr.i(this.$tr("please_select_a_record_first"));
      }
    },
    toggleEdit() {
      this.editKey++;
      this.isEdit = !this.isEdit;
    },
    onToggleShowProgress() {
      this.showProgressBar = !this.showProgressBar;
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
    // =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  },
  // =>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
};
</script>

<style scoped></style>
