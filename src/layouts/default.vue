<template>
  <v-app>
    <div
      v-shortkey="['ctrl', '/']"
      class="d-flex flex-grow-1"
      @shortkey="onKeyup"
    >
      <!-- Navigation -->
      <v-navigation-drawer
        v-model="drawer"
        app
        floating
        class="elevation-1"
        :right="$vuetify.rtl"
        :light="menuTheme === 'light'"
        :dark="menuTheme === 'dark'"
      >
        <!-- Navigation menu info -->
        <template v-slot:prepend>
          <div class="pa-2">
            <v-img
              :src="
                $vuetify.theme.isDark
                  ? '/light-mode-logo.svg'
                  : '/dark-mode-logo.svg'
              "
            />
          </div>
        </template>

        <!-- Navigation menu -->
        <main-menu :menu="navigation.menu" />

        <!-- Navigation menu footer -->
        <!-- Footer navigation links -->
        <template v-slot:append> </template>
      </v-navigation-drawer>

      <!-- Toolbar -->
      <v-app-bar
        app
        :color="isToolbarDetached ? 'surface' : undefined"
        :flat="isToolbarDetached"
        :light="toolbarTheme === 'light'"
        :dark="toolbarTheme === 'dark'"
      >
        <v-card
          class="flex-grow-1 d-flex"
          :class="[isToolbarDetached ? 'pa-1 mt-3 mx-1' : 'pa-0 ma-0']"
          :flat="!isToolbarDetached"
        >
          <div class="d-flex flex-grow-1 align-center">
            <!-- search input mobile -->
            <v-text-field
              v-if="showSearch"
              append-icon="mdi-close"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              hide-details
              solo
              flat
              autofocus
              @click:append="showSearch = false"
            ></v-text-field>

            <div v-else class="d-flex flex-grow-1 align-center">
              <v-app-bar-nav-icon @click.stop="drawer = !drawer">
              </v-app-bar-nav-icon>

              <v-spacer class="d-none d-lg-block"></v-spacer>

              <!-- search input desktop -->
              <v-text-field
                ref="search"
                class="mx-1 hidden-xs-only"
                :placeholder="$tr('toolbar_search')"
                prepend-inner-icon="mdi-magnify"
                hide-details
                filled
                rounded
                dense
              >
              </v-text-field>

              <v-spacer class="d-block d-sm-none"></v-spacer>

              <v-btn class="d-block d-sm-none" icon @click="showSearch = true">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>

              <toolbar-language />

              <toolbar-apps />

              <div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']">
                <toolbar-notifications />
              </div>

              <toolbar-user />
            </div>
          </div>
        </v-card>
      </v-app-bar>

      <v-main>
        <v-container class="fill-height pa-2" :fluid="!isContentBoxed">
          <v-layout>
            <nuxt />
          </v-layout>
        </v-container>

        <v-footer app inset>
          <v-spacer></v-spacer>
          <div class="overline">
            Built with
            <v-icon small color="pink">mdi-heart</v-icon>
            <a
              class="text-decoration-none"
              href="https://indielayer.com"
              target="_blank"
              >@Teeb-Al-Hoor</a
            >
          </div>
        </v-footer>
        <customization-menu />
        <online-users />
      </v-main>
      <LoadingComponent :loadingProps.sync="loading" />
    </div>
  </v-app>
</template>

<script>
import { mapState } from "vuex";

// navigation menu configurations
import config from "../configs";

import MainMenu from "../components/navigation/MainMenu";
import ToolbarUser from "../components/toolbar/ToolbarUser";
import ToolbarApps from "../components/toolbar/ToolbarApps";
import ToolbarLanguage from "../components/toolbar/ToolbarLanguage";
import ToolbarNotifications from "../components/toolbar/ToolbarNotifications";
import CustomizationMenu from "../components/navigation/CustomizationMenu";
import OnlineUsers from "../components/onlineUsers/OnlineUsers";
import { mapActions } from "vuex";
import LoadingComponent from "../components/LoadingComponent.vue";

export default {
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

  components: {
    MainMenu,
    ToolbarUser,
    ToolbarApps,
    ToolbarLanguage,
    ToolbarNotifications,
    CustomizationMenu,
    OnlineUsers,
    LoadingComponent,
  },
  data() {
    return {
      drawer: null,
      showSearch: false,
      navigation: config.navigation,
      loading: true,
    };
  },

  computed: {
    ...mapState("app", [
      "application",
      "isContentBoxed",
      "menuTheme",
      "toolbarTheme",
      "isToolbarDetached",
    ]),
  },
  methods: {
    ...mapActions({
      fetchTranslations: "translations/fetchTranslations",
    }),
    onKeyup(e) {
      this.$refs.search.focus();
    },
    async logout() {
      await this.$auth.logout();
      this.$router.push("/auth/signin");
    },
  },
};
</script>
<style>
tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
