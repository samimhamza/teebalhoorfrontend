<template>
  <div class="mt-3 px-4">Tab Four</div>
</template>
<script>
import CustomButton from "../design/components/CustomButton.vue";

export default {
  components: {
    CustomButton,
  },
  data() {
    return {
      menuItems: [
        {
          title: "remove",
          icon: "fa-trash",
        },
      ],
    };
  },
  methods: {},
};
</script>
<style scoped>
.team-member {
  border: 1px solid rgba(220, 220, 220, 0.5);
  padding: 8px;
}
.first-p {
  margin-bottom: 4px !important;
  font-size: 14px !important;
}
.second-p {
  font-size: 12px !important;
}
</style>
