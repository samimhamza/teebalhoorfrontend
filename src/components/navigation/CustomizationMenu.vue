<template>
  <div>
    <v-btn
      ref="button"
      class="drawer-button"
      color="#ee44aa"
      dark
      @click="right = true"
    >
      <v-icon class="fa-spin">mdi-cog-outline</v-icon>
    </v-btn>

    <v-navigation-drawer
      v-model="right"
      fixed
      right
      hide-overlay
      temporary
      width="310"
    >
      <div class="d-flex align-center pa-2">
        <div class="title">{{ $tr("settings") }}</div>
        <v-spacer></v-spacer>
        <CloseBtn @click="right = false" />
      </div>

      <v-divider></v-divider>

      <div class="pa-2">
        <div class="font-weight-bold my-1">{{ $tr("global_theme") }}</div>
        <v-btn-toggle v-model="theme" color="primary" mandatory class="mb-2">
          <v-btn x-large>{{ $tr("light") }}</v-btn>
          <v-btn x-large>{{ $tr("dark") }}</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">{{ $tr("toolbar_theme") }}</div>
        <v-btn-toggle
          v-model="toolbarTheme"
          color="primary"
          mandatory
          class="mb-2"
        >
          <v-btn x-large>{{ $tr("global") }}</v-btn>
          <v-btn x-large>{{ $tr("light") }}</v-btn>
          <v-btn x-large>{{ $tr("dark") }}</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">{{ $tr("toolbar_style") }}</div>
        <v-btn-toggle
          v-model="toolbarStyle"
          color="primary"
          mandatory
          class="mb-2"
        >
          <v-btn x-large>{{ $tr("full") }}</v-btn>
          <v-btn x-large>{{ $tr("solo") }}</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">{{ $tr("content_layout") }}</div>
        <v-btn-toggle
          v-model="contentBoxed"
          color="primary"
          mandatory
          class="mb-2"
        >
          <v-btn x-large>{{ $tr("fluid") }}</v-btn>
          <v-btn x-large>{{ $tr("boxed") }}</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">{{ $tr("menu_theme") }}</div>
        <v-btn-toggle
          v-model="menuTheme"
          color="primary"
          mandatory
          class="mb-2"
        >
          <v-btn x-large>{{ $tr("global") }}</v-btn>
          <v-btn x-large>{{ $tr("light") }}</v-btn>
          <v-btn x-large>{{ $tr("dark") }}</v-btn>
        </v-btn-toggle>

        <div class="font-weight-bold my-1">RTL</div>
        <v-switch v-model="rtl" inset :label="$tr('right_to_left')"> </v-switch>

        <div class="font-weight-bold my-1">{{ $tr("primary_color") }}</div>

        <v-color-picker
          v-model="color"
          mode="hexa"
          :swatches="swatches"
          show-swatches
        ></v-color-picker>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import CloseBtn from "../design/Dialog/CloseBtn.vue";

export default {
  data() {
    return {
      right: false,
      theme: 0,
      toolbarTheme: 0,
      toolbarStyle: 0,
      contentBoxed: 0,
      menuTheme: 0,
      timeout: null,
      color: "#2e7be6",
      swatches: [
        ["#2e7be6", "#31944f"],
        ["#EE4f12", "#46BBB1"],
        ["#ee44aa", "#55BB46"],
      ],
      rtl: 0,
    };
  },
  components: {
    CloseBtn,
  },
  watch: {
    color(val) {
      this.$vuetify.theme.themes.dark.primary = val;
      this.$vuetify.theme.themes.light.primary = val;
    },

    theme(val) {
      const theme = val === 0 ? "light" : "dark";
      localStorage.setItem("global_theme", theme);
      this.$vuetify.theme.dark = theme === "dark";
      this.setGlobalTheme(theme);
    },
    toolbarTheme(val) {
      const theme = val === 0 ? "global" : val === 1 ? "light" : "dark";

      this.setToolbarTheme(theme);
    },
    toolbarStyle(val) {
      this.setToolbarDetached(val === 1);
    },
    menuTheme(val) {
      const theme = val === 0 ? "global" : val === 1 ? "light" : "dark";

      this.setMenuTheme(theme);
    },
    contentBoxed(val) {
      this.setContentBoxed(val === 1);
    },
    rtl(val) {
      this.$vuetify.rtl = val;
      this.setRTL(val);
    },
  },

  mounted() {
    this.animate();
  },
  beforeDestroy() {
    if (this.timeout) clearTimeout(this.timeout);
  },
  methods: {
    ...mapMutations("app", [
      "setMenuTheme",
      "setGlobalTheme",
      "setToolbarTheme",
      "setContentBoxed",
      "setRTL",
      "setToolbarDetached",
    ]),

    animate() {
      if (this.timeout) clearTimeout(this.timeout);

      const time = (Math.floor(Math.random() * 10 + 1) + 10) * 1000;

      this.timeout = setTimeout(() => {
        this.$animate(this.$refs.button.$el, "bounce");
        this.animate();
      }, time);
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-button {
  position: fixed;
  top: 340px;
  right: -20px;
  z-index: 6;
  box-shadow: 1px 1px 18px #ee44aa;

  .v-icon {
    margin-left: -18px;
    font-size: 1.3rem;
  }
}
</style>
