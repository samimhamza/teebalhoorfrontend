<template>
  <v-card elevation="24" class="rounded-0">
    <v-card-title
      class="white--text primary text-h5 py-1 font-weight-bold justify-center"
    >
      {{ $tr("systems") }}
    </v-card-title>
    <v-card-text class="pt-3">
      <v-row>
        <v-col
          cols="12"
          md="2"
          sm="4"
          xs="6"
          v-for="(system, key) in systems"
          :key="key"
          class="py-2 d-flex justify-center"
        >
          <div
            class="d-flex flex-column"
            style="max-width: 160px; cursor: pointer"
            @click="navigateSystem(system)"
          >
            <div
              class="rounded-circle d-flex justify-center mx-auto"
              :class="system.active ? 'primary' : ''"
              style="border: 3px solid #eeef; padding: 2px"
            >
              <div
                class="
                  rounded-circle
                  d-flex
                  justify-center
                  align-center
                  mx-auto
                "
                :style="`background:${
                  system.background == 'primary'
                    ? background.primary
                    : system.background == 'cyan'
                    ? background.cyan
                    : system.background == 'yellow'
                    ? background.yellow
                    : background.red
                }`"
              >
                <img
                  :src="system.icon"
                  width="110"
                  style="transform: scale(1.2)"
                />
              </div>
            </div>
            <p
              class="text-center mt-1 mb-0 font-weight-medium"
              :class="system.active ? 'primary--text' : ''"
            >
              {{ $tr(system.phrase) }}
            </p>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import Alert from "../../helpers/alert";
export default {
  data() {
    return {
      background: {
        primary: "#70bbd4",
        cyan: "#71c9b5",
        yellow: "#edc561",
        red: "#f27f68",
      },
      systems: [
        {
          name: "Master Management System",
          phrase: "master_management_system",
          link: "/masters/countries",
          icon: "/icons/SYSTEM ICON/System Icone-01.svg",
          active: false,
          background: "primary",
        },

        {
          name: "File Management System",
          phrase: "file_management_system",
          link: "file_management/company",
          icon: "/icons/SYSTEM ICON/System Icone-06.svg",
          active: false,
          background: "red",
        },
        {
          name: "Users Management Systems",
          phrase: "user_management_system",
          link: "/users/",
          icon: "/icons/SYSTEM ICON/System Icone-03.svg",
          active: false,
          background: "yellow",
        },
        {
          name: "Supplier Management System",
          phrase: "supplier_management_system",

          link: "/supplier/",
          icon: "/icons/SYSTEM ICON/System Icone-04.svg",
          active: false,
          background: "red",
        },
        {
          name: "Call Center Management System",
          phrase: "call_center_management_system",
          link: "/",
          icon: "/icons/SYSTEM ICON/System Icone-02.svg",
          active: false,
          background: "cyan",
        },
        {
          name: "Fulfilment Management System",
          phrase: "fulfilment_management_system",
          link: "/",
          icon: "/icons/SYSTEM ICON/System Icone-05.svg",
          active: false,
          background: "yellow",
        },
        {
          name: "Order Management System",
          phrase: "order_management_system",
          link: "/",
          icon: "/icons/SYSTEM ICON/System Icone-07.svg",
          active: false,
          background: "primary",
        },
        {
          name: "Team Management System",
          phrase: "team_management_system",
          link: "/",
          icon: "/icons/SYSTEM ICON/System Icone-08.svg",
          active: false,
          background: "cyan",
        },
        {
          name: "Digital Marketing Management System",
          phrase: "digital_marketing_management_system",
          link: "/",
          icon: "/icons/SYSTEM ICON/System Icone-09.svg",
          active: false,
          background: "cyan",
        },
        {
          name: "Digital Marketing Management System",
          phrase: "digital_marketing_management_system",
          link: "/",
          icon: "/icons/SYSTEM ICON/System Icone-10.svg",
          active: false,
          background: "primary",
        },
        {
          name: "Inventory Management System",
          phrase: "inventory_management_system",
          link: "/",
          icon: "/icons/SYSTEM ICON/System Icone-11.svg",
          active: false,
          background: "yellow",
        },
        {
          name: "Product Management System",
          phrase: "product_management_system",
          link: "/",
          icon: "/icons/SYSTEM ICON/System Icone-12.svg",
          active: false,
          background: "cyan",
        },
      ],
    };
  },
  computed: {},
  methods: {
    async navigateSystem(system) {
      this.systems.forEach((system) => {
        system.active = false;
      });
      this.systems[this.systems.indexOf(system)].active = true;
      if (system.link == "/") {
        // alert
        this.$swal({
          type: "info",
          title: "Comming Soon...",
          text: "The system is in development mode!",
          confirmButtonColor: this.$vuetify.theme.isDark
            ? this.$vuetify.theme.themes.dark.primary
            : this.$vuetify.theme.themes.light.primary,
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.value) {
            this.systems.forEach((system) => {
              system.active = false;
            });
          }
        });
      } else {
        this.$router.push(`/systems/${system.name}`);
      }
    },
  },
};
</script>

<style></style>
