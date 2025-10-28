<template>
<div class="grid grid-cols-6 grid-rows-[25px_700px] gap-4 h-screen">
    <div class="row-span-2">
        <p class="text-2xl pl-4 pt-10">Sensores</p>
        <ul class="menu bg-base-200 rounded-box w-full">
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
            <li><a>Item 3</a></li>
        </ul>
    </div>
    <div class="row-span-3 col-start-5 col-span-2 row-start-1">
        <p class="text-2xl pt-10">Dados</p>
        <div class="overflow-x-auto">
            <table class="table">
                <!-- head -->
                <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Job</th>
                    <th>Favorite Color</th>
                </tr>
                </thead>
                <tbody>
                <!-- row 1 -->
                <tr>
                    <th>1</th>
                    <td>Cy Ganderton</td>
                    <td>Quality Control Specialist</td>
                    <td>Blue</td>
                </tr>
                <!-- row 2 -->
                <tr>
                    <th>2</th>
                    <td>Hart Hagerty</td>
                    <td>Desktop Support Technician</td>
                    <td>Purple</td>
                </tr>
                <!-- row 3 -->
                <tr>
                    <th>3</th>
                    <td>Brice Swyre</td>
                    <td>Tax Accountant</td>
                    <td>Red</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div class="col-span-3 col-start-2 row-start-2">
        <component :is="currentView"/>
    </div>
    <div class="col-start-4 row-start-1 p-10">
        <label class="label">
            <input type="checkbox" class="toggle" />
            Tempo real
        </label>
    </div>
</div>
    
</template>

<script setup>
import { ref, computed } from 'vue'
import TemperatureLineView from './TemperatureLineView.vue'

const graphs = {
  '/temperatura': TemperatureLineView
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return graphs[currentPath.value.slice(1) || '/'] 
})

</script>