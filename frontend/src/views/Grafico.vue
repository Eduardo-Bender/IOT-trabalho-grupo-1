<template>
<div class="grid grid-cols-8 grid-rows-[25px_600px] gap-4 h-screen">
    <div class="col-start-2 row-span-2">
        <p class="text-2xl pl-4 pt-10">Sensores</p>
        <ul class="menu bg-base-200 rounded-box w-full">
            <li v-for="g in graphs"><a :href="'#' + g.url">{{g.nome}}</a></li>
        </ul>
    </div>

    <div class="col-span-5 col-start-3 row-start-2 p-3">
        <component :is="currentView.view"/>
    </div>

</div>
    
</template>

<script setup>
import { ref, computed } from 'vue'
import TemperatureLineView from './TemperatureLineView.vue'
import UltrasonicInterpolationView from './UltrasonicInterpolationView.vue'
import UmidadeTempMultiAxisView from './UmidadeTempMultiAxisView.vue'

const graphs = [{
    nome: 'Temperatura',
    url: '/temperatura',
    view: TemperatureLineView
},
{
    nome: 'Ultrassônico',
    url: '/ultrassonico',
    view: UltrasonicInterpolationView
},
{
    nome: 'Umidade e Temperatura',
    url: '/umidtemp',
    view: UmidadeTempMultiAxisView
}]

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return graphs.find(obj => obj.url == currentPath.value.slice(1))
})

</script>