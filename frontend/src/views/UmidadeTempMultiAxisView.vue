<template>
  <div class="flex gap-4" >
    <p class="text-2xl text-black" v-if="exibirNome">Sensor de Umidade e Temperatura</p>
    <Calendar :day="day" @input="changeDay" :uniqueId="uniqueID" :popover="uniqueID + 'popover'"></Calendar>
    <select v-if="!isLoading" class="select w-min" v-model="selectedPlaca" @change="changePlaca()">
      <option v-for="p in placas" :id="p">{{ p }}</option>
    </select>
  </div>
      <label class="label">
      <input type="checkbox" class="toggle" v-model="isRealTime" @change="realTime"/>
      Tempo real
  </label>
  <div v-if="isAlerta" role="alert" class="alert alert-warning">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
  <span>Alerta: Temperatura acima do limite!</span>
</div>
  <div class="h-full" v-if="!isLoading">
    <div class="h-full ">

      <LineChart  :chart-data="chartData" :chart-options="chartOptions"/>
    </div>
  </div>


</template>

<script setup lang="ts">
import { ref, inject, onMounted} from "vue";
import LineChart from "@/components/LineChart.vue";
import Calendar from "@/components/Calendar.vue";

const isAlerta = ref(false)
let interval
const isRealTime = ref(false)
const exibirNome = window.location.hash.includes('umidtemp') ? true : false
const colors = inject('colors')
const selectedPlaca = ref();
const filteredData = ref() ;
const placas = ref()
const uniqueID = crypto.randomUUID(); // id unico pra ser usado nos calendários e não dar conflito um com o outro na dashboard
const pins = ref()
const date = new Date();
const currentDate = date.getFullYear() + "-" + (date.getMonth() +1) + "-" + ("0" + date.getDate()).slice(-2);
const day = ref(currentDate) //data selecionada no calendário
const yValue = ref()
const y1Value = ref()
const datasets = ref()
const chartData = ref();
const chartOptions  = ref({})
const isLoading = ref(true)

function realTime(){
  if(isRealTime.value){
    interval = setInterval(async () => {
    filteredData.value  = await getData('sensores/UMIDADE_TEMPERATURA/' + selectedPlaca.value)
    yValue.value = filteredData.value.map(obj => obj.temperatura)
    y1Value.value = filteredData.value.map(obj => obj.umidade)
    datasets.value = setDatasets()
    chartData.value = setData()
    setChartOptions()

    }, 1000);
  }
  else{
    clearInterval(interval)
  }
}

function setChartOptions(){
chartOptions.value = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x:{
              ticks:{
                display: window.location.hash.includes('umidtemp') ? true : false
              }
            },
            temperaturaAxis:{
              min: Math.min(...yValue.value) - 1,
              max: Math.max(...yValue.value) + 1,
              display: true,
              position:'left',
              type: 'linear'
            },
            umidadeAxis:{
              max: Math.max(...y1Value.value) + 5,
              position:'right',
              type: 'linear',
              display: true,
              grid:{
                drawOnChartArea: false
              }
            }
          },
          // plugins:{
          //   datalabels:{
          //     display: function(context) {
          //       console.log(context);
          //             const totalPoints = context.dataset.data.length;
          //             const maxLabels = 5; // Maximum labels to show per dataset

          //             // Calculate spacing to evenly distribute labels
          //             const spacing = Math.floor(totalPoints / maxLabels);

          //             // Show label if it's at the calculated intervals
          //             return context.dataIndex % spacing === 0 ||
          //                   context.dataIndex === totalPoints - 1;
          //                 }
          //   }
          // }
          plugins: {
                datalabels: {
                    display: function(context) {
                      const totalPoints = context.dataset.data.length;
                      const maxLabels = 5; // Maximum labels to show per dataset

                      // Calculate spacing to evenly distribute labels
                      const spacing = Math.floor(totalPoints / maxLabels);

                      // Show label if it's at the calculated intervals
                      return context.dataIndex % spacing === 0 ||
                            context.dataIndex === totalPoints - 1;
                          },
                  anchor: 'end', // Position the label at the end of the bar
                  align: 'end',  // Align the label to the end of the bar
                  formatter: (value, context) => {
                    // Customize the label text here
                    if(context.dataset.label.includes('Temperatura'))
                        return value.temperatura; // Displays the raw data value
                    return value.umidade
                  },
                  color: 'black', // Set label color
                  font: {
                    weight: 'bold' // Set font weight
                  }
                }
              }
          }
}

async function renderData(){
  isLoading.value = true
  
  filteredData.value  = await getData('sensores/UMIDADE_TEMPERATURA/' + selectedPlaca.value)
  filteredData.value = filteredData.value.filter(obj => obj.dataHora.slice(0,10) == day.value)

  pins.value = Array.from(new Set(filteredData.value.map(obj => obj.pin)))

  yValue.value = filteredData.value.map(obj => obj.temperatura)
  y1Value.value = filteredData.value.map(obj => obj.umidade)

  datasets.value = setDatasets()
  chartData.value = setData()

  isLoading.value = false

  setChartOptions()

}

 // função que cria o array de objetos, aplicando os filtros
function setArrays(){
  let array = []

  for( const i of pins.value){
    array.push((filteredData.value.filter(obj => obj.pin === i)).filter(obj => obj.dataHora.slice(0,10) == day.value))

    }
  return array

}

// função que configura os datasets
function setDatasets(){
  let array = setArrays();
  let ret = [];
  let i = 2;
  if(array.length > 0){
    if(array[0].length > 0){
        // um dataset por pin do sensor
        for(const a of array){
          ret.push(
            {
              label: a[0].pin + " - Temperatura",
              backgroundColor: colors[i],
              borderColor: colors[i],
              data: a,
              parsing: {
                xAxisKey: 'dataHora',
                yAxisKey: 'temperatura'
              },
              yAxisID: 'temperaturaAxis'
            },
            {
              label: a[0].pin + " - Umidade",
              backgroundColor: colors[i] + '80',
              borderColor: colors[i],
              borderDash: [5, 5],
              data: a,
              parsing:{
                xAxisKey: 'dataHora',
                yAxisKey: 'umidade'
              },
              yAxisID: 'umidadeAxis'
            }
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
  }
  else{
    ret.push({})
  }
 

  return ret
}

function setData(){
  return {           datasets: datasets.value
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

const MAX_TEMP = inject('MAX_TEMP')
async function getData(busca:string){
  
  try{
    const response = await axios.get('http://localhost:3001/api/' + busca)
    console.log(response.data[0].temperatura)
    if(response.data[0].temperatura > MAX_TEMP){
      isAlerta.value = true
      sendAlert()
    }
    else if(isAlerta){
      isAlerta.value = false
    }
    return response.data

  } catch (error) {
    console.error(error.message)
  }

}

function sendAlert(){

}


onMounted(async () => {

  placas.value = await getData('placas')
  placas.value = placas.value.map(obj => obj.id)
  selectedPlaca.value = placas.value[0]
  await renderData()
  
})
</script>
