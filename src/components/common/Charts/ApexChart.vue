<template>
<client-only>
  <div>
  <v-card>
    <v-card-title
      class="pa-0 overflow-hidden"
      style="border-radius: 0px !important"
    >
      <slot/>
    <v-row> </v-row>
    </v-card-title>
    <v-card-text>
      <apexchart
      type="area"
      height="350"
      :options="chartOptions"
      :series="series"
      ></apexchart>
        <v-row class="mx-1">
        <v-btn @click="$emit('prev')" color="primary" class="rounded-sm pe-2" ><v-icon  >mdi-chevron-left</v-icon> Prev</v-btn>
          <v-spacer></v-spacer>
        <v-btn @click="$emit('next')" color="primary" class="rounded-sm ps-2">Next <v-icon>mdi-chevron-right</v-icon></v-btn>
        </v-row>
    </v-card-text>
  </v-card>
  </div>
</client-only>
</template>

<script>
import CustomButton from '../../design/components/CustomButton.vue'
import CustomCard from '../CustomCard.vue'
export default {
  components: { CustomCard, CustomButton },
name: "ApexChart",
props:{
  data:{
    type: Array,
    require: true,
  },
  categories:{
    type: Array,
    require: true,
  }
},
   data(){
     return {
          date: new Date().toISOString().substr(0, 7),
      menu: false,
       series: [{
              name: "Users",
              data: this.data
          }],


          chartOptions: {
            chart: {


              zoom: {
                enabled: true
              },

            },

            fill: {
              type: "gradient",
              gradient: {
                enabled: true,
                 opacityFrom: 0.75,
                 opacityTo: 0
              }
            },

             dataLabels: {
              enabled: false
            },
             stroke: {
              curve: 'straight',
            },
            markers: {
                size: 5,
                colors: ["#fff"],
                strokeColors: '#008ffb',
                strokeWidth: 3
            },
            //  title: {
            //   text: 'Product Trends by Month',
            //   align: 'left'
            // },
             grid: {
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
              xaxis: {
              categories: this.categories,
              tickAmount: 16,
            }
     }
   }
},
  methods:{
 getDate() {
      this.menu = false;
      this.$emit("filterByMonth", this.date);
    },
  }

}
</script>

<style>
</style>
