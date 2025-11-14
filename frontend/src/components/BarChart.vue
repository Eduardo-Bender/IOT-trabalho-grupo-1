<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  
} from 'chart.js'

import { Bar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels)

const props = defineProps({
  chartData: {
        type: Object,
        required: true
      },
    chartOptions: {
        type: Object,
        default: () => ({})
    }
})
</script>
