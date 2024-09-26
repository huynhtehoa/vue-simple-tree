<template>
  <div>
    <input v-model="filter" />
  </div>
  <table>
    <thead>
      <th
        v-for="col in colDefs"
        :key="col.field"
        @click="() => handleSort(col)"
      >
        {{ col.field }}
      </th>
    </thead>
    <tbody>
      <tr v-for="rowObj in paginatedData" :key="rowObj.id">
        <td v-for="col in colDefs" :key="col.field">{{ col.cellRenderer(rowObj) }}</td>
      </tr>
    </tbody>
  </table>


  <div :style="{ display: 'flex', gap: '2px' }">
    <button
      v-for="(_, i) in Array(Math.ceil(filteredData.length / pagination.pageSize))"
      :key="i"
      @click="$emit('pageChanged', i + 1)"
    >
      {{ i + 1 }}
    </button>
  </div>
  <div>
    <select @change="e => $emit('pageSizeChanged', e.target.value)">
      <option v-for="page in pagination.pageRange" :key="page">{{ page }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type Cell = string | number
interface Pagination {
  pageSize: number,
  page: number,
  pageRange: number[],
}
interface ColDef {
  field: string
  cellRenderer: (...args: any[]) => Cell
  comparator?: (...args: any[]) => number
}
interface Props {
  colDefs: ColDef[],
  data: Record<string, any>[]
  pagination: Pagination
  filter?: string
}

const props = defineProps<Props>()
const emits = defineEmits<{
  pageChanged: [value: number],
  pageSizeChanged: [value: number],
}>()

// filter
const filter = ref(props.filter || '')
const filteredData = computed(() => {
  const data = props.data.slice()
  if (!filter.value) return data;

  return data.filter(d => {
    return Object.values(d).join(' ').toLocaleLowerCase().includes(filter.value.toLocaleLowerCase())
  })
})

// sort
const sortField = ref('')
const sortDir = ref('asc')

function handleSort(col: ColDef) {
  sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  sortField.value = col.field;
}

const sortedData = computed(() => {
  const cloned = filteredData.value.slice()
  const comparator = props.colDefs.find(col => col.field === sortField.value)?.comparator;

  if (typeof comparator !== 'function') {
    return cloned;
  }
  cloned.sort((a, b) => comparator(a, b, sortDir.value))

  return cloned;
})

// pagination
const paginatedData = computed(() => {
  const offset = props.pagination.page * props.pagination.pageSize;
  const data = sortedData.value.slice(offset - props.pagination.pageSize, offset);

  return data;
})

watch(() => filteredData.value.length, (v) => {
  if (props.pagination.page > (Math.ceil(filteredData.value.length / props.pagination.pageSize))) {
    emits('pageChanged', Math.ceil(filteredData.value.length / props.pagination.pageSize))
  }
}, {immediate: true})

</script>