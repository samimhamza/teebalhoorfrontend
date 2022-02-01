<template>
  <v-container fluid class="pa-0 social_media">
    <v-row no-gutters>
      <ProgressBar v-if="showProgressBar" />

      <v-dialog
        v-model="isEdit"
        persistent
        width="1300"
        scrollable
        v-if="$isInScope('social_media-update')"
      >
        <SocialMediaEdit
          v-if="isEdit"
          :key="editKey"
          :editData="editData"
          @closeEdit="toggleEdit"
        />
      </v-dialog>
      <v-dialog
        v-model="autoEdit"
        persistent
        width="1300"
        scrollable
        max-height="800px"
        v-if="$isInScope('social_media-update')"
      >
        <SocialMediaAutoEdit
          v-if="autoEdit"
          :key="editKey"
          :autoEditData="autoEditData"
          @closeEdit="toggleAutoEdit"
        />
      </v-dialog>
      <v-dialog
        v-model="registerDialog"
        persistent
        width="1300"
        scrollable
        v-if="$isInScope('social_media-create')"
      >
        <Dialog @closeDialog="registerDialog = false">
          <SocialMediaRegistration />
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
          :downloadContent="getItems"
          :downloadDialog="downloadDialog"
          :filename="$tr('social_media')"
          :content.sync="content"
          :contentT.sync="contentData"
          :selectedOption.sync="type"
          :showFilter="false"
          @search="searchProject"
          @searchAgain="searchAgain"
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
            :text="$tr('create_item', $tr('social_media'))"
            type="primary"
          />
        </PageFilters>
      </v-col>
      <v-col cols="12">
        <PageActions
          :showAutoEdit="$isInScope('social_media-update')"
          :showDelete="$isInScope('social_media-delete')"
          :showBlock="$isInScope('social_media-update')"
          :showSelect="$isInScope('social_media-update')"
          :showApply="$isInScope('social_media-update')"
          :tab-key.sync="tabItems[tabIndex].key"
          @onEdit="onEdit"
          :showView="false"
          :selectedItems.sync="selectedItems"
          @onAutoEdit="onAutoEdit"
          :showEdit="$isInScope('social_media-update')"
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
          v-model="selectedItems"
          :headers="headers"
          :key="tableKey"
          :loading="apiCalling"
          @click:row="onRowClicked"
          ref="socialTableRef"
          :items="getItems"
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
                        v-text="getTotals(tabItems[i].key)"
                      />
                    </v-tab>
                  </client-only>
                </v-tabs>
              </v-col>
            </v-row>
          </template>

          <template v-slot:[`item.code`]="{ item }">
            <span class="mx-1 font-weight-bold">
              {{ item.code }}
            </span>
          </template>
          <template v-slot:[`item.website`]="{ item }">
            <span class="primary--text">
              <a :href="item.website" target="_blank"> {{ item.website }} </a>
            </span>
          </template>
        </DataTable>
        <h1></h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ProgressBar from "../../components/common/ProgressBar";
import PageHeader from "../../components/design/PageHeader";
import PageFilters from "../../components/design/PageFilters";
import PageActions from "../../components/design/PageActions";
import DataTable from "../../components/design/DataTable";
import SocialMedia from "../../configs/pages/social_media";
import CustomButton from "../../components/design/components/CustomButton";
import CloseDialogButton from "../../components/common/buttons/CloseDialogButton";
import TextField from "../../components/common/TextField";
import AutoComplete from "../../components/common/AutoComplete";
import SocialMediaRegistration from "../../components/masters/social_media/SocialMediaRegistration.vue";
import SocialMediaEdit from "../../components/masters/social_media/SocialMediaEdit.vue";
import SocialMediaAutoEdit from "../../components/masters/social_media/SocialMediaAutoEdit.vue";
import Dialog from "../../components/design/Dialog/Dialog";
import ColumnHelper from "~/helpers/column-helper";
import HandleException from "~/helpers/handle-exception";
import Alert from "../../helpers/alert";

export default {
  meta: {
    hasAuth: true,
    scope: "social_media-view",
  },

  async asyncData({ store }) {
    await store.dispatch("social_media/fetchItems", { key: "all" });
  },

  name: "SocialMedia",
  components: {
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
    SocialMediaRegistration,
    SocialMediaEdit,
    SocialMediaAutoEdit,
  },

  data() {
    return {
      tabItems: SocialMedia(this).tabItems,
      headers: SocialMedia(this).headers,
      breadcrumb: SocialMedia(this).breadcrumb,
      registerDialog: false,

      selectedItems: [],
      tabIndex: 0,
      tableKey: 0,
      // for custom columns
      dialogKey: 0,
      selected_header: [],
      showProgressBar: false,
      type: 1,
      content: [],
      contentData: "",
      downloadDialog: false,
      systemFilter: "",
      filterData: "",

      // Page actions
      showReasonDialog: false,
      selectedStatus: "",
      itemIds: [],
      allReasons: [],

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
      getItems: "social_media/getItems",
      getTotals: "social_media/getTotal",
      apiCalling: "social_media/isApiCalling",
    }),
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
      this.fetchItems({ key: this.getTabKey(), options: data });
    },
  },
  async created() {
    this.$root.$on("closeAutoEdit", this.toggleAutoEdit);
    this.$root.$on("closeEdit", this.toggleEdit);
    this.$root.$on("getData", (data) => {
      this.filterData = data;
    });
  },

  methods: {
    ...mapActions({
      fetchItems: "social_media/fetchItems",
      insertNewItem: "social_media/insertNewItem",
      deleteItem: "social_media/removeItem",
      insertNewItem: "social_media/insertNewItem",
    }),
    checkSelectedTab(value) {
      this.tableKey++;
      this.selectedItems = [];
      this.tabItems = this.tabItems.map((item, index) => {
        index === value ? (item.isSelected = 1) : (item.isSelected = 0);
        return item;
      });
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
    onRowClicked(item) {
      let items = new Set(this.selectedItems);
      items.has(item) ? items.delete(item) : items.add(item);
      this.selectedItems = Array.from(items);
    },

    onItemsSelect(items) {
      this.selectedItems = items;
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
          const response = await this.$axios.post(
            "social_media/searchSocialMedia",
            data
          );
          this.selectData(response);
        } catch (error) {}
      } else if (this.type == 0) {
        this.fetchItems({
          key: this.getTabKey(),
          options: {
            ...this.filterData,
            type: this.type,
            content: this.content,
            contentData: this.contentData,
          },
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
        this.$refs.socialTableRef.selected?.unshift(data);
      } else {
        this.$refs.pageFilterRef.clearInput();
      }
    },
    searchAgain() {
      this.fetchItems({
        key: this.getTabKey(),
        options: {
          ...this.filterData,
          type: this.type,
          content: this.content,
          contentData: this.contentData,
        },
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
      if (!this.isEdit) {
        this.selectedItems = [];
      }
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
      if (!this.isEdit) {
        this.selectedItems = [];
      }
    },
    onToggleShowProgress() {
      this.showProgressBar = !this.showProgressBar;
    },
    unSelect(key) {
      this.selectedItems = this.selectedItems.filter(
        (data) => data.code !== key
      );
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
          `reasons/id?type=${this.selectedStatus}&sub_system=Social Media`
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
            ? await this.$axios.delete(`social_media/${this.itemIds}`)
            : await this.$axios.post("social_media/changeStatus", data);

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
                `social_media/${this.itemIds}?reasonId=${reasonId}`
              )
            : await this.$axios.post("social_media/changeStatus", data);

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
      this.fetchItems({ key: this.getTabKey(), options: data });
    },

  },
};
</script>

<style>
.social_media a,
a:hover,
a:focus,
a:active {
  text-decoration: none !important;
  color: inherit !important;
}
</style>
