<script lang="ts" setup>

import { ref, onMounted } from 'vue';



type Word = {
  text: string;
  show: boolean;
  awnsered?: boolean;
};

const props = defineProps({
  router: String,
  level: Number
});

async function getActiveTabURL() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await browser.tabs.query(queryOptions);
  return tab;
}

const buttonColors = [
  "#5ca5ee",
  "#fcba03",
  "#fc5c03",
  "#03fc5c",
]


const title = ref('');
const artist = ref('');
const lyrics = ref<string[]>([]);
const lyricsArray = ref<Word[][]>([]);
const score = ref({
  points: 0,
  words: 0,
  hits: 0,
  power: 100,
});
const noLyrics = ref(false);

const answers = ref<string[]>([]);
const currentIndex = ref(0);
const currentInput = ref<HTMLInputElement | null>(null);
const allInputs = ref<NodeListOf<HTMLInputElement>>();

const createLyrics = (lyrics: string[]): Word[][] => {
  const parsed_lyrics = lyrics.filter(line => { return line !== '' && !line.startsWith('[') });
  return parsed_lyrics.map(line => {
    let words_ = line.split(' ');
    words_ = words_.filter(word => word !== '');
    return words_.map(word => {
      const show = getRandomTrueFalse() || word.startsWith('[') || word.startsWith('(');
      if (!show) {
        answers.value.push(word);
      }
      return {
        text: word,
        show: show
      }
    })

  });
};

const getLyrics = () => {
  fetch(`https://api.lyrics.ovh/v1/${artist.value}/${title.value}`)
    .then((result) => result.json())
    .then((song) => {
      console.log(song);
      if (song.lyrics.length > 0) {
        const new_lyrics = song.lyrics.split("\n");
        new_lyrics.shift();
        lyricsArray.value = createLyrics(new_lyrics);
        console.log("lyricsArray");
        browser.runtime.sendMessage({ type: 'lyrics', lyrics: lyrics.value, title: title.value, artist: artist.value });
        console.log("lyricsArray2222");
      } else {
        noLyrics.value = true;
      }

      setTimeout(() => {
        allInputs.value = document.querySelectorAll('.hiddenword');
        console.log(allInputs.value[0])
        allInputs.value[0].focus();
      }, 1000);
      // console.log(answers.value)
    })
    .catch((err) => {
      console.log(err)
    });
}


onMounted(async () => {
  console.log('mounted');
  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  console.log("activeTab", activeTab);
  const currentVideo = urlParameters.get("v");
  const titleTab = activeTab.title.split(" - YouTube")[0];
  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    // const song = lyrics.find((song) => song.id === currentVideo);
    let artistTab = titleTab.split(" - ")[0];
    artist.value = artistTab.split(") ")[1] || artistTab;
    title.value = titleTab.split(" - ")[1].split(" ft. ")[0];

    getLyrics();
  }
  else {
    noLyrics.value = true;
  }
  // fetchLyrics();
});





const getRandomTrueFalse = () => {
  const level = props.level;
  const probability = Math.random() * 100;
  if (level === 1) {
    return probability > 50;
  } else if (level === 2) {
    return probability > 70;
  } else if (level === 3) {
    return probability > 850;
  } else if (level === 4) {
    return probability > 95;
  }
};

const finishGame = (): void => {
  console.log('finish game');
  browser.runtime.sendMessage({ type: 'finish' });
};

const scoreCorrectAnswer = (): void => {
  score.value.words += 1;
  score.value.points = Math.round(score.value.points + score.value.power);
  score.value.hits += 1;
  score.value.power *= 1.2;
};

const scoreWrongAnswer = () => {
  score.value.power = 100;
  score.value.hits = 0;
};

const checkWord = (event: Event, word: Word) => {
  const input = event.target as HTMLInputElement;
  if (input.value.toLowerCase() === word.text.toLowerCase()) {
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
    input.readOnly = true;
    word.show = true;
    word.awnsered = true;
    scoreCorrectAnswer();
    // next input
    allInputs.value = document.querySelectorAll('.hiddenword');
    const inputs = Array.from(allInputs.value);
    const nextInput = inputs.indexOf(input) + 1;
    if (nextInput < inputs.length) {
      currentInput.value = inputs[nextInput];
      inputs[nextInput].focus();
    }
    currentIndex.value += 1;
  } else {
    input.classList.add('is-invalid');
    input.value = '';
    input.focus();
    scoreWrongAnswer();
    setTimeout(() => {
      input.classList.remove('is-invalid');
      input.value = '';
    }, 200);
  }
};

const checkAnswer = (answer: string) => {
  currentInput.value!.value = answer;
  currentInput.value!.dispatchEvent(new Event('change'));

};

const checkKeyword = (event: KeyboardEvent) => {
  if (event.key === '1') {
    document.getElementById('answer-0')?.click();
  } else if (event.key === '2') {
    document.getElementById('answer-1')?.click();
  } else if (event.key === '3') {
    document.getElementById('answer-2')?.click();
  } else if (event.key === '4') {
    document.getElementById('answer-3')?.click();
  }

  // continue event
  return true;
};

const returnRandomOrder = (array: string[]) => {
  return array.sort(() => Math.random() - 0.5);
};


const getTranslate = (word: Word) => {
  window.open(`https://www.wordreference.com/es/en/translation.asp?spen=${word.text}`, 'name', 'width=600,height=400');
};
</script>

<template>
  <div class="container">
    <div class="form-group row mt-2 d-flex justify-content-center" id="score">
      <label for="points" class="col-form-label col-2">Points</label>
      <div class="col-2 px-0">
        <input type="number" id="points" name="points" v-model="score.points" class="form-control" readonly />
      </div>
      <label for="words" class="col-form-label col-2">Words</label>
      <div class="col-2 px-0">
        <input type="text" id="words" name="words" v-model="score.words" class="form-control" readonly />
      </div>
      <label for="words" class="col-form-label col-2">Hits</label>
      <div class="col-2 px-0">
        <input type="number" id="hits" name="hits" v-model="score.hits" class="form-control" readonly />
      </div>
    </div>
    <div class="row mt-3">
      <h2 id="title" style="color: #ffffff;">{{ title }}</h2>
      <h5 id="artist" style="color: #666;">{{ artist }}</h5>
    </div>
    <div class="row mt-3" id="lyrics" v-if="!noLyrics">
      <p v-for="(line, index) in lyricsArray" :key="index" class="d-inline-block">
        <span v-for="(word, i) in line" :key="i" class="d-inline-block me-1">
          <span v-if="word.show" :class="word.awnsered ? 'text-success' : ''"><a @click="getTranslate(word)">{{
            word.text }}</a></span>
          <input v-else type="text" class="form-control d-inline-block mt-1 py-1 hiddenword"
            @change="checkWord($event, word)" @focus="currentInput = $event.target" @keyup="checkKeyword($event)"
            :style="'width: ' + word.text.length * 20 + 'px;font-size:15px;'">
        </span>
      </p>
    </div>
    <div class="row mt-3" v-else>
      <h3>No lyrics found</h3>
    </div>
    <footer class="fixed-bottom text-center px-3 my-2">
      <!-- Show 4 buttons with the 4 possible answers -->
      <div class="row">
        <div v-for="(answer, index) in returnRandomOrder(answers.slice(currentIndex, currentIndex + 4))" :key="index"
          class="d-inline-block col-6">
          <div class="m-1" @click="checkAnswer(answer)" :id="'answer-' + index" :key="index"
            style="cursor: pointer; border: 1px solid #000; padding: 5px; border-radius: 5px;"
            :style="'background-color: ' + buttonColors[index]">
            {{ answer }}
          </div>
        </div>
      </div>

    </footer>
  </div>
</template>

<style scoped>
#lyrics {
  font-size: 1rem;
  overflow-y: scroll;
  scrollbar-width: none;
  max-height: 300px;
}

#score input {
  padding-right: 0px;
  padding-left: 0px;
  text-align: center;
}
</style>