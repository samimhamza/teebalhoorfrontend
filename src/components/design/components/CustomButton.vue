<template>
  <v-btn
    v-if="!isDropdown"
    elevation="1"
    outlined
    :class="`custom-btn btn-${type} ${!text ? 'just-icon' : ''}`"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div class="flex-column justify-items-center">
      <div v-if="!isSvg" :class="isHasStyle ? 'px-4 ' : ''">
        <v-icon> {{ icon }}</v-icon>
      </div>
      <div v-else class="px-3 pt-1">
        <img width="45" :src="icon" alt="" />
      </div>
      <div class="btn-text">{{ $tr(text) }}</div>
    </div>
  </v-btn>
  <v-menu offset-y v-else :close-on-content-click="false" v-model="dropdown">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        elevation="1"
        outlined
        :class="`custom-btn btn-${type} ${!text ? 'just-icon' : ''}`"
        v-bind="attrs"
        v-on="on"
      >
        <div class="flex-column justify-items-center">
          <div v-if="!isSvg" :class="isHasStyle ? 'px-4 ' : ''">
            <v-icon> {{ icon }}</v-icon>
          </div>
          <div v-else class="px-3 pt-1">
            <img width="45" :src="icon" alt="" />
          </div>
          <div class="btn-text">{{ $tr(text) }}</div>
        </div>
      </v-btn>
    </template>
    <v-list>
      <v-list-item class="text-uppercase">{{ $tr("view") }}</v-list-item>
      <v-list-item link v-for="(item, index) in dropdownItems" :key="index">
        <v-list-item-title
          class="d-flex align-center"
          @click="selectViewStyle(item)"
        >
          <img width="30" :src="item.prepend" alt="" />
          <div class="px-1">{{ item.text }}</div>
          <v-icon v-if="item.hasCheck">{{ item.append }}</v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-list-item class="text-uppercase" v-if="dropdownItems[1].hasCheck">{{
        $tr("thumbnail_size")
      }}</v-list-item>
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
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
export default {
  props: {
    icon: {
      required: true,
      type: String,
    },
    text: {
      required: true,
      type: String,
    },
    type: {
      type: String,
      default: "light",
    },
    customDisabled: {
      type: Boolean,
    },
    isSvg: {
      default: false,
      type: Boolean,
    },
    isHasStyle: {
      default: false,
      type: Boolean,
    },
    isDropdown: {
      default: false,
      type: Boolean,
    },
    dropdownItems: {
      type: Array,
    },
  },
  data() {
    return {
      thumbnailSize: 110,
      dropdown: false,
    };
  },
  methods: {
    selectViewStyle(item) {
      this.dropdown = false;
      this.$emit("viewStyle", item.key);
    },
    changeSize() {
      this.$emit("changeSize", this.thumbnailSize);
    },
    addSize() {
      this.thumbnailSize += 5;
      this.$emit("changeSize", this.thumbnailSize);
    },
    minusSize() {
      this.thumbnailSize -= 5;
      this.$emit("changeSize", this.thumbnailSize);
    },
  },
};
</script>
<style scoped>
.custom-btn {
  padding-left: 1.85rem !important;
  padding-right: 1.85rem !important;
  height: 40px !important;
  margin: 0.16rem 0.16rem !important;
  border-radius: 4px !important;
}

.custom-btn.just-icon {
  padding: 0.3rem 0rem !important;
  min-width: 54px;
}
.custom-btn.btn-light .v-icon {
  font-size: 10px;
}

.custom-btn .v-icon {
  font-size: 12px;
}

.custom-btn.just-icon .v-icon {
  font-size: 16px !important;
}

.btn-light {
  color: var(--v-primary-darken1) !important;
  border: 1px solid #ccc;
}

.btn-primary {
  background: var(--v-primary-base) !important;
  border-color: var(--v-primary-base) !important;
  color: #fff !important;
}

.btn-dark {
  background: #102457 !important;
  border-color: #102457 !important;
  color: #fff !important;
}

.btn-primary-darken2 {
  background: #2a549b !important;
  border-color: #2a549b !important;
  color: #fff !important;
}

.btn-primary-darken1 {
  background: #3a77c3 !important;
  border-color: #3a77c3 !important;
  color: #fff !important;
}

.btn-danger {
  background: #e83c59 !important;
  border-color: #e83c59 !important;
  color: #fff !important;
}

.btn-danger2 {
  background: #e84b3a !important;
  border-color: #e84b3a !important;
  color: #fff !important;
}

.btn-text {
  font-size: 11px;
  font-weight: bolder;
  line-height: 0.8 !important;
}
.sliderStyle {
  width: 230px !important;
}
</style>
