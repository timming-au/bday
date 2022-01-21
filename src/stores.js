import { writable } from 'svelte/store'
const store = writable({
    cursor: null,
})
export default store