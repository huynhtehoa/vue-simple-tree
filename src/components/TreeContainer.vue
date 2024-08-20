<script setup lang="ts">
import type { Tree } from '@/types';
import TreeItem from './TreeItem.vue';
import { inject } from 'vue';
import { navTreeInjectionKey } from './Tree.vue';

withDefaults(defineProps<{
  tree: Tree,
  depth?: number,
}>(), {
  depth: 0
})

const emit = defineEmits<{
  (e: 'addItem', payload: { id: number }): void;
}>()

const injected = inject(navTreeInjectionKey)

</script>
<template>
  <div class="tree-container">
    <TreeItem :item="tree" :depth="depth" :key="tree.id" @add-item="payload => injected?.open(payload.id)" />
    <div v-if="tree.children && !tree.collapsed">
      <div v-for="node in tree.children">
        <TreeContainer :tree="node" :depth="depth + 1" />
      </div>
    </div>
  </div>
</template>