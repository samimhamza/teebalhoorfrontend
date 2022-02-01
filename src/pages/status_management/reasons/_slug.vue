<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <ProgressBar v-if="showProgressBar" />
      <v-dialog
        v-model="registerDialog"
        persistent
        scrollable
        width="1300"
        v-if="$isInScope('reasons-create')"
      >
        <Dialog @closeDialog="registerDialog = false">
          <register-reason
            @closeDialog="registerDialog = false"
            :edit_data="selected"
            :key="key"
            :slug="slug"
          />
        </Dialog>
      </v-dialog>

      <v-dialog
        v-model="showProfile"
        persistent
        width="1300"
        scrollable
        v-if="$isInScope('reasons-view')"
      >
        <reason-profile
          :key="profileKey"
          @onEdit="editSelectedReason"
          :profileData="profileData"
          :dialog.sync="showProfile"
        />
      </v-dialog>

      <v-dialog
        v-model="editDialog"
        persistent
        width="1300"
        v-if="$isInScope('reasons-update')"
      >
        <edit-reason
          :edit-dialog.sync="editDialog"
          :key="editKey"
          :editItems="editItems"
          :is-auto-edit.sync="isAutoEdit"
          :slug="slug"
        />
      </v-dialog>
      <v-col cols="12">
        <PageHeader
          Icon="mdi-head-question"
          Title="reasons"
          :Breadcrumb="breadcrumb"
        />
      </v-col>
      <v-col cols="12">
        <PageFilters
          ref="pageFilterRef"
          :selected_header.sync="headers"
          :downloadContent="reasons"
          @onDownload="toggleDownload"
          :downloadDialog="downloadDialog"
          :filename="$tr('reasons')"
          :showBulkUpload="true"
          :selectedOption.sync="type"
          :showFilter="false"
          @search="searchReason"
          @searchAgain="searchAgain"
          :content.sync="content"
          :contentT.sync="contentData"
          @unSelect="unSelect"
          @onTypeChange="onTypeChange"
          :show-add-note="$isInScope('reasons-create')"
          :show-bulk-upload="$isInScope('reasons-create')"
          :showDownload="$isInScope('reasons-view')"
        >
          <CustomButton
            @click="addReason"
            icon="fa-plus"
            text="add_reason"
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
          :showAutoEdit="$isInScope('reasons-update')"
        />
      </v-col>
      <v-col cols="12">
        <DataTable
          ref="tableRef"
          :headers="headers"
          :items="reasons"
          :ItemsLength="getTotal"
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
                        v-text="getTotal"
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
                  <span v-if="item.title.length >= 50"
                    >{{ item.title.substring(0, 49) }} ...
                  </span>
                  <span v-else>{{ item.title.substring(0, 49) }} </span>
                </span>
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>
          </template>
        </DataTable>
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
import Reasons from "~/configs/pages/reason";
import CustomButton from "~/components/design/components/CustomButton.vue";
import { mapGetters, mapActions } from "vuex";
import Dialog from "~/components/design/Dialog/Dialog.vue";
import EditReason from "~/components/statusManagement/reasons/EditReason";
import ReasonProfile from "~/components/statusManagement/reasons/ReasonProfile";
import RegisterReason from "~/components/statusManagement/reasons/RegisterReason";

export default {
  meta: {
    hasAuth: true,
    scope: "reasons-view",
  },
  name: "reason",
  async asyncData({ store, params }) {
    await store.dispatch("reasons/fetchReasons", {
      slug: params.slug,
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
    ReasonProfile,
    EditReason,
    RegisterReason,
  },

  data() {
    return {
      selected: [],
      tabItems: Reasons(this).tabItems,
      headers: Reasons(this).headers,
      breadcrumb: Reasons(this).breadcrumb,
      registerDialog: false,
      showProgressBar: false,
      tabIndex: 0,
      key: 0,
      type: 1,
      content: [],
      contentData: "",

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
    };
  },

  async validate({ params }) {
    return !params.slug ? false : true;
  },

  computed: {
    ...mapGetters({
      getTranslations: "translations/getTranslations",
      reasons: "reasons/get_reasons",
      getTotal: "reasons/get_total",
    }),
  },
  async created() {},
  methods: {
    ...mapActions({
      fetchTranslations: "translations/fetchTranslations",
      fetchReasonPagination: "reasons/fetchReasonPaginate",
      removeReason: "reasons/deleteItem",
      insertReason: "reasons/insertNewItem",
      fetchReasons: "reasons/fetchReasons",
      searchId: "reasons/searchReasons",
    }),
    // add or remove item from selected items
    onRowClicked(item) {
      let items = new Set(this.selected);
      items.has(item) ? items.delete(item) : items.add(item);
      this.selected = Array.from(items);
    },

    async onTableChanges(options) {
      const data = {
        ...options,
        type: this.type,
        content: this.content,
        contentData: this.contentData,
        slug: this.slug,
      };
      await this.fetchReasons(data);
    },

    toggleDownload() {
      this.downloadDialog = !this.downloadDialog;
    },

    async viewSelectedReason(item) {
      this.profileData = item;
      this.showProfile = true;
    },

    async addReason() {
      this.showProgressBar = true;
      this.key++;
      this.selected = [];
      this.registerDialog = true;
      this.showProgressBar = false;
    },
    async Edit() {
      this.showProgressBar = true;
      this.editKey++;
      this.editDialog = true;
      this.editItems[0] = this._.clone(this.selected[0]);
      this.showProgressBar = false;
    },

    async editSelectedReason(item) {
      this.showProgressBar = true;
      this.showProfile = false;
      this.editKey++;
      this.editItems[0] = this._.clone(item);
      this.editDialog = true;
      this.showProgressBar = false;
    },

    async autoEdit() {
      this.showProgressBar = true;
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

    // search Reason
    async searchReason() {
      const data = {
        type: this.type,
        content: this.content,
        contentData: this.contentData,
        slug: this.slug,
      };

      if (this.type == 0) {
        try {
          await this.fetchReasons(data);
        } catch (error) {
          console.log(error);
        }
      } else if (this.type == 1 && this.content.length != 0) {
        var response = await this.searchId(data);
        if (response != null) {
          this.onRowClicked(response);
        } else {
          this.$refs.pageFilterRef.clearInput();
        }
      }
    },
    searchAgain() {
      const data = {
        type: this.type,
        content: this.content,
        contentData: this.contentData,
        slug: this.slug,
      };
      this.fetchReasons(data);
    },
    onTypeChange() {
      this.selected = [];
    },
    unSelect(key) {
      this.selected = this.selected.filter((data) => data.code !== key);
    },
  },
};
</script>

<style scoped></style>
