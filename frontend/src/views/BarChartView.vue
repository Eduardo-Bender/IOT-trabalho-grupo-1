<template>
  <BarChart :chart-data="chartData" :chart-options="chartOptions"/>
</template>

<script>
import BarChart from '../components/BarChart.vue'
  const dados = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

  console.log(dados.map(obj => obj.year))
export default {
  name: 'App',
  components: { BarChart },
  data(){
    return {
      chartData: {
        labels: dados.map(obj => obj.year),
        datasets: [{
          label:"amount by year",
          data: dados.map(obj => obj.count)
        }],
      },
      chartOptions: {
        responsive: true
      }
    }
  }
}
</script>
