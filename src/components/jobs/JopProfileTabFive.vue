<template>
  <div class="mt-3 px-4">
    <v-row>
      <v-col cols="12" md="3" class="px-2">
        <CustomInput
          v-model="filterText"
          placeholder="filter_button"
          type="textfield"
        />
        <v-btn block tile color="primary" class="mb-1">
          <div class="d-flex w-full justify-space-around">
            <p class="ma-0">General</p>
            <v-chip class="ms-1 tab-chip" small v-text="1" />
          </div>
        </v-btn>
        <v-btn block tile color="" class="mb-1">
          <div class="d-flex w-full justify-space-around align-center">
            <v-avatar class="" color="primary" size="28">
              <span class="white--text">RM</span>
            </v-avatar>
            <p class="ma-0 candidate-name">Candidated Name</p>
            <v-chip class="ms-1 tab-chip" small v-text="1" />
          </div>
        </v-btn>
      </v-col>
      <v-col cols="12" md="9" class="px-2">hi </v-col>
    </v-row>
  </div>
</template>
<script>
import CustomInput from "../design/components/CustomInput.vue";

export default {
  components: {
    CustomInput,
  },
  data() {
    return {
      filterText: "",
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
.candidate-name {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
