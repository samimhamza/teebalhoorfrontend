<template>
  <v-form
    ref="user_bulk_upload_file_form"
    lazy-validation
    @submit.prevent="onSubmit"
    id="user_bulk_upload_file_form"
  >
    <v-dialog v-model="fileUploadError" width="450">
      <Dialog persistent @closeDialog="fileUploadError = false">
        <BulkUploadError
          :error_text="error_text"
          :isErrorOrWarning="isErrorOrWarning"
        />
      </Dialog>
    </v-dialog>
    <CustomStepper
      :headers="stepper_header"
      :canNext="false"
      ref="customStepper"
      @submit="onSubmit"
      :loading="isDataLoaded"
      :isSubmitting="isDataLoaded"
      @validate="changeStepper"
    >
      <template v-slot:chooseFile>
        <div class="w-full">
          <v-file-input
            class="custom-file"
            outlined
            :accept="fileExtension"
            prepend-icon=""
            dense
            @change="validateFile"
            @click:clear="clearFile"
            :success="filePath !== ''"
            :rules="BulkUploadRules.fileRule($v.form, $root)"
          >
            <template slot="prepend-inner">
              <div
                name="prepend-inner"
                style="max-width: 260px; text-align: center"
              >
                <p class="ma-0">
                  <svg
                    width="60"
                    height="60"
                    viewBox="100 200 500 140"
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
                  <p class="mb-0">
                    {{ $tr("name") }}: {{ $v.form.file.$model.name }}
                  </p>
                  <p class="mb-0">
                    <small>
                      {{ $tr("size") }}:
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
          style="min-width: 160px"
          @click="onDownload"
        >
          <template>
            <span>
              <span>
                {{
                  !isFileDownloaded
                    ? $tr("download_format")
                    : $tr("downloading")
                }}</span
              >
              <v-progress-circular
                v-if="isFileDownloaded"
                class="ma-0"
                indeterminate
                color="white"
                size="25"
                :width="2"
              />
              <i v-else class="fas fa-download ml-1"></i>
            </span>
          </template>
        </v-btn>
      </template>
      <template v-slot:fileUpload>
        <BulkUploadFileLoader
          :value="percentage"
          v-if="errors.length == 0 && !isDataClean"
        />
        <FileUploadError v-else-if="errors.length > 0 && !isDataClean" />
        <BulkUploadSuccessLoader v-else-if="isDataClean" />
        <DataTable
          ref="tableRef"
          :headers="selectedHeaders"
          :items="selectedRows"
          :ItemsLength="selectedRows.length"
          :show_select="false"
          :elevation="0"
          :item-class="itemRowBackground"
          :perpageDropdown="perpageDropdown"
          v-show="(errors.length > 0)"
          :height="height"
          :itemsPerPage="5"
          disbale_data_table_hover="disbale-data-table-hover"
          :defaultNote="false"
          :defaultLogo="false"
          :defaultCountry="false"
          :showRefreshBtn="false"
        >
          <!-- <template v-slot:[`item`]="{ item, index }">
            <v-edit-dialog
              :return-value.sync="item.firstname"
              @save="save"
            > {{item.firstname}}
              <template v-slot:input>
                <v-text-field
                  v-model="item.firstname"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template> -->
          <template v-slot:[`item.schedule_type`]="{ item }">
            <span>
              {{ item.schedule_type ? item.schedule_type : $tr("optional") }}
            </span>
          </template>
          <template v-slot:[`item.date_range`]="{ item }">
            <span>
              {{ item.date_range ? item.date_range : $tr("optional") }}
            </span>
          </template>
          <template v-slot:[`item.image`]="{ item }">
            <span>
              {{ item.image ? item.image : $tr("optional") }}
            </span>
          </template>
          <template v-slot:[`item.time_range`]="{ item }">
            <span>
              {{ item.time_range ? item.time_range : $tr("optional") }}
            </span>
          </template>

          <template v-slot:[`item.firstname`]="{ item, index }">
            <span
              :class="` ${
                !checkIfHasErr(item.firstname, 'firstname', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.firstname ? item.firstname : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.lastname`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.lastname, 'lastname', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.lastname ? item.lastname : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.username`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.username, 'username', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.username ? item.username : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.phone`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.phone, 'phone', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.phone ? item.phone : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.whatsapp`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.whatsapp, 'whatsapp', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.whatsapp ? item.whatsapp : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.email`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.email, 'email', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.email ? item.email : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.password`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.password, 'password', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.password ? item.password : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.gender`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.gender, 'gender', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.gender ? item.gender : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.birth_date`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.birth_date, 'birth_date', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.birth_date ? item.birth_date : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.note`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.note, 'note', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.note ? item.note : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.current_country`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(
                  item.current_country,
                  'current_country',
                  index + 6
                )
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.current_country ? item.current_country : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.country`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.country, 'country', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.country ? item.country : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.state`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.state, 'state', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.state ? item.state : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.label`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.label, 'label', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.label ? item.label : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.language`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.language, 'language', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.language ? item.language : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.team`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.team, 'team', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.team ? item.team : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.role`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.role, 'role', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.role ? item.role : $tr("empty") }}
            </span>
          </template>
          <template v-slot:[`item.company`]="{ item, index }">
            <span
              :class="`${
                !checkIfHasErr(item.company, 'company', index + 6)
                  ? ''
                  : 'text--white error-class px-2 d-flex align-center justify-center'
              }`"
            >
              {{ item.company ? item.company : $tr("empty") }}
            </span>
          </template>
        </DataTable>
        <v-simple-table dense v-show="errors.length > 0">
          <template v-slot:default>
            <thead>
              <tr class="table-header">
                <th colspan="3" style="color: red;" class="font-weight-bold">
                  {{ $tr("validation_table_header") }}
                </th>
              </tr>
              <tr>
                <th class="text-left">
                  {{ $tr("row_caps") }}
                </th>
                <th class="text-left">
                  {{ $tr("column_caps") }}
                </th>
                <th class="text-left">
                  {{ $tr("descriptions_caps") }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(error, index) in errors"
                :key="index"
                class="custom-row-error"
              >
                <td>{{ error.row }}</td>
                <td>{{ error.column }}</td>
                <td>
                  <span class="custom-error-details">{{ error.value }}</span>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>
      <template v-slot:check>
        <v-alert dense text type="success">
          {{ $tr("record_has_no_error") }}
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
          :defaultNote="false"
          :defaultLogo="false"
          :defaultCountry="false"
          :showRefreshBtn="false"
        >
        </DataTable>
      </template>
      <template v-slot:done>
        <div class="d-flex justify-center">
          <done-message :title="$tr('done')" :subTitle="$tr('users_created')" />
        </div>
      </template>
    </CustomStepper>
  </v-form>
</template>
<script>
import DataTable from "../../components/design/bulkupload/DataTable";
import CustomStepper from "../design/FormStepper/CustomStepper.vue";
import CustomButton from "../design/components/CustomButton";
import BulkUpload from "../../validations/bulkupload-validations";
import StepperActionButtonsVue from "../stepper/StepperActionButtons.vue";
import readXlsxFile from "read-excel-file";
import Dialog from "../design/Dialog/Dialog.vue";
import BulkUploadError from "../../components/users/BulkUploadError";
import BulkUploadFileLoader from "../../components/users/BulkUploadFileLoader";
import BulkUploadSuccessLoader from "../../components/users/BulkUploadSuccessLoader";
import FileUploadError from "../../components/users/FileUploadError";
import DoneMessage from "../design/components/DoneMessage.vue";
import HandleException from "../../helpers/handle-exception";
// import Users from "../../configs/pages/users";

export default {
  name: "user-bulk-upload",
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
  },
  data() {
    return {
      height: "",
      percentage: 0,
      error_text: "",
      isDataClean: false,
      isErrorOrWarning: true,
      fileUploadError: false,
      isDataLoaded: false,
      BulkUploadRules: BulkUpload.rules,
      stepper_header: [
      {icon: "fa-info-circle", title: "choose_file", slotName: "chooseFile"},
      {icon: "fas fa-cloud-upload-alt", title: "file_upload", slotName: "fileUpload"},
      {icon: "far fa-check-circle", title: "check", slotName: "check"},
      {icon: "fa-thumbs-up", title: "done", slotName: "done"},
      ],
      isFileSelected: false,
      filePath: "",
      rules: BulkUpload.rules,
      user: BulkUpload.schema,
      fileExtension: BulkUpload.fileExtension,
      go_to_next_step: false,
      isFileDownloaded: false,
      errors: [],
      rows: [],
      selectedHeaders: [],
      selectedRows: [],
      form: BulkUpload.form,
      perpageDropdown: BulkUpload.perpageDropdown,
      isDataLoaded: false,
      finalErrors: [],
      result: {},
    };
  },
  validations: {
    user: BulkUpload.validations,
    form: BulkUpload.validations,
  },
  methods: {
    checkIfHasErr(value, col, index) {
      let hasErr = false;
      if (value) {
        this.errors.forEach((e) => {
          if (
            typeof e.row == "object"
              ? e.row.includes(index) && e.column == col
              : e.row == index && e.column == col
          ) {
            hasErr = true;
            return;
          }
        });
      } else {
        return true;
      }
      return hasErr;
    },
    async onSubmit() {
      if (this.selectedRows.length) {
        this.isDataLoaded = true;
        const users = this.selectedRows;
        try {
          const response = await this.$axios.post("/bulk-upload-user", users);
          if (response?.status === 201) {
            this.clearFile();
            this.$refs.customStepper.setCurrent(4);
          }
        } catch (error) {
          HandleException.handleApiException(this, error);
        }
        this.isDataLoaded = false;
      } else {
      }
    },
    itemRowBackground: function (item) {
      return "warning";
    },
    clearFile() {
      this.$v.form.file.$model = "";
      this.filePath = "";
      this.isFileSelected = false;
      this.selectedHeaders = [];
      this.selectedRows = [];
      this.errors = [];
      this.finalErrors = [];
      this.go_to_next_step = false;
      this.isDataClean = false;
    },
    toggleFileError() {
      this.fileUploadError = !this.fileUploadError;
    },
    validateFile(file) {
      if (file) {
        const fileExtension = file.type;
        if (fileExtension !== this.fileExtension) {
          this.isErrorOrWarning = true;
          this.error_text = this.$tr("file_upload_extension_conflict");
          this.toggleFileError();
          return;
        }
        if (file) {
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
        const response = await this.$axios.get("/export-user-template");
        const url = response.data;
        window.location.href = url;
        this.isFileDownloaded = false;
      } catch (error) {
        HandleException.handleApiException(this, error);
      }
    },
    validateForm() {
      this.$refs.user_bulk_upload_file_form.validate();
      this.$v.form.file.$touch();
    },
    isStepOneDataValid() {
      return this.$v.form.file.$invalid === false;
    },
    async changeStepper(step) {
      switch (step) {
        case 1:
          {
            if (!this.isStepOneDataValid()) {
              this.validateForm();
              return;
            }
            this.$refs.customStepper.forceNext();
            this.percentage = 30;
            await this.readFileAsXlsx();
          }
          break;
        case 2:
          {
            if (this.errors.length == 0) {
              this.$refs.customStepper.forceNext();
            }
          }
          break;
      }
    },
    async readFileAsXlsx() {
      readXlsxFile(this.form.file).then(async (rows) => {
        let selectedRows = [],
          selectedHeaders = [];
        selectedRows = rows.filter((row, index) => {
          if (index > 4) return row;
        });
        selectedHeaders = rows[4];
        if (selectedHeaders == undefined || selectedHeaders.length != 23) {
          this.clearFile();
          if (!selectedHeaders) {
            this.error_text = this.$tr("wrong_template_uploaded");
            this.isErrorOrWarning = true;
          } else {
            this.error_text = this.$tr("inappropriate_uploaded_file");
            this.isErrorOrWarning = false;
          }
          this.$refs.customStepper.prev();
          this.toggleFileError();
          return;
        }
        if (selectedRows.length == 0) {
          this.clearFile();
          this.error_text = this.$tr("empty_file_uploaded");
          this.isErrorOrWarning = false;
          this.$refs.customStepper.prev();
          this.toggleFileError();
          return;
        }
        selectedHeaders.forEach((element) => {
          this.selectedHeaders.push({
            text: element,
            value: element.toLowerCase(),
          });
        });
        this.percentage = 60;
        selectedRows.forEach((r) => {
          let row = {};
          r.forEach(async (col_value, index) => {
            let col_name = selectedHeaders[index].toLowerCase();
            row[col_name] = col_value;
          });
          this.selectedRows.push(row);
        });
        this.percentage = 90;
        this.finalErrors = this.validateSelectedRows(
          selectedRows,
          selectedHeaders
        );
        if (this.finalErrors.length > 0) {
          const err = this.reArrangeErrArr(this.finalErrors);
          this.errors = err;
          return;
        }
        //check for uniqueness in front before backend,
        this.finalErrors = this.checkUniquenessInFrontEnd(
          selectedHeaders,
          selectedRows
        );
        //check for uniqueness in backend,
        if (this.finalErrors.length == 0) {
          this.selectedRows.forEach(async (row, counter) => {
            await this.addUniquenessErrors(row, counter);
          });
        }
        this.errors = this.finalErrors;
        this.percentage = 100;
      });
    },
    checkUniquenessInFrontEnd(selectedHeaders, selectedRows) {
      let not_dublicable_columns = [
          "username",
          "phone",
          "whatsapp",
          "email",
          "image",
        ],
        returnedData = [];
      for (let index = 0; index < selectedHeaders.length; index++) {
        for (let k = 0; k < selectedRows.length; k++) {
          for (let counter = k + 1; counter < selectedRows.length; counter++) {
            if (
              selectedRows[counter][index] == selectedRows[k][index] &&
              not_dublicable_columns.includes(
                selectedHeaders[index].toLowerCase()
              )
            ) {
              returnedData.push({
                row: counter + 6,
                column: selectedHeaders[index].toLowerCase(),
                value: this.$tr(
                  "duplicate_row_for",
                  selectedRows[counter][index]
                ),
              });
            }
          }
        }
      }
      return this.reArrangeErrArr(returnedData);
    },
    reArrangeErrArr(errors) {
      let final_errors = [],
        returnedData = [];
      errors.forEach((e, i) => {
        if (final_errors[e.column]) {
          final_errors[e.column].row.add(e.row);
          final_errors[e.column].value.add(e.value);
          return;
        }
        final_errors[e.column] = {
          row: new Set().add(e.row),
          value: new Set().add(e.value),
          column: e.column,
        };
      });
      Object.values(final_errors).forEach((element) => {
        returnedData.push({
          column: element.column,
          row: Array.from(element.row).sort(function (a, b) {
            return a - b;
          }),
          value: Array.from(element.value).join(", "),
        });
      });
      return returnedData;
    },
    async addUniquenessErrors(row, counter) {
      let columns = [
        { columnName: "username", value: row.username },
        { columnName: "phone", value: row.phone },
        { columnName: "email", value: row.email },
        { columnName: "whatsapp", value: row.whatsapp },
      ];
      this.result = await this.checkUniquenessFromApi(columns);
      if (this.result.isUsernameAlreadyExists) {
        this.finalErrors.push({
          row: counter + 6,
          column: "username",
          value: row.username + " " + this.$tr("already_exists"),
        });
      }
      if (this.result.isEmailAlreadyExists) {
        this.finalErrors.push({
          row: counter + 6,
          column: "email",
          value: row.email + " " + this.$tr("already_exists"),
        });
      }
      if (this.result.isPhoneAlreadyExists) {
        this.finalErrors.push({
          row: counter + 6,
          column: "phone",
          value: row.phone + " " + this.$tr("already_exists"),
        });
      }
      if (this.result.isWhatsappAlreadyExists) {
        this.finalErrors.push({
          row: counter + 6,
          column: "whatsapp",
          value: row.whatsapp + " " + this.$tr("already_exists"),
        });
      }
      if (this.errors.length === 0) {
        this.isDataClean = true;
      }
    },
    async checkUniquenessFromApi(columns) {
      try {
        let url = "users/check-uniqueness";
        const response = await this.$axios.post(url, columns);
        return {
          isUsernameAlreadyExists: response?.data?.username,
          isEmailAlreadyExists: response?.data?.email,
          isPhoneAlreadyExists: response?.data?.phone,
          isWhatsappAlreadyExists: response?.data?.whatsapp,
        };
      } catch (error) {
        HandleException.handleApiException(this, error);
        return false;
      }
    },
    validateSelectedRows(rows, selectedHeaders) {
      let errors = [];
      rows.forEach((elements, counter) => {
        elements.forEach((col, index) => {
          let key = selectedHeaders[index].toLowerCase();
          if (key === "country") {
            this.$v.user.country_id.$model = col;
          } else if (key === "label") {
            this.$v.user.label_id.$model = col;
          } else if (key === "language") {
            this.$v.user.language_id.$model = col;
          } else if (key === "state") {
            this.$v.user.state_id.$model = col;
          } else if (key === "current_country") {
            this.$v.user.current_country_id.$model = col;
          } else if (key === "team") {
            this.$v.user.team_id.$model = col;
          } else if (key === "company") {
            this.$v.user.company_id.$model = col;
          } else if (key === "role") {
            this.$v.user.role_id.$model = col;
          } else {
            this.$v.user[key].$model = col;
          }
          this.validateExcelColumn(counter, this.$v.user, errors, key);
        });
      });
      return errors;
    },

    validateExcelColumn(row, user, errors, key) {
      let validatedArr,
        rule = key + "Rule";
      if (key === "current_country") {
        validatedArr = this.rules.currentCountryRule(user, this.$root);
      } else if (key === "birth_date") {
        validatedArr = this.rules.dobRule(user, this.$root);
      } else if (
        key === "schedule_type" ||
        key === "date_range" ||
        key === "time_range" ||
        key === "image"
      ) {
        validatedArr = [true];
      } else if (key === "state") {
        validatedArr = this.rules.countryStateRule(user, this.$root);
      } else {
        validatedArr = this.rules[rule](user, this.$root);
      }
      this.ifHasError(errors, validatedArr, row, key);
    },
    ifHasError(errors, validationArr, row, col) {
      validationArr.forEach((element) => {
        if (typeof element == "function") {
          if (typeof element() == "string") {
            let rowError = row + 6;
            errors.push({
              row: rowError,
              column: col,
              value: element(),
            });
          }
        }
      });
      return errors;
    },
  },
  watch: {
    rows: function (rows) {
      let init_height = 100;
      if (rows.length == 1) {
        height = init_height + "px";
      } else if (rows.length == 2) {
        height = init_height * 2 + "px";
      } else if (rows.length == 3) {
        height = init_height * 2 + 50 + "px";
      } else if (rows.length == 4) {
        height = init_height * 3 + "px";
      } else if (rows.length == 5) {
        height = init_height * 3 + 50 + "px";
      }
    },
  },
};
</script>
<style scoped>
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
  height: 110px;
  opacity: 0;
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
.error-class {
  background-color: red;
  color: white;
  border-radius: 2px;
}
.v-data-table table tbody tr:not(.v-data-table__selected):hover {
  background-color: #f0ad4e !important;
}
.custom-row-error:hover .custom-error-details {
  color: white !important;
}
.custom-error-details {
  color: red !important;
}
.table-header,
.table-header > th {
  border-top-right-radius: 5px !important;
  border-top-left-radius: 5px !important;
}
</style>
