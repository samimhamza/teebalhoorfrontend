<template>
  <v-row>
    <v-col cols="12" md="4">
      <template    >
        <v-card class="mx-auto" tile>
          <v-list dense>
            <v-subheader>REPORTS</v-subheader>
           
            <v-list-item-group v-model="selectedItem" color="primary">
              <v-list-item >
               <v-list-item-title v-text="$t('General')" class="px-5"></v-list-item-title>
              </v-list-item>
              <v-list-item v-for="(item, i) in menuItems" :key="i">
                <v-list-item-icon class="px-2">
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </template>
    </v-col>
    <v-col cols="12" md="8" style="background-color: white"> 
      <!-- upload -->
    <div class="mt-3 px-4" row >
    <v-file-input
      label="File input"
      v-model="file"
      show-size
      multiple
    ></v-file-input>

    <v-btn
      ref="button"
      class="drawer-button"
      color="#ee44aa"
      dark
      @click="upload"
    >
      upload
    </v-btn>  
  </div>
  <v-divider class="grey darken-1 mt-1"></v-divider>
  <!-- show data -->
    <v-col cols="12" md="12"  v-for="getAttchmentsItems in getAttchmentsItems" :key="getAttchmentsItems.id">
          <div class="team-member d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-avatar class="me-2" color="primary" size="40">
                <span class="white--text">RM</span>
              </v-avatar>
              <div>
                <nuxt-link class="text-decoration-none" to="/users/">
                  <p class="ma-0 first-p">
                    {{ getAttchmentsItems.id }}
                  </p>
                </nuxt-link>
                <p class="ma-0 second-p text--secondary">{{ getAttchmentsItems.attachment.url }}</p>
              </div>
            </div>
            <div
              style="min-width: 80px"
              class="d-flex align-center justify-end"
            >
              <v-btn icon text  >
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
  <!-- end -->
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CustomInput from "../design/components/CustomInput.vue";

export default {
  components: {
    CustomInput,
  },
  computed: {
    ...mapGetters({
      getAttchmentsItems: "job_posts/getJobAttachment",
    }),
  },
  props: {
    JobData: {
      type: Object,
      require: true,
    },
  },

  data() {
    return {
       
      isFileSelected: false,
      profileImagePath: "",
      file: [],
      menuItems: [
        {
          title: "download",
          icon: "fa-download",
        },
        {
          title: "remove",
          icon: "fa-trash",
        },
      ],
      selectedItem:[],
   
    };
  },
  methods: {
    // vuex state methods
    ...mapActions({
      fetchItems: "job_posts/fetchJobAttachment",
    }),

    upload() {
      const jobPostFile = new FormData();
      for (var i = 0; i < this.file.length; i++) {
        jobPostFile.append("attachments[]", this.file[i]);
      }
      jobPostFile.append("job_post_id", this.JobData.id);
        
      this.$axios
        .post("job-posts/upload-attachment", jobPostFile)
        .then((res) => {
          console.log("suvvess");
        })
        .catch((err) => console.log(err));
    },
  },
  async created() {
    const data = {
      job_id: this.JobData.id,
    };
    await this.fetchItems(data);
    
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
.candidate-name {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
