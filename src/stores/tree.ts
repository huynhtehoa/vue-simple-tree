import useLocalStorage from '@/composables/useLocalStorage';
import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';
import { deepClone } from '@/utils/deepClone';
import type { Tree, ItemType } from '@/types';

/* GLOBAL */
let id = 0;

const INIT_TREE: Tree = {
  id: id++,
  type: 'root',
  label: 'root',
  collapsed: false,
  children: [
    {
      label: `folder-${id}`,
      id: id++,
      type: 'folder',
      collapsed: true,
      children: [
        {
          label: `file-${id}`,
          id: id++,
          type: 'file',
        },
        {
          label: `file-${id}`,
          id: id++,
          type: 'file',
        },
        {
          label: `file-${id}`,
          id: id++,
          type: 'file',
        },
        {
          label: `folder-${id}`,
          collapsed: true,
          id: id++,
          type: 'folder',
          children: [
            {
              label: `file-${id}`,
              id: id++,
              type: 'file',
            },
            {
              label: `file-${id}`,
              id: id++,
              type: 'file',
            },
          ],
        },
      ],
    },
    {
      label: `folder-${id}`,
      id: id++,
      type: 'folder',
      collapsed: true,
      children: [
        {
          label: `file-${id}`,
          id: id++,
          type: 'file',
        },
        {
          label: `file-${id}`,
          id: id++,
          type: 'file',
        },
        {
          label: `file-${id}`,
          id: id++,
          type: 'file',
        },
        {
          label: `folder-${id}`,
          id: id++,
          type: 'folder',
          collapsed: true,
          children: [
            {
              label: `file-${id}`,
              id: id++,
              type: 'file',
            },
            {
              label: `file-${id}`,
              id: id++,
              type: 'file',
            },
            {
              label: `folder-${id}`,
              id: id++,
              type: 'folder',
              collapsed: true,
              children: [
                {
                  label: `file-${id}`,
                  id: id++,
                  type: 'file',
                },
                {
                  label: `file-${id}`,
                  id: id++,
                  type: 'file',
                },
                {
                  label: `file-${id}`,
                  id: id++,
                  type: 'file',
                },
                {
                  label: `folder-${id}`,
                  id: id++,
                  type: 'folder',
                  collapsed: true,
                  children: [
                    {
                      label: `file-${id}`,
                      id: id++,
                      type: 'file',
                    },
                    {
                      label: `file-${id}`,
                      id: id++,
                      type: 'file',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/* spaghetti incoming */
export const useTreeStore = defineStore('tree', () => {
  const localId: Ref<number> = ref(id);
  const { data: tree, clear }: { data: Ref<Tree>; clear: () => void } =
    useLocalStorage<Tree>('_____tree', deepClone(INIT_TREE));

  function find(
    id: number,
    node: Tree = tree.value,
    parent = node,
    index = 0
  ): { parent?: Tree; node?: Tree; index?: number } | undefined {
    if (id === node.id) return { parent, node, index };
    for (let i = 0; i < (node?.children || []).length; i++) {
      const res = find(id, node?.children?.[i], node, i);
      if (res) return res;
    }
  }

  function add(
    parentId: number,
    type: Extract<ItemType, 'file' | 'folder'>,
    label: string
  ) {
    const node = find(parentId);
    node?.node?.children?.push({
      label: `${label}-${localId.value}`,
      id: localId.value++,
      type,
    });
    node!.node!.collapsed = false;
    return node?.node?.children?.[node?.node?.children?.length - 1];
  }

  function remove(id: number) {
    const node = find(id);
    if (typeof node?.index === 'number') {
      node?.parent?.children?.splice(node?.index, 1);
    }
  }

  function toggle(id: number) {
    const node = find(id);
    if (!node?.node) return;
    if (node?.node?.type !== 'file') node.node.collapsed = !node.node.collapsed;
  }

  function toggleAll() {
    const rootState = !!tree.value.collapsed;
    function toggle(node: Tree) {
      if (node.type !== 'file') {
        node.collapsed = !rootState;
      }
      node.children?.forEach(ch => toggle(ch));
    }
    toggle(tree.value);
  }

  function reset() {
    clear();
    localId.value = id;
    tree.value = deepClone(INIT_TREE);
  }

  return {
    tree,
    add,
    remove,
    toggle,
    toggleAll,
    reset,
  };
});
