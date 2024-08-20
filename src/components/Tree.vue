<script lang="ts">
import type { InjectionKey } from 'vue'

interface Inject {
  open: (id: number) => void
}

export const navTreeInjectionKey = Symbol('NavTree') as InjectionKey<Inject>
</script>

<script setup lang="ts">
import { nextTick, provide, ref, type Ref } from 'vue';
import TreeContainer from './TreeContainer.vue';
import { useTreeStore } from '@/stores/tree';

const store = useTreeStore()
const openInput = ref(false)
const label = ref('')
const currentAdding: Ref<number | null> = ref(null);
const inputEl: Ref<HTMLElement | null> = ref(null)

provide(navTreeInjectionKey, {
  open
})

function open(id: number) {
  currentAdding.value = id
  openInput.value = true
  nextTick(() => {
    inputEl.value?.focus()
  })
}

function add() {
  const node = store.add(currentAdding.value!, 'file', label.value)
  if (!node) return;

  node.new = true;

  setTimeout(() => {
    node.new = false
  }, 3000)

  openInput.value = false;
  currentAdding.value = null;
  label.value = '';
}

</script>

<template>
  <div class="nav-tree">
    <button @click="store.reset" style="margin-bottom: 50px;">Reset to inital state</button>
    <div v-show="openInput" style="margin-bottom: 50px;" @keyup.enter="add">
      <input ref="inputEl" v-model="label" type="text" />
      <button @click="add">add</button>
    </div>
    <div>
      <TreeContainer :tree="store.tree" />
    </div>
  </div>
</template>