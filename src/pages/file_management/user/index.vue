<template>
  <div class="w-full">
    <div class="w-full">
      <PageHeader
        Icon="mdi-image-multiple"
        Title="menu.userManagement"
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
            <p class="mb-0 ps-1 headerStyle">Name</p>
            <p class="mb-0 ps-1 headerStyle">Time</p>
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
            </div>
            <div>
              <v-btn class="pa-0 EscButton" elevation="0">
                <div class="d-flex align-center pa-0 ma-0 white--text">
                  <div class="">{{ $tr("esc") }}</div>
                  <v-icon>mdi-close</v-icon>
                </div>
              </v-btn>
            </div>
          </div>
        </v-card-title>
        <v-card-text class="pa-0 ma-0 scroll">
          <v-list-item-group v-model="model" multiple>
            <template v-for="(item, i) in items">
              <v-list-item
                class="px-5 py-0 my-0"
                style="height: 70px"
                :class="i % 2 !== 0 ? 'oddStyle' : ''"
                :key="`item-${i}`"
                :value="item"
                @click="selectFile(id)"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-action>
                    <v-checkbox
                      :input-value="active"
                      color="primary"
                    ></v-checkbox>
                  </v-list-item-action>
                  <v-list-item-icon class="mx-1 margin-top">
                    <img
                      width="50"
                      :src="`/icons/SVG BLACK/Icons-${i + 1}.svg`"
                      alt="SDw"
                    />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ item }}</v-list-item-title>
                    <v-list-item-subtitle
                      >Allow notifications
                      <span @click.stop="addFav(i)">
                        <v-icon v-if="!active" color="grey lighten-1">
                          mdi-star-outline
                        </v-icon>

                        <v-icon v-else color="yellow darken-3">
                          mdi-star
                        </v-icon>
                      </span>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-light"
                      >24 minute ago</v-list-item-title
                    >
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
            </div>
            <div>
              <v-btn class="pa-0 EscButton" elevation="0">
                <div class="d-flex align-center pa-0 ma-0 white--text">
                  <div class="">{{ $tr("esc") }}</div>
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
              v-for="(item, i) in items"
              class="ma-2"
              tile
              :key="`item-${i}`"
              :value="item"
              elevation="1"
              @click="selectFile(i)"
            >
              <v-img :src="`/icons/SVG BLACK/Icons-${i + 1}.svg`">
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
                  {{ item }}
                  <span @click.stop="addFav(i)">
                    <v-icon v-if="!thumbnailCheckbox[i]" color="grey lighten-1">
                      mdi-star-outline
                    </v-icon>

                    <v-icon v-else color="yellow darken-3"> mdi-star </v-icon>
                  </span>
                </p>
                <p class="pa-0 ma-0 font-weight-thin">Allow notifications</p>
              </v-card-text>
            </v-card>
          </v-item-group>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
<script>
import PageFilters from "../../../components/design/PageFilters.vue";
import PageHeader from "../../../components/design/PageHeader.vue";
import CustomButton from "../../../components/design/components/CustomButton.vue";

export default {
  components: { PageFilters, PageHeader, CustomButton },
  data() {
    return {
      breadcrumb: [
        { text: this.$tr("dashboard"), exact: true, to: "/" },
        {
          text: this.$tr("companyFile"),
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
      list: true,
      selected: [],
      thumbnailCheckbox: [],
      Width: 140,
      dropdownItems: [
        {
          key: 1,
          prepend: "/File Manage/File Managment system ICon-03.svg",
          text: "List",
          hasCheck: true,
          append: "mdi-check",
        },
        {
          key: 2,
          prepend: "/File Manage/File Managment system ICon-01.svg",
          text: "Thumbnail",
          hasCheck: false,
          append: "mdi-check",
        },
      ],
    };
  },
  methods: {
    selectFile(id) {
      if (this.selectedItems.includes(this.items[id])) {
        this.selectedItems = this.selectedItems.filter(
          (deps) => deps !== this.items[id]
        );
      } else {
        this.selectedItems.push(this.items[id]);
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
  margin-top: -10px !important;
  z-index: 10;
  border-top: 2px solid #f0f0f0 !important;
}
.scroll {
  width: 100%;
  max-height: 400px !important;
  height: 400px;
  overflow-y: scroll !important;
}
</style>
