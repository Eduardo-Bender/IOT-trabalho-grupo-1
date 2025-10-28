<script setup lang="ts">
import { ref, computed } from 'vue';
import TemperatureLineView from './views/TemperatureLineView.vue';
import Dashboard from './views/Dashboard.vue';

const sensores = [{
  nome: 'Sensor de temperatura',
  grafico: '#/temperatura',
  tabela: '#/table/temperatura'
}]
const routes = {
  '/': Dashboard,
  '/temperatura': TemperatureLineView
}
const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] 
})
</script>

<template>

  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
        </div>
        <ul
          tabindex="-1"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
          <li>
            <a>Gráficos</a>
            <ul class="p-2">
              <li v-for="g in sensores" ><a :href="g.grafico">>{{g.nome}}</a></li>
            </ul>
          </li>
          <li>
            <a>Dados</a>
            <ul class="p-2">
              <li v-for="g in sensores" ><a :href="g.tabela">>{{g.nome}}</a></li>
            </ul>
          </li>
          <li><a>Condigurações</a></li>
        </ul>
      </div>
      <a class="btn btn-ghost text-xl" href="#/">NomeSistema</a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-8">
        <li>
          <details>
            <summary>Gráficos</summary>
            <ul class="p-0">
              <li v-for="g in sensores"><a :href="g.grafico">>{{g.nome}}</a></li>
            </ul>
          </details>
        </li>
        <li>
          <details>
            <summary>Dados</summary>
            <ul class="p-0">
              <li v-for="g in sensores" ><a :href="g.tabela">>{{g.nome}}</a></li>
            </ul>
          </details>
        </li>
        <li><a>Configurações</a></li>
      </ul>
    </div>
    <div class="navbar-end">
      <!-- <a class="btn">Button</a> -->
    </div>
  </div>
  <div>
    <component :is="currentView"/>
  </div>
</template>

<style scoped>
/* header {
  line-height: 1.5;
  max-height: 100vh;
} */

/* .logo {
  display: block;
  margin: 0 auto 2rem;
} */

/* nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
} */

/* nav a.router-link-exact-active {
  color: var(--color-text);
} */

/* nav a.router-link-exact-active:hover {
  background-color: transparent;
} */

/* nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
} */

/* nav a:first-of-type {
  border: 0;
} */

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
