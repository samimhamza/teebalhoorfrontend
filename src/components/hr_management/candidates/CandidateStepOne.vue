<template>
  <div>
    <CustomInput
      placeholder="current_company"
      label="current_company"
      type="textfield"
      counter
      :maxlength="candidate.current_company.$params.maxLength.max"
      v-model="candidate.current_company.$model"
      :rules="validate(candidate.current_company, $root, 'current_company')"
    />

    <CustomInput
      :items="occupations"
      item-value="id"
      item-text="name"
      has-logo
      :loading="isFetchingOccupations"
      v-model="candidate.current_occupation_id.$model"
      :rules="
        validate(candidate.current_occupation_id, $root, 'current_position')
      "
      label="current_position"
      :placeholder="$tr('choose_item', $tr('current_position'))"
      type="autocomplete"
      class="mb-0"
    />

    <CustomInput
      v-model="candidate.diploma.$model"
      :rules="validate(candidate.diploma, $root, 'diploma')"
      :maxlength="candidate.diploma.$params.maxLength.max"
      counter
      type="textfield"
      placeholder="diploma"
      label="diploma"
    />
  </div>
</template>


<script>
import CustomInput from "~/components/design/components/CustomInput";
import GlobleRules from "~/helpers/vuelidate";
export default {
  components: { CustomInput },
  props: {
    candidate: {
      type: Object,
      required: true,
    },
  },

  async fetch() {
    try {
      if (this.occupations.length) {
        return;
      }
      this.isFetchingOccupations = true;
      const url = "data?table=occupations";
      const response = await this.$axios.get(url);
      this.occupations = response.data.occupations;
    } catch (error) {}
    this.isFetchingOccupations = false;
  },

  data() {
    return {
      validate: GlobleRules.validate,
      occupations: [],
      isFetchingOccupations: false,
    };
  },
};
</script>
