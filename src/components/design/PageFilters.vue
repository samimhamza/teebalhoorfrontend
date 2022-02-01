<template>
  <v-card class="w-full mb-2 px-2 py-1" elevation="1" outlined>
    <h4 class="title ma-0 mb-2">{{ $tr("search_filter") }}</h4>
    <h5 class="title2 ms-2">{{ $tr("search_type") }}</h5>
    <v-row class="align-center">
      <v-col
        cols="12"
        xl="4"
        class="pt-0 pb-1 pb-xl-0 d-flex flex-column flex-sm-row"
      >
        <div class="w-auto" style="min-width: 172px">
          <v-radio-group
            v-model="searchT.type"
            row
            style="height: 36px"
            class="ma-0 mx-2"
            mandatory
            @change="onTypeChange"
          >
            <v-radio value="1">
              <template v-slot:label>
                <div class="radio-label">{{ $tr("id") }}</div>
              </template>
            </v-radio>
            <v-radio value="0">
              <template v-slot:label>
                <div class="radio-label">{{ $tr("content") }}</div>
              </template>
            </v-radio>
          </v-radio-group>
        </div>

        <div class="flex-grow-1">
          <CustomTextField
            v-if="searchT.type == 0"
            :label="$tr('search') + '...'"
            v-model="searchT.contentData"
            @keyup.enter="search"
            @click:append="search"
            @input="searchAgain"
            append-icon="mdi-magnify"
            class="w-full"
            style=""
          />
          <!-- <v-combobox
            v-if="searchT.type == 1"
            multiple
            :allow-overflow="false"
            v-model="searchT.data"
            :label="$tr('search')"
            small-chips
            deletable-chips
            hide-spin-buttons
            class="tag-input w-full custom-textfield"
            outlined
            dense
            rounded
            height="36"
            item-color="primary"
            :hide-details="true"
            append-icon="mdi-magnify"
            :search-input.sync="searchData"
            @input="searchAgain"
            @keyup.tab="search"
            @keyup.enter="search"
            @click:append="search"
            @paste="search"
          >
          </v-combobox> -->
          <v-combobox
            v-if="searchT.type == 1"
            multiple
            v-model="searchT.data"
            small-chips
            deletable-chips
            :label="$tr('search') + '...'"
            outlined
            dense
            rounded
            :hide-details="true"
            height="36"
            class="tag-input w-full custom-textfield searchCombobox"
            append-icon="mdi-magnify"
            :search-input.sync="searchData"
            @input="searchAgain"
            @keyup.tab="search"
            @keyup.enter="search"
            @click:append="search"
            @paste="search"
          >
            <template v-slot:selection="{ attrs, item, select }">
              <v-chip
                v-if="checkShowIds(item)"
                class="my-1 py-0 mx-0 primary"
                v-bind="attrs"
                small
                close
                color="primary"
                @click="select"
                @click:close="removeChip(item)"
                >{{ item }}</v-chip
              >
            </template>
          </v-combobox>
          <!-- <div class="searchLayout"><v-text-field ></v-text-field></div> -->
        </div>
      </v-col>
      <v-col cols="12" xl="8" class="d-flex py-0 flex-wrap justify-center">
        <CustomButton
          v-if="showFilter"
          icon="fa-filter"
          text="filter_button"
          @click="onFilter"
        />
        <v-dialog persistent v-model="downloadDialog" max-width="400">
          <DownloadPopUp
            @closeDownload="closeDownload"
            :selected_header.sync="selected_header"
            :content="downloadContent"
            :filename="filename"
          />
        </v-dialog>

        <CustomButton
          @click="$emit('onColumn')"
          icon="fa-columns"
          text="column"
          v-if="showColumn"
        />
        <CustomButton
          v-if="showDownload"
          icon="fa-download"
          text="download"
          @click="onDownload"
        />
        <CustomButton
          v-if="showOrdering"
          text=""
          :isSvg="true"
          icon="/File Manage/File Managment system ICon-02.svg"
          @click="onOrdering"
        />
        <CustomButton
          v-if="showViewType"
          text=""
          :isSvg="true"
          icon="/File Manage/File Managment system ICon-03.svg"
          @click="onViewType"
          :isDropdown="true"
          :dropdownItems="dropdownItems"
          @viewStyle="viewStyle"
          @changeSize="changeSize"
        />
        <v-spacer />
        <CustomButton
          v-if="showBulkUpload"
          icon="fa-file-upload"
          text="bulk_upload"
          type="primary"
          @click="onBulkUpload"
        />
        <slot />
        <CustomButton
          v-if="showAddLocation"
          icon="fa-warehouse"
          text="add_location"
          type="primary"
        />
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import CustomButton from "./components/CustomButton.vue";
import CustomTextField from "./components/CustomTextfield.vue";
import DownloadPopUp from "../common/DownloadPopUp.vue";

export default {
  components: {
    CustomButton,
    CustomTextField,
    DownloadPopUp,
  },
  props: {
    filename: {
      type: String,
      required: false,
      default: "Filename",
    },
    selected_header: {
      type: Array,
      required: true,
    },
    downloadContent: {
      type: Array,
      required: true,
    },

    downloadDialog: {
      type: Boolean,
      default: false,
      required: false,
    },

    showBulkUpload: {
      type: Boolean,
      default: false,
    },
    showAddLocation: {
      type: Boolean,
      default: false,
    },

    selectedOption: {
      require: true,
    },
    content: {
      type: Array,
      require: true,
    },
    contentT: {
      type: String,
      require: true,
    },
    showColumn: {
      type: Boolean,
      default: true,
    },
    showFilter: {
      type: Boolean,
      default: true,
    },
    showDownload: {
      type: Boolean,
      default: true,
    },
    showViewType: {
      type: Boolean,
      default: false,
    },
    showOrdering: {
      type: Boolean,
      default: false,
    },
    dropdownItems: {
      type: Array,
    },
  },
  data() {
    return {
      searchT: {
        type: this.selectedOption,
        data: this.content,
        contentData: this.contentT,
      },
      copyData: [],
      searchData: "",
      showIds: [],
      changeItem: 3,
      // searchType: 1,
      // searchText: "",
    };
  },
  created() {
    if (process.client) {
      if (window !== undefined) {
        window.addEventListener("resize", this.myEventHandler);
        window.dispatchEvent(new Event("resize"));
      }
    }

    this.$on("sendContent", (data) => {
      this.searchT.data = data;
    });
  },

  destroyed() {
    if (process.client) {
      if (window !== undefined) {
        window.removeEventListener("resize", this.myEventHandler);
      }
    }
  },

  methods: {
    myEventHandler(e) {
      var w = e.target.innerWidth;
      // var w = window.innerWidth;
      if (w < 800) {
        this.changeItem = 2;
        // this.searchT.data = this.searchT.data.slice(
        //   Math.max(this.searchT.data.length - this.changeItem, 0)
        // );
      } else if (w < 900) {
        this.changeItem = 4;
        // this.searchT.data = this.searchT.data.slice(
        //   Math.max(this.searchT.data.length - this.changeItem, 0)
        // );
      } else if (w < 1264) {
        this.changeItem = 5;
        // this.searchT.data = this.searchT.data.slice(
        //   Math.max(this.searchT.data.length - this.changeItem, 0)
        // );
      } else if (w < 1400) {
        this.changeItem = 6;
        // this.searchT.data = this.searchT.data.slice(
        //   Math.max(this.searchT.data.length - this.changeItem, 0)
        // );
      } else if (w < 1904) {
        this.changeItem = 7;
        // this.searchT.data = this.searchT.data.slice(
        //   Math.max(this.searchT.data.length - this.changeItem, 0)
        // );
      } else if (w < 2200) {
        this.changeItem = 2;
        // this.searchT.data = this.searchT.data.slice(
        //   Math.max(this.searchT.data.length - this.changeItem, 0)
        // );
      } else if (w < 3000) {
        this.changeItem = 3;
        // this.searchT.data = this.searchT.data.slice(
        //   Math.max(this.searchT.data.length - this.changeItem, 0)
        // );
      }
    },
    clearSearch() {
      this.searchT.data = "";
      this.searchT.contentData = "";
    },
    onFilter() {
      this.$emit("onFilter");
    },
    search() {
      if (this.searchData) {
        this.$nextTick(() => {
          this.searchT.data.push(...this.searchData.split(","));
          this.$nextTick(() => {
            this.searchData = "";
          });
        });
      }
      this.searchT.data.forEach((element) => {
        if (!this.copyData.includes(element)) {
          this.copyData.push(element);
        }
      });
      this.searchT.data = this.searchT.data.slice(
        Math.max(this.searchT.data.length - this.changeItem, 0)
      );
      this.$emit("update:content", this.searchT.data);
      this.$emit("update:contentT", this.searchT.contentData);
      this.$emit("update:selectedOption", this.searchT.type);
      this.$emit("search");
    },
    searchAgain(value) {
      if (!value) {
        this.$emit("update:content", this.searchT.data);
        this.$emit("update:contentT", this.searchT.contentData);
        this.$emit("update:selectedOption", this.searchT.type);
        this.$emit("searchAgain");
      }
    },
    toggleSearchType() {
      this.$emit("onToggleSearchType", this.searchType);
    },
    onKeyPress() {
      this.$emit("onKeyPress", this.searchText);
    },
    onKeyUp() {
      this.$emit("onKeyUp", this.searchText);
    },
    onKeyDown() {
      this.$emit("onKeyDown", this.searchText);
    },
    onBulkUpload() {
      this.$emit("onBulkUpload");
    },
    clearInput() {
      this.copyData.pop();
      // this.searchT.data.pop();
      this.searchT.data = this.copyData.slice(
        Math.max(this.copyData.length - this.changeItem, 0)
      );
     
    },
    // for changing type of search(ID,Content) and clean inputs
    onTypeChange() {
      
      this.searchT.data = [];
      this.searchT.contentData = ''
      this.$emit("update:content", this.searchT.data);
      this.$emit("update:contentT", this.searchT.contentData);
      this.searchAgain();
      this.$emit("onTypeChange");
    },

    onDownload() {
      this.$emit("onDownload");
    },

    closeDownload() {
      this.$emit("onDownload");
    },
    onOrdering() {
      this.$emit("onOrdering");
    },
    onViewType() {
      this.$emit("onViewType");
    },
    viewStyle(key) {
      this.$emit("viewStyle", key);
    },
    changeSize(size) {
      this.$emit("changeSize", size);
    },
    removeChip(key) {
      this.copyData = this.copyData.filter((data) => data !== key);
      this.searchT.data = this.copyData.slice(
        Math.max(this.copyData.length - this.changeItem, 0)
      );
      this.$emit("update:content", this.searchT.data);
      this.$emit("unSelect", key);
    },
    checkShowIds(item) {
      if (this.searchT.data.includes(item)) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style scoped>
.title,
.title2 {
  font-size: 1rem !important;
  line-height: 1rem !important;
}

.radio-label {
  font-size: 1rem;
  font-weight: 500;
}
</style>
<style>
.tag-input span.chip {
  background-color: #1976d2;
  color: #fff;
  /* font-size: 1em; */
}

.tag-input span.v-chip {
  background-color: #1976d2;
  color: #fff;
  /* font-size: 1em; */
  /* padding-left: 7px; */
}
.v-radio .v-input--selection-controls__input .v-icon.v-icon {
  font-size: 16px;
}

.v-radio .v-input--selection-controls__ripple {
  height: 0;
  width: 0;
}

.w-full .v-radio .v-input--selection-controls__input {
  margin: 0 !important;
}
.w-full
  .v-input.tag-input.w-full.custom-textfield.v-input--hide-details.v-input--dense.v-autocomplete
  .v-input__control {
  min-height: 36px !important;
  /* height: 36px !important; */
}
.w-full .v-select.v-select--is-menu-active .v-input__icon--append .v-icon {
  transform: unset !important;
}

.v-input.tag-input.custom-textfield.v-select.v-select--chips.v-select--is-multi.v-autocomplete
  .v-select__selections {
  /* max-width: 150px !important; */
  flex-wrap: nowrap !important;
  overflow-x: hidden !important;
}
.searchCombobox {
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
}
</style>
