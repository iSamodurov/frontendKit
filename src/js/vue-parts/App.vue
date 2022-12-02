<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">This is vue counter. Clicked {{ count }} times.</button>
</template>

<style lang="scss">
button {
    border-radius: 100px;
    border: none;
    padding: 20px;
    cursor: pointer;
}
</style>