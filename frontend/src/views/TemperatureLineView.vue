<template>
  <div class="flex gap-4">
    <p class="text-2xl text-black">Sensor de Temperatura</p>
    <Calendar :day="day" @input="changeDay" :uniqueId="uniqueID" :popover="uniqueID + 'popover'"></Calendar>
    <select class="select w-min" v-model="selectedPlaca" @change="reload()">
      <option v-for="p in placas" :id="p">{{ p }}</option>
    </select>
  </div>
  <div class="h-full">
    <div class="h-full ">
      <LineChart :chart-data="chartData" :chart-options="chartOptions"/>
    </div>
  </div>


</template>

<script setup lang="ts">
import { ref, inject} from "vue";
import LineChart from "@/components/LineChart.vue";
import Calendar from "@/components/Calendar.vue";

const placas = ['placa1', 'placa2']
const colors = inject('colors')
const selectedPlaca = ref(placas[0]);

interface Dados {
  id: number,
  data: string;
  hora: string;
  temperatura: number;
}
const jsonString = '{"data":[{"id":1,"date":"2025-11-10", "time":"12:20:59", "temperature":"79.11", "placa": "placa2"},{"id":1,"date":"2025-11-10", "time":"12:20:60", "temperature":"78.23", "placa": "placa1"},{"id":1,"date":"2025-11-10", "time":"12:21:0", "temperature":"78.23", "placa": "placa1"},{"id":1,"date":"2025-11-10", "time":"12:21:1", "temperature":"79.11", "placa": "placa1"},{"id":1,"date":"2025-11-10", "time":"12:21:2", "temperature":"78.23", "placa": "placa1"},{"id":1,"date":"2025-11-10", "time":"12:21:3", "temperature":"78.23", "placa": "placa1"},{"id":1,"date":"2025-11-10", "time":"12:21:4", "temperature":"79.11", "placa": "placa1"},{"id":2,"date":"2025-11-10", "time":"12:20:59", "temperature":"79.11", "placa": "placa1"},{"id":2,"date":"2025-11-10", "time":"12:20:60", "temperature":"78.23", "placa": "placa2"},{"id":2,"date":"2025-11-10", "time":"12:21:0", "temperature":"78.23", "placa": "placa1"},{"id":2,"date":"2025-11-10", "time":"12:21:1", "temperature":"79.11", "placa": "placa1"},{"id":2,"date":"2025-11-10", "time":"12:21:2", "temperature":"78.23", "placa": "placa1"},{"id":2,"date":"2025-11-10", "time":"12:21:3", "temperature":"78.23", "placa": "placa1"},{"id":2,"date":"2025-11-10", "time":"12:21:4", "temperature":"79.11", "placa":"placa1"}]}';

const rawData:Dados = JSON.parse(jsonString).data;
let filteredData:Dados = rawData
// função pra criar um array com algum dos parametros
function setValues(prop:string){
  return filteredData.map(obj => obj[prop])
}
 // função que cria o array de objetos, aplicando os filtros
function setArrays(){
  let array = []

  for( const i of ids.value){
    array.push(((rawData.filter(obj => obj.id === i)).filter(obj => obj.date == day.value)).filter(obj=>obj.placa == selectedPlaca.value))
  }
  return array

}

// função que configura os datasets
function setDatasets(){
  let array = setArrays();
  console.log(array)
  let ret = [];
  let i = 0;
  if(array.length > 0){
    if(array[0].length > 0){
        // um dataset por id do sensor
        for(const a of array){
          ret.push(
            {
              label: a[0].id,
              backgroundColor: colors[i],
              borderColor: colors[i],
              data: a.map(obj => obj.temperature)
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


const date = new Date();
const currentDate = date.getFullYear() + "-" + (date.getMonth() +1) + "-" + ("0" + date.getDate()).slice(-2);
const uniqueID = crypto.randomUUID(); // id unico pra ser usado nos calendários e não dar conflito um com o outro na dashboard
const ids = ref(new Set(setValues("id")))
const day = ref(currentDate) //data selecionada no calendário
const labels = ref(Array.from(new Set(setValues("time")))) //array de horários
const temps = ref(setValues("temperature"))
const datasets = ref(setDatasets())
const chartData = ref(setData());

function reload(){
  filteredData = (rawData.filter(obj => obj.date == day.value)).filter(obj=>obj.placa == selectedPlaca.value)
  ids.value = (new Set(setValues("id")))
  labels.value = (Array.from(new Set(setValues("time"))))
  temps.value = (setValues("temperature"))
  datasets.value = setDatasets();
  chartData.value = setData();
}
function changeDay(dia) { //atualiza os datasets quando muda o dia
  day.value = dia
  reload();
}

reload();

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
