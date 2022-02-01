<template>
    <v-form lazy-validation ref="reasonForm" @submit.prevent="submitForm">
        <CustomStepper
            :headers="steppers"
            @close="closeDialog"
            :canNext="false"
            @validate="()=>{}"
            :is-submitting="isLoading"
            @submit="submitForm"
            ref="customStepper"
            >
            <template v-slot:step1>
                <div class="w-full pb-3">
                    <CustomInput
                        :label="$tr('label_required',$tr('title'))"
                        placeholder="title"
                        type="textarea"
                        v-model.trim="$v.reason.title.$model"
                        :rules="titleRule($v.reason.title)"
                    />
                </div>
            </template>

            <template v-slot:step2>
                <DoneMessage :title="$tr('item_all_set',$tr('reason'))" :subTitle="$tr('you_can_access_your_item',$tr('reason'))"/>
            </template>
        </CustomStepper>
    </v-form>
</template>



<script>
import { mapActions } from "vuex";
import { minLength, required } from "vuelidate/lib/validators";
import CustomStepper from "~/components/design/FormStepper/CustomStepper";
import HandleException from "~/helpers/handle-exception";
import CustomInput from "~/components/design/components/CustomInput.vue";
import FormBtn from "~/components/design/components/FormBtn.vue";
import SelectedItem from "~/components/design/components/SelectedItem";
import DoneMessage from "~/components/design/components/DoneMessage.vue";

export default {
    name: "RegisterReason",
    components: { CustomInput, FormBtn, SelectedItem, CustomStepper, DoneMessage },


    data(){
        return {
            isLoading: false,
            steppers: [
                {icon: "fa-lock", title: "general", slotName: "step1"},
                {icon: "fa-thumbs-up", title: "done", slotName: "step2"},
            ],
            reason:{


                title:              '',
            },

        }
    },

    validations:{
        reason:{
            title:        { required, minLength: minLength(2) },
        }
    },
    props:{
        slug:{
            type: String
        }
    },


    methods:{
        ...mapActions({
            fetchReasons: "reasons/fetchReasons",
        }),

        async submitForm() {
            this.$refs.reasonForm.validate();
            this.$v.reason.$touch();
            if (!this.$v.reason.$invalid) {
                this.isLoading = true
                await this.insertRecord();
            } else {
                this.$toastr.e(this.$tr("please_fill_all_fields_correctly"));
            }
        },

        async insertRecord(){
            this.reason.system_name = this.slug;
            try {
                const response = await this.$axios.post("reasons", this.reason);
                if (response?.status == 200) {
                    this.resetForm();
                    this.$refs.customStepper.setCurrent(2);
                    this.fetchReasons({slug:this.slug})
                    this.isLoading=false;
                } else {
                this.$toastr.e(this.$tr("something_went_wrong"));
                    this.isLoading=false;

                }
            } catch (error) {
                HandleException.handleApiException(this, error);
                    this.isLoading=false;
            }
        },

        resetForm(){
            this.reason.title               = '';
            this.$refs.reasonForm?.resetValidation();
        },

        closeDialog() {
            this.resetForm();
            this.$refs.customStepper.fillMore()
        },
        titleRule(title) {
            return [
                (_) => title.required || this.$tr('item_is_required', this.$tr("title")),
                (_) => title.minLength || this.$tr('min_length', this.$tr("title"),this.$tr('2'))
            ];
        },
    },
}
</script>
