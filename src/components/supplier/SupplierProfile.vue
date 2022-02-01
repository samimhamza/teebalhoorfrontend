<template>
  <div>
    <v-card
      :color="$vuetify.theme.dark ? 'black' : '#f9fafd'"
      class="height-80-vh"
    >
      <v-card-title class="py-1 px-3">
        <span class="custom-dialog-title">{{ $tr("supplier_profile") }}</span>
        <v-spacer />
        <CloseBtn @click="$emit('update:dialog')" />
      </v-card-title>

      <v-card-text>
        <!-- Logo sectin -->
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
                {{
                  profileData.supplier_name
                    ? profileData.supplier_name[0].toUpperCase()
                    : ""
                }}
              </span>
            </v-avatar>
            <div
              class="d-flex flex-column align-center"
              style="position: relative; top: 0px; z-index: 10000003"
            >
              <span class="title text-h5 font-weight-bold">{{
                profileData.supplier_name
              }}</span>
            </div>
            <span
              :class="statusColor"
              style="z-index: 1000000"
              class="text--white rounded-circle active-status-btn d-flex justify-center align-center white--text font-weight-bold text-subtitle-2 open-sans"
            >
              {{ profileData.status }}
            </span>
          </div>
        </v-card>

        <!-- Header -->
        <div
          class="white pt-2 px-2 rounded-sm project-details-container"
          style="overflow-y: scroll; overflow-x: hidden; height: 450px"
        >
          <div style="position: relative"></div>

          <v-row>
            <v-col cols="12" md="6" class="py-0">
              <div class="d-flex">
                <v-icon class="me-1">mdi-information</v-icon>

                <h2 class="align-self-end">
                  {{ $tr("general_information") }}
                </h2>
              </div>
            </v-col>

            <v-col cols="12" md="6" class="py-0">
              <div class="d-flex justify-space-between">
                <h2 class="align-self-end">
                  <v-icon>mdi-account</v-icon>
                  {{ $tr("supplier_information") }}
                </h2>

                <v-btn
                  color="primary"
                  class="mx-0 rounded-sm px-1"
                  small
                  @click="openEdit"
                >
                  <v-icon class="mr-1" right small> fa-edit </v-icon>
                  {{ $tr("edit") }}
                </v-btn>
              </div>
            </v-col>
          </v-row>

          <v-divider class="grey darken-1 mt-1"></v-divider>

          <v-row>
            <!-- General Details -->
            <v-col cols="12" md="6" class="py-0 py-1">
              <v-card elevation="0" class="w-full">
                <div class="d-flex ms-2 mt-1">
                  <h3 class="align-self-end me-1">{{ $tr("companies") }}:</h3>
                  <div class="text-primary" style="font-size: 1rem">
                    <div class="d-flex" v-if="profileData.companies.length > 1">
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
                          v-for="(company, key) in profileData.companies"
                          :key="key"
                          >{{ company.name }} <br
                        /></span>
                      </v-tooltip>
                    </div>
                    <div class="d-flex" v-else>
                      {{ profileData.companies[0].name }}
                    </div>
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("supply_type") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">{{
                      profileData.supply_type
                    }}</span>
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("legal_type") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">
                      {{ profileData.legal_type }}</span
                    >
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("country_type") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">
                      {{ profileData.country_type }}</span
                    >
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("supplier_source") }}:</h3>
                    <span
                      class="text-primary ps-1"
                      v-for="(source, key) in profileData.sourcers"
                      :key="key"
                      style="font-size: 1rem"
                      >{{ source.name }},
                    </span>
                  </div>
                </div>

                <!-- <div class="d-flex ms-2 mt-1">
              <h3 class="align-self-end me-1">
               {{ $t('datatable.supplier_source') }}:
              </h3>
              <div class="text-primary " style="font-size: 1rem;">
                <div class="d-flex" v-if="profileData.sourcers.length > 1">
                      <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                              <span v-bind="attrs" v-on="on" style="white-space: nowrap" class="primary--text">
                              {{$t('datatable.supplier_source')}}
                              </span>
                          </template>
                          <span v-for="(source, key) in profileData.sourcers" :key="key">{{ source.name }} <br/></span>
                      </v-tooltip>
                  </div>
                  <div class="d-flex" v-else>
                      {{ profileData.sourcers[0].name }}
                  </div>
              </div>
            </div> -->

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("commercial_type") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">
                      {{ profileData.commercial_type }}</span
                    >
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("created_by") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">
                      {{ profileData.created_at }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("last_update") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">
                      {{
                        new Date(profileData.updated_at).toLocaleTimeString()
                      }}
                      |
                      {{
                        new Date(profileData.updated_at).toLocaleDateString()
                      }}
                    </span>
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("created_by") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">
                      {{ profileData.created_by == null ? "" : getfullName }}
                    </span>
                  </div>
                </div>
              </v-card>
            </v-col>

            <v-divider vertical class="grey"></v-divider>

            <!-- Supplier Information -->

            <v-col cols="12" md="6" class="py-0">
              <v-card elevation="0" class="w-full">
                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("supplier_trading_name") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">{{
                      profileData.supplier_trading_name
                    }}</span>
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("supplier_name") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">
                      {{ profileData.supplier_name }}</span
                    >
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("main_phone") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem"
                      ><a :href="`tel:${profileData.main_phone}`">{{
                        profileData.main_phone
                      }}</a></span
                    >
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("email") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">
                      <a :href="`mailto:${profileData.email}`">{{
                        profileData.email
                      }}</a></span
                    >
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("purchase_order_phone") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">
                      <a :href="`tel:${profileData.purchase_order_phone}`">{{
                        profileData.purchase_order_phone
                      }}</a></span
                    >
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("website") }}:</h3>
                    <a
                      :href="`${profileData.website}`"
                      target="_blanck"
                      class="text-primary ps-1"
                      style="font-size: 1rem"
                      >{{ profileData.website }}</a
                    >
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("prepration_period") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">
                      {{ profileData.prepration_period }}</span
                    >
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("label") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">
                      {{ profileData.label.title }}</span
                    >
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("status") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">
                      {{ profileData.status }}</span
                    >
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("code_id") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">
                      {{ profileData.code }}</span
                    >
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Location Details -->

          <v-card
            elevation="0"
            class="pa-2 w-full"
            v-for="(row, key) in profileData.locations"
            :key="key"
          >
            <div class="d-flex justify-space-between mb-1">
              <h2 class="align-self-end">
                <v-icon>mdi-map-marker</v-icon>
                {{ $tr("location_details") }}
                {{ profileData.locations.length > 1 ? key + 1 : "" }}
              </h2>
            </div>

            <v-divider class="grey darken-1 mt-1"></v-divider>

            <v-row>
              <!-- first row -->
              <v-col cols="12" md="6" class="py-0 pt-2">
                <div class="d-flex mb-1">
                  <h3 class="align-self-end me-1">{{ $tr("country") }}:</h3>
                  <span class="text-primary ps-1" style="font-size: 1rem">{{
                    row.country.name
                  }}</span>
                </div>

                <div class="d-flex mb-1">
                  <h3 class="align-self-end me-1">{{ $tr("state") }}:</h3>
                  <span class="text-primary ps-1" style="font-size: 1rem">{{
                    row.state.name
                  }}</span>
                </div>

                <div class="d-flex mb-1">
                  <h3 class="align-self-end me-1">{{ $tr("type") }}:</h3>
                  <span class="text-primary ps-1" style="font-size: 1rem">{{
                    row.location_type
                  }}</span>
                </div>

                <div class="d-flex mb-1">
                  <h3 class="align-self-end me-1">{{ $tr("address") }}:</h3>
                  <span class="text-primary ps-1" style="font-size: 1rem">{{
                    row.address
                  }}</span>
                </div>
              </v-col>

              <v-divider vertical class="grey"></v-divider>

              <!-- second row -->
              <v-col cols="12" md="6" class="py-0 pt-2">
                <div class="d-flex mb-1">
                  <h3 class="align-self-end me-1">
                    {{ $tr("crowd_status") }}:
                  </h3>
                  <span class="text-primary ps-1" style="font-size: 1rem">{{
                    row.crowd_status
                  }}</span>
                </div>

                <div class="d-flex mb-1">
                  <h3 class="align-self-end me-1">{{ $tr("staff_name") }}:</h3>
                  <span class="text-primary ps-1" style="font-size: 1rem">{{
                    row.contact_staff_name
                  }}</span>
                </div>

                <div class="d-flex mb-1">
                  <h3 class="align-self-end me-1">{{ $tr("phone") }}:</h3>
                  <span class="text-primary ps-1" style="font-size: 1rem">
                    {{ row.location_phone }}</span
                  >
                </div>

                <div class="d-flex mb-1">
                  <h3 class="align-self-end me-1">{{ $tr("map_link") }}:</h3>
                  <span class="text-primary ps-1" style="font-size: 1rem">
                    {{ row.map_link }}</span
                  >
                </div>
              </v-col>
            </v-row>
          </v-card>

          <!-- statues -->
          <v-card elevation="0" class="pa-2 w-full">
            <h2 class="align-self-end">
              {{ $tr("status_transformation") }}
            </h2>
            <v-divider class="grey darken-1 mt-1"></v-divider>
            <div class="profile-table">
              <v-simple-table dense>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">{{ $tr("status") }}</th>
                      <th class="text-left">{{ $tr("applied_by") }}</th>
                      <th class="text-left">{{ $tr("reasons") }}</th>
                      <th class="text-left">{{ $tr("date") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, n) in profileData.statuses
                        .slice()
                        .reverse()"
                      :key="n"
                    >
                      <td>{{ item.pivot.status }}</td>
                      <td>
                        {{
                          profileData.changed_by[n].firstname +
                          " " +
                          profileData.changed_by[n].lastname
                        }}
                      </td>
                      <td>{{ item.title }}</td>
                      <td>
                        {{
                          new Date(item.pivot.created_at).toLocaleDateString()
                        }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
          </v-card>

          <!-- Remarks -->
          <v-row class="mx-1">
            <v-col>
              <div class="mt-3 mt-3 pb-1">
                <span class="subtitle-1">{{ $tr("remarks") }}</span>
              </div>
              <v-card elevation="0" class="px-2 py-3">
                <div class="text-primary" style="font-size: 1rem">
                  <h4>{{ profileData.label.title }}</h4>
                  <span v-if="profileData.note != null">
                    <span v-if="profileData.note.length >= 70 && !showMore"
                      >{{ profileData.note.substring(0, 69) }}
                      <span
                        style="cursor: pointer"
                        @click="showMore = true"
                        v-if="!showMore"
                        class="primary--text"
                        >read more</span
                      ></span
                    >
                    <span v-if="showMore"
                      >{{ profileData.note }}
                      <span
                        style="cursor: pointer"
                        @click="showMore = false"
                        v-if="showMore"
                        class="primary--text"
                        >read less</span
                      ></span
                    >
                  </span>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import CloseBtn from "../design/Dialog/CloseBtn.vue";
import CustomInput from "~/components/design/components/CustomInput.vue";
import TextField from "../common/TextField";
import FormBtn from "~/components/design/components/FormBtn.vue";
import SelectedItem from "~/components/design/components/SelectedItem.vue";
import FlagIcon from "../../components/common/FlagIcon.vue";

export default {
  components: {
    CustomInput,
    FormBtn,
    TextField,
    SelectedItem,
    CloseBtn,
    FlagIcon,
  },

  computed: {
    getfullName() {
      return (
        this.profileData.created_by.firstname +
        " " +
        this.profileData.created_by.lastname
      );
    },
  },

  props: {
    profileData: {
      type: Object,
      require: true,
    },
    dialog: {
      type: Boolean,
      required: true,
    },
  },

  created() {
    console.log("profile", this.profileData);
  },

  data() {
    return {
      editProfile: false,
      showMore: false,
      statusColor: "",
    };
  },

  mounted() {
    switch (this.profileData.status) {
      case "inactive":
        this.statusColor = "warning";
        break;
      case "active":
        this.statusColor = "success";
        break;
      case "removed":
        this.statusColor = "error";
        break;
      case "pending":
        this.statusColor = "warning";
        break;
      case "block":
        this.statusColor = "error";
        break;
      case "warning":
        this.statusColor = "warning";
        break;
      default:
        this.statusColor = "primary";
    }
  },
  methods: {
    openEdit() {
      this.$emit("closeProfile");
      this.$emit("onEdit");
    },
  },
};
</script>

<style lang="scss">
.flag-icon {
  height: 22px;
  width: 22px;

  &.flag-round {
    background-size: cover;
    border-radius: 100%;
    height: 26px;
    width: 26px;
  }
}
</style>

<style scopped>
.project-details-container {
  margin-top: 10rem !important;
}

.active-status-btn {
  width: 4.5rem;
  height: 4.5rem;
  /* background: #37b34a; */
  padding: 10px;
  position: absolute !important;
  right: 10rem !important;
  top: 270px;
  transform: translateY(-50%);
  box-shadow: 0 0 8px 2px rgb(0 0 0 / 15%);
}

.profile-details {
  border-bottom: 2px solid var(--input-border-color);
}

.details_title {
  font-size: 1rem !important;
  font-weight: bold !important;
}

.details_value {
  font-size: 0.9rem !important;
  font-weight: 500;
  color: var(--input-border-color);
}

.list-item {
  padding-top: 0px;
}
</style>
