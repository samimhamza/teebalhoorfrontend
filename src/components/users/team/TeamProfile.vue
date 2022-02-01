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
        </div>
      </v-card>

      <div style="overflow-y: scroll; overflow-x: hidden; height: 450px">
        <v-row>
          <v-col cols="12" class="d-flex" md="5">
            <v-card elevation="0" class="pa-2 w-full">
              <div class="d-flex justify-space-between">
                <h2 class="align-self-end">
                  {{ $tr("team_role") }}
                </h2>
                <v-btn
                  color="primary "
                  class="border-radius-1 mx-0 px-1"
                  small
                  @click="$emit('onEdit', profileData)"
                >
                  <v-icon class="mr-1" right small> fa-edit </v-icon>
                  {{ $tr("edit") }}
                </v-btn>
              </div>
              <v-divider class="grey darken-1 mt-1 mb-2"></v-divider>
              <div>
                <div>
                  <h3>{{ $tr("company") }}:</h3>
                  <div class="d-flex" v-if="companies.length > 1">
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
                      <span v-for="com in companies" :key="com.id"
                        >{{ com }} <br
                      /></span>
                    </v-tooltip>
                  </div>
                </div>
                <div class="my-2">
                  <h3>Permissions</h3>
                  <div class="text-primary" style="font-size: 1rem">
                    Users Sections
                  </div>
                  <div class="text-primary" style="font-size: 1rem">
                    Transactions Sections
                  </div>

                  <div class="text-primary" style="font-size: 1rem">
                    Shipment Sections
                  </div>
                  <div class="text-primary" style="font-size: 1rem">
                    Export & Download
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" class="d-flex" md="7">
            <v-card elevation="0" class="pa-2 w-full">
              <div class="d-flex justify-space-between">
                <h2 class="align-self-end">
                  {{ $tr("members") }}
                </h2>
                <v-btn
                  color="primary "
                  class="border-radius-1 mx-0 px-1"
                  small
                  @click="$emit('onEdit', profileData)"
                >
                  <v-icon class="mr-1" right small> fa-edit </v-icon>
                  Edit
                </v-btn>
              </div>
              <v-divider class="grey darken-1 mt-1 mb-1"></v-divider>
              <div class="d-flex">
                <v-icon dense class="pr-1" color="primary">
                  fa-envelope-open-text
                </v-icon>
                admin@alhoor.com
              </div>
              <v-divider class="grey darken-1 mt-1"></v-divider>
              <div>
                <v-row>
                  <v-col
                    v-for="(member, n) in profileData.members"
                    :key="n"
                    class="d-flex py-2"
                    cols="12"
                    md="6"
                    sm="6"
                  >
                    <v-avatar
                      style="
                        border-top: 3px #1361cb solid;
                        border-left: 3px #1361cb solid;
                      "
                      tile
                      color="#58595b"
                      class="rounded d-inline-block"
                      size="78"
                    >
                      <v-img
                        lazy-src="https://picsum.photos/id/11/10/6"
                        :src="member.image"
                      ></v-img>
                    </v-avatar>
                    <div class="mx-2 d-flex flex-column">
                      <div>{{ member.firstname + " " + member.lastname }}</div>
                      <div>Admin</div>
                      <v-divider
                        class="grey darken-1 mt-1"
                        style="margin-bottom: 2px"
                      ></v-divider>
                      <div class="d-flex">
                        <div class="mx-1">
                          <v-avatar
                            tile
                            color="#58595b"
                            class="rounded d-inline-block"
                            size="20"
                          >
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <span
                                  v-bind="attrs"
                                  v-on="on"
                                  style="white-space: nowrap"
                                >
                                  <a :href="`mailto:${member.email}`">
                                    <v-icon color="white" size="13">
                                      fa-envelope-open-text
                                    </v-icon>
                                  </a>
                                </span>
                              </template>
                              <span>{{ member.email }}</span>
                            </v-tooltip>
                          </v-avatar>
                        </div>
                        <div class="mx-1">
                          <v-avatar
                            tile
                            color="#58595b"
                            class="rounded d-inline-block"
                            size="20"
                          >
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <span
                                  v-bind="attrs"
                                  v-on="on"
                                  style="white-space: nowrap"
                                >
                                  <a :href="`tel:${member.phone}`">
                                    <v-icon color="white" size="13">
                                      mdi-cellphone
                                    </v-icon>
                                  </a>
                                </span>
                              </template>
                              <span>{{ member.phone }}</span>
                            </v-tooltip>
                          </v-avatar>
                        </div>
                        <div class="mx-1">
                          <v-avatar
                            tile
                            color="#58595b"
                            class="rounded d-inline-block"
                            size="20"
                          >
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on, attrs }">
                                <span
                                  v-bind="attrs"
                                  v-on="on"
                                  style="white-space: nowrap"
                                >
                                  <a :href="`https://wa.me/${member.whatsapp}`">
                                    <v-icon color="white" size="13">
                                      mdi-whatsapp
                                    </v-icon>
                                  </a>
                                </span>
                              </template>
                              <span>{{ member.whatsapp }}</span>
                            </v-tooltip>
                          </v-avatar>
                        </div>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-card elevation="0" class="pa-2 project-details-container">
          <div class="d-flex justify-space-between mb-1">
            <h2 class="align-self-end">{{ $tr("details") }}</h2>
          </div>
          <v-divider class="grey darken-1 mt-1 mb-2"></v-divider>
          <v-row>
            <v-col md="6" cols="12" class="py-0">
              <div class="d-flex mb-1">
                <h3 class="align-self-end me-1">{{ $tr("team") }} :</h3>
                <div class="text-primary" style="font-size: 1rem">
                  {{ profileData.name }}
                </div>
              </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
              <div class="d-flex mb-1">
                <h3 class="align-self-end me-1">{{ $tr("created_by") }} :</h3>
                <div class="text-primary" style="font-size: 1rem">
                  {{
                    profileData.created_by.firstname +
                    " " +
                    profileData.created_by.lastname
                  }}
                </div>
              </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
              <div class="d-flex mb-1">
                <h3 class="align-self-end me-1">{{ $tr("updated_by") }} :</h3>
                <div class="text-primary" style="font-size: 1rem">
                  {{
                    profileData.updated_by.firstname +
                    " " +
                    profileData.updated_by.lastname
                  }}
                </div>
              </div>
            </v-col>

            <v-col md="6" cols="12" class="py-0">
              <div class="d-flex mb-1">
                <h3 class="align-self-end me-1">{{ $tr("company") }} :</h3>
                <div class="text-primary" style="font-size: 1rem">
                  <div class="d-flex" v-if="countries.length > 1">
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
                      <span v-for="(com, n) in countries" :key="n"
                        >{{ com }} <br
                      /></span>
                    </v-tooltip>
                  </div>
                  <div class="d-flex" v-else>
                    {{ countries[0] }}
                  </div>
                </div>
              </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
              <div class="d-flex mb-1">
                <h3 class="align-self-end me-1">{{ $tr("code_id") }} :</h3>
                <div class="text-primary" style="font-size: 1rem">
                  {{ profileData.code }}
                </div>
              </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
              <div class="d-flex mb-1">
                <h3 class="align-self-end me-1">{{ $tr("department") }} :</h3>
                <div class="text-primary" style="font-size: 1rem">
                  <div class="d-flex" v-if="departments.length > 1">
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
                      <span v-for="(com, n) in departments" :key="n"
                        >{{ com }} <br
                      /></span>
                    </v-tooltip>
                  </div>
                  <div class="d-flex" v-else>
                    {{ departments[0] }}
                  </div>
                </div>
              </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
              <div class="d-flex mb-1">
                <h3 class="align-self-end me-1">{{ $tr("created_by") }} :</h3>
                <div
                  class="text-primary"
                  style="font-size: 1rem"
                  v-if="profileData.created_at != null"
                >
                  {{ new Date(profileData.created_at).toLocaleTimeString() }} |
                  {{ new Date(profileData.created_at).toLocaleDateString() }}
                </div>
              </div>
            </v-col>

            <v-col md="6" cols="12" class="py-0">
              <div class="d-flex mb-1">
                <h3 class="align-self-end me-1">{{ $tr("status") }} :</h3>
                <div class="text-primary" style="font-size: 1rem">
                  {{ profileData.status }}
                </div>
              </div>
            </v-col>
            <v-col md="6" cols="12" class="py-0">
              <div class="d-flex mb-1">
                <h3 class="align-self-end me-1">{{ $tr("last_update") }} :</h3>
                <div
                  class="text-primary"
                  style="font-size: 1rem"
                  v-if="profileData.updated_at != null"
                >
                  {{ new Date(profileData.updated_at).toLocaleTimeString() }} |
                  {{ new Date(profileData.updated_at).toLocaleDateString() }}
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
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
import CloseBtn from "~/components/design/Dialog/CloseBtn";

export default {
  name: "TeamProfile",
  components: { CloseBtn },
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
      countries: [],
      companies: [],
      departments: [],
      showMore: false,
    };
  },

  mounted() {
    const countrySet = new Set();
    const companySet = new Set();
    const departmentSet = new Set();
    this.profileData.department_company_country.forEach((dep) => {
      departmentSet.add(dep.name);
      dep.companies.forEach((com) => {
        companySet.add(com.name);
        com.countries.forEach((count) => {
          countrySet.add(count.name);
        });
      });
    });
    this.countries = Array.from(countrySet);
    this.companies = Array.from(companySet);
    this.departments = Array.from(departmentSet);
  },

  methods: {},
};
</script>

<style scoped>
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
</style>
