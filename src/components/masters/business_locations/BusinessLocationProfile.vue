<template>
  <div>
    <v-card
      :color="$vuetify.theme.dark ? 'black' : '#f9fafd'"
      class="height-80-vh"
    >
      <v-card-title class="py-1 px-3">
        <span class="custom-dialog-title">{{
          $tr("Business_Location_Profile")
        }}</span>
        <v-spacer />
        <close-btn @click="$emit('update:dialog')" />
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
                {{ profileData.name ? profileData.name[0].toUpperCase() : "" }}
              </span>
            </v-avatar>
            <div
              class="d-flex flex-column align-center"
              style="position: relative; top: 0px; z-index: 10000003"
            >
              <span class="title text-h5 font-weight-bold">{{
                profileData.name
              }}</span>
            </div>

            <span
              class="text--white rounded-circle active-status-btn d-flex justify-center align-center white--text font-weight-bold text-subtitle-2 open-sans"
            >
              <span class="mb-19">
                <FlagIcon
                  :flag="profileData.country.iso2.toLowerCase()"
                  :round="true"
                  large
                />
              </span>
            </span>
          </div>
        </v-card>

        <!-- Header -->
        <div
          class="white pt-2 px-2 rounded-sm"
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
                  <v-icon>mdi-map-marker</v-icon>
                  {{ $tr("businessLocation_information") }}
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
                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("name") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">{{
                      profileData.name
                    }}</span>
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("status") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">{{
                      profileData.status
                    }}</span>
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("created_at") }}:</h3>
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
              </v-card>
            </v-col>

            <!-- Business Location Information -->

            <v-col cols="12" md="6" class="py-0">
              <v-card elevation="0" class="w-full">
                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("country") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">{{
                      profileData.country.name
                    }}</span>
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("state") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">{{
                      profileData.state.name
                    }}</span>
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("address") }}:</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">{{
                      profileData.address
                    }}</span>
                  </div>
                </div>

                <div>
                  <div class="ms-2 mt-1 d-flex">
                    <h3>{{ $tr("created_by") }} :</h3>
                    <span class="text-primary ps-1" style="font-size: 1rem">
                      {{ profileData.created_by == null ? "" : getfullName }}
                    </span>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>

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
import FormBtn from "../../design/components/FormBtn";
import SelectedItem from "../../design/components/SelectedItem";
import CustomInput from "../../design/components/CustomInput";
import TextField from "../../common/TextField";
import { mapActions, mapGetters } from "vuex";
import CloseBtn from "../../design/Dialog/CloseBtn.vue";
import FlagIcon from "../../../components/common/FlagIcon.vue";

export default {
  components: {
    CustomInput,
    SelectedItem,
    FormBtn,
    TextField,
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

  data() {
    return {
      showMore: false,
    };
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

  methods: {
    openEdit() {
      // console.log("profile closed")
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
.active-status-btn {
  width: 4.5rem;
  height: 4.5rem;
  /* background: #37b34a; */
  position: absolute !important;
  right: 10rem !important;
  top: 250px;
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
