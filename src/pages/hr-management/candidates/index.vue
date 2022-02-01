<template>
  <v-container fluid class="pa-0">
    <RegisterCandidate
      v-if="registerDialog"
      :registerDialog.sync="registerDialog"
    />

    <v-row no-gutters>
      <v-col cols="12">
        <PageHeader
          :Icon="breadcrumb[1].icon"
          :Title="breadcrumb[1].text"
          :Breadcrumb="breadcrumb"
        />
      </v-col>

      <v-col cols="12">
        <PageFilters show-bulk-upload>
          <CustomButton
            @click="openRegisterDialog"
            icon="fa-user-plus"
            :text="$tr('create_item', $tr('candidate'))"
            type="primary"
          />
        </PageFilters>
      </v-col>
      <v-col cols="12">
        <PageActions
          :selectedItems="selectedItems"
          tab-key.sync="all"
          @onEdit="() => {}"
          @onView="() => {}"
          @onAutoEdit="() => {}"
          @onDelete="() => {}"
          @onApply="() => {}"
          @onSubmit="() => {}"
          @onBlock="() => {}"
          :reasons="[]"
          :showReasonDialog="false"
        />
      </v-col>
      <v-col cols="12">
        <DataTable
          :headers="headers"
          :items="candidates"
          :ItemsLength="candidateTotal"
          v-model="selectedItems"
          :loading="isLoading"
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
                        v-text="candidateTotal"
                      />
                    </v-tab>
                  </client-only>
                </v-tabs>
              </v-col>
            </v-row>
          </template>
          <template v-slot:[`item.code`]="{ item }">
            <span class="mx-1 primary--text font-weight-bold">
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
import PageHeader from "~/components/design/PageHeader";
import PageFilters from "~/components/design/PageFilters";
import PageActions from "~/components/design/PageActions";
import DataTable from "~/components/design/DataTable";
import HandleException from "~//helpers/handle-exception";
import Alert from "~/helpers/alert";
import Helper from "~/helpers/helpers";
import RegisterCandidate from "~/components/hr_management/candidates/RegisterCandidate";
import CustomButton from "~/components/design/components/CustomButton";
import Candidates from "~/configs/pages/hr_management/candidates";


export default {
  meta: {
    hasAuth: true,
    scope: "users-view",
  },

  async asyncData({ $axios }) {

    try {
      const response = await $axios.get("candidates");
      return {
        candidates: response.data.data,
        candidateTotal: response.data.total,
      };
    } catch (error) {}
    return {
      candidates: [],
      candidateTotal: 0,
    };
  },

  components: {
    CustomButton,
    DataTable,
    PageActions,
    PageFilters,
    PageHeader,
    RegisterCandidate,
  },
  data() {
    return {
      category: Candidates.category,
      headers: Candidates.headers,
      breadcrumb: Candidates.breadcrumb,
      tabItems: Candidates.tabItems,
      selectedItems: [],
      tabIndex: 0,
      isLoading: false,
      registerDialog: false,
    };
  },

  watch: {
    tabIndex: function (value) {
      this.selectedItems = [];
      this.checkSelectedTab(value);
    },
  },

  methods: {
    // active selected tab item when tab changed
    checkSelectedTab(value) {
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

    // paginate data from server
    async onTableChanges(options) {
      try {
        this.isLoading = true;
        const response = await this.$axios.get("candidates", {
          params: options,
        });
        this.candidates = response.data.data;
        this.candidateTotal = response.data.total;
      } catch (error) {
        this.candidates = [];
        this.candidateTotal = 0;
      }
      this.isLoading = false;
    },

    // open candidate register dialog
    openRegisterDialog() {
      this.registerDialog = true;
    },
  },
};
</script>
