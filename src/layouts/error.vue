<template>
  <div>
    <v-card
      v-if="error.statusCode === 404"
      class="text-center w-full error-page pa-3"
    >
      <v-img
        src="/images/illustrations/404-illustration.svg"
        max-height="400"
        contain
      />
      <div class="display-2 mt-10">{{ $tr("how_did_you_get_here") }}</div>
      <div class="mt-3 mb-6">
        {{ $tr("cant_find_page") }}
      </div>
      <v-text-field solo placeholder="Search website" large></v-text-field>
      <v-btn block large @click="back" color="primary">
        {{ $tr("sent_me_back") }}
      </v-btn>
    </v-card>
    <v-card
      v-else-if="error.statusCode === 401"
      class="text-center w-full error-page pa-3"
    >
      <v-img
        src="/images/illustrations/401-illustration.svg"
        max-height="400"
        contain
      />
      <div class="display-2 mt-10">{{ $tr("unauthorized") }}</div>
      <div class="mt-3 mb-6">
        {{ $tr("unauthorized_to_page") }}
      </div>
      <v-text-field solo placeholder="Search website" large></v-text-field>
      <v-btn block large @click="back" color="primary">
        {{ $tr("sent_me_back") }}
      </v-btn>
    </v-card>
    <v-card v-else class="text-center w-full error-page pa-3">
      <v-img
        src="/images/illustrations/500-illustration.svg"
        max-height="400"
        contain
      />
      <div class="display-2 mt-10">{{ $tr("oops_something_went_wrong") }}</div>
      <div class="mt-3 mb-10">{{ $tr("our_experts_are_working") }}</div>
      <v-text-field solo placeholder="Search website"></v-text-field>
      <v-btn block large @click="back" color="primary">
        {{ $tr("sent_me_back") }}
      </v-btn>
    </v-card>
    <LoadingComponent :loadingProps.sync="loading" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import LoadingComponent from "../components/LoadingComponent.vue";

export default {
  layout: "simple",
  components: {
    LoadingComponent,
  },
  data() {
    return {
      loading: true,
    };
  },
  async created() {
    if (process.client) {
      if (this.$auth.loggedIn) {
        await this.fetchTranslations({
          language_id: this.$auth.user.translated_language_id,
        });
      } else {
        await this.fetchTranslations({
          baseLanguage: true,
        });
      }
      this.loading = false;
    }
  },

  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    back() {
      this.$router.back();
    },
    ...mapActions({
      fetchTranslations: "translations/fetchTranslations",
    }),
  },
};
</script>

<style>
.error-page {
  max-width: 500px;
}
</style>
