<template>
  <v-card
    :color="$vuetify.theme.dark ? 'black' : '#f9fafd'"
    class="height-80-vh"
  >
    <v-card-title class="py-1" elevation="0">
      <span class="custom-dialog-title rounded-0">{{ $tr("profile") }}</span>
      <v-spacer />
      <CloseBtn @click="$emit('update:dialog')" />
    </v-card-title>
    <v-card-text>
      <v-card
        elevation="0"
        style="
          position: sticky;
          top: 0;
          z-index: 10000000;
          max-height: 130px;
          margin-bottom: 130px;
        "
      >
        <div
          class="d-flex flex-column align-center py-10"
          style="position: relative; top: 0px; z-index: 10000001"
        >
          <v-avatar :size="100" color="blue-grey">
            <span class="white--text text-h3 pa-1">
              {{ department.name ? department.name[0].toUpperCase() : "" }}
            </span>
          </v-avatar>
          <div
            class="d-flex flex-column align-center"
            style="position: relative; top: 0px; z-index: 10000003"
          >
            <span class="title text-h5 font-weight-bold">
              {{ department.name }}
            </span>
          </div>

          <span
            :style="`background:${getColor}`"
            class="text--white rounded-circle active-status-btn d-flex justify-center align-center white--text font-weight-bold text-subtitle-2 open-sans"
            >{{ $tr(department.status) }}</span
          >
        </div>
      </v-card>

      <div
        class="white pt-2 px-2 rounded-sm"
        style="overflow-y: scroll; overflow-x: hidden; height: 450px"
      >
        <div style="position: relative"></div>

        <div
          class="d-flex justify-space-between mx-2 custom-profile-details pb-1"
        >
          <span class="text-subtitle-1">{{ $tr("details") }}</span>
          <v-btn
            color="primary "
            class="rounded-sm mx-0 pe-2"
            small
            @click="$emit('onEdit', department)"
          >
            <v-icon class="pe-2" right small @click="() => $emit('edit')">
              fa-edit
            </v-icon>
            <span class="text-subtitle-2">{{ $tr("edit") }}</span>
          </v-btn>
        </div>

        <v-row>
          <v-col>
            <div class="ms-2 d-flex">
              <h3>{{ $tr("country") }}:</h3>
              <span
                class="text-primary ps-1"
                style="font-size: 1rem"
                v-if="
                  department.companies.map((c) => c.countries)[0].length > 1
                "
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                      style="white-space: nowrap"
                      class="primary--text"
                    >
                      {{ $tr("countries") }}
                    </span>
                  </template>
                  <span
                    v-for="(country, index) in department.companies.map(
                      (c) => c.countries
                    )[0]"
                    :key="index"
                    >{{ country.name }} <br />
                  </span>
                </v-tooltip>
              </span>
              <span v-else class="text-primary ps-1" style="font-size: 1rem">
                {{ department.companies.map((c) => c.countries)[0][0].name }}
              </span>
            </div>
            <div class="ms-2 mt-1 d-flex">
              <h3>{{ $tr("company") }}:</h3>
              <span
                class="text-primary ps-1"
                style="font-size: 1rem"
                v-if="department.companies.length > 1"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                      style="white-space: nowrap"
                      class="primary--text"
                    >
                      {{ $tr("companies") }}
                    </span>
                  </template>
                  <span
                    v-for="(company, index) in department.companies"
                    :key="index"
                    >{{ company.name }} <br
                  /></span>
                </v-tooltip>
              </span>
              <span v-else class="text-primary ps-1" style="font-size: 1rem">
                {{ department.companies[0].name }}
              </span>
            </div>
            <div class="ms-2 mt-1 d-flex">
              <h3>{{ $tr("department") }}:</h3>
              <span class="text-primary ps-1" style="font-size: 1rem">{{
                department.name
              }}</span>
            </div>
            <div class="ms-2 mt-1 d-flex">
              <h3>{{ $tr("industry") }}:</h3>
              <span
                class="text-primary ps-1"
                style="font-size: 1rem"
                v-if="department.industry"
                >{{ department.industry.name }}</span
              >
            </div>
            <div class="ms-2 mt-1 d-flex">
              <h3>{{ $tr("status") }}:</h3>
              <span class="text-primary ps-1" style="font-size: 1rem">{{
                $tr(department.status)
              }}</span>
            </div>
          </v-col>
          <v-col>
            <v-row>
              <v-col cols="12" md="6" class="pa-0">
                <div class="ms-2 d-flex">
                  <h3>{{ $tr("created_by") }}:</h3>
                  <span class="text-primary ps-1" style="font-size: 1rem">{{
                    department.created_by == null ? "" : getfullName
                  }}</span>
                </div>
                <div class="ms-2 mt-1 d-flex">
                  <h3>{{ $tr("created_at") }}:</h3>
                  <span class="text-primary ps-1" style="font-size: 1rem">{{
                    department.created_at
                  }}</span>
                </div>
                <div class="ms-2 mt-1 d-flex">
                  <h3>{{ $tr("last_update") }}:</h3>
                  <span class="text-primary ps-1" style="font-size: 1rem">{{
                    department.updated_at
                  }}</span>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="mx-1">
          <v-col>
            <div class="mt-3 mt-3 pb-1">
              <span class="text-subtitle-1">{{ $tr("remarks") }}</span>
            </div>
            <div class="white rounded-sm" style="min-height: 120px">
              <p class="text-primary ps-1" style="font-size: 1rem">
                {{ department.note }}
              </p>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import CloseBtn from "../../../components/design/Dialog/CloseBtn";

export default {
  components: { CloseBtn },
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    department: {
      type: Object,
      required: true,
    },
  },
  computed: {
    getfullName() {
      return (
        this.department.created_by.firstname +
        " " +
        this.department.created_by.lastname
      );
    },
    getColor() {
      switch (this.department.status) {
        case "active":
          return "#37b34a";
        case "inactive":
          return "#F3F713";
        case "pending":
          return "#C9472B";
        case "warning":
          return "#E8B60F";
      }
    },
  },
};
</script>
