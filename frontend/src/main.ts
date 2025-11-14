import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import "cally"
import { provide } from 'vue'
import Dashboard from './views/Dashboard.vue'
import Grafico from './views/Grafico.vue'
import Dados from './views/Dados.vue'

const app = createApp(App)

const routes = {
  '/': Dashboard,
  '/temperatura': Grafico,
  '/ultrassonico': Grafico,
  '/umidtemp': Grafico,
  '/encoder': Grafico,
  '/acegiro': Grafico,
  '/teclado': Grafico,
  '/table/temperatura': Dados,
  '/table/ultrassonico': Dados,
  '/table/umidtemp': Dados,
  '/table/encoder': Dados,
  '/table/acegiro': Dados,
  '/table/teclado': Dados
}
app.provide('routes', routes)

const colors = [
  "#55efc4", "#74b9ff", "#81ecec", "#ffeaa7","#a29bfe",  "#ff7675","#0984e3", "#fd79a8",
  "#00b894","#fab1a0", "#00cec9",  "#6c5ce7", "#fdcb6e", "#e17055", "#d63031", "#e84393"
]

app.provide('colors', colors);

app.mount('#app')
