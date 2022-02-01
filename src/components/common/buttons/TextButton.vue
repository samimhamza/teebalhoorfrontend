<template>
  <div>
    <v-btn
      v-if="type === 'primary'"
      v-bind="$attrs"
      v-on="$listeners"
      style="
        border: #2e7be6 solid 1px !important;
        padding: 1.15rem 1.6rem;
        margin: 0 0.2rem;
        border-radius: 5px !important;
      "
      small
      class="text-subtitle-2 primary"
    >
      <div>
        {{ $tr(text) }}
      </div>
    </v-btn>

    <v-btn
      v-if="type === 'danger'"
      v-bind="$attrs"
      v-on="$listeners"
      style="
        border: #E82C5D solid 1px !important;
        padding: 1.15rem 1.6rem;
        margin: 0 0.2rem;
        border-radius: 5px !important;
      "
      small
      class="text-subtitle-2 error"
    >
      <div>
        {{ $tr(text) }}
      </div>
    </v-btn>

    <v-btn
      v-if="type === 'secondary'"
      v-bind="$attrs"
      v-on="$listeners"
      :style="`
        border: #78909C solid 1px !important;
        padding: 1.15rem 1.6rem;
        ${$vuetify.theme.dark ? '' : 'background-color: #DEE8EB !important;'}
        border-radius: 5px !important;
      `"
      small
      class="text-subtitle-2"
    >
      <div>
        {{ $tr(text) }}
      </div>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "TextButton",
  props: {
    text: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      default: "primary",
    },
  },
};
</script>

<style></style>
