<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
    router: String,
});

const emit = defineEmits(["update:router"]);

const msg = ref("Login");

const start = (level: Number) => {
    console.log("start");
    emit("update:router", { router: "main", level: level });
};


</script>

<template>
    <div class="my-1">
        <h1>Lyrics Game</h1>
        <a href="https://vuejs.org/" target="_blank">
            <img src="@/assets/icon.jpg" class="logo vue" alt="Vue logo" />
        </a>
    </div>
    <div class="body">
        <div class="card">
            <p>Go to youtube and search for a song you like. Then, click on the level you want to play.</p>
            <b-button variant="primary" @click="start(1)" class="mt-2">Beginner</b-button>
            <b-button variant="secondary" @click="start(2)" class="mt-2">Intermediate</b-button>
            <b-button variant="success" @click="start(3)" class="mt-2">Expert</b-button>
            <b-button variant="danger" @click="start(4)" class="mt-2">Native</b-button>
        </div>
    </div>
</template>

<style scoped>
.logo {
    height: 10rem;
    padding: 0;
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
