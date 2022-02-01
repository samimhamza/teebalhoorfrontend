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
        class="pa-2"
        style="position: sticky; top: 0; z-index: 10000000"
      >
        <v-row>
          <v-col cols="12 py-0" class="d-flex" sm="5">
            <v-avatar size="120" tile rounded>
              <img :src="user.image" :alt="fullName" class="rounded" />
            </v-avatar>
            <div class="mx-2">
              <h2 class="">
                {{ fullName }}
              </h2>
              <h4>
                <div>Senior Manager</div>
                <div>Dubai</div>
              </h4>
            </div>
          </v-col>

          <v-col cols="12 py-0" sm="7">
            <div class="d-flex flex-column justify-space-between">
              <div class="pb-2">
                <div class="d-flex full-width justify-space-between pb-1">
                  <div>
                    <v-icon color="primary">mdi-email-outline</v-icon>
                    <a :href="`mailto:${user.email}`">{{ user.email }}</a>
                  </div>
                  <div>
                    <v-icon color="primary">mdi-cellphone</v-icon>
                    <a :href="`tel:${user.phone}`">{{ user.phone }}</a>
                  </div>
                </div>
                <div>
                  <v-icon color="primary">mdi-whatsapp</v-icon>
                  <a :href="`https://wa.me/${user.whatsapp}`">
                    {{ user.whatsapp }}</a
                  >
                </div>
              </div>
              <v-divider class="grey lighten-1"></v-divider>
              <div class="d-flex full-width justify-space-between pt-1">
                <div>
                  <v-icon color="primary">mdi-map-marker</v-icon>
                  <span>
                    <span> {{ $tr("address") }} : </span>
                    <span class="font-weight-bold">{{ user.address }} </span>
                  </span>
                </div>
                <div>
                  <v-icon color="primary">mdi-clock-outline</v-icon>
                  <span>
                    <span> {{ $tr("last_login") }} : </span>
                    <span class="font-weight-bold"> 30 Min. ago </span>
                  </span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <v-row>
        <v-col cols="12" class="d-flex" md="4">
          <v-card elevation="0" class="pa-2 w-full">
            <div class="d-flex justify-space-between">
              <h2 class="align-self-end">
                {{ $tr("permissions") }}
              </h2>
              <v-btn
                color="primary "
                class="border-radius-1 mx-0 px-1"
                small
                @click="$emit('onEdit', user)"
              >
                <v-icon class="mr-1" right small> fa-edit </v-icon>
                {{ $tr("edit") }}
              </v-btn>
            </div>
            <v-divider class="grey darken-1 mt-1 mb-2"></v-divider>
            <div>
              <div>
                <h3>{{ $tr("roles") }}</h3>
                <div class="text-primary" style="font-size: 1rem">Admin</div>
                <div class="text-primary" style="font-size: 1rem">Manager</div>
              </div>
              <div class="my-2">
                <h3>{{ $tr("permissions") }}</h3>
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
        <v-col cols="12" md="8">
          <v-card elevation="0" class="pa-2 w-full">
            <div class="d-flex justify-space-between mb-1">
              <h2 class="align-self-end">
                {{ $tr("general_information") }}
              </h2>
              <v-btn
                color="primary "
                class="border-radius-1 mx-0 px-1"
                small
                @click="$emit('onEdit', user)"
              >
                <v-icon class="mr-1" right small> fa-edit </v-icon>
                {{ $tr("edit") }}
              </v-btn>
            </div>
            <v-divider class="grey darken-1 mt-1 mb-2"></v-divider>
            <v-row>
              <v-col cols="6" class="py-0">
                <h3>{{ $tr("gender") }}</h3>
                <div class="text-primary" style="font-size: 1rem">
                  {{ $tr(user.gender) }}
                </div>
              </v-col>
              <v-col cols="6" class="py-0">
                <h3>{{ $tr("birth_date") }}</h3>
                <div class="text-primary" style="font-size: 1rem">
                  {{ user.birth_date }}
                </div>
              </v-col>
              <v-col cols="6" class="py-1">
                <h3>{{ $tr("national") }}</h3>
                <div class="text-primary" style="font-size: 1rem">
                  {{ user.country.national }}
                </div>
              </v-col>
              <v-col cols="6" class="py-1">
                <h3>{{ $tr("current_country") }}</h3>
                <div class="text-primary" style="font-size: 1rem">
                  {{ user.current_country.name }}
                </div>
              </v-col>
              <v-col cols="12" class="py-1">
                <h3>{{ $tr("city") }}</h3>
                <div class="text-primary" style="font-size: 1rem">
                  {{ user.state.name }}
                </div>
              </v-col>

              <v-col cols="12" class="py-1">
                <h3>{{ $tr("address") }}</h3>
                <div class="text-primary" style="font-size: 1rem">
                  {{ user.address }}
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="d-flex py-0">
          <v-card elevation="0" class="pa-2 w-full">
            <h2 class="align-self-end">{{ $tr("active_sessions") }}</h2>
            <v-divider class="grey darken-1 mt-1 mb-2"></v-divider>
            <div v-for="n of 3" :key="n">
              <div class="d-flex justify-space-between">
                <div class="d-flex">
                  <div>
                    <v-icon>mdi-google-chrome</v-icon>
                  </div>
                  <div class="mx-2" v-if="n == 1">
                    Generic placeholder image Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Iste doloribus inventore
                    repudiandae harum unde eos ratione tempora sequi, facilis
                    molestiae minima itaque natus, veritatis nam ut, debitis
                    ipsum. Cumque, laborum!
                  </div>
                  <div class="mx-2" v-else>
                    Generic placeholder image Lorem ipsums, veritatis nam ut,
                    debitis ipsum. Cumque, laborum!
                  </div>
                </div>
                <v-divider vertical class="grey lighten-2 mx-1"></v-divider>
                <div>{{ $tr("duration") }}: 6:00AM - 5:00PM</div>
                <v-divider vertical class="grey lighten-2 mx-1"></v-divider>
                <div>{{ $tr("duration") }}: 6:00AM - 5:00PM</div>
              </div>
              <v-divider
                v-if="n !== 3"
                class="grey lighten-2 mt-1 mb-2"
              ></v-divider>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" class="d-flex">
          <v-card elevation="0" class="pa-2 w-full">
            <h2 class="align-self-end">{{ $tr("activity_logs") }}</h2>
            <v-divider class="grey darken-1 mt-1 mb-2"></v-divider>
            <div v-for="n of 3" :key="n">
              <div class="d-flex justify-space-between">
                <div>Jennifer Kent Congratulated Anthony Hopkins</div>
                <v-divider vertical class="grey lighten-2 mx-1"></v-divider>
                <div>November 5:00 ,13 Am</div>
              </div>
              <v-divider
                v-if="n !== 3"
                class="grey lighten-2 mt-1 mb-2"
              ></v-divider>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import CloseBtn from "../design/Dialog/CloseBtn";

export default {
  name: "UserProfile",
  components: { CloseBtn },
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },

  computed: {
    fullName() {
      const firstname = this.user?.firstname || "";
      const lastname = this.user?.lastname || "";
      return firstname + " " + lastname;
    },
  },
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
