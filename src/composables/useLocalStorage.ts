import { ref, watch, type Ref } from 'vue';

const localStorage = window.localStorage;

export default function useLocalStorage<T>(key: string, defaultValue: T) {
  const data: Ref<T> = ref(get(key, defaultValue));

  function get(key: string, defaultValue: any) {
    const val = localStorage.getItem(key);
    if (val == null) return defaultValue;
    if (typeof key === 'number') return val;

    try {
      const parsed = JSON.parse(val);
      return parsed;
    } catch {
      return val;
    }
  }

  function set(val: any) {
    const localVal =
      typeof val === 'object' || val !== null ? JSON.stringify(val) : val;
    localStorage.setItem(key, localVal);
  }

  function clear() {
    localStorage.removeItem(key)
  }

  watch(data, (v) => set(v), { deep: true });


  return { data, clear }
}
