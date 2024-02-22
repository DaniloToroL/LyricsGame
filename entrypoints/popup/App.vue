<script lang="ts" setup>
import Main from '@/components/Main.vue';
import Login from '@/components/Login.vue';
import { ref } from 'vue';

const router = ref("login")
const level = ref(0);
const update = (event: any) => {
  router.value = event.router;
  level.value = event.level;
}

</script>

<template>
  <Login v-if="router === 'login'" @update:router="update($event)" />
  <Main v-if="router === 'main'" :level="level" @update:router="update($event)" />
</template>

<style scoped>  
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }

  .logo:hover {
    filter: drop-shadow(0 0 2em #54bc4ae0);
  }

  .logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
</style>



