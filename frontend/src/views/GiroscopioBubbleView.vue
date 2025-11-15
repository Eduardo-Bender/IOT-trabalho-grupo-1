<template>
  <div class="flex gap-4" >

    <Calendar :day="day" @input="changeDay" :uniqueId="uniqueID" :popover="uniqueID + 'popover'"></Calendar>
    <select v-if="!isLoading" class="select w-min" v-model="selectedPlaca" @change="changePlaca()">
      <option v-for="p in placas" :id="p">{{ p }}</option>
    </select>
  </div>
  <div class="h-full" v-if="!isLoading">
    <div class="h-full ">

      <BubbleChart  :chart-data="chartData" :chart-options="chartOptions"/>
    </div>
  </div>


</template>

<script setup lang="ts">
import { ref, inject, onMounted, onUnmounted} from "vue";
import BubbleChart from "@/components/BubbleChart.vue";
import Calendar from "@/components/Calendar.vue";

let interval
const colors = inject('colors')
const selectedPlaca = ref();
const filteredData = ref() ;
const placas = ref()
const uniqueID = crypto.randomUUID(); // id unico pra ser usado nos calendários e não dar conflito um com o outro na dashboard
const pins = ref()
const date = new Date();
const currentDate = date.getFullYear() + "-" + (date.getMonth() +1) + "-" + ("0" + date.getDate()).slice(-2);
const day = ref(currentDate) //data selecionada no calendário
const datasets = ref()
const chartData = ref();
const chartOptions  = ref({})
const isLoading = ref(true)

async function renderData(){
  isLoading.value = true
  
  filteredData.value  = await getData('sensores/ACELEROMETRO_GIROSCOPIO/' + selectedPlaca.value)
  filteredData.value = filteredData.value.filter(obj => obj.dataHora.slice(0,10) == day.value)

  pins.value = Array.from(new Set(filteredData.value.map(obj => obj.pin)))


  datasets.value = setDatasets()
  chartData.value = setData()
    console.log(chartData.value)
  isLoading.value = false

  chartOptions.value = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x:{

              ticks:{
                display: window.location.hash.includes('acegiro') ? true : false
              },
            }

          },
          plugins: {
                datalabels: {
                  anchor: 'end', // Position the label at the end of the bar
                  align: 'end',  // Align the label to the end of the bar
                  formatter: (value, context) => {
                    return value.r
                  },
                  color: 'black', // Set label color
                  font: {
                    weight: 'bold' // Set font weight
                  }
                }
              }
          }

}

 // função que cria o array de objetos, aplicando os filtros
function setArrays(){
  let array = []

  for( const i of pins.value){
    let list = (filteredData.value.filter(obj => obj.pin === i)).filter(obj => obj.dataHora.slice(0,10) == day.value)
    list.length > 0 ? array.push(list[0]) : {}
    }
  return array

}

// função que configura os datasets
function setDatasets(){
  let array = setArrays();
  let ret = [];
  let i = 4;
  if(array.length > 0){
    // if(array[0].length > 0){
        // um dataset por pin do sensor
        for(const a of array){
          ret.push(
            {
              type: 'bubble',
              label: a.pin,
              backgroundColor: colors[i],
              borderColor: colors[i],
              data:[{
                x: a.giro_x,
                y: a.giro_y,
                r: a.giro_z
              }],
              xAxisID: 'x'
            },
            
          )
          if(i == colors.length){
            i = 0;
          }
          else{
            i++;
          }
        }

  }
  else{
    ret.push({})
  }
  return ret
}

function setData(){

  return {         
          datasets: datasets.value
        }
}

async function changeDay(dia) {
  day.value = dia
  await renderData()
}

async function changePlaca(){
  await renderData()
}
import axios from 'axios';

async function getData(busca:string){
  
  try{
    const response = await axios.get('http://localhost:3001/api/' + busca)
    return response.data

  } catch (error) {
    console.error(error.message)
  }

}


onMounted(async () => {

  placas.value = await getData('placas')
  placas.value = placas.value.map(obj => obj.id)
  selectedPlaca.value = placas.value[0]
  await renderData()
  
    interval = await setInterval(async () => {
    filteredData.value  = await getData('sensores/ACELEROMETRO_GIROSCOPIO/' + selectedPlaca.value)
    datasets.value = setDatasets()
    chartData.value = setData()

    }, 1000)
  

  
})

onUnmounted(()=> {
  console.log(interval)
  clearInterval(interval)})
</script>
