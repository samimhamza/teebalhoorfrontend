<template>
  <div class="mt-3">
    <div
      class="d-flex align-center justify-center text-center"
      style="min-height: 400px"
      v-if="!hasCandidates"
    >
      <div>
        <p class="mb-1" style="font-size: 18px">
          {{ $tr("no_candidates_added_to_job") }}
        </p>
        <CustomButton
          icon="fa-user-plus"
          :text="$tr('add_candidates')"
          type="primary"
        />
      </div>
    </div>
    <div v-else-if="hasCandidates">
      <div class="action-buttons d-flex justify-center align-center">
        <CustomButton @click="() => {}" icon="fa-filter" text="filter_button" />
        <CustomButton @click="() => {}" icon="fa-columns" text="column" />
        <CustomButton @click="() => {}" icon="fa-download" text="download" />
      </div>
      <DataTable
        class="mt-1"
        :elevation="0"
        ref="tableRef"
        :headers="headers"
        :items="items"
        :ItemsLength="30"
        paginateSmall
        v-model="selectedItems"
        @click:row="() => {}"
        @select="() => {}"
        @onTablePaginate="() => {}"
        :dark="this.$vuetify.theme.isDark"
      >
        <template v-slot:[`item.name`]="{ item }">
          <div class="candidate-name d-flex align-center justify-space-between">
            <p class="ma-0">
              {{ item.name }}
            </p>
            <div class="ps-2 d-flex align-center">
              <div class="candidate-file px-1">
                <v-icon small>fa-file</v-icon>
              </div>
              <v-btn icon text>
                <v-icon small>far fa-eye</v-icon>
              </v-btn>

              <v-menu transition="slide-y-transition" bottom left offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text icon v-bind="attrs" v-on="on">
                    <v-icon small>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item link v-for="(item, i) in menuItems" :key="i">
                    <v-list-item-icon>
                      <v-icon small v-text="item.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </template>
        <template v-slot:[`item.owner`]="{ item }">
          <div class="candidate-owner">
            <nuxt-link
              to="/users/987656789"
              class="text-decoration-none text--primary"
            >
              <UserChip :name="item.owner" avatar="AS" />
            </nuxt-link>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>
<script>
import CustomButton from "../design/components/CustomButton.vue";
import DataTable from "../design/DataTable.vue";
import UserChip from "../design/UserChip.vue";

export default {
  components: {
    CustomButton,
    DataTable,
    UserChip,
  },
  data() {
    return {
      hasCandidates: true,
      headers: [
        {
          text: "candidate_name",
          value: "name",
          sortable: false,
        },
        {
          text: "match_stage",
          value: "stage",
          sortable: false,
        },
        {
          text: "dropped",
          value: "dropped",
          category_id: 1,
        },
        {
          text: "drop_reason",
          value: "reason",
          category_id: 1,
        },
        {
          text: "match_owner",
          value: "owner",
          category_id: 1,
        },
        {
          text: "match_create_date",
          value: "created_at",
          category_id: 1,
        },
      ],
      items: [
        {
          id: 1,
          name: "Abdullah Qasemi",
          stage: "New Candidates",
          dropped: "No",
          reason: "",
          owner: "Rohullah Hussaini",
          created_at: "2020-10-10",
        },
        {
          id: 2,
          name: "Mohammad Nabavi",
          stage: "New Candidates",
          dropped: "No",
          reason: "",
          owner: "Rohullah Hussaini",
          created_at: "2020-10-10",
        },
        {
          id: 3,
          name: "Humayon Mohammadi",
          stage: "New Candidates",
          dropped: "No",
          reason: "",
          owner: "Rohullah Hussaini",
          created_at: "2020-10-10",
        },
      ],
      selectedItems: [],
      selectedStatus: "",
      statusItems: [
        {
          id: "edit_columns",
          name: "edit_columns",
        },
        {
          id: "export",
          name: "export",
        },
      ],
      menuItems: [
        {
          title: "details",
          icon: "fa-info-circle",
        },
        {
          title: "move",
          icon: "fa-exchange-alt",
        },
        {
          title: "compose_email",
          icon: "fa-envelope",
        },
        {
          title: "drop",
          icon: "fa-user-times",
        },
        {
          title: "remove",
          icon: "fa-trash",
        },
      ],
    };
  },
};
</script>
<style scoped>
.candidate-file {
  opacity: 0.7;
}
</style>
