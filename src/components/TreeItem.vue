<script setup lang="ts">
import { computed  } from 'vue';
import { useTreeStore } from '@/stores/tree';
import type { Tree } from '@/types';

const props = defineProps<{
  item: Tree,
  depth: number
}>()

const emit = defineEmits<{
  (e: 'addItem', payload: { id: number }): void
}>()

const store = useTreeStore();

const indentation = computed(() => props.depth * 12)

const isFolder = computed(() => props.item.type === 'folder')
const isRoot = computed(() => props.item.type === 'root')
</script>

<template>
  <div v-if="isRoot">
    <b style="margin-right: 12px; font-size: large;">{{ item.label }}</b>
    <button @click="store.toggle(item.id)">{{ item.collapsed ? 'expand' : 'collapse' }}</button>
    <button @click="store.toggleAll">{{ item.collapsed ? 'expand all' : 'collapse all' }}</button>
  </div>
  <div v-else :style="{ marginLeft: indentation + 'px' }">
    <span :style="{ color: item.new ? 'red' : 'black', marginRight: '12px' }">{{ item.label }}</span>
    <button @click="store.remove(item.id)">remove</button>
    <template v-if="isFolder">
      <button @click="emit('addItem', { id: item.id })">add Item</button>
      <button @click="store.toggle(item.id)">{{ item.collapsed ? 'expand' : 'collapse' }}</button>
    </template>
  </div>
</template>