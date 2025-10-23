<template>
    <div>
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

  </div>
  <div>
    <BarChart :chart-data="chartData" :chart-options="chartOptions"/>
  </div>

</template>

<script setup lang="js">
import "cally";
import BarChart from '../components/BarChart.vue'
import { ref } from "vue";

function setValues(num){
  return props.chartData.map(obj => obj[propriedades[num-1][2]])
}


const props = defineProps({
  chartData: {
        type: Object,
        required: true
      },
    chartOptions: {
        type: Object,
        default: () => ({})
    }
})

const propriedades  = [[1, "Data", "date"], [2, "Hora", "time"], [3, "Temperatura", "temperature"]]
const eixoX = ref(2);
const eixoY = ref(3);
const dataInicial = ref()
const labels = ref(setValues(eixoX.value))
const datasets = ref(setValues(eixoY.value))

const chartData = ref({
  labels: labels.value,
  datasets: [
    {
      label: 'Data One',
      backgroundColor: '#f87979',
      data: datasets.value
    }
  ]
})

</script>
