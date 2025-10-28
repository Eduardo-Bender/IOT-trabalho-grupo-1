import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import "cally"
import { provide } from 'vue'
import Dashboard from './views/Dashboard.vue'
import TemperatureLineView from './views/TemperatureLineView.vue'
import Grafico from './views/Grafico.vue'

const app = createApp(App)

const routes = {
  '/': Dashboard,
  '/temperatura': Grafico
}
app.provide('routes', routes)

app.mount('#app')
