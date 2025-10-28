<template>
  <Calendar :day="day"></Calendar>
  <div>
    <LineChart :chart-data="chartData" :chart-options="chartOptions"/>
  </div>

</template>

<script setup lang="ts">
import { ref} from "vue";
import LineChart from "@/components/LineChart.vue";
import Calendar from "@/components/Calendar.vue";

interface Dados {
  id: number,
  data: string;
  hora: string;
  temperatura: number;
}
const jsonString = '{"data":[{"id":1,"date":"2015/7/21", "time":"12:20:59", "temperature":"79.11"},{"id":1,"date":"2015/7/21", "time":"12:20:60", "temperature":"78.23"},{"id":1,"date":"2015/7/21", "time":"12:21:0", "temperature":"78.23"},{"id":1,"date":"2015/7/21", "time":"12:21:1", "temperature":"79.11"},{"id":1,"date":"2015/7/21", "time":"12:21:2", "temperature":"78.23"},{"id":1,"date":"2015/7/21", "time":"12:21:3", "temperature":"78.23"},{"id":1,"date":"2015/7/21", "time":"12:21:4", "temperature":"79.11"},{"id":2,"date":"2015/7/21", "time":"12:20:59", "temperature":"79.11"},{"id":2,"date":"2015/7/21", "time":"12:20:60", "temperature":"78.23"},{"id":2,"date":"2015/7/21", "time":"12:21:0", "temperature":"78.23"},{"id":2,"date":"2015/7/21", "time":"12:21:1", "temperature":"79.11"},{"id":2,"date":"2015/7/21", "time":"12:21:2", "temperature":"78.23"},{"id":2,"date":"2015/7/21", "time":"12:21:3", "temperature":"78.23"},{"id":2,"date":"2015/7/21", "time":"12:21:4", "temperature":"79.11"}]}';

const rawData:Dados = JSON.parse(jsonString).data;

function setValues(prop:string){
  return rawData.map(obj => obj[prop])
}

function setArrays(){
  let array = []
  for( const i of ids.value){
    array.push(rawData.filter(obj => obj.id === i))
  }
  return array

}

function setDatasets(){
  let array = setArrays();
  let ret = [];
  for(const a of array){
    ret.push(
      {
        label: a[0].id,
        backgroundColor: '#ffffff',
        data: a.map(obj => obj.temperature)
      }
    )
  }
  return ret
}
function setData(){
  return {  labels: labels.value,
          datasets: datasets.value
        }
}


const ids = ref(new Set(setValues("id")))
const day = ref()
const labels = ref(Array.from(new Set(setValues("time"))))
const temps = ref(setValues("temperature"))
const datasets = ref(setDatasets())
const chartData = ref(setData());


const chartOptions  = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y:{
      min: Math.min(...temps.value) - 1,
      max: Math.max(...temps.value) + 1
    }
  },
  plugins: {
        datalabels: {
          anchor: 'end', // Position the label at the end of the bar
          align: 'end',  // Align the label to the end of the bar
          formatter: (value, context) => {
            // Customize the label text here
            return value; // Displays the raw data value
          },
          color: 'black', // Set label color
          font: {
            weight: 'bold' // Set font weight
          }
        }
      }
}


</script>
