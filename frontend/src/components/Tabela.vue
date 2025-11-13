<template>
        <div class="overflow-x-auto">
            <table class="table w-min">
                <!-- head -->
                <thead>
                <tr>
                    <th v-for="col in tableColumns"> {{ col }}</th>
                </tr>
                </thead>
                <tbody>
                <!-- row 1 -->
                <tr v-for="row in tableData">
                    <td v-for="i in tableProps">{{ row[i] }}</td>
                </tr>

                </tbody>
            </table>
        </div>

</template>

<script setup>


const props = defineProps({
  tableData: {
        type: Object,
        // required: true
      },
    tableColumns: {
        type: Object,
        default: () => ([])
    },
    tableProps:{
        type: Array,
        default: () => ([])
    }
})
</script>