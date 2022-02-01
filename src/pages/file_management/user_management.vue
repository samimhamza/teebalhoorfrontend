<template>
  <div class="w-full">
    <div class="w-full">
      <PageHeader
        :Icon="breadcrumb[1].icon"
        :Title="breadcrumb[1].text"
        :Breadcrumb="breadcrumb"
      />
    </div>
    <div class="w-full">
      <PageFilters
        ref="pageFilterRef"
        :selected_header="[]"
        :downloadContent="[]"
        :showColumn="false"
        :showDownload="false"
        :showOrdering="true"
        :showViewType="true"
        :content.sync="content"
        :contentT.sync="contentData"
        :selectedOption.sync="type"
        :dropdownItems="dropdownItems"
        @viewStyle="viewStyle"
        @changeSize="changeSize"
        @onOrdering="OrderFIles"
      >
        <CustomButton
          v-if="$isInScope('companies-create')"
          :isHasStyle="true"
          icon="mdi-alert-circle-outline"
          @click="registerDialog = true"
          text=""
          type="primary"
        />
        <CustomButton
          v-if="$isInScope('companies-create')"
          icon="fa-plus"
          @click="registerDialog = true"
          text="new"
          type="primary"
        />
      </PageFilters>
    </div>
    <div class="w-full" v-if="list">
      <v-card elevation="1" class="w-full">
        <v-card-title
          class="pa-0 overflow-hidden"
          style="border-radius: 0px !important"
        >
          <div
            class="primary w-full white--text px-5 py-1 d-flex"
            v-if="!selectedFile"
          >
            <p class="mb-0 ps-1 headerStyle">{{ $tr('name') }}</p>
            <p class="mb-0 ps-1 headerStyle">{{ $tr('time') }}</p>
          </div>
          <SelectedTitle
            v-else
            :selectedItems.sync="selectedItems"
            :selectedFile.sync="selectedFile"
            @unSelectAll="unSelectAll"
          />
        </v-card-title>
        <v-card-text class="pa-0 ma-0 scroll">
          <v-list-item-group v-model="model" multiple>
            <template v-for="(item, id) in companies">
              <v-list-item
                class="px-5 py-0 my-0"
                style="height: 70px"
                :class="id % 2 !== 0 ? 'oddStyle' : ''"
                :key="item.id"
                @click="selectFile(id)"
              >
                <template>
                  <v-list-item-action>
                    <v-checkbox
                      :input-value="thumbnailCheckbox[id]"
                      color="primary"
                    ></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-icon class="mx-1 margin-top">
                    <img
                      width="50"
                      :src="`/new-folder-logo.png`"
                      class="ma-0 pa-0"
                    />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                    <!-- <v-list-item-subtitle
                      >Allow notifications
                      <span @click.stop="addFav(i)">
                        <v-icon v-if="!active" color="grey lighten-1">
                          mdi-star-outline
                        </v-icon>

                        <v-icon v-else color="yellow darken-3">
                          mdi-star
                        </v-icon>
                      </span>
                    </v-list-item-subtitle> -->
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-light">{{
                      item.created_at
                    }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-card-text>
      </v-card>
    </div>
    <div class="w-full" v-else>
      <v-card elevation="1" class="w-full">
        <v-card-title
          class="pa-0 overflow-hidden"
          style="border-radius: 0px !important"
        >
          <div
            class="
              primary
              w-full
              white--text
              px-5
              py-1
              d-flex
              justify-space-between
            "
            v-if="!selectedFile"
          >
            <p class="mb-0 ps-1">{{ $tr('file')}}</p>
            <p class="mb-0 ps-1">
              {{ $tr('last_modified') }}
              <v-icon color="white">mdi-arrow-down</v-icon>
            </p>
          </div>
          <SelectedTitle
            v-else
            :selectedItems.sync="selectedItems"
            :selectedFile.sync="selectedFile"
            @unSelectAll="unSelectAll"
          />
        </v-card-title>
        <v-card-text class="pa-0 ma-0 scroll">
          <v-item-group v-model="model" multiple class="d-flex flex-wrap">
            <!-- <div v-for="item in companies" :key="item.id" class="ma-2"> -->
            <v-card
              :width="Width"
              v-for="(item, id) in companies"
              class="ma-2 pa-1"
              flat
              rounded
              :key="item.id"
              @click="selectFile(id)"
            >
              <div class="">
                <v-img :src="`/new-folder-logo.png`" class="ma-0 pa-0">
                  <v-checkbox
                    v-if="thumbnailCheckbox[id]"
                    :input-value="thumbnailCheckbox[id]"
                    class="float-left pa-0 ma-0"
                    color="primary"
                    @click="(id) => selectFile"
                  ></v-checkbox>
                </v-img>
                <!-- <v-img :width="Width" :src="`/new-folder-logo.png`"></v-img> -->

                <p class="pa-0 ma-0 font-weight-bold">
                  {{ item.name }}
                  <!-- <span @click.stop="addFav(i)">
                    <v-icon v-if="!thumbnailCheckbox[i]" color="grey lighten-1">
                      mdi-star-outline
                    </v-icon>

                    <v-icon v-else color="yellow darken-3"> mdi-star </v-icon>
                  </span> -->
                </p>
              </div>
              <!-- </div> -->
            </v-card>
          </v-item-group>
        </v-card-text>
      </v-card>
      <!-- <v-card elevation="1" class="w-full">
        <v-card-title
          class="pa-0 overflow-hidden"
          style="border-radius: 0px !important"
        >
          <div
            class="primary w-full white--text px-5 py-1 d-flex justify-space-between"
            v-if="!selectedFile"
          >
            <p class="mb-0 ps-1">File</p>
            <p class="mb-0 ps-1">
              Last Modified
              <v-icon color="white">mdi-arrow-down</v-icon>
            </p>
          </div>
          <div
            class="primary w-full white--text px-5 py-1 d-flex justify-space-between"
            v-else
            style="height: 46px !important"
          >
            <div class="d-flex py-0 my-0">
              <v-checkbox
                :input-value="selectedFile"
                color="white"
                class="my-0 py-0"
                @click="unSelectAll"
              ></v-checkbox>
              <span class="font-weight-thin"
                >{{ selectedItems.length }} file selected</span
              >
            </div>
            <div>
              <v-btn class="pa-0 buttonStyle" elevation="0">
                <div class="d-flex align-center pa-0 ma-0">
                  <img
                    width="35"
                    class="pa-0 ma-0"
                    src="/File Manage/File Managment system ICon-14.svg"
                  />
                  <div class="">{{ $t("buttons.share") }}</div>
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
                  <div class="">{{ $t("buttons.permalink") }}</div>
                </div>
              </v-btn>
              <v-btn class="pa-0 buttonStyle pe-1" elevation="0">
                <div class="d-flex align-center pa-0 ma-0">
                  <img
                    width="35"
                    class="pa-0 ma-0"
                    src="/File Manage/File Managment system ICon-16.svg"
                  />
                  <div class="">{{ $t("buttons.download") }}</div>
                </div>
              </v-btn>
            </div>
            <div>
              <v-btn class="pa-0 EscButton" elevation="0">
                <div class="d-flex align-center pa-0 ma-0 white--text">
                  <div class="">{{ $t("buttons.Esc") }}</div>
                  <v-icon>mdi-close</v-icon>
                </div>
              </v-btn>
            </div>
          </div>
        </v-card-title>
        <v-card-text class="pa-0 ma-0 scroll">
          <v-item-group v-model="model" multiple class="d-flex flex-wrap">
            <v-card
              :width="Width"
              v-for="(item, i) in companies"
              class="ma-2"
              tile
              :key="item.id"
              :value="item.id"
              elevation="1"
              @click="selectFile(i)"
            >
              <v-img :src="item.logo">
                <v-checkbox
                  v-if="thumbnailCheckbox[i]"
                  :input-value="thumbnailCheckbox[i]"
                  class="float-right pt-0"
                  color="primary"
                  @click="(id) => selectFile"
                ></v-checkbox>
              </v-img>
              <v-card-text class="cardStyle py-1">
                <p class="pa-0 ma-0 font-weight-bold">
                  {{ item.name }}
                  <span @click.stop="addFav(i)">
                    <v-icon v-if="!thumbnailCheckbox[i]" color="grey lighten-1">
                      mdi-star-outline
                    </v-icon>

                    <v-icon v-else color="yellow darken-3"> mdi-star </v-icon>
                  </span>
                </p>
                <p class="pa-0 ma-0 font-weight-thin">{{}}</p>
              </v-card-text>
            </v-card>
          </v-item-group>
        </v-card-text>
      </v-card> -->
      <!-- <ViewStyle :data="companies" /> -->
    </div>
  </div>
</template>
<script>
import PageFilters from "../../components/design/PageFilters.vue";
import PageHeader from "../../components/design/PageHeader.vue";
import CustomButton from "../../components/design/components/CustomButton.vue";
import ViewStyle from "../../components/file_management/ViewStyle.vue";
import SelectedTitle from "../../components/file_management/SelectedTitle";
import { mapActions, mapGetters } from "vuex";

export default {
  meta: {
    hasAuth: true,
    scope: "companies-view",
  },
  async asyncData({ store }) {
    await store.dispatch("companies/fetchAscCompanies");
  },
  components: {
    PageFilters,
    PageHeader,
    CustomButton,
    ViewStyle,
    SelectedTitle,
  },
  data() {
    return {
      breadcrumb: [
        { text: this.$tr("dashboard"), exact: true, to: "/" },
        {
          text: "system_file_manager",
          disabled: true,
          to: "",
          icon: "mdi-image-multiple",
        },
      ],
      model: [],
      items: ["icon-1", "icon-2", "icon-3", "icon-4"],
      selectedItems: [],
      favorites: [],
      selectedFile: false,
      list: false,
      selected: [],
      thumbnailCheckbox: [],
      Width: 110,
      type: 1,
      content: [],
      contentData: "",
      dropdownItems: [
        {
          key: 1,
          prepend: "/File Manage/File Managment system ICon-03.svg",
          text: "List",
          hasCheck: false,
          append: "mdi-check",
        },
        {
          key: 2,
          prepend: "/File Manage/File Managment system ICon-01.svg",
          text: "Thumbnail",
          hasCheck: true,
          append: "mdi-check",
        },
      ],
    };
  },

  computed: {
    ...mapGetters({
      companies: "companies/getAscCompanies",
    }),
  },
  methods: {
    ...mapActions({
      getCompanies: "companies/fetchAscCompanies",
    }),
    selectFile(id) {
      if (this.selectedItems.includes(this.companies[id])) {
        this.selectedItems = this.selectedItems.filter(
          (deps) => deps !== this.companies[id]
        );
      } else {
        this.selectedItems.push(this.companies[id]);
      }
      if (this.selectedItems.length) {
        this.selectedFile = true;
      } else {
        this.selectedFile = false;
      }
      // start of magic
      if (this.thumbnailCheckbox.length == 0) {
        for (let i = 0; i <= id; i++) {
          if (i == id) {
            this.thumbnailCheckbox[i] = true;
          } else {
            this.thumbnailCheckbox[i] = false;
          }
        }
      } else {
        for (let i = 0; i <= id; i++) {
          if (i == id) {
            if (this.thumbnailCheckbox[i]) {
              this.thumbnailCheckbox[i] = false;
            } else {
              this.thumbnailCheckbox[i] = true;
            }
          }
        }
      }
      // end of magic
    },
    addFav(id) {
      this.favorites.push(id);
    },
    unSelectAll() {
      this.selectedItems = [];
      this.model = [];
      this.selectedFile = false;
      this.thumbnailCheckbox = [];
    },
    viewStyle(itemKey) {
      if (itemKey == 1) {
        this.list = true;
        if ((this.dropdownItems.key = itemKey)) {
          this.dropdownItems[0].hasCheck = true;
          this.dropdownItems[1].hasCheck = false;
        }
      } else {
        this.list = false;
        if ((this.dropdownItems.key = itemKey)) {
          this.dropdownItems[1].hasCheck = true;
          this.dropdownItems[0].hasCheck = false;
        }
      }
    },
    changeSize(size) {
      this.Width = size;
    },
    OrderFIles() {},
    openFile(company) {},
  },
};
</script>
<style scoped>
.headerStyle {
  align-items: center;
  align-self: center;
  display: flex;
  flex-wrap: wrap;
  width: 50% !important;
  flex: 1 1;
  overflow: hidden;
}
.buttonStyle {
  background-color: #edf2f9 !important;
  border-radius: 2px !important;
}
.oddStyle {
  background-color: rgba(0, 0, 0, 0.02) !important;
}
.margin-top {
  margin-top: 5px !important;
}
.EscButton {
  border: none !important;
  background-color: transparent !important;
}
.cardStyle {
  /* margin-top: -10px !important;
  z-index: 10;
  border-top: 2px solid #f0f0f0 !important; */
}
.scroll {
  width: 100%;
  max-height: 400px !important;
  height: 400px;
  overflow-y: scroll !important;
}
</style>
