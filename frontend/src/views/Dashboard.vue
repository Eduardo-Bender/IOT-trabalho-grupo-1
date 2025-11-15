<template>

<div class="grid grid-cols-6 grid-rows-6 gap-10 p-10 content-center flex h-230">
    <div class="col-span-2 row-span-3 p-4 outline-2 outline-zinc-300">
        <div class="pb-3">
        <select class="select z-2" v-model="g1">
            <option v-for="s in sensores" :id="s.nome" :value="s.id">{{s.nome}}</option>
            </select>
        </div>
        <div class="h-65">
            <component :is="sensores.filter(obj => obj.id == g1)[0].grafico"/>
        </div>


    </div>
    <div class="col-span-2 row-span-3 col-start-3 p-4 outline-2 outline-zinc-300">
        <div class="pb-3">
        <select class="select z-2" v-model="g2">
            <option v-for="s in sensores" :id="s.nome" :value="s.id">{{s.nome}}</option>
            </select>
        </div>
        <div class="h-65">
            <component :is="sensores.filter(obj => obj.id == g2)[0].grafico"/>
        </div>

    </div>
    <div class="col-span-2 row-span-3 col-start-1 row-start-4 p-4 outline-2 outline-zinc-300">
        <div class="pb-3">
        <select class="select" v-model="g3">
            <option v-for="s in sensores" :id="s.nome" :value="s.id">{{s.nome}}</option>
            </select>
        </div>
        <div class="h-65">
            <component :is="sensores.filter(obj => obj.id == g3)[0].grafico"/>
        </div>
    </div>
    <div class="col-span-2 row-span-3 col-start-3 row-start-4 p-4 outline-2 outline-zinc-300">
        <div class="pb-3">
        <select class="select" v-model="g4">
            <option v-for="s in sensores" :id="s.nome" :value="s.id">{{s.nome}}</option>
            </select>
        </div>
        <div class="h-65">
            <component :is="sensores.filter(obj => obj.id == g4)[0].grafico"/>
        </div>
    </div>
    <div class="col-span-2 row-span-3 col-start-5 p-4 outline-2 outline-zinc-300">
        <div class="pb-3">
        <select class="select" v-model="g5">
            <option v-for="s in sensores" :id="s.nome" :value="s.id">{{s.nome}}</option>
            </select>
        </div>
        <div class="h-65">
            <component :is="sensores.filter(obj => obj.id == g5)[0].grafico"/>
        </div>
    </div>
    <div class="col-span-2 row-span-3 col-start-5 p-4 outline-2 outline-zinc-300">
        <div class="pb-3">
        <select class="select" v-model="g6">
            <option v-for="s in sensores" :id="s.nome" :value="s.id">{{s.nome}}</option>
            </select>
        </div>
        <div class="h-65">
            <component :is="sensores.filter(obj => obj.id == g6)[0].grafico"/>
        </div>
    </div>
</div>
    
</template>

<script setup>
import {ref} from 'vue';
import TemperatureLineView from './TemperatureLineView.vue';
import UltrasonicInterpolationView from './UltrasonicInterpolationView.vue';
import UmidadeTempMultiAxisView from './UmidadeTempMultiAxisView.vue';
import EncoderBarView from './EncoderBarView.vue';
import AcelerometroBubbleView from './AcelerometroBubbleView.vue';
import GiroscopioBubbleView from './GiroscopioBubbleView.vue';

const sensores = [{
  nome: 'Temperatura',
  grafico: TemperatureLineView,
  id: 1
},
{
  nome: 'Ultrasônico',
  grafico: UltrasonicInterpolationView,
  id: 2
},
{
    nome: 'Temperatura e Umidade',
    grafico: UmidadeTempMultiAxisView,
    id: 3
},
{
    nome: 'Velocidade',
    grafico: EncoderBarView,
    id: 4
},
{
    nome: 'Acelerômetro',
    grafico: AcelerometroBubbleView,
    id:5
},
{
    nome: 'Giroscópio',
    grafico: GiroscopioBubbleView,
    id: 6
}]

const g1 = ref(1);
const g2 = ref(2);
const g3 = ref(4);
const g4 = ref(5);
const g5 = ref(3);
const g6 = ref(6);
</script>