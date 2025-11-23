<template>
    <div class="grid grid-cols-5 grid-rows-[25px_600px] gap-4 h-screen">
        <div class="col-start-1 row-span-2">
            <p class="text-2xl pl-4 pt-10">Sensores</p>
            <ul class="menu bg-base-200 rounded-box w-full">
                <li v-for="g in tables"><a :href="'#' + g.url">{{g.nome}}</a></li>
            </ul>
        </div>

        <div class="col-span-3 col-start-2 row-start-2 p-3">
            <div class="flex gap-4" >
                <p class="text-2xl text-black">Sensor {{currentView.nome}}</p>
                <Calendar :day="day" @input="changeDay"></Calendar>
                <select v-if="!isLoading" class="select w-min" v-model="selectedPlaca" @change="changePlaca()">
                    <option v-for="p in placas" :id="p">{{ p }}</option>
                </select>
                <button class="btn btn-md" @click="exportCSV">Baixar CSV</button>

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
    props: ['id', 'pin', 'distancia', 'dataHora']

},
{
    nome: 'Umidade e Temperatura',
    url: '/table/umidtemp',
    cod: 'UMIDADE_TEMPERATURA',
    cols: ['ID', 'Pin', 'Temperatura', 'Umidade', 'Data e hora'],
    props: ['id', 'pin', 'temperatura','umidade', 'dataHora']

},
{
    nome: 'Velocidade',
    url: '/table/encoder',
    cod: 'VELOCIDADE_ENCODER',
    cols: ['ID', 'Pin', 'Contagem', 'Data e hora'],
    props: ['id', 'pin', 'contagem', 'dataHora']

},
{
    nome: 'Acelerômetro e Giroscópio',
    url: '/table/acegiro',
    cod: 'ACELEROMETRO_GIROSCOPIO',
    cols: ['ID', 'Pin', 'X (A)', 'Y (A)', 'Z (A)', 'X (G)', 'Y (G)', 'Z (G)', 'Temperatura', 'Data e hora'],
    props: ['id', 'pin', 'acel_x', 'acel_y', 'acel_z', 'giro_x', 'giro_y', 'giro_z', 'temperatura_mpu', 'dataHora']

},
{
    nome: 'Teclado',
    url: '/table/teclado',
    cod: 'TECLADO',
    cols: ['ID', 'Pin', 'Tecla', 'Data e hora'],
    props: ['id', 'pin', 'tecla', 'dataHora']

},
{
    nome: 'Infravermelho',
    url: '/table/infravermelho',
    cod:'IR',
    cols: ['ID', 'Pin', 'Codigo', 'Data e hora'],
    props: ['id', 'pin', 'codigo', 'dataHora']
},
{
    nome: 'Joystick',
    url: '/table/joystick',
    cod:'MODULO_JOYSTICK',
    cols: ['ID', 'Pin', 'Eixo X', 'Eixo Y', 'Clique', 'Data e hora'],
    props: ['id', 'pin', 'eixo_x', 'eixo_y', 'clique', 'dataHora']
},
{
    nome: 'Gestos e Cor',
    url: '/table/gestoscor',
    cod:'GESTOS_COR',
    cols: ['ID', 'Pin', 'Gesto', 'R', 'G', 'B', 'Data e hora'],
    props: ['id', 'pin', 'gesto', 'cor_r', 'cor_g', 'cor_b', 'dataHora']
}]

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
   renderData()
})

function exportCSV(){
    const headers = Object.keys(filteredData.value[0]).join(',');
    const rows = filteredData.value.map(item => Object.values(item).join(',')).join('\n')
    const csvContent = `${headers}\n${rows}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'my_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

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

// function getRandomInt() {
//   return Math.floor(Math.random() * (50 - 5 + 1)) + 5
// }
// function salvar(){
//     let temp = getRandomInt()
//     let temp1 = getRandomInt()
//     let umidade = getRandomInt()
//     let acel_x = getRandomInt()
//     let acel_y = getRandomInt()
//     let acel_z = getRandomInt()
//     let giro_x = getRandomInt()
//     let giro_y = getRandomInt()
//     let giro_z = getRandomInt()
//     let temp_mpu = getRandomInt()
//     let velocidade = getRandomInt()
//     let distancia = getRandomInt()

//     // const savejson = { "esp_id": "AA:BB:CC:DD:EE:GG", "sensors": [
//     //     {"type": "TEMP", "value": temp, "pin": 27},
//     //     {"type": "UMIDADE_TEMPERATURA", "value": {"temperatura": temp1, "umidade":umidade}, "pin": 20},
//     //     {"type": "ULTRASSONICO", "value": distancia, "pin": 10},
//     //     {"type": "VELOCIDADE_ENCODER", "value": velocidade, "pin": 4},
//     //     {"type": "ACELEROMETRO_GIROSCOPIO", "value":{"acel_x": acel_x, "acel_y": acel_y, "acel_z": acel_z, "giro_x": giro_x, "giro_y": giro_y, "giro_z": giro_z, "temperatura_mpu": temp_mpu}, "pin":19}
//     // ]}

//     const savejson = { "esp_id": "AA:BB:CC:DD:EE:GG", "sensors":[
//         {"type": "TECLADO", "value":"a", "pin":2}
//     ]}

//     axios.post('http://localhost:3001/api/dados', savejson)
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });

// }
// salvar()
</script>