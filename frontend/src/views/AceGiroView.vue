<script setup lang="ts">
import AcelerometroBubbleView from './AcelerometroBubbleView.vue';
import GiroscopioBubbleView from './GiroscopioBubbleView.vue';
import TemperaturaMPUView from './TemperaturaMPUView.vue';

</script>

<template>
  <div class="h-100">
    <p class="text-2xl text-black">Acelerômetro e Giroscópio</p>
    <AcelerometroBubbleView/>
    <GiroscopioBubbleView/>
    <TemperaturaMPUView/>
  </div>


</template>