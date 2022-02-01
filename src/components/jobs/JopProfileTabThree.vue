<template>
  <div class="mt-3 px-4">
    <div class="section">
      <div class="d-flex align-center">
        <h3 class="text-h6 me-2">Job Team</h3>
        <CustomButton
          icon="fa-plus"
           @click="add"
          :text="$tr('add_team_memeber')"
          type="primary"
        />
      </div>
      <v-row>
        <v-col cols="12" md="6" lg="4" class="px-2"  v-for="getJobPostTeam in getJobPostTeam" :key="getJobPostTeam.id">
          <div class="team-member d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-avatar class="me-2" color="primary" size="40">
                <span class="white--text">RM</span>
              </v-avatar>
              <div>
                <nuxt-link class="text-decoration-none" to="/users/">
                  <p class="ma-0 first-p">
                    {{ getJobPostTeam.created_by.firstname }}
                  </p>
                </nuxt-link>
                <p class="ma-0 second-p text--secondary">{{ getJobPostTeam.created_by.lastname }}</p>
              </div>
            </div>
            <div
              style="min-width: 80px"
              class="d-flex align-center justify-end"
            >
              <v-btn icon text @click="view">
                <v-icon small>far fa-eye</v-icon>
              </v-btn>
              <div style="width: 32px">
                <v-menu transition="slide-y-transition" bottom left offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn text icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item link v-for="(item, i) in menuItems" :key="i">
                      <v-list-item-icon>
                        <v-icon small v-text="item.icon"></v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="section">
      <div class="d-flex align-center">
        <h3 class="text-h6 me-2">Department Team</h3>
      </div>
      <v-row>
        <v-col cols="12" md="6" lg="4" class="px-2">
          <div class="team-member d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-avatar class="me-2" color="primary" size="40">
                <span class="white--text">RM</span>
              </v-avatar>
              <div>
                <nuxt-link class="text-decoration-none" to="/users/">
                  <p class="ma-0 first-p">Asadullah</p>
                </nuxt-link>
                <p class="ma-0 second-p text--secondary">Asadullah</p>
              </div>
            </div>
            <div
              style="min-width: 80px"
              class="d-flex align-center justify-end"
            >
              <v-btn icon text>
                <v-icon small>far fa-eye</v-icon>
              </v-btn>
              <div style="width: 32px">
                <v-menu transition="slide-y-transition" bottom left offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn text icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item link v-for="(item, i) in menuItems" :key="i">
                      <v-list-item-icon>
                        <v-icon small v-text="item.icon"></v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6" lg="4" class="px-2">
          <div class="team-member d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-avatar class="me-2" color="primary" size="40">
                <span class="white--text">RM</span>
              </v-avatar>
              <div>
                <nuxt-link class="text-decoration-none" to="/users/">
                  <p class="ma-0 first-p">Asadullah</p>
                </nuxt-link>
                <p class="ma-0 second-p text--secondary">Asadullah</p>
              </div>
            </div>
            <div
              style="min-width: 80px"
              class="d-flex align-center justify-end"
            >
              <v-btn icon text>
                <v-icon small>far fa-eye</v-icon>
              </v-btn>
              <div style="width: 32px">
                <v-menu transition="slide-y-transition" bottom left offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn text icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item link v-for="(item, i) in menuItems" :key="i">
                      <v-list-item-icon>
                        <v-icon small v-text="item.icon"></v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script>
import CustomButton from "../design/components/CustomButton.vue";
import {mapActions,mapGetters }  from "vuex";

export default {
  async asyncData({ store }) {
    await store.dispatch("job_post_teams/fetchJobPostTeam");
  },
  components: {
    CustomButton,
  },
  data() {
    return {  
      lists:{},      
      menuItems: [
        {
          title: "remove",
          icon: "fa-trash",
        },
      ],
    };
  },
  fetch(){
    this.fetchJobPostTeam();
  },
   computed: mapGetters({
  getJobPostTeam: "job_post_teams/getJobPostTeam"
 }),
  methods: {
    ...mapActions({
      fetchJobPostTeam: "job_post_teams/fetchJobPostTeam",
    }),
    add(){
      this.lists = this.fetchJobPostTeam();
      console.log(this.lists);
    },
    view(){
      console.log('viewwwwwwwwwwwwwwwwwwwwwwwwwww');
    }
  },
};
</script>
<style scoped>
.team-member {
  border: 1px solid rgba(220, 220, 220, 0.5);
  padding: 8px;
}
.first-p {
  margin-bottom: 4px !important;
  font-size: 14px !important;
}
.second-p {
  font-size: 12px !important;
}
</style>
