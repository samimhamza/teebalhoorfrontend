<template>
  <div>
    <v-card class="w-full mb-2 d-flex position-relative" elevation="1" outlined>
      <div class="px-2 py-3">
        <h2 class="title">
          <v-icon v-if="!flag" class="" large>{{ Icon }}</v-icon>
          <FlagIcon v-if="flag" :flag="Icon" :round="true" />
          {{ $tr(Title) }}
          <slot name="title-button"></slot>
        </h2>
        <v-breadcrumbs :items="Breadcrumb" class="ps-0 pb-0 pt-1" divider="»">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item
              :to="item.href"
              class="breadcrumb-item"
              nuxt
              :disabled="item.disabled"
            >
              <v-icon class="me-1" dense v-if="item.icon">{{
                item.icon
              }}</v-icon>
              {{ $tr(item.text) }}
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </div>
      <v-spacer />
      <slot name="button"></slot>
      <v-spacer />
      <img
        height="113"
        :class="{ 'rotated-image': $vuetify.rtl }"
        width="250"
        src="~/static/images/corner.png"
        alt=""
      />
    </v-card>
    <slot name="content"></slot>
  </div>
</template>
<script>
import FlagIcon from "~/components/common/FlagIcon.vue";

export default {
  components: {
    FlagIcon,
  },
  props: {
    Icon: {
      type: String,
      required: true,
    },
    Title: {
      type: String,
    },
    Breadcrumb: {
      type: Array,
    },
    flag: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style scoped>
.rotated-image {
  transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  -o-transform: rotate(180deg);
}
.title {
  font-size: 1.7rem !important;
}

.theme--light .breadcrumb-item a,
.theme--light .v-breadcrumbs__divider {
  color: #444 !important;
}

.theme--dark .breadcrumb-item a,
.theme--dark .v-breadcrumbs__divider {
  color: #ccc !important;
}
</style>
