<template>
  <v-menu offset-y left transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn icon class="elevation-2" v-on="on">
        <v-badge color="success" dot bordered offset-x="10" offset-y="10">
          <v-avatar size="40">
            <v-img :src="authUser.image"></v-img>
          </v-avatar>
        </v-badge>
      </v-btn>
    </template>

    <!-- user menu list -->
    <v-list dense nav>
      <v-list-item
        v-for="(item, index) in menu"
        :key="index"
        :to="item.link"
        :exact="item.exact"
        :disabled="item.disabled"
        link
      >
        <v-list-item-icon>
          <v-icon small :class="{ 'grey--text': item.disabled }">{{
            item.icon
          }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{
            item.key ? $tr(item.key) : item.text
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="my-1"></v-divider>

      <v-list-item link @click.prevent="logout">
        <v-list-item-icon>
          <v-icon small>mdi-logout-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ $tr("logout") }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <ProgressBar v-if="isLoggingOut" />
  </v-menu>
</template>

<script>
import config from "../../configs";
import Alert from "~/helpers/alert";
import ProgressBar from "../common/ProgressBar";
/*
|---------------------------------------------------------------------
| Toolbar User Component
|---------------------------------------------------------------------
|
| Quick menu for user menu shortcuts on the toolbar
|
*/
export default {
  components: { ProgressBar },
  data() {
    return {
      authUser: this.$auth.user,
      menu: config.toolbar.user,
      isLoggingOut: false,
    };
  },

  methods: {
    logout() {
      Alert.logoutDialogAlert(this, async () => {
        this.isLoggingOut = true;
        await this.$auth.logout();
        location.reload();
        this.isLoggingOut = false;
      });
    },
  },
};
</script>
