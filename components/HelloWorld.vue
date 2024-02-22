<script lang="ts" setup>
import { ref } from "vue";

defineProps({
  msg: String,
  router: String
});

const start = () => {
  console.log("start");
  const router = ref(props.router);
  

};
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <p>Go to youtube and search for a song you like. Then, click on start</p>
    <b-button variant="primary" @click="start()">Start</b-button>
  </div>
</template>
