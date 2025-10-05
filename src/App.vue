<template>
  <div id="app">
    <header class="header">
      <h1>Horse Racing Game</h1>
      <div class="header-buttons">
        <button
          @click="generateProgram"
          class="btn-generate"
          :disabled="isRacing"
        >
          GENERATE PROGRAM
        </button>
        <button
          @click="startRace"
          class="btn-start"
          :disabled="!isGameStarted || raceInProgress"
        >
          {{ raceButtonText }}
        </button>
      </div>
    </header>

    <div class="main-content">
      <HorseList />
      <RaceTrack />
      <div class="right-panel">
        <ProgramPanel />
        <ResultsPanel />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import HorseList from "./components/HorseList.vue";
import RaceTrack from "./components/RaceTrack.vue";
import ProgramPanel from "./components/ProgramPanel.vue";
import ResultsPanel from "./components/ResultsPanel.vue";

export default {
  name: "App",
  components: {
    HorseList,
    RaceTrack,
    ProgramPanel,
    ResultsPanel,
  },
  setup() {
    const store = useStore();

    const isGameStarted = computed(() => store.getters.isGameStarted);
    const isRacing = computed(() => store.getters.isRacing);
    const raceInProgress = computed(() => store.state.raceInProgress);
    const currentRound = computed(() => store.getters.currentRoundNumber);

    const raceButtonText = computed(() => {
      if (raceInProgress.value) return "RACING...";
      if (currentRound.value >= 6) return "FINISHED";
      if (currentRound.value === 0) return "START";
      return `START ROUND ${currentRound.value + 1}`;
    });

    const generateProgram = () => {
      store.dispatch("generateSchedule");
    };

    const startRace = () => {
      store.dispatch("startRace");
    };

    onMounted(() => {
      store.dispatch("initializeHorses");
    });

    return {
      isGameStarted,
      isRacing,
      raceInProgress,
      generateProgram,
      startRace,
      raceButtonText,
    };
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: #f0f2f5;
  padding: 20px;
}

#app {
  max-width: 1600px;
  margin: 0 auto;
}

.header {
  background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
  padding: 20px 30px;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header h1 {
  color: #fff;
  font-size: 28px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.header-buttons button {
  margin-left: 12px;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-generate {
  background: #fff;
  color: #ff6b6b;
}

.btn-start {
  background: #4caf50;
  color: white;
}

.btn-generate:disabled,
.btn-start:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-generate:hover:not(:disabled),
.btn-start:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.main-content {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 0;
  background: white;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-height: 650px;
}

.right-panel {
  display: flex;
  flex-direction: column;
}
</style>
