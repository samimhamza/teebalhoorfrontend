<template>
  <div>
    <v-btn
      v-if="!right"
      ref="button"
      class="drawer-button"
      color="primary"
      dark
      @click="getData"
    >
      <v-icon left>mdi-account-group-outline</v-icon>
      {{ $tr("online_users") }}
    </v-btn>

    <v-navigation-drawer
      v-model="right"
      fixed
      right
      hide-overlay
      width="310"
      style="top: unset; height: 55%; bottom: 0"
    >
      <v-card max-width="310" class="mx-auto">
        <v-card-title
          class="py-0"
          style="position: sticky; top: 0; z-index: 10000000"
          :style="`background: ${$vuetify.theme.dark ? '#000000' : '#FFFFFF'}`"
        >
          <v-app-bar-title>
            <span>{{ $tr("online_users") }} </span>
          </v-app-bar-title>
          <v-spacer />
          <CloseBtn @click="() => (right = !right)" />
        </v-card-title>

        <v-list three-line>
          <template v-for="(user, index) in onlineUsers">
            <v-card
              :color="$vuetify.theme.dark ? 'black' : '#f9fafd'"
              class="rounded-sm"
              :key="index + 1"
              elevation="0"
            >
              <v-list-item :key="user.title">
                <template>
                  <v-list-item-avatar>
                    <v-img
                      :src="user.image"
                      :alt="`${user.title} avatar`"
                    ></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ user.firstname + " " + user.lastname }}
                      <v-badge
                        style="padding-top: 3px !important"
                        class="ma-0 ml-1"
                        color="green"
                        dot
                      >
                      </v-badge>
                    </v-list-item-title>
                    <v-list-item-subtitle
                      v-text="user.location.city"
                    ></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-list-item-action-text
                      v-text="'2 hr'"
                    ></v-list-item-action-text>
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-divider
                v-if="index < onlineUsers.length - 1"
                :key="index"
              ></v-divider>
            </v-card>
          </template>
        </v-list>
      </v-card>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import CloseBtn from "../../components/design/Dialog/CloseBtn.vue";

import FlagIcon from "../common/FlagIcon.vue";

export default {
  data() {
    return {
      right: false,
      interval: null,
      selected: [2],
      background: this.$vuetify.theme.dark ? "#FFC107" : "#E91E63",
    };
  },
  components: {
    FlagIcon,
    CloseBtn,
  },

  methods: {
    getData() {
      this.right = !this.right;
      this.right ? this.fetchOnlineUsers() : null;

      // set interval if there is no interval
      if (this.interval == null) {
        this.interval = setInterval(this.fetchOnlineUsers, 30000);
      }
      // clear interval if the popup is closed
      if (this.right == false && this.interval != null) {
        clearInterval(this.interval);
        this.interval = null;
      }
    },
    ...mapActions("users", [
      "fetchOnlineUsers", // map `this.increment()` to `this.$store.dispatch('increment')`
    ]),
  },
  computed: {
    ...mapGetters({
      onlineUsers: "users/onlineUsers",
    }),
  },
};
</script>

<style lang="scss" scoped>
.drawer-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  box-shadow: 1px 1px 18px var(--v-primary-base) !important;
  .v-icon {
    font-size: 1.3rem;
  }
}
</style>
