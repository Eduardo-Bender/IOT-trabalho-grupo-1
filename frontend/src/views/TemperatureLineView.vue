<template>
    <!-- <div>
      <button popovertarget="cally-popover1" class="input input-border" id="dataInicial" style="anchor-name:--dataInicial">
        Pick a date
      </button>
      <div popover id="cally-popover1" class="dropdown bg-base-100 rounded-box shadow-lg" style="position-anchor:--dataInicial">
        <calendar-date class="cally" onchange="{document.getElementById('dataInicial').innerText = this.value; dataInicial.value = this.value}" >
          <svg aria-label="Previous" class="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
          <svg aria-label="Next" class="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
          <calendar-month></calendar-month>
        </calendar-date>
      </div>


    <fieldset class="fieldset">
      <legend class="fieldset-legend">Eixo X</legend>
      <select class="select" id="selectX" v-model="eixoX">
        <option disabled selected>Eixo X</option>
        <option v-for="p in propriedades" :value="p[0]">{{p[1]}}</option>
      </select>
    </fieldset>
    <fieldset class="fieldset">
      <legend class="fieldset-legend">Eixo Y</legend>
      <select class="select" id="selectY" v-model="eixoY">
        <option disabled selected>Eixo Y</option>
        <option v-for="p in propriedades" :value="p[0]">{{p[1]}}</option>
      </select>
    </fieldset>

  </div> -->
  <div>
    <LineChart :chart-data="chartData" :chart-options="chartOptions"/>
  </div>

</template>

<script setup lang="ts">

import "cally";
import { ref, watch } from "vue";
import LineChart from "@/components/LineChart.vue";

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
        backgroundColor: '#f87979',
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
const dataInicial = ref()
const dates = ref(new Set(setValues("date")))
const labels = ref(Array.from(new Set(setValues("time"))))
const temps = ref(setValues("temperature"))
const datasets = ref(setDatasets())


const chartData = ref(setData());
console.log(chartData.value)
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
