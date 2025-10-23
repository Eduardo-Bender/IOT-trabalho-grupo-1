<template>
    <Bubble
    id="bubbleChart"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script>
import { Bubble } from 'vue-chartjs'
import { Chart as ChartJS, Tooltip, Legend, PointElement, LinearScale } from 'chart.js'

ChartJS.register(LinearScale, PointElement, Tooltip, Legend)

export default {
  name: 'BubbleChart',
  components: { Bubble },
  props: {
    chartData: {
        type: Object,
        required: true
      },
    chartOptions: {
        type: Object,
        default: () => ({})
    }
  }
}
</script>
