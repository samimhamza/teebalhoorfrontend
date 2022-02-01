<template>
  <div>
    <!-- <v-btn
      ref="button"
      class="drawer-button"
      color="#ee44aa"
      dark
      @click="right = true"
    >
      <v-icon class="fa-spin">mdi-cog-outline</v-icon>
    </v-btn> -->

    <v-navigation-drawer
      v-model="showProfile2"
      @input="close"
      fixed
      right
      temporary
      width="1000px"
    >
      <div class="d-flex align-center pa-2" v-if="showProfile">
        <div class="title">{{ $tr("view_job") }}</div>
        <v-spacer></v-spacer>
        <CloseBtn
          @click="
            () => {
              $emit('close', false);
            }
          "
        />
      </div>

      <v-divider></v-divider>
   
      <div class="">
        <div class="header px-3 py-2 align-center">
          <div class="mb-1 mx-auto d-flex justify-center">
            <v-avatar color="primary" size="80">
              <span class="white--text text-h4">TB</span>
            </v-avatar>
          </div>
          <div class="mx-auto text-center">
            <div class="mb-1 d-flex align-center justify-center">
              <h2 class="job-title me-2">Software Engineer</h2>
              <UserChip name="Ahmad Samim" avatar="AS" />
            </div>
            <div class="job-dep d-flex justify-center align-center mb-1">
              <v-icon style="min-width: 20px" small class="me-1">
                fa-school
              </v-icon>
              <p class="ma-0">Department Name</p>
              <nuxt-link
                class="text-decoration-none"
                to="/masters/departments/department_id"
              >
                <v-icon small class="ms-1">fa-link</v-icon>
              </nuxt-link>
            </div>
            <div class="job-salary d-flex justify-center align-center mb-1">
              <v-icon style="min-width: 20px" small class="me-1">
                fa-dollar-sign
              </v-icon>
              <p class="ma-0">1000$ - 2000$</p>
            </div>
          </div>
          <div class="stats d-flex align-center justify-center text-center">
            <div class="stat mx-1">
              <div class="stat-header success white--text">
                {{ $tr("hired") }}
              </div>
              <div class="stat-body">123</div>
            </div>
            <div class="stat mx-1">
              <div class="stat-header warning white--text">
                {{ $tr("in_pipline") }}
              </div>
              <div class="stat-body">123</div>
            </div>
            <div class="stat mx-1">
              <div class="stat-header error white--text">
                {{ $tr("dropped") }}
              </div>
              <div class="stat-body">123</div>
            </div>
          </div>
        </div>
        <div>
          <v-tabs
            v-model="tabIndex"
            height="40"
            background-color="primary"
            active-class="active-background"
            show-arrows
            dark
          >
            <client-only>
              <v-tab dark v-for="(item, i) in tabItems" :key="i" class="px-3">
                <span
                  :class="`${
                    item.isSelected ? 'selected' : 'not-selected'
                  } tab-icon`"
                >
                  <v-icon left small class="me-1">{{ item.icon }}</v-icon>
                </span>
                <p
                  :class="`${
                    item.isSelected ? 'selected' : 'not-selected'
                  } tab-title text-capitalize mb-0`"
                >
                  {{ $tr(item.text) }}
                </p>
                <v-chip
                  v-if="item.hasChip"
                  class="ms-1 tab-chip"
                  :color="item.isSelected ? 'primary' : 'white'"
                  :text-color="item.isSelected ? 'white' : 'primary'"
                  small
                  v-text="item.number"
                />
              </v-tab>
              <v-tabs-items v-model="tabIndex" light>
                <v-tab-item class="py-2">
                  <JobProfileTabOne />
                </v-tab-item>
                <v-tab-item class="py-2">
                  <JopProfileTabTwo />
                </v-tab-item>
                <v-tab-item>
                  <JopProfileTabThree />
                </v-tab-item>
                <v-tab-item>
                  <JopProfileTabFour />
                </v-tab-item>
                <v-tab-item>
                  <JopProfileTabFive />
                </v-tab-item>
                <v-tab-item>
                   <AddJobNote :profileData="profileData" />
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                  <JopProfileTabSeven :JobData="profileData" />

                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text v-text="'text8'"></v-card-text>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-card-text v-text="'text9'"></v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </client-only>
          </v-tabs>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import CloseBtn from "../design/Dialog/CloseBtn.vue";
import JobProfileTabOne from "./JopProfileTabOne.vue";
import JopProfileTabTwo from "./JopProfileTabTwo.vue";
import JopProfileTabThree from "./JopProfileTabThree.vue";
import JopProfileTabFour from "./JopProfileTabFour.vue";
import JopProfileTabFive from "./JopProfileTabFive.vue";
import JopProfileTabSeven from "./JopProfileTabSeven.vue";
import AddJobNote from "./AddJobNote.vue";
import UserChip from "../design/UserChip.vue";
export default {
  components: {
    CloseBtn,
    JobProfileTabOne,
    JopProfileTabTwo,
    JopProfileTabThree,
    JopProfileTabFour,
    JopProfileTabFive,
    JopProfileTabSeven,
    UserChip,
    AddJobNote
  },
  props: {
    showProfile: {
      type: Boolean,
    },
    profileData:{
      type: Object,
      require: true,
    }
  },
  data() {
    return {
      showProfile2: false,
      right: false,
      tabIndex: 0,
      tabItems: [
        {
          text: "candidates",
          icon: "fa-users",
          isSelected: true,
          hasChip: false,
        },
        {
          text: "summary",
          icon: "fa-sticky-note",
          isSelected: false,
          hasChip: false,
        },
        {
          text: "team",
          icon: "fa-sticky-note",
          isSelected: false,
          hasChip: true,
          number: 2,
        },
        {
          text: "recommendations",
          icon: "fa-info-circle",
          isSelected: false,
          hasChip: false,
        },
        {
          text: "activities",
          icon: "fa-calendar",
          isSelected: false,
          hasChip: false,
        },
        {
          text: "notes",
          icon: "fas fa-comment-alt",
          isSelected: false,
          hasChip: false,
        },
        {
          text: "attachments",
          icon: "fa-paperclip",
          isSelected: false,
          hasChip: false,
        },
        {
          text: "sourcing",
          icon: "fa-plus-circle",
          isSelected: false,
          hasChip: false,
        },
        {
          text: "reports",
          icon: "fa-chart-bar",
          isSelected: false,
          hasChip: false,
        },
      ],
    };
  },
  watch: {
    tabIndex: function (value) {
      this.checkSelectedTab(value);
    },
    showProfile: function (value) {
      this.showProfile2 = value;
    },
  },

  mounted() {},
  methods: {
    checkSelectedTab(value) {
      this.tabItems = this.tabItems.map((item, index) => {
        index === value ? (item.isSelected = 1) : (item.isSelected = 0);
        return item;
      });
    },
    close(value) {
      this.$emit("close", value);
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-button {
  position: fixed;
  top: 440px;
  right: -20px;
  z-index: 6;

  .v-icon {
    margin-left: -18px;
    font-size: 1.3rem;
  }
}
// should remove
.header {
  background: var(--stepper-header-bg);
}
.job-dep,
.job-salary {
  font-size: 14px !important;
}
.stats .stat {
  font-size: 14px !important;
}
.stats .stat .stat-header {
  border-radius: 6px 6px 0 0;
  font-weight: 500;
  padding: 4px 10px;
}
.stats .stat .stat-body {
  padding: 2px 10px;
  border: 1px solid rgba(144, 144, 144, 0.5);
  border-top: 0 !important;
  border-radius: 0 0 6px 6px;
}
</style>
