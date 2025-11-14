<template>
    <div class="grid grid-cols-5 grid-rows-[25px_600px] gap-4 h-screen">
        <div class="col-start-2 row-span-2">
            <p class="text-2xl pl-4 pt-10">Sensores</p>
            <ul class="menu bg-base-200 rounded-box w-full">
                <li v-for="g in tables"><a :href="'#' + g.url">{{g.nome}}</a></li>
            </ul>
        </div>

        <div class="col-span-3 col-start-3 row-start-2 p-3">
            <div class="flex gap-4" >
                <p class="text-2xl text-black">Sensor {{currentView.nome}}</p>
                <Calendar :day="day" @input="changeDay"></Calendar>
                <select v-if="!isLoading" class="select w-min" v-model="selectedPlaca" @change="changePlaca()">
                    <option v-for="p in placas" :id="p">{{ p }}</option>
                </select>
            </div>
            <div class="flex " v-if="!isLoading">
                <div class="">
                    <Tabela :table-data="filteredData" :table-columns="currentView.cols" :table-props="currentView.props"></Tabela>
                </div>
            </div>
        </div>

    </div>

</template>

<script setup>
import Tabela from '@/components/Tabela.vue';

import { ref, computed, onMounted} from 'vue'
import Calendar from '@/components/Calendar.vue';
import axios from 'axios'

const isLoading = ref(false)
const selectedPlaca = ref();
const filteredData = ref() ;
const placas = ref()
const date = new Date();
const currentDate = date.getFullYear() + "-" + (date.getMonth() +1) + "-" + ("0" + date.getDate()).slice(-2);
const day = ref(currentDate) //data selecionada no calendário

const tables = [{
    nome: 'Temperatura',
    url: '/table/temperatura',
    cod: 'TEMP',
    cols: ['ID', 'Pin', 'Temperatura', 'Data e hora'],
    props: ['id', 'pin', 'temperatura', 'dataHora']
},
{
    nome: 'Ultrassônico',
    url: '/table/ultrassonico',
    cod: 'ULTRASSONICO',
    cols: ['ID', 'Pin', 'Distância', 'Data e hora'],
    props: ['id', 'pín', 'distancia', 'dataHora']

},
{
    nome: 'Umidade e Temperatura',
    url: '/table/umidtemp',
    cod: 'UMIDADE_TEMPERATURA',
    cols: ['ID', 'Pin', 'Temperatura', 'Umidade', 'Data e hora'],
    props: ['id', 'pín', 'temperatura','umidade', 'dataHora']

},
{
    nome: 'Velocidade',
    url: '/table/encoder',
    cod: 'VELOCIDADE_ENCODER',
    cols: ['ID', 'Pin', 'Contagem', 'Data e hora'],
    props: ['id', 'pín', 'contagem', 'dataHora']

}]

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
   renderData()
})


const currentView = computed(() => {
  return tables.find(obj => obj.url == currentPath.value.slice(1))
})


async function getData(busca){
  
  try{
    const response = await axios.get('http://localhost:3001/api/' + busca)
    return response.data

  } catch (error) {
    console.error(error.message)
  }

}

async function renderData(){
    filteredData.value = await getData('sensores/' + currentView.value.cod + '/' + selectedPlaca.value)
    filteredData.value = filteredData.value.filter(obj => obj.dataHora.slice(0,10) == day.value)
    console.log(filteredData.value)
}

async function changeDay(dia) {
  day.value = dia
  await renderData()
}

async function changePlaca(){
  await renderData()
}

onMounted(async () => {

  placas.value = await getData('placas')
  placas.value = placas.value.map(obj => obj.id)
  selectedPlaca.value = placas.value[0]
  await renderData()

})

</script>