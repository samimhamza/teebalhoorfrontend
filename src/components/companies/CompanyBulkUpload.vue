<template>
  <v-form
    ref="company_bulk_upload_file_form"
    lazy-validation
    @submit.prevent="onSubmit"
    id="company_bulk_upload_file_form"
  >
    <v-dialog
      v-model="fileUploadError"
      width="450"
    >
      <Dialog  persistent @closeDialog="fileUploadError = false">
        <BulkUploadError :error_text="error_text" :isErrorOrWarning="isErrorOrWarning" />
      </Dialog>
    </v-dialog>
    <CustomStepper
      :headers="stepper_header"
      :canNext="false"
      ref="customStepper"
      @submit="onSubmit"
      :loading="isDataLoaded"
      :isSubmitting="isLoadingOrSubmitting"
      @validate="changeStepper"
    >
      <template v-slot:chooseFile>
        <div class="w-full">
            <v-file-input
            class="custom-file"
            style="border: 0px !important; background-color: white !important; margin-bottom: 10px !important;"
            outlined
            :accept="fileExtension"
            prepend-icon=""
            dense
            @change="validateFile"
            @click:clear="clearFile"
            :success="filePath !== ''"
            :rules="rules.fileRule($v.form, $root)"
            >
            <template slot="prepend-inner">
                <div
                name="prepend-inner"
                style="max-width: 260px; text-align: center;"
                >
                <p class="ma-0">
                    <svg
                    width="60"
                    height="60"
                    viewBox="100 100 500 140"
                    fill="currentColor"
                    style="transform: translateY(4px)"
                    >
                    <g>
                        <path
                        d="m479.71 198.78h-0.86328c-6.1133-51.496-50.938-91.512-102.99-91.512-42.559 0-81.152 26.367-96.625 65.824-2.7773-0.30469-5.5078-0.44141-8.168-0.44141-33.949 0-63.816 23.754-71.656 56.746-32.059 2.8945-56.934 29.938-56.934 62.348 0 34.512 28.094 62.625 62.625 62.625h119.63c4.293 0 7.7695-3.4766 7.7695-7.793 0-4.3164-3.4766-7.793-7.7695-7.793l-119.6-0.003906c-25.922 0-47.039-21.094-47.039-47.039 0-25.898 21.023-47.016 46.828-47.016l1.0039 0.023438c3.8281 0 7.1406-2.8477 7.7227-6.6484 4.0586-28.426 28.746-49.867 57.445-49.867 3.9883 0 7.957 0.42188 11.945 1.2383l1.4023 0.13672c3.4062 0 6.4648-2.2617 7.3984-5.4375 11.738-36.656 45.5-61.32 84.023-61.32 47.414 0 86.078 37.191 88.059 84.699 0.14063 2.0781 1.0977 4.0117 2.7305 5.4375 1.5391 1.3086 3.2422 1.6562 5.9258 1.8203 2.7305-0.30469 5.0859-0.46484 7.1641-0.46484 34.301 0 62.207 27.906 62.207 62.207s-27.906 62.207-62.207 62.207h-104.42c-4.293 0-7.7695 3.4766-7.7695 7.793s3.5 7.793 7.7695 7.793h104.42c42.887 0 77.793-34.883 77.793-77.793s-34.93-77.77-77.816-77.77z"
                        />
                        <path
                        d="m413.02 318.92c0.023437 0 0.023437 0 0 0 2.125 0 4.1289-0.81641 5.5312-2.2383 2.9883-3.0352 2.9883-7.957 0-11.012l-63.047-63.047c-2.9648-2.9414-8.0273-2.918-11.012 0.070312l-63.023 62.977c-1.4688 1.4688-2.2617 3.4297-2.2617 5.5078 0 2.1016 0.81641 4.0586 2.2383 5.4609 1.3984 1.4453 3.4062 2.2852 5.4844 2.3086h0.046875c2.1016 0 4.1055-0.81641 5.5312-2.2617l49.699-49.676v177.92c0 4.3164 3.5 7.793 7.7695 7.793 4.3164 0 7.8164-3.4766 7.8164-7.793v-177.92l49.652 49.652c1.4453 1.4375 3.4492 2.2578 5.5742 2.2578z"
                        />
                    </g>
                    </svg>
                </p>
                <div v-if="!isFileSelected">
                  <p class="mb-0" v-show="!isFileSelected">
                    {{ $tr("bulk_upload") }}
                  </p>
                  <p class="mb-0" v-show="!isFileSelected">
                    <small>{{ $tr("upload_only_excel") }}</small>
                  </p>
                </div>
                <div v-if="isFileSelected">
                  <p class="mb-0">name: {{ $v.form.file.$model.name }}</p>
                  <p class="mb-0">
                    <small>
                      size:
                      {{ ($v.form.file.$model.size / 1024).toFixed(2) }}
                      KB
                    </small>
                  </p>
                </div>
                </div>
            </template>
            </v-file-input>
        </div>
        <v-btn
        color="primary"
        class="download-button px-3 float-right"
        style="min-width: 160px ;"
        @click="onDownload"
        >
        <template>
            <div>
            <span> {{ !isFileDownloaded ? $tr("download_format") : $tr("downloading") }}</span>
            <v-progress-circular v-if="isFileDownloaded" class="ma-0" indeterminate color="white" size="25" :width="2"/>
            <i v-else class="fas fa-download ml-1"></i>
            </div>
        </template>
        </v-btn>
      </template>
      <template v-slot:fileUpload>
        <!-- errors.length == 0 && !isDataClean -->
        <BulkUploadFileLoader :value="percentage" v-if="errors.length == 0 && !isDataClean" />
        <FileUploadError v-else-if="errors.length > 0 && !isDataClean" />
        <BulkUploadSuccessLoader v-else-if="isDataClean"/>
        <DataTable
          ref="tableRef"
          :headers="selectedHeaders"
          :items="selectedRows"
          :ItemsLength="selectedRows.length"
          :show_select="false"
          :elevation="0"
          :perpageDropdown="perpageDropdown"
          v-show="errors.length > 0"
          :height="height"
          :itemsPerPage="5"
          disbale_data_table_hover="disbale-data-table-hover"
          :defaultNote="false"
          :defaultLogo="false"
          :defaultCountry="false"
          :showRefreshBtn="false"
          :key="tableKey"
        >
          <template v-slot:[`item.name`]="{ item, index }">
            <div class="w-full">
              <v-edit-dialog
              class="d-block"
                :return-value.sync="item.name"
                large
                @open="onOpen(item.name, 'name')"
                @save="onSave('name', 'name', index+6, company.name)"
              >
                <div
                  :class="`${
                    checkIfHasErr(item.name, 'name', index + 6)
                      ? 'text--white error-class px-5 d-flex align-center justify-center w-full'
                      : ''
                  }`"
                >
                  <span class="me-1">{{ item.name ? item.name : "empty" }}</span>
                  <v-progress-circular 
                    v-if="checkIfHasErr(item.name, 'name', index + 6) && (index+6) == current_index && current_column == 'name'" 
                    class="ma-0 float-right" 
                    indeterminate 
                    color="white" 
                    size="20" 
                    :width="2"
                  />
                </div>
                <template v-slot:input>
                  <CustomInput
                    style="width: 300px !important"
                    class="mt-3"
                    placeholder="name"
                    label="name"
                    type="textfield"
                    v-model="$v.company.name.$model"
                    :rules="rules.nameRule($v.company, $root)"
                    :error-message="nameErrMessage"
                  />
                </template>
              </v-edit-dialog>
            </div>
          </template>
          <template v-slot:[`item.note`]="{ item, index }">
            <div>
              <v-edit-dialog
                :return-value.sync="item.note"
                large
                @open="onOpen(item.note, 'note')"
                @save="onSave('note', 'note', index+6, company.note)"
              >
                <div
                  :class="`${
                    checkIfHasErr(item.note, 'note', index + 6)
                      ? 'text--white error-class px-5 d-flex align-center justify-center'
                      : ''
                  }`"
                >
                  {{ item.note ? item.note : "empty" }}
                </div>
                <template v-slot:input>
                  <CustomInput
                    style="width: 300px !important"
                    class="mt-3"
                    placeholder="note"
                    label="note"
                    type="textfield"
                    v-model="$v.company.note.$model"
                    :rules="rules.noteRule($v.company, $root)"
                    :error-message="noteErrMessage"
                  />
                </template>
              </v-edit-dialog>
            </div>
          </template>
          <template v-slot:[`item.email`]="{ item, index }">
            <div>
              <v-edit-dialog
                :return-value.sync="item.email"
                large
                @open="onOpen(item.email, 'email')"
                @save="onSave('email', 'email', index+6, company.email)"
              >
                <div
                  :class="`${
                    checkIfHasErr(item.email, 'email', index + 6)
                      ? 'text--white error-class px-5 d-flex align-center justify-center'
                      : ''
                  }`"
                >
                  {{ item.email ? item.email : "empty" }}
                  <v-progress-circular 
                    v-if="checkIfHasErr(item.name, 'email', index + 6) && (index+6) == current_index && current_column == 'email'" 
                    class="ma-0 float-right ml-2" 
                    indeterminate color="white" 
                    size="20" 
                    :width="2"
                  />
                </div>
                <template v-slot:input>
                  <CustomInput
                    style="width: 300px !important"
                    class="mt-3"
                    placeholder="email"
                    label="email"
                    type="textfield"
                    v-model="$v.company.email.$model"
                    :rules="rules.emailRule($v.company, $root)"
                    :error-message="emailErrMessage"
                  />
                </template>
              </v-edit-dialog>
            </div>
          </template>
          <template v-slot:[`item.investment_type`]="{ item, index }">
            <div>
              <v-edit-dialog
                :return-value.sync="item.investment_type"
                large
                @open="onOpen(item.investment_type, 'investment_type')"
                @save="onSave('investment_type', 'investment_type', index+6, company.investment_type)"
              >
                <div
                  :class="`${
                    checkIfHasErr(item.investment_type, 'investment_type', index + 6)
                      ? 'text--white error-class px-5 d-flex align-center justify-center'
                      : ''
                  }`"
                >
                  {{ item.investment_type ? item.investment_type : "empty" }}
                </div>
                <template v-slot:input>
                  <CustomInput
                    class="mt-3"
                    :items="investment_types"
                    style="width: 300px !important"
                    item-value="name"
                    item-text="name"
                    label="investment_type"
                    placeholder="investment_type"
                    type="autocomplete"
                    v-model="$v.company.investment_type.$model"
                    :rules="rules.investmentTypeRule($v.company, $root)"
                    :error-message="investment_typeErrMessage"
                  />
                </template>
              </v-edit-dialog>
            </div>
          </template>
          <template v-slot:[`item.system`]="{ item, index }">
            <div>
              <v-edit-dialog
                :return-value.sync="item.system"
                large
                @open="onOpen(item.system, 'system_id')"
                @save="onSave('system_id', 'system', index+6, company.system_id)"
              >
                <div
                  :class="`${
                    checkIfHasErr(item.system, 'system', index + 6)
                      ? 'text--white error-class px-5 d-flex align-center justify-center'
                      : ''
                  }`"
                >
                  {{ item.system ? item.system : "empty" }}
                </div>
                <template v-slot:input>
                  <CustomInput
                    class="mt-3"
                    :items="systems"
                    style="width: 300px !important"
                    item-value="name"
                    item-text="name"
                    label="system"
                    placeholder="systems"
                    type="autocomplete"
                    v-model="$v.company.system_id.$model"
                    :rules="rules.systemRule($v.company, $root)"
                    :error-message="systemErrMessage"
                  />
                </template>
              </v-edit-dialog>
            </div>
          </template>
          <template v-slot:[`item.label`]="{ item, index }">
            <div>
              <v-edit-dialog
                :return-value.sync="item.label"
                large
                @open="onOpen(item.label, 'label_id')"
                @save="onSave('label_id', 'label', index+6, company.label_id)"
              >
                <div
                  :class="`${
                    checkIfHasErr(item.label, 'label', index + 6)
                      ? 'text--white error-class px-5 d-flex align-center justify-center'
                      : ''
                  }`"
                >
                  {{ item.label ? item.label : "empty" }}
                </div>
                <template v-slot:input>
                  <CustomInput
                    class="mt-3"
                    :items="labels"
                    style="width: 300px !important"
                    item-value="name"
                    item-text="title"
                    label="label"
                    placeholder="labels"
                    type="autocomplete"
                    v-model="$v.company.label_id.$model"
                    :rules="rules.systemRule($v.company, $root)"
                    :error-message="labelErrMessage"
                  />
                </template>
              </v-edit-dialog>
            </div>
          </template>
          <template v-slot:[`item.country`]="{ item, index }">
            <div>
              <v-edit-dialog
                :return-value.sync="item.country"
                large
                @open="onOpen(item.country, 'country_id')"
                @save="onSave('country_id', 'country', index+6, company.country_id)"
              >
                <div
                  :class="`${
                    checkIfHasErr(item.country, 'country', index + 6)
                      ? 'text--white error-class px-5 d-flex align-center justify-center'
                      : ''
                  }`"
                >
                  {{ item.country ? item.country : "empty" }}
                </div>
                <template v-slot:input>
                  <CustomInput
                    class="mt-3"
                    :items="countries"
                    style="width: 300px !important"
                    item-value="name"
                    item-text="name"
                    label="country"
                    placeholder="countries"
                    type="autocomplete"
                    v-model="$v.company.country_id.$model"
                    :rules="rules.systemRule($v.company, $root)"
                    :error-message="countryErrMessage"
                  />
                </template>
              </v-edit-dialog>
            </div>
          </template>
        </DataTable>
        <v-simple-table
          dense v-show="errors.length > 0"
        >
          <template v-slot:default>
            <thead>
              <tr class="table-header">
                <th colspan="3" style="color:red;" class="font-weight-bold">
                  {{$tr('validation_table_header')}}
                </th>
              </tr>
              <tr>
                <th class="text-left">
                  {{$tr('line')}}
                </th>
                <th class="text-left">
                  {{$tr('column')}}
                </th>
                <th class="text-left">
                  {{$tr('descriptions')}}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(error, index) in errors"
                :key="index"
                class="custom-row-error"
              >
                <td style="color: black !important">{{ error.row }}</td>
                <td style="color: black !important">{{ error.column }}</td>
                <td>
                  <div class="custom-error-details">
                    {{Array.from(new Set(error.value.map(e => e.value)))}}
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>
      <template v-slot:check>
        <v-alert
          dense
          text
          type="success"
        >
          {{$tr('record_has_no_error')}}
        </v-alert>
        <DataTable
          ref="tableRef"
          :headers="selectedHeaders"
          :items="selectedRows"
          :ItemsLength="selectedRows.length"
          :show_select="false"
          :elevation="0"
          :perpageDropdown="perpageDropdown"
          :itemsPerPage="10"
          :showRefreshBtn="false"
        >
        </DataTable>
      </template>
      <template v-slot:done>
        <div class="d-flex justify-center">
          <done-message
            title="done"
            subTitle="company_created"
          />
        </div>
      </template>
    </CustomStepper>
  </v-form>
</template>
<script>
import DataTable from "../../components/design/bulkupload/DataTable";
import CustomStepper from "../design/FormStepper/CustomStepper.vue";
import CustomButton from "../design/components/CustomButton";
import CompanyValidation from '../../validations/company-bulkupload-validations';
import StepperActionButtonsVue from '../stepper/StepperActionButtons.vue';
import readXlsxFile from 'read-excel-file';
import Dialog from "../design/Dialog/Dialog.vue";
import BulkUploadError from '../../components/users/BulkUploadError';
import BulkUploadFileLoader from '../../components/users/BulkUploadFileLoader';
import BulkUploadSuccessLoader from '../../components/users/BulkUploadSuccessLoader';
import FileUploadError from '../../components/users/FileUploadError';
import DoneMessage from "../design/components/DoneMessage.vue";
import HandleException from "../../helpers/handle-exception";
import CustomInput from "../../components/design/components/CustomInput.vue";
import { mapActions, mapGetters } from 'vuex';
import CompanyAutoEditVue from './CompanyAutoEdit.vue';

export default {
  name: 'company-bulk-upload', 
  components: {
    CustomStepper,
    CustomButton,
    DataTable,
    Dialog,
    BulkUploadError,
    BulkUploadFileLoader,
    BulkUploadSuccessLoader,
    FileUploadError,
    DoneMessage,
    CustomInput,
  },
  props: {
    tabKey: {
      type: String, 
      require: true, 
    },
    countries: {
      require: true,
    },
    labels: {
      require: true,
    },
    systems: {
      type: Array, 
      default: ()=>{
        return [];
      }
    }, 
    countries: {
      type: Array, 
      default: ()=>{
        return [];
      }
    }, 
  },
  data(){
    return {
      isValid: false,
      height: '',
      percentage: 0,
      error_text: '',
      isDataClean: false, 
      isErrorOrWarning: true, 
      fileUploadError: false, 
      isDataLoaded: false,  
      isLoadingOrSubmitting: false,
      stepper_header: [
      {icon: "fa-info-circle", title: "choose_file", slotName: "chooseFile"},
      {icon: "fas fa-cloud-upload-alt", title: "file_upload", slotName: "fileUpload"},
      {icon: "far fa-check-circle", title: "check", slotName: "check"},
      {icon: "fa-thumbs-up", title: "done", slotName: "done"},
      ],
      isFileSelected: false,
      filePath: '',
      rules: CompanyValidation.rules,
      company: CompanyValidation.schema,
      fileExtension: CompanyValidation.fileExtension,
      isFileDownloaded: false,
      errors: [],
      rows: [],
      headers: [],
      allLabels: [],
      selectedHeaders: [],
      selectedRows: [],
      form: CompanyValidation.form,
      perpageDropdown: CompanyValidation.perpageDropdown,
      isDataLoaded: false,
      result: {},
      nameErrMessage: '',
      countryErrMessage: '',
      systemErrMessage: '',
      labelErrMessage: '',
      emailErrMessage: '',
      noteErrMessage: '',
      emailErrMessage: '', 
      systemErrMessage: '', 
      countryErrMessage: '', 
      investment_typeErrMessage: '',
      tableKey: 0,
      current_index: 0, 
      current_step: 0,
      industries: [],
      current_column: '',
      investment_types: [
        { id: "Main Company", name: this.$tr("main_company") },
        { id: "Other", name: this.$tr("other") },
      ],      
    }
  },
  validations: {
    company: CompanyValidation.validations,
    form: CompanyValidation.validations
  },
  methods: {
    ...mapActions({
      fetchCompanies: "companies/fetchCompanies",
    }),
    onOpen(value, col){
      let errMsg = col + 'ErrMessage';
      switch (col) {
        case 'label' : {
          this.$v.company.label_id.$model = value;
          errMsg = this.$tr("label_required");
        }
        case 'email' : {
          this.$v.company.email.$model = value;
          errMsg = this.$tr("email_required");
        }
          break;
        case 'investment_type' : {
          this.$v.company.investment_type.$model = value;
          errMsg = this.$tr("investment_type");
        }
          break;
        case 'name' : {
          this.$v.company.name.$model = value;
          errMsg = this.$tr("name");
        }
          break;
        case 'note' : {
          this.$v.company.note.$model = value;
          errMsg = this.$tr("note");
        }
          break;
        case 'email' : {
          this.$v.company.email.$model = value;
          errMsg = this.$tr("email");
        }
          break;
        case 'system' : {
          this.$v.company.system_id.$model = value;
          errMsg = this.$tr("system");
        }
          break;
        case 'country' : {
          this.$v.company.country_id.$model = value;
          errMsg = this.$tr("country");
        }
          break;
      }
    },
    async onSave(key, col, index, value){
      let dublicable_columns = ['note', 'investment_type', 'label', 'country', 'system'];
      if(!this.$v.company[key].$invalid){
        this.rows[index-6].some((column, i)=> {
          if(this.headers[i].toLowerCase() == col){
            this.rows[index-6][i] = value;
          }
        });
        // update selected rows
        this.selectedRows = await this.prepareRows(this.headers, this.rows);
        this.tableKey++;
        const errors_of_first_step = await this.validateSelectedRows(this.rows, this.headers);
        if(!dublicable_columns.includes(col)){
          let names = [], multi = true;
          this.selectedRows.forEach((row, counter) => {
            names.push({ value: row.name, index: counter+6 });
          });
          const errors_of_second_step = await this.checkUniquenessInFrontEnd(this.headers, this.rows);
          // merge both errors
          const finalErrors = await [...errors_of_first_step, ...errors_of_second_step];
          this.current_index = index;
          this.current_column = col;
          let name_columns = this.selectedRows.map((row, index) => {
            return {
              name: 'name',
              value: row.name, 
              index: index + 6,
            };
          });     
          let email_columns = this.selectedRows.map((row, index) => {
            return {
              name: 'email',
              value: row.email, 
              index: index + 6,
            }
          });
          let columns = [...name_columns, ...email_columns];
          let if_names_exists = await this.checkUniquenessFromApi(columns);
          this.current_index = 0;
          this.current_column = '';
          await if_names_exists.forEach(async(ele) => {
            if(ele.if_exists){
              finalErrors.push({
                row: ele.index,
                column: ele.column,
                value: {
                  index: ele.index, 
                  value: this.$tr("item_already_exists", ele.column_value), 
                },
              });
            }
          });
          let arranged_arr = await this.reArrangeErrArr(finalErrors);
          this.errors = arranged_arr;
          this.errors = this.errors.length == 0 ? [] : this.errors;
          this.isDataClean = this.errors.length == 0 ? true : false;
        }
        else {
          this.errors.forEach(e => {
            if(e.column == col){
              e.row = e.row.filter(x => x != index);
              if(e.row.length == 0){
                e.value.pop();
              }
            }
          });
          this.errors = this.errors.length == 0 ? [] : this.errors;
          this.isDataClean = this.errors.length == 0 ? true : false;
          this.errors = this.errors.filter(err => (err.row.length > 0));
        }
        this.percentage = this.errors.length === 0 ? 0 : this.percentage;
        this.errors = this.errors.length == 0 ? [] : this.errors;
        this.isDataClean = this.errors.length == 0 ? true : false;
      }
    },
    checkIfHasErr(value, col, index){
      let hasErr = false;
      if(value){
        this.errors.forEach(e => {
          if( e.row.includes(index) && e.column === col ){
            hasErr = true;
            return;
          }
        });
      }
      else {
        return true;
      }
      return hasErr;
    },
    async onSubmit(){
      if (this.selectedRows.length) {
        this.isDataLoaded = true;
        this.isLoadingOrSubmitting = true;
        const companies = this.selectedRows;
        try {
          const response = await this.$axios.post("/company-bulk-upload", companies);
          if (response?.status === 200) {
            await this.fetchCompanies({key: this.tabKey});
            this.$refs.customStepper.forceNext();
            this.clearFile();
          }
        } catch (error) {
          HandleException.handleApiException(this, error);
        }
        this.isDataLoaded = false;
        this.isLoadingOrSubmitting = false;
      } else {

      }
    },
    clearFile(){
      this.$v.form.file.$model = "";
      this.filePath = "";
      this.isFileSelected = false
      this.selectedHeaders = [];
      this.selectedRows = [];
      this.errors = [];
      this.isDataClean = false;
      this.percentage = 0;
    },
    toggleFileError(){
      this.fileUploadError = !this.fileUploadError;
    },
    validateFile(file){
      if (file) {
        const fileExtension = file.type;
        if (fileExtension !== this.fileExtension) {
          this.isErrorOrWarning = true;
          this.error_text = this.$tr("file_upload_extension_conflict");
          this.toggleFileError();
          return;
        }
        if(file){
            this.clearFile();
        }
        this.isFileSelected = true;
        this.$v.form.file.$model = file;
        this.filePath = file;
      }
    },
    async onDownload() {
      try {
        this.isFileDownloaded = true;
        const response = await this.$axios.get("/export-company-template");
        const url = response.data;
        window.location.href = url;
        this.isFileDownloaded = false;
      } catch (error) {
        HandleException.handleApiException(this, error);
      }
    },
    validateForm(){
      this.$refs.departmecompanyload_file_form.validate();
      this.$v.form.file.$touch();
    },
    isStepOneDataValid(){
      return this.$v.form.file.$invalid === false;
    },
    async changeStepper(step){
      this.current_step = step;
      switch (step) {
        case 1:{
          if(!this.isStepOneDataValid()){
            this.validateForm();
            return;
          }
          this.$refs.customStepper.forceNext();
          await this.readFileAsXlsx();
        }
          break;
        case 2: {
          if(this.errors.length == 0 && this.isDataClean){
            this.$refs.customStepper.forceNext();
          }
        }
          break;
      }
    },
    async readFileAsXlsx(){
      readXlsxFile(this.form.file).then(async(rows) => {
        if(this.selectedRows.length){
          this.selectedRows = [];
          this.selectedHeaders = [];
        }
        let selectedRows = [], selectedHeaders = [];
        selectedRows = rows.filter((row, index)=>{ if(index > 4) return row });
        selectedHeaders = rows[4];
        this.rows = selectedRows;
        this.headers = selectedHeaders;
        if (selectedHeaders == undefined || selectedHeaders.length != 7) {
            this.clearFile();
            if(!selectedHeaders){
              this.error_text = this.$tr("wrong_template_uploaded");
              this.isErrorOrWarning = true;
            }
            else {
              this.error_text = this.$tr("inappropriate_uploaded_file");
              this.isErrorOrWarning = false;
            }
            this.$refs.customStepper.prev();
            this.toggleFileError();
            return;
        }
        if(selectedRows.length == 0){
            this.clearFile();
            this.error_text = this.$tr("empty_file_uploaded");
            this.isErrorOrWarning = false;
            this.$refs.customStepper.prev();
            this.toggleFileError();
            return;
        }
        await this.prepareMainValidations(selectedHeaders, selectedRows);
      });
    }, 
    async prepareMainValidations(selectedHeaders, selectedRows){
      selectedHeaders.forEach(element => {
        this.selectedHeaders.push({
          text: element, 
          value: element.toLowerCase()
        });
      });
      this.selectedRows = await this.prepareRows(selectedHeaders, selectedRows);
      // errors of first step of validation
      const errors_of_first_step = await this.validateSelectedRows(selectedRows, selectedHeaders);
      // check for uniqueness in front before backend,
      const errors_of_second_step = await this.checkUniquenessInFrontEnd(selectedHeaders, selectedRows);
      // merge both errors
      const finalErrors = await [...errors_of_first_step, ...errors_of_second_step];
      //check for uniqueness in backend,' 
      let name_columns = this.selectedRows.map((row, index) => {
        return {
          name: 'name',
          value: row.name, 
          index: index + 6,
        };
      });     
      let email_columns = this.selectedRows.map((row, index) => {
        return {
          name: 'email',
          value: row.email, 
          index: index + 6,
        }
      });
      let columns = [...name_columns, ...email_columns];
      this.percentage = this.percentage + Number.parseInt(100/selectedRows.length);
      let values = await this.checkUniquenessFromApi(columns);
      await values.forEach(async(ele, counter) => {
        if(ele.if_exists){
          finalErrors.push({
            row: ele.index,
            column: ele.column,
            value: {
              index: ele.index, 
              value: this.$tr("item_already_exists", ele.column_value), 
            },
          });
        }
        if(counter == (values.length - 1)){
          this.percentage = 100;
        }
      });
      let arranged_arr = await this.reArrangeErrArr(finalErrors);
      this.errors = arranged_arr.length == 0 ? [] : arranged_arr;
      this.isValid = this.current_step == 3 ? true : false;
      this.isDataClean = arranged_arr.length == 0 ? true : false;
    },
    async prepareRows(selectedHeaders, selectedRows){
      let rows = [];
      selectedRows.forEach(async(r, counter) => {
        let row = {};
        r.forEach(async(col_value, index) => {
          let col_name = selectedHeaders[index].toLowerCase();
          row[col_name] = col_value;
          row.index = counter+6
        });
        rows.push(row);
      });
      return rows;
    },
    async checkUniquenessInFrontEnd(selectedHeaders, selectedRows){
      let not_dublicable_columns = ['name', 'email'], returnedData = [];
      for (let index = 0; index < 2; index++) {
        for (let k = 0; k < selectedRows.length; k++) {
          for (let counter = k+1; counter < selectedRows.length; counter++) {
            if( selectedRows[counter][index] == selectedRows[k][index] && not_dublicable_columns.includes(selectedHeaders[index].toLowerCase()) ){
              returnedData.push({
                column_value: selectedRows[counter][index], 
                row: counter+6, 
                column: selectedHeaders[index].toLowerCase(), 
                value: {
                  index: counter+6, 
                  value: this.$tr("duplicate_row_for", selectedRows[counter][index])
                },
              });
            }
          }
        }
      }
      return returnedData;
    },
    async reArrangeErrArr(errors){
      let final_errors = [], returnedData = [];
      await errors.forEach(async (e, i) => {
        if(final_errors[e.column]){
          final_errors[e.column].row.add(e.row);
          final_errors[e.column].value.add(e.value);
          final_errors[e.column].column_value = e.column_value;
          return;
        }
        final_errors[e.column] = {
          row: new Set().add(e.row),
          value: new Set().add(e.value),
          column: e.column,
          column_value: e.column_value,
        };
      });
      await Object.values(final_errors).forEach(async element => {
        returnedData.push({
          column: element.column,
          row: Array.from(element.row).sort(function(a, b){return a-b}),
          value: Array.from(element.value),
          column_value: element.column_value
        });
      });
      return returnedData;
    },
    async checkUniquenessFromApi(columns){
      try {
        let url = `companies/check-uniqueness`;
        const response = await this.$axios.post(url, columns);
        return response?.data;
      } catch (error) {
        HandleException.handleApiException(this, error);
        return false;
      }
    },
    async validateSelectedRows(rows, selectedHeaders){
      let errors = [];
      rows.forEach((elements, counter) => {
        elements.forEach((col, index) => {
          let key = selectedHeaders[index].toLowerCase();
          if(key === 'country'){
            this.$v.company.country_id.$model= col;
          } else if(key === 'system'){
            this.$v.company.system_id.$model = col;
          } else if(key === 'label'){
            this.$v.company.label_id.$model = col;
          } else {
            this.$v.company[key].$model = col;
          }
          this.validateExcelColumn(counter, this.$v.company, errors, key);
        });
      });
      return errors;
    },
    validateExcelColumn(row, company, errors, key){
      let validatedArr, rule = key+'Rule';
      if (key === "investment_type") {
        validatedArr = this.rules.investmentTypeRule(company, this.$root);
      } else {
        validatedArr = this.rules[rule](company, this.$root);
      }
      this.ifHasError(errors, validatedArr, row, key);
    },
    ifHasError(errors, validationArr, row, col){
      validationArr.forEach(element => {
        if(typeof element == 'function'){
          if(typeof element() == 'string'){
            let rowError = row + 6;
            errors.push({
              row: rowError,
              column: col,
              value: {
                index: rowError, 
                value: element(), 
              }
            });
          }
        }
      });
      return errors;
    },
  },
  async mounted() {
    if (this.companies.length == 0) {
      this.fetchCompanies();
    }
  },
  computed: {
    ...mapGetters({
      companies: "companies/getCompanies",
    }),
  },
  watch: {
    rows: function(rows){
      let init_height = 100;
      if(rows.length == 1){
        this.height = init_height+'px';
      }
      else if(rows.length == 2){
        this.height = init_height+25 + 'px';
      }
      else if(rows.length == 3 ){
        this.height = init_height+75+'px';
      }
      else if(rows.length == 4){
        this.height = init_height+85+'px';
      }
      else {
        this.height = '205px';
      }
    }
  }
}
</script>
<style scoped>
.error-class {
  background-color: red; 
  color:white;
  border-radius: 2px;
}
.download-button {
  font-size: 16px;
  height: 38px !important;
  font-weight: 400;
  border-radius: 4px;
}
.avatar {
  height: 110px;
  width: 110px;
  background-color: var(--gray-cyan);
  border: 2px solid var(--gray-cyan);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.avatar .v-icon {
  color: var(--color-white);
  font-size: 60px;
}

.custom-file .v-file-input__text {
  background-color: white !important;
}

.custom-file .v-input__slot fieldset {
  border-style: dashed !important;
}

.custom-file .v-input__slot {
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

.custom-file .v-input__prepend-inner {
  position: absolute;
}

.table-header, .table-header > th {
  border-top-right-radius: 5px !important;
  border-top-left-radius: 5px !important;
}

.v-data-table table tbody tr:not(.v-data-table__selected):hover{
  background-color: #fffff7 !important;
}
.custom-row-error:hover
  .custom-error-details{
    color: black !important;
}
.custom-error-details{
  color: red !important;
}

.v-small-dialog__actions {
  display: none !important;
}
</style>