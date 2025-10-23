<template>
  <Bar
    id="barChart"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale} from 'chart.js/auto'

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

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
// export default {
//   name: 'BarChart',
//   components: { Bar },
//   props: {
    
//   }
// }
</script>