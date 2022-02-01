<template>
  <v-card
    :color="$vuetify.theme.dark ? 'black' : '#f9fafd'"
    class="height-80-vh"
  >
    <v-card-title class="py-1">
      <v-app-bar-title>
        <span class="custom-dialog-title text-uppercase">
          {{ $tr("profile") }}
        </span>
      </v-app-bar-title>

      <v-spacer />
      <CloseBtn @click="$emit('update:dialog')" />
    </v-card-title>
    <v-card-text class="mb-2">
      <div
        class="white rounded-sm d-flex justify-center align-end"
        style="min-height: 120px"
      >
        <div style="transform: translateY(+50%)">
          <v-avatar
            tile
            color="#58595b"
            class="rounded d-inline-block"
            size="100"
          >
            <v-img
              lazy-src="https://picsum.photos/id/11/10/6"
              :src="profileData.logo"
            ></v-img>
          </v-avatar>
        </div>
      </div>
      <div class="d-flex flex-column align-center pt-5 mt-2">
        <span class="title text-h5 font-weight-bold arial">{{
          profileData.name
        }}</span>
      </div>

      <v-row class="mt-5">
        <v-col cols="12" class="d-flex py-0">
          <v-card elevation="0" class="pa-2 w-full">
            <h2 class="align-self-end">{{ $tr("sub_system") }}</h2>
            <v-divider class="grey darken-1 mt-1 mb-2"></v-divider>
            <div
              class="text-center my-5"
              v-if="profileData.sub_systems.length == 0"
            >
              <h4>{{ $tr("the_system_does_not_have_any_sub_system") }}</h4>
            </div>
            <div v-for="sys in profileData.sub_systems" :key="sys.id">
              <h3>{{ sys.name }}</h3>
              <v-row class="mb-3">
                <template v-for="(action, index) in sys.actions">
                  <v-col cols="6" md="2" sm="3" class="py-0" :key="index">
                    <v-checkbox
                      :label="action.name"
                      hide-details
                      input-value="true"
                    ></v-checkbox>
                  </v-col>
                </template>
              </v-row>
              <v-divider class="grey lighten-2 mt-1 mb-2"></v-divider>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import SelectedItem from "../design/components/SelectedItem";
import CloseBtn from "../design/Dialog/CloseBtn";

export default {
  name: "SystemProfile",
  components: { CloseBtn, SelectedItem },
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
