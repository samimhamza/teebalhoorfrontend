<template>
  <v-card
    :color="$vuetify.theme.dark ? 'black' : '#f9fafd'"
    class="height-80-vh"
  >
    <v-card-title class="py-1">
      <span class="custom-dialog-title">{{ $tr("profile") }}</span>
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
          <v-avatar
            tile
            color="#58595b"
            class="rounded d-inline-block mb-1"
            :size="100"
          >
            <v-img
              lazy-src="https://picsum.photos/id/11/10/6"
              :src="profileData.logo"
            ></v-img>
          </v-avatar>
          <div
            class="d-flex flex-column align-center"
            style="position: relative; top: 0px; z-index: 10000003"
          >
            <span class="title text-h5 font-weight-bold">
              {{ profileData.name }}
            </span>
          </div>

          <span
            :class="statusColor"
            class="text--white rounded-circle active-status-btn d-flex justify-center align-center white--text font-weight-bold text-subtitle-2 open-sans"
          >
            <span>
              {{ profileData.status }}
            </span>
          </span>
        </div>
      </v-card>

      <div
        class="white pt-2 px-2 rounded-sm"
        style="overflow-y: scroll; overflow-x: hidden; height: 300px"
      >
        <div style="position: relative"></div>

        <div
          class="d-flex justify-space-between mx-2 custom-profile-details pb-1"
        >
          <span class="text-subtitle-1">{{ $tr("general_information") }}</span>
          <v-btn
            color="primary "
            class="mx-0 px-1"
            small
            @click="$emit('onEdit', profileData)"
          >
            <v-icon class="mr-1" right small> fa-edit </v-icon>
            {{ $t("buttons.edit") }}
          </v-btn>
        </div>

        <v-row>
          <v-col>
            <div class="ms-2 d-flex">
              <h3>{{ $tr("investment_type") }} :</h3>
              <span class="text-primary ps-1" style="font-size: 1rem">{{
                profileData.investment_type
              }}</span>
            </div>

            <div class="ms-2 mt-1 d-flex">
              <h3>{{ $tr("code_id") }} :</h3>
              <span class="text-primary ps-1" style="font-size: 1rem">{{
                profileData.code
              }}</span>
            </div>
            <div class="ms-2 mt-1 d-flex">
              <h3>{{ $tr("updated_by") }} :</h3>
              <span class="text-primary ps-1" style="font-size: 1rem">
                {{
                  profileData.updated_by.firstname +
                  " " +
                  profileData.updated_by.lastname
                }}</span
              >
            </div>
            <div
              class="ms-2 mt-1 d-flex"
              v-if="profileData.departments.length > 0"
            >
              <h3>{{ $t("common.departments") }} :</h3>
              <span
                class="text-primary ps-1"
                style="font-size: 1rem"
                v-if="profileData.departments.length > 1"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                      style="white-space: nowrap"
                      class="primary--text"
                    >
                      {{ $t("common.departments") }}
                    </span>
                  </template>
                  <span v-for="(com, n) in profileData.departments" :key="n"
                    >{{ com.name }} <br
                  /></span>
                </v-tooltip>
              </span>

              <span v-else class="text-primary ps-1" style="font-size: 1rem">
                {{ profileData.departments[0].name }}
              </span>
            </div>
            <div
              class="ms-2 mt-1 d-flex"
              v-if="profileData.countries.length > 0"
            >
              <h3>{{ $t("common.company_country") }} :</h3>
              <span
                class="text-primary ps-1"
                style="font-size: 1rem"
                v-if="profileData.countries.length > 1"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      v-bind="attrs"
                      v-on="on"
                      style="white-space: nowrap"
                      class="primary--text"
                    >
                      {{ $t("common.countries") }}
                    </span>
                  </template>
                  <span v-for="(com, n) in profileData.countries" :key="n"
                    >{{ com.name }} <br
                  /></span>
                </v-tooltip>
              </span>
              <span v-else class="text-primary ps-1" style="font-size: 1rem">
                {{ profileData.countries[0].name }}
              </span>
            </div>
            <div
              class="ms-2 mt-1 d-flex flex-wrap"
              v-if="profileData.social_media.length > 0"
            >
              <h3>{{ $tr("social_media") }} :</h3>
              <span v-for="(media, id) in profileData.social_media" :key="id">
                <a :href="media.pivot.url" target="_blank" class="ms-1">
                  <v-avatar size="30" class="">
                    <img :src="media.logo" alt="" />
                  </v-avatar>
                </a>
              </span>
            </div>
          </v-col>
          <v-col>
            <v-row>
              <v-col cols="12" md="6" class="pa-0">
                <div class="d-flex">
                  <h3>{{ $tr("created_by") }}:</h3>
                  <span class="text-primary ps-1" style="font-size: 1rem">
                    {{ new Date(profileData.created_at).toLocaleTimeString() }}
                    |
                    {{ new Date(profileData.created_at).toLocaleDateString() }}
                  </span>
                </div>
                <div class="mt-1 d-flex">
                  <h3>{{ $tr("status") }}:</h3>
                  <span class="text-primary ps-1" style="font-size: 1rem">
                    {{ profileData.status }}
                  </span>
                </div>
                <div class="mt-1 d-flex">
                  <h3>{{ $tr("last_update") }}:</h3>
                  <span class="text-primary ps-1" style="font-size: 1rem">
                    {{ new Date(profileData.updated_at).toLocaleTimeString() }}
                    |
                    {{ new Date(profileData.updated_at).toLocaleDateString() }}
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <div>
          <v-row class="pt-3">
            <v-col cols="12" class="d-flex py-0">
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
                          v-for="(item, n) in profileData.reasons
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
      </div>

      <div>
        <v-row>
          <v-col md="12" cols="12" class="pt-2 pb-1">
            <span class="subtitle-1">{{ $tr("remarks") }} </span>
          </v-col>
          <v-col class="py-0" md="12" cols="12">
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
</template>

<script>
import CloseBtn from "../design/Dialog/CloseBtn";
import CustomInput from "../design/components/CustomInput";
import FlagIcon from "../common/FlagIcon";

export default {
  name: "ProjectProfile",
  components: { FlagIcon, CustomInput, CloseBtn },
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
      statusColor: "",
      showMore: false,
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
};
</script>
