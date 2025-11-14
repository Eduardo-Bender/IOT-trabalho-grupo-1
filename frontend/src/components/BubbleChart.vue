<template>
  <Bubble :data="chartData" :options="chartOptions" />
</template>

<script setup>
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  PointElement,
  LinearScale,
  LineElement,
    CategoryScale,

} from 'chart.js'
import { Bubble } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels';


ChartJS.register(
  Tooltip,
  Legend,
  PointElement,
  LinearScale,
  LineElement,
  // ChartDataLabels,
  CategoryScale,
)

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
