<template>
  <v-card class="main-Card px-3">
    <v-card-title
      primary-title
      class="pb-1 my-0 title d-flex justify-space-between"
    >
      <h2 class="text-h4 font-weight-bold">
        {{ $tr(`${isAutoEdit ? "item_auto_edit" : "item_edit"}`, tableName) }}
      </h2>
      <CloseBtn @click="close" type="button" />
    </v-card-title>
    <v-card-text class="position-relative card-pos">
      <v-card class="headerCard pt-3 px-3" elevation="0">
        <v-row>
          <v-col
            cols="12 pa-0 ma-0"
            md="3"
            lg="2"
            class="text-center"
            v-if="showTitle"
          >
            <v-avatar class="rounded d-inline-block ms-3" size="130">
              <v-icon v-if="isIcon" color="white" class="ma-0 pa-0" size="135">
                {{ iconOrLogo }}
              </v-icon>
              <v-img v-else :src="iconOrLogo"></v-img>
            </v-avatar>
          </v-col>
          <v-col
            cols="12 pa-0 ma-0 pt-2"
            :md="showTitle ? '9' : '12'"
            :lg="showTitle ? '10' : '12'"
          >
            <h2
              class="name text-h4 ms-1 font-weight-bold text-center text-md-left"
              v-if="checkName()"
            >
              {{ editData.name }}
            </h2>
            <div class="d-flex justify-space-between">
              <div>
                <h2
                  :class="`name text-h4 font-weight-bold ${
                    showTitle ? '' : 'ms-2'
                  } ${showOnlyTitle ? 'mb-5' : ''}`"
                  v-if="showTitle || showOnlyTitle"
                >
                  {{ title }}
                </h2>
              </div>

              <!--    Auto Edit Section  -->
              <div class="me-3" v-if="isAutoEdit">
                <div class="d-flex">
                  <h2
                    class="text-h5 mx-2 font-weight-bold"
                    style="color: #58595b"
                  >
                    {{ tableName }} :
                  </h2>
                  <span class="text-h5 font-weight-bold" style="color: #58595b">
                    {{ currentIndex + 1 }}
                  </span>
                  <span class="text-h5 font-weight-bold" style="color: #58595b">
                    /
                  </span>
                  <span class="text-h5 font-weight-bold" style="color: #58595b">
                    {{ totals }}
                  </span>
                </div>
                <v-btn-toggle
                  rounded
                  class="ms-auto float-right pt-1"
                  mandatory
                >
                  <v-btn
                    active-class="primary white--text"
                    x-small
                    @click="onPrevItem"
                  >
                    <v-icon x-small>fa-angle-double-left</v-icon>
                  </v-btn>
                  <v-btn
                    active-class="primary white--text"
                    x-small
                    @click="onNextItem"
                  >
                    <v-icon x-small>fa-angle-double-right</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </div>
            </div>
          </v-col>
        </v-row>
        <div
          class="d-flex justify-center margin"
          :class="{ 'pt-2 pb-1': !showTitle }"
        >
          <div class="stepper-header d-flex justify-space-around align-center">
            <template v-for="(header, i) in headers">
              <div
                :class="` ${i == 0 ? 'spacer-none' : ''} ${
                  current >= i + 1 ? 'current' : ''
                }`"
                :key="i"
              ></div>
              <div
                class="mr-md-5"
                :class="`stepper-header-item-outer text-center ${
                  current === i + 1 ? 'current' : ''
                }`"
                :key="i + 5 * headers.length"
                @click="changeTo(i + 1)"
              >
                <div
                  class="stepper-header-item-inner rounded-circle d-flex justify-center align-center mx-auto"
                >
                  <v-icon style="font-size: 18px">{{ header.icon }}</v-icon>
                </div>
                <div class="stepper-header-title">{{ $tr(header.title) }}</div>
              </div>
              <div
                :class="` ${i === headers.length - 1 ? 'spacer-none' : ''} ${
                  current > i + 1 ? 'current' : ''
                }`"
                :key="i + 3 * headers.length"
              ></div>
            </template>
          </div>
        </div>
      </v-card>
      <v-card
        elevation="0"
        :class="`mt-4 dataCard ${hasLogo ? 'has-logo' : ''}`"
      >
        <div
          :class="`content`"
          v-for="(header, i) in headers"
          :key="i * 1000"
          class=""
        >
          <transition :name="back ? 'slideback' : 'slide'">
            <div v-show="current === i + 1" class="stepper-content-item">
              <slot :name="header.slotName"></slot>
            </div>
          </transition>
        </div>
      </v-card>
      <v-card class="mt-5 footerCart" elevation="0">
        <div class="stepper-footer-outer">
          <div
            :class="`stepper-footer py-2 px-1 px-md-8 d-flex ${
              current !== headers.length
                ? 'justify-space-between'
                : 'justify-end'
            }`"
          >
            <v-btn
              v-if="current !== 1"
              text
              color="primary"
              class="stepper-btn"
              @click="prev"
            >
              <v-icon left x-small>fa-chevron-left</v-icon>
              {{ $tr("prev") }}
            </v-btn>
            <v-spacer></v-spacer>

            <v-btn
              color="primary"
              class="stepper-btn px-4"
              style="min-width: 150px"
              v-if="isLoading || isSubmitting"
              :loading="isLoading || isSubmitting"
            >
              <template v-slot:loader>
                <span>
                  <span>
                    {{
                      isSubmitting
                        ? $tr("submitting") + "..."
                        : $tr("validating") + "..."
                    }}</span
                  >
                  <v-progress-circular
                    class="ma-0"
                    indeterminate
                    color="white"
                    size="25"
                    :width="2"
                  />
                </span>
              </template>
            </v-btn>

            <!--     Auto Edit Section       -->
            <div v-else-if="isAutoEdit">
              <v-btn
                color="primary"
                class="border px-3 ms-2 stepper-btn"
                @click="saveAndNext"
                v-if="currentIndex + 1 < totals"
              >
                {{ $tr("save_next") }}
              </v-btn>
              <v-btn class="ms-2 px-3 border stepper-btn" @click="onSave">
                {{ $tr("save") }}
              </v-btn>
              <v-btn
                v-if="current !== headers.length"
                class="ms-2 me-3 px-3 border stepper-btn"
                @click="
                  current === headers.length ? onNextItem() : onValidate()
                "
                >{{ $tr("next") }}
              </v-btn>
            </div>
            <v-btn
              v-else
              color="primary"
              class="stepper-btn"
              @click="() => onValidate()"
              type="button"
              >{{
                current === headers.length - 1
                  ? $tr("update")
                  : current === headers.length
                  ? $tr("close")
                  : $tr("next")
              }}
              <v-icon right small
                >{{
                  current === headers.length - 1
                    ? "fa-check"
                    : current === headers.length
                    ? "fa-times"
                    : "fa-chevron-right"
                }}
              </v-icon>
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
import CloseBtn from "~/components/design/Dialog/CloseBtn";

export default {
  components: {
    CloseBtn,
  },
  props: {
    showTitle: {
      type: Boolean,
      default: true,
      require: false,
    },
    title: {
      require: true,
      type: String,
    },
    showOnlyTitle: {
      type: Boolean,
      default: true,
    },
    headers: {
      require: true,
      type: Array,
    },
    iconOrLogo: {
      require: true,
    },
    isIcon: {
      type: Boolean,
      default: true,
    },
    tableName: {
      require: true,
    },
    isLoading: {
      require: true,
      default: false,
    },

    isSubmitting: {
      require: true,
      default: false,
    },
    isAutoEdit: {
      type: Boolean,
      default: false,
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
    totals: {
      type: Number,
      default: 5,
    },
    editData: {
      type: Object,
    },
    hasLogo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      back: false,
      current: 1,
    };
  },
  methods: {
    // close edit dialog
    closeDialog() {
      this.$root.$emit("closeEdit");
    },

    /** Outer Stepper **/

    // fired on save button event
    onSave() {
      this.$emit("onSave");
    },

    // fired on save and next event
    saveAndNext() {
      this.$emit("OnSaveAndNext");
    },

    // goes to next page
    onNextItem() {
      this.$emit("onItemChange", "next");
    },

    // goes prev item
    onPrevItem() {
      this.$emit("onItemChange", "back");
    },

    /** Inner Stepper */

    // call validation event  or submit event
    close() {
      this.$emit("close");
    },

    onValidate() {
      if (this.current === this.headers.length - 1) {
        this.$emit("onSubmit");
      } else if (this.current === this.headers.length) {
        this.close();
      } else {
        this.$emit("onValidate", this.current);
      }
    },

    // goes to next step
    nextForce() {
      if (this.current !== this.headers.length) {
        this.back = false;
        this.current = this.current + 1;
      } else {
        this.current = 1;
      }
    },

    // goes one step back
    prev() {
      if (this.current !== 1) {
        this.back = true;
        this.current = this.current - 1;
      }
    },

    // set current step to a specific step
    setCurrent(current) {
      this.current = current;
    },

    // change to specific step or fire on icon clicked
    changeTo(index) {
      // if (this.current > index) {
      //   this.back = true;
      //   this.current = index;
      // } else {
      // this.$emit("onValidate", this.current);
      this.$emit("onChangeTo", index);
      // }
    },
    success() {
      this.current = this.headers.length;
    },

    checkName() {
      return !!this.editData?.name;
    },
  },
};
</script>
<style scoped>
.card-pos {
  height: 73vh;
}
.stepper-btn {
  font-size: 16px;
  height: 38px !important;
  font-weight: 400;
  border-radius: 4px;
}
.footerCart {
  position: absolute;
  bottom: 20px;
  right: 16px;
  left: 16px;
}
.dataCard {
  overflow-y: scroll !important;
  position: absolute;
  top: 116px;
  bottom: 110px;
  right: 16px;
  left: 16px;
}
.has-logo.dataCard {
  top: 166px !important;
}
.main-Card {
  background-color: var(--stepper-header-bg) !important;
  height: 80vh;
}
.main-Card .margin {
  margin-top: -45px;
}
@media only screen and (max-width: 960px) {
  .margin {
    margin-top: 0 !important;
  }
}
.main-Card .title {
  color: #b6c1d2 !important;
}
.stepper-header {
  position: sticky;
  top: 0;
  z-index: 1000000000;
}
.stepper-header-item-outer {
  position: relative;
  cursor: pointer;
  min-width: 64px;
}

.spacer.current {
  background: var(--spacer-active-current);
}

.spacer-none {
  background: transparent !important;
}

@media only screen and (max-width: 800px) {
  .spacer {
    display: none;
  }
}

.stepper-header-item-inner {
  height: 46px;
  width: 46px;
  border: 2px solid var(--stepper-header-item-border);
  background: var(--bg-white);
  transition: all 0.3s;
  z-index: 3;
  position: relative;
}

.current.stepper-header-item-outer .stepper-header-item-inner {
  background: var(--v-primary-base) !important;
  border-color: var(--v-primary-base) !important;
  color: white;
}

.stepper-header-item-inner .v-icon {
  color: var(--stepper-header-item-border);
  transition: all 0.3s;
}

.current .stepper-header-item-inner .v-icon {
  color: white !important;
}

.stepper-header-title {
  color: var(--input-placeholder-color);
}

.current .stepper-header-title {
  color: var(--v-primary-base);
}

.slide-leave-active {
  transition: 0.3s;
  position: absolute;
  display: none;
}

.slide-enter-active {
  transition: 0.3s;
}

.slide-enter {
  transform: translate(100%, 0);
}

.slide-leave-to {
  transform: translate(-100%, 0);
  position: absolute;
}

.slideback-leave-active {
  transition: 0.3s;
  display: none;
}

.slideback-enter {
  transform: translate(-100%, 0%);
}

.slideback-enter-active {
  transition: 0.3s;
}
</style>
