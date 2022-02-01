<template>
  <div class="mt-3 px-4">
    <v-row>
      <v-col cols="12" md="3" class="px-2">
        <CustomInput
          v-model="Note"
          placeholder="Note..."
          type="textfield"
        />

      <v-radio-group v-model="type">
          <v-radio value="general" label="General">
            
          </v-radio>
          <v-radio value="candidate" label="Candidate">

          </v-radio>
      </v-radio-group>

        <CustomInput
                type="autocomplete"
                class="me-md-4 mb-md-2 mb-0"
                :items="candidate"
                v-model="selected_candidate"
                item-text="candidate"
                item-value="candidate_id"
        />

    
        <v-btn block tile color="primary"  @click="addNote" class="mt-1">
          <div class="d-flex w-full justify-space-around">
            <p class="ma-0">Add</p>
          </div>
        </v-btn>

      </v-col>
      
      <v-col cols="12" md="9" >
   
      <v-list>
      <template v-for="(item, index) in getGeneralNote">
        <v-list-item
          :key="item.id"
        >
          <v-list-item-avatar>
             <v-img ></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
             <v-list-item-title >Asad Muradi</v-list-item-title>
            <v-list-item-subtitle >
               {{ item.note }}
            </v-list-item-subtitle>
          </v-list-item-content>

        </v-list-item>
      </template>
    </v-list>
      </v-col>
       
    </v-row>
    <P>
 
    </p>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import CustomInput from "../design/components/CustomInput.vue";

export default {
  components: {
    CustomInput,
  },
  props: {
    profileData:{
      type: Object,
      require: true,
    }
  },
  computed: {
    ...mapGetters({
      getGeneralNote: "job_posts/getJobGeneralNote",
      getCandidateNote: "job_posts/getJobCandidateNote"
    }),
  },
  data() {
    return {
      Note: "",
      type:"general",
      candidate:[],
      candidate_id:[],
      selected_candidate:"",  
      mydata:'',
    };
  },
  methods: {
    ...mapActions({
      fetchGeneralNote: "job_posts/fetchGeneralJobNote",
      fetchCandidateNote: "job_posts/fetchCandidateJobNote"
    }),

      async addNote(){
      console.log(this.selected_candidate);
      const data= {
          note: this.Note,
          job_post_id:this.profileData.id,
          type:this.type,
          candidate_id:"02e29854-aa40-4000-b0d8-f9485060fe72",
          }
          
          const response = await this.$axios.post('note-posts/note',data);
          // console.log(data.type);
      }
  },

  async created(){

  //  const response= await this.$axios.get('note-posts/JobCandidateNote',{ params:{job_post_id:this.profileData.id}});
  //  console.log(response?.data?.data[0]?.candidate); 
  //  this.candidate=[ response?.data?.data[0]?.candidate.firstname];
  //  this.candidate_id= response?.data?.data[0]?.candidate.id;


  //  const note= await this.$axios.get('note-posts/JobGeneralNote',{ params:{job_post_id:this.profileData.id}});
  //  console.log(note);  
   console.log(this.selected_candidate);
    const data = {
        job_post_id:"1bd0dd80-65de-4ff8-88b6-6d9289517394",
    
    };
    await this.fetchGeneralNote(data);
    console.log('gettercalled',this.getGeneralNote)
    
    
    // await this.fetchCandidateNote(data);
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
