<script setup lang="ts">
import { ref, computed, inject } from 'vue';

const sensores = [{
  nome: 'Sensor de temperatura',
  grafico: '#/temperatura',
  tabela: '#/table/temperatura'
},
{
  nome: 'Sensor Ultrassônico',
  grafico: '#/ultrassonico',
  tabela: '#/table/ultrassonico'
},
{
  nome: 'Sensor de Umidade e Temperatura',
  grafico: '#/umidtemp',
  tabela: '#/table/umidtemp'
},
{
  nome: 'Sensor de Velocidade',
  grafico: '#/encoder',
  tabela: '#/table/encoder'
},
{
  nome: 'Acelerômetro e Giroscópio',
  grafico: '#/acegiro',
  tabela: '#/table/acegiro'
},
{
  nome: 'Teclado',
  grafico: null,
  tabela: '#/table/teclado'
}]

const routes = inject('routes')

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] 
})
</script>

<template>

  <div class="navbar bg-base-100 shadow-sm z-4">
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
              <li v-for="g in sensores"  class="z-4"><a v-if="g.grafico" :href="g.grafico">>{{g.nome}}</a></li>
            </ul>
          </li>
          <li>
            <a>Dados</a>
            <ul class="p-2">
              <li v-for="g in sensores" class="z-4"><a :href="g.tabela">>{{g.nome}}</a></li>
            </ul>
          </li>
        </ul>
      </div>
      <a class="btn btn-ghost text-xl" href="#/">Dashboard
      </a>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-8">
        <li>
          <details>
            <summary>Gráficos</summary>
            <ul class="p-0">
              <li v-for="g in sensores" class="z-4"><a v-if="g.grafico" :href="g.grafico">>{{g.nome}}</a></li>
            </ul>
          </details>
        </li>
        <li>
          <details>
            <summary>Dados</summary>
            <ul class="p-0">
              <li v-for="g in sensores" class="z-4"><a :href="g.tabela">>{{g.nome}}</a></li>
            </ul>
          </details>
        </li>
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