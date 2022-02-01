<template>
  <v-card
    :color="$vuetify.theme.dark ? 'black' : '#f9fafd'"
    class="height-80-vh"
  >
    <v-card-title class="py-1">
      <v-app-bar-title
        ><span class="custom-dialog-title text-uppercase">{{
          $tr("profile")
        }}</span></v-app-bar-title
      >
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
          style="position: relative; z-index: 10000001"
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
            <span class="title text-h5 font-weight-bold arial">{{
              profileData.name
            }}</span>
          </div>
          <span
            class="text--white rounded-circle active-status-btn d-flex justify-center align-center white--text font-weight-bold text-subtitle-2 open-sans"
            style="z-index: 10000003"
          >
            {{ profileData.status }}
          </span>
        </div>
      </v-card>

      <div
        class="white pt-2 px-2 mt-5 rounded-sm"
        style="overflow-y: scroll; overflow-x: hidden; height: 450px"
      >
        <div style="position: relative"></div>

        <div class="d-flex justify-space-between mx-2 profile-details pb-1">
          <span class="text-subtitle-1">{{ $tr("details") }}</span>
          <v-btn
            color="primary "
            class="rounded-sm mx-0 pe-2"
            small
            @click="$emit('onEdit')"
          >
            <v-icon class="pe-2" right small> fa-edit </v-icon>
            <span class="text-subtitle-2">{{ $tr("edit") }}</span>
          </v-btn>
        </div>
        <v-row class="mx-2">
          <v-col cols="12" md="6" class="pa-0">
            <div class="ms-2 mt-2 d-flex">
              <h3>{{ $t("textField.role_name") }}:</h3>
              <span class="text-primary ps-1" style="font-size: 1rem">
                {{ profileData.name }}</span
              >
            </div>
            <div class="ms-2 mt-1 d-flex">
              <h3>{{ $t("textField.departments") }} :</h3>
              <span class="text-primary ps-1" style="font-size: 1rem">
                <span class="text-primary" style="font-size: 1rem">
                  <span v-if="profileData.departments.length > 1">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span
                          v-bind="attrs"
                          v-on="on"
                          style="white-space: nowrap"
                          class="primary--text"
                        >
                          {{ $tr("departments") }}
                        </span>
                      </template>
                      <span v-for="(com, n) in profileData.departments" :key="n"
                        >{{ com.name }} <br
                      /></span>
                    </v-tooltip>
                  </span>
                  <span v-else>
                    {{ profileData.departments[0].name }}
                  </span>
                </span>
              </span>
            </div>
            <div class="ms-2 mt-1 d-flex">
              <h3>{{ $tr("status") }} :</h3>
              <span class="text-primary ps-1" style="font-size: 1rem">
                {{ profileData.status }}</span
              >
            </div>
          </v-col>
          <v-col cols="12" md="6" class="pa-0">
            <div class="ms-2 mt-2 d-flex">
              <h3>{{ $t("common.created_by") }} :</h3>
              <span class="text-primary ps-1" style="font-size: 1rem">
                {{
                  profileData.created_by.firstname +
                  " " +
                  profileData.created_by.lastname
                }}
              </span>
            </div>
            <div class="ms-2 mt-1 d-flex">
              <h3>{{ $tr("created_by") }}:</h3>
              <span
                class="text-primary ps-1"
                style="font-size: 1rem"
                v-if="profileData.created_at != null"
              >
                {{ new Date(profileData.created_at).toLocaleTimeString() }} |
                {{ new Date(profileData.created_at).toLocaleDateString() }}
              </span>
            </div>
            <div class="ms-2 mt-1 d-flex">
              <h3>{{ $t("common.updated_at") }} :</h3>
              <span
                class="text-primary ps-1"
                style="font-size: 1rem"
                v-if="profileData.updated_at != null"
              >
                {{ new Date(profileData.updated_at).toLocaleTimeString() }} |
                {{ new Date(profileData.updated_at).toLocaleDateString() }}
              </span>
            </div>
          </v-col>
        </v-row>

        <div>
          <v-row class="pt-3">
            <v-col cols="12" class="d-flex py-0">
              <v-card elevation="0" class="pa-2 w-full">
                <h2 class="align-self-end">
                  {{ $tr("status_transformation") }}
                </h2>
                <v-divider class="grey darken-1 mt-1 mb-2"></v-divider>
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
                              new Date(
                                item.pivot.created_at
                              ).toLocaleDateString()
                            }}
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div>
          <v-row>
            <v-col md="12" cols="12" class="pt-2 pb-1">
              <span class="subtitle-1">Remarks</span>
            </v-col>
            <v-col class="py-0" md="12" cols="12">
              <v-card elevation="0" class="px-2 py-3">
                <div class="text-primary" style="font-size: 1rem">
                  <h4>{{ profileData.label.title }}</h4>
                  <span v-if="profileData.note != null">
                    <span v-if="profileData.note.length >= 70 && !showMore">
                      {{ profileData.note.substring(0, 69) }}
                      <span
                        style="cursor: pointer"
                        @click="showMore = true"
                        v-if="!showMore"
                        class="primary--text"
                      >
                        read more
                      </span>
                    </span>
                    <span v-if="showMore"
                      >{{ profileData.note }}
                      <span
                        style="cursor: pointer"
                        @click="showMore = false"
                        v-if="showMore"
                        class="primary--text"
                        >read less</span
                      >
                    </span>
                  </span>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import SelectedItem from "../../design/components/SelectedItem";
import CloseBtn from "../../design/Dialog/CloseBtn";
import FlagIcon from "../../common/FlagIcon.vue";

export default {
  name: "TeamProfile",
  components: { CloseBtn, SelectedItem, FlagIcon },
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    profileData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      showMore: false,
    };
  },
};
</script>

<style scoped>
.active-status-btn {
  width: 4.5rem;
  height: 4.5rem;
  background: #37b34a;
  padding: 10px;
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
  color: #a7b4c8;
}

a {
  text-decoration: none;
  color: black !important;
}

.theme--dark a {
  color: white !important;
}

.border-radius-1 {
  border-radius: 2px !important;
}
.flag-btn {
  width: 3rem;
  height: 3rem;

  position: absolute !important;
  right: 15rem !important;
  top: 0;
  transform: translateY(-50%);
  box-shadow: 0 0 8px 2px rgb(0 0 0 / 15%);
}
</style>
<style>
.flag-btn .flag-icon {
  height: 34px !important;
  width: 34px !important;
}
</style>
