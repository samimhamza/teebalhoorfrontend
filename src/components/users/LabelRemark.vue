<template>
  <div>
    <div class="d-flex">
      <CustomInput
        :items="allLabels"
        item-value="id"
        item-text="title"
        :label="$tr('label_required', $tr('label'))"
        :placeholder="$tr('choose_item',$tr('label'))"
        v-model="itemData.label_id.$model"
        :rules="rules.labelRule(itemData, $root)"
        type="autocomplete"
        class="mb-0 w-full w-md-half"
      />
    </div>
    <div class="d-flex">
      <CustomInput
        :label="$tr('label_required', $tr('note'))"
        placeholder="note"
        type="textarea"
        v-model="itemData.note.$model"
        :rules="rules.noteRule(itemData, $root)"
        class="mb-0 w-full"
        rows="4"
      />
    </div>
  </div>
</template>

<script>
import CustomInput from "../design/components/CustomInput";

export default {
  name: "LabelRemark",
  components: { CustomInput },

  props: {
    allLabels: {
      required: true,
      type: Array,
    },
    item: {
      required: true,
      type: Object,
    },
    rules: {
      required: true,
      type: Object,
    },
  },

  data() {
    return {
      itemData: this.item,
    };
  },
  methods: {
    // check validations
    checkValidation() {
      const isLabelInvalid = this.itemData.label_id.$invalid;
      const isNoteInvalid = this.itemData.note.$invalid;
      const isInvalid = isNoteInvalid || isLabelInvalid;
      return !isInvalid;
    },
  },
};
</script>

<style scoped></style>
