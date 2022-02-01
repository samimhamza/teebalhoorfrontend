<template>
  <div
    class="primary w-full white--text px-5 py-1 d-flex justify-space-between"
    style="height: 46px !important"
  >
    <div class="d-flex py-0 my-0">
      <v-checkbox
        :input-value="selected"
        color="white"
        class="my-0 py-0"
        @click="unSelectAll"
      ></v-checkbox>
      <span class="font-weight-thin">{{ items.length }} file selected</span>
    </div>
    <div>
      <v-btn class="pa-0 buttonStyle" elevation="0">
        <div class="d-flex align-center pa-0 ma-0">
          <img
            width="35"
            class="pa-0 ma-0"
            src="/File Manage/File Managment system ICon-14.svg"
          />
          <div class="">{{ $tr("share") }}</div>
          <v-icon>mdi-chevron-down</v-icon>
        </div>
      </v-btn>
      <v-btn class="pa-0 buttonStyle pe-1" elevation="0">
        <div class="d-flex align-center pa-0 ma-0">
          <img
            width="40"
            class="pa-0 ma-0"
            src="/File Manage/File Managment system ICon-15.svg"
          />
          <div class="">{{ $tr("permalink") }}</div>
        </div>
      </v-btn>
      <v-btn class="pa-0 buttonStyle pe-1" elevation="0">
        <div class="d-flex align-center pa-0 ma-0">
          <img
            width="35"
            class="pa-0 ma-0"
            src="/File Manage/File Managment system ICon-16.svg"
          />
          <div class="">{{ $tr("download") }}</div>
        </div>
      </v-btn>
      <v-menu offset-y :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text class="white--text" v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-horizontal </v-icon>
          </v-btn>
        </template>
        <v-list>
          <!-- <v-list-item class="text-uppercase">{{
            $t("buttons.view")
          }}</v-list-item>
          <v-list-item link v-for="(item, index) in actions" :key="index">
            <v-list-item-title
              class="d-flex align-center"
              @click="selectViewStyle(item)"
            >
              <img width="30" :src="item.prepend" alt="" />
              <div class="px-1">{{ item.text }}</div>
              <v-icon v-if="item.hasCheck">{{ item.append }}</v-icon>
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            class="text-uppercase"
            v-if="dropdownItems[1].hasCheck"
            >{{ $t("buttons.thumbnail_size") }}</v-list-item
          >
          <v-list-item class="sliderStyle" v-if="dropdownItems[1].hasCheck">
            <v-slider
              max="150"
              min="80"
              append-icon="mdi-plus"
              prepend-icon="mdi-minus"
              @click:append="addSize"
              @click:prepend="minusSize"
              v-model="thumbnailSize"
              @change="changeSize"
            ></v-slider>
          </v-list-item> -->
        </v-list>
      </v-menu>
    </div>
    <div>
      <v-btn text class="pa-0 EscButton" elevation="0">
        <div class="d-flex align-center pa-0 ma-0 white--text">
          <div class="">{{ $tr("esc") }}</div>
          <v-icon>mdi-close</v-icon>
        </div>
      </v-btn>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    selectedFile: {
      required: true,
    },
    selectedItems: {
      required: true,
    },
  },
  data() {
    return {
      selected: this.selectedFile,
      items: this.selectedItems,
    };
  },
  methods: {
    unSelectAll() {
      this.$emit("update:selectedFile", this.selected);
      this.$emit("update:selectedItems", this.items);
      this.$emit("unSelectAll");
    },
  },
};
</script>
<style scoped>
.EscButton {
  border: none !important;
  background-color: transparent !important;
}
</style>
