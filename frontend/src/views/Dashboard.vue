<template>

<div class="grid grid-cols-6 grid-rows-6 gap-10 p-10 content-center flex h-230">
    <div class="col-span-2 row-span-3 p-4 outline-2 outline-zinc-300">
        <div class="pb-3">
        <select class="select">
            <option disabled selected>Temperatura</option>
            <option>Crimson</option>
            <option>Amber</option>
            <option>Velvet</option>
            </select>
        </div>
        <div class="h-70">
            <component :is="TemperatureLineView"/>
        </div>


    </div>
    <div class="col-span-2 row-span-3 col-start-3 p-4 outline-2 outline-zinc-300">
        <div class="pb-3">
            <select class="select">
                <option disabled selected>Temperatura</option>
                <option>Crimson</option>
                <option>Amber</option>
                <option>Velvet</option>
            </select>
        </div>
        <div class="h-70">
            <component :is="TemperatureLineView"/>
        </div>

    </div>
    <div class="col-span-2 row-span-3 col-start-1 row-start-4 p-4 outline-2 outline-zinc-300">
                <div class="pb-3">
            <select class="select">
                <option disabled selected>Temperatura</option>
                <option>Crimson</option>
                <option>Amber</option>
                <option>Velvet</option>
            </select>
        </div>
        <div class="h-70">
            <component :is="TemperatureLineView"/>
        </div>
    </div>
    <div class="col-span-2 row-span-3 col-start-3 row-start-4 p-4 outline-2 outline-zinc-300">
                <div class="pb-3">
            <select class="select">
                <option disabled selected>Temperatura</option>
                <option>Crimson</option>
                <option>Amber</option>
                <option>Velvet</option>
            </select>
        </div>
        <div class="h-70">
            <component :is="TemperatureLineView"/>
        </div>
    </div>
    <div class="col-span-2 row-span-3 col-start-5 p-4 outline-2 outline-zinc-300">
                <div class="pb-3">
            <select class="select">
                <option disabled selected>Temperatura</option>
                <option>Crimson</option>
                <option>Amber</option>
                <option>Velvet</option>
            </select>
        </div>
        <div class="h-70">
            <component :is="TemperatureLineView"/>
        </div>
    </div>
    <div class="col-span-2 row-span-3 col-start-5 p-4 outline-2 outline-zinc-300">
                <div class="pb-3">
            <select class="select">
                <option disabled selected>Temperatura</option>
                <option>Crimson</option>
                <option>Amber</option>
                <option>Velvet</option>
            </select>
        </div>
        <div class="h-70">
            <component :is="TemperatureLineView"/>
        </div>
    </div>
</div>
    
</template>

<script setup>
import TemperatureLineView from './TemperatureLineView.vue';
</script>