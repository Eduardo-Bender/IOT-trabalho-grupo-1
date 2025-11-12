<template>
  <div class="flex gap-4" >
    <p class="text-2xl text-black">Sensor de Temperatura</p>
    <Calendar :day="day" @input="changeDay" :uniqueId="uniqueID" :popover="uniqueID + 'popover'"></Calendar>
    <select v-if="!isLoading" class="select w-min" v-model="selectedPlaca" @change="changePlaca()">
      <option v-for="p in placas" :id="p">{{ p }}</option>
    </select>
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

const colors = inject('colors')
const selectedPlaca = ref();
const filteredData = ref() ;
const placas = ref()
const uniqueID = crypto.randomUUID(); // id unico pra ser usado nos calendários e não dar conflito um com o outro na dashboard
const pins = ref()
const date = new Date();
const currentDate = date.getFullYear() + "-" + (date.getMonth() +1) + "-" + ("0" + date.getDate()).slice(-2);
const day = ref(currentDate) //data selecionada no calendário
const labels = ref() //array de horários
const yValue = ref()
const datasets = ref()
const chartData = ref();
const chartOptions  = ref({})
const isLoading = ref(true)

async function renderData(){
  isLoading.value = true
  
  filteredData.value  = await getData('sensores/TEMP/' + selectedPlaca.value)

  pins.value = Array.from(new Set(filteredData.value.map(obj => obj.pin)))

  yValue.value = filteredData.value.map(obj => obj.temperatura)

  labels.value = Array.from(new Set(filteredData.value.map(obj => obj.dataHora.slice(11,19)))) //array de horários

  datasets.value = setDatasets()
  chartData.value = setData()

  isLoading.value = false
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
  let i = 0;
  if(array.length > 0){
    if(array[0].length > 0){
        // um dataset por pin do sensor
        for(const a of array){
          ret.push(
            {
              label: a[0].pin,
              backgroundColor: colors[i],
              borderColor: colors[i],
              data: a.map(obj => obj.temperatura)
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
  return {  labels: labels.value,
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
// const savejson = { "esp_id": 10, "sensors": [{"type": "TEMP", "value": 15.000000}, {"type": "TEMP_UMID", "value": [26.000000, 50.000000]}, {"type": "PASSWORD", "value": "1234"}]}

// function salvar(){

// axios.post('http://localhost:3001/api/dados', savejson)
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
// }

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

  chartOptions.value = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y:{
              min: Math.min(...yValue.value) - 1,
              max: Math.max(...yValue.value) + 1
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

})
</script>
