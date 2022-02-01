<template>
  <v-dialog v-model="model" width="1300" persistent>
    <Dialog @closeDialog="closeDialog">
      <v-form lazy-validation ref="candidateRegisterForm">
        <div class="stepper arial">
          <div class="stepper-header d-flex justify-space-around align-center">
            <template v-for="(header, i) in headers">
              <div
                :class="`spacer ${i == 0 ? 'spacer-none' : ''} ${
                  current >= i + 1 ? 'current' : ''
                }`"
                :key="i"
              ></div>
              <div
                :class="`stepper-header-item-outer text-center ${
                  current == i + 1 ? 'current' : ''
                } ${current > i + 1 ? 'finished' : ''}`"
                :key="i + 5 * headers.length"
                @click="changeTo(i + 1)"
              >
                <div
                  :class="`stepper-header-item-inner rounded-circle d-flex justify-center align-center mx-auto ${
                    current >= i + 1 ? 'current' : ''
                  } ${
                    current == headers.length && i < headers.length - 1
                      ? 'not-allowed'
                      : ''
                  }`"
                >
                  <v-icon style="font-size: 18px">{{ header.icon }}</v-icon>
                </div>
                <div class="stepper-header-title">{{ $tr(header.title) }}</div>
              </div>
              <div
                :class="`spacer ${
                  i == headers.length - 1 ? 'spacer-none' : ''
                } ${current > i + 1 ? 'current' : ''}`"
                :key="i + 3 * headers.length"
                v-if="i == headers.length - 1"
              ></div>
            </template>
          </div>
          <div class="stepper-content overflow-hidden">
            <div class="content-outer px-md-4 pt-md-4 pb-0">
              <div
                :class="`content`"
                v-for="(header, i) in headers"
                :key="i * 1000"
              >
                <transition :name="back ? 'slideback' : 'slide'">
                  <div
                    v-show="current === i + 1"
                    class="stepper-content-item pa-3"
                  >
                    <slot :name="header.slotName"></slot>
                  </div>
                </transition>
              </div>
            </div>
          </div>
          <div class="stepper-footer-outer pa-md-3 pa-2">
            <div
              :class="`stepper-footer py-2 px-1 px-md-8 d-flex ${
                current === 1
                  ? 'justify-end'
                  : current != headers.length
                  ? 'justify-space-between'
                  : 'justify-end'
              }`"
            >
              <v-btn
                text
                color="primary"
                class="stepper-btn"
                @click="prev"
                v-if="current !== headers.length && current !== 1"
              >
                <v-icon left x-small>fa-chevron-left</v-icon>
                {{ $tr("prev") }}
              </v-btn>
              <!--
        <v-spacer /> -->

              <div>
                <v-btn
                  text
                  color="primary"
                  class="stepper-btn mr-2"
                  @click="nextSkip"
                  v-if="isInSkip(current)"
                  :type="current === headers.length ? 'submit' : 'button'"
                >
                  {{ $tr("skip") }}
                  <v-icon right small
                    >{{
                      current == headers.length - 1
                        ? "fa-check"
                        : current == headers.length
                        ? "fa-times"
                        : "fa-chevron-right"
                    }}
                  </v-icon>
                </v-btn>

                <v-btn
                  color="primary"
                  class="stepper-btn px-3"
                  style="min-width: 160px"
                  v-if="loading || isSubmitting"
                  :loading="loading || isSubmitting"
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

                <v-btn
                  v-else-if="current === headers.length"
                  color="primary"
                  class="stepper-btn"
                  @click="fillMore"
                  :type="'button'"
                >
                  {{ $tr("start_over") }}
                  <v-icon right small>fa-redo</v-icon>
                </v-btn>

                <v-btn
                  v-else
                  color="primary"
                  class="stepper-btn"
                  @click="current === headers.length - 1 ? submit() : next()"
                  :type="'button'"
                >
                  {{ $tr(current === headers.length - 1 ? "submit" : "next") }}
                  <v-icon right small>
                    {{
                      current === headers.length - 1
                        ? "fa-check"
                        : "fa-chevron-right"
                    }}
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-form>
    </Dialog>
  </v-dialog>
</template>
<script>
import FlagIcon from "../../common/FlagIcon.vue";
import CloseBtn from "../Dialog/CloseBtn.vue";
import CustomInput from "../components/CustomInput.vue";
import SelectedItem from "../components/SelectedItem.vue";
import FormAddBtn from "../components/FormBtn.vue";

export default {
  components: {
    CloseBtn,
    FlagIcon,
    CustomInput,
    SelectedItem,
    FormAddBtn,
  },
  props: {
    headers: {
      type: Array,
    },
    isSubmitting: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },

    canNext: {
      type: Boolean,
    },
    skip: {
      type: Array,
      default() {
        return [];
      },
    },
    reloadReason: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      model: true,
      current: 1,
      checkbox1: true,
      back: false,
      filePath: "",
    };
  },
  methods: {
    async next() {
      await this.$emit("validate", this.current);
      if (this.canNext) {
        this.$emit("update:canNext", false);
        if (this.current !== this.headers.length) {
          this.back = false;
          this.current = this.current + 1;
          this.$emit("onNext", this.current);
        } else {
          this.$emit("close");
          this.current = 1;
        }
      }
    },
    // goes to next step
    forceNext() {
      if (this.current !== this.headers.length) {
        this.back = false;
        this.current = this.current + 1;
        this.$emit("onNext", this.current);
      } else {
        this.$emit("close");
        this.current = 1;
      }
    },
    nextSkip() {
      this.$emit("onSkip");
      if (this.current !== this.headers.length) {
        this.back = false;
        this.current = this.current + 1;
        this.$emit("onNext", this.current);
      } else {
        this.$emit("close");
        this.current = 1;
      }
    },
    fillMore() {
      this.current = 1;
      if (this.reloadReason) {
        this.$emit("reloadReason");
      }
    },
    prev() {
      if (this.current !== 1) {
        this.back = true;
        this.current = this.current - 1;
      }
    },
    async changeTo(index) {
      // await this.$emit("validate", this.current);
      if (index !== this.headers.length) {
        if (this.current !== this.headers.length) {
          if (this.current > index) {
            this.back = true;
          } else {
            this.back = false;
          }
          this.current = index;
          this.$emit("onChangeTo", this.current);
        }
      }
    },
    setCurrent(current) {
      this.current = current;
    },
    isInSkip(current) {
      return this.skip.includes(current);
    },
    submit() {
      this.$emit("submit");
    },
    // close dialog
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>
<style scoped>
.stepper {
  height: 80vh;
}
.stepper-header {
  padding: 20px 50px;
  background: var(--stepper-header-bg);
  position: sticky;
  top: 0;
  z-index: 1000000000;
  overflow: hidden;
}
.stepper-header-item-outer {
  position: relative;
  cursor: pointer;
  min-width: 64px;
}
.spacer {
  height: 2px;
  background: var(--stepper-header-item-border);
  transform: translateY(-11px) scaleX(1.3);
  z-index: 1;
  transition: all 0.3s;
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
  height: 42px;
  width: 42px;
  border: 2px solid var(--stepper-header-item-border);
  background: var(--bg-white);
  transition: all 0.3s;
  z-index: 3;
  position: relative;
}
.not-allowed.stepper-header-item-inner {
  cursor: not-allowed;
}
.current.stepper-header-item-outer .stepper-header-item-inner {
  background: var(--v-primary-base) !important;
  border-color: var(--v-primary-base) !important;
  color: var(--color-white);
}
.finished.stepper-header-item-outer .stepper-header-item-inner {
  background: var(--v-primary-base) !important;
  border-color: var(--v-primary-base) !important;
  color: var(--color-white);
}
.stepper-header-item-inner .v-icon {
  color: var(--stepper-header-item-border);
  transition: all 0.3s;
}
.current .stepper-header-item-inner .v-icon,
.finished .stepper-header-item-inner .v-icon {
  color: var(--color-white) !important;
}
.stepper-header-title {
  color: var(--input-placeholder-color);
}
.current .stepper-header-title {
  color: var(--v-primary-base);
}
.finished .stepper-header-title {
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
.slideback-leave-to {
  transform: translate(100%, 0%);
}
.stepper-footer {
  background: var(--stepper-header-bg);
}
.stepper-btn {
  font-size: 16px;
  height: 38px !important;
  font-weight: 400;
  border-radius: 4px;
}
.stepper-footer-outer {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
}
.content-outer {
  position: absolute;
  top: 90px;
  left: 0;
  right: 0;
  bottom: 100px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
