<template v-slot:done>
    <div class="topDiv">
    <div class="topTitle">
        <h1
        class="text-center text-h4 font-weight-bold border-bottom py-2 text-uppercase"
        style="color: #58595b"
        >
        {{$tr('done')}}
        </h1>
    </div>
    <div class="labels mt-3 mx-1">
        <done-message title="Done" :subTitle="'Done with success'" />
    </div>
    </div>
</template>
<script>
import DoneMessage from '../../../design/components/DoneMessage.vue';
export default {
    components: {DoneMessage, },
}
</script>
<style>
.custom-logo {
  background-repeat: no-repeat;
  background-size: cover !important;
  background-position: center;
  background: #edf2f9;
}
.custom-logo .v-file-input__text {
  height: 110px;
  opacity: 0;
}
.custom-logo .v-input__slot fieldset {
  border-style: dashed !important;
}
.custom-logo .v-input__slot {
  min-height: 200px !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
.upload-first-p {
  font-size: 18px;
  color: var(--upload-input-first-p);
  letter-spacing: 0.5px;
}
.upload-second-p {
  color: var(--input-border-color);
  line-height: 1.5;
}
.custom-logo .v-input__prepend-inner {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.main-Card {
  background-color: #f9fafd !important;
}
.main-Card .title {
  color: #b6c1d2 !important;
}
.main-Card .v-stepper .v-stepper__header .v-stepper__step__step {
  display: none !important;
}
.main-Card .v-stepper__step.v-stepper__step--active .v-stepper__label .v-btn {
  background-color: var(--v-primary-base);
  color: white;
}
.dublicate-name {
  top: 33%;
  padding: 0rem !important;
  position: absolute !important;
  color: red;
}
</style>
