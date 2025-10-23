<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HomeView from './views/HomeView.vue';
import { ref, onMounted } from 'vue'
import * as chartConfig from './chartConfig.js'
import ChartData from 'chart.js/auto'
import BarChartView from './views/BarChartView.vue';

interface Dados {
  data: string;
  hora: string;
  temperatura: number;
}

const jsonString = '{"data":[{"date":"2015/7/21", "time":"12:20:59", "temperature":"79.11"},{"date":"2015/7/21", "time":"12:20:59", "temperature":"78.23"},{"date":"2015/7/21", "time":"12:21:0", "temperature":"78.23"},{"date":"2015/7/21", "time":"12:21:1", "temperature":"79.11"},{"date":"2015/7/21", "time":"12:21:2", "temperature":"78.23"},{"date":"2015/7/21", "time":"12:21:3", "temperature":"78.23"},{"date":"2015/7/21", "time":"12:21:4", "temperature":"79.11"}]}'


const data:Dados = JSON.parse(jsonString).data;

const options = chartConfig.options


</script>

<template>
  <BarChartView :chart-data="data" :chart-options="options" />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
