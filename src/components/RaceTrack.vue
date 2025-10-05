<template>
  <div class="race-track">
    <div v-if="!raceInProgress && currentRound === 0" class="empty-state">
      <h2>🏇 Welcome to Horse Racing Game</h2>
      <p>Click "GENERATE PROGRAM" to start</p>
    </div>

    <div v-else>
      <div class="track-info">
        <h2>{{ currentRound > 0 ? `Round ${currentRound}` : "Ready" }}</h2>
        <p v-if="currentDistance">{{ currentDistance }}m</p>
      </div>

      <div class="lanes">
        <div
          v-for="(horse, index) in displayHorses"
          :key="horse.id"
          class="lane"
        >
          <div class="lane-number">{{ index + 1 }}</div>
          <div class="track-line">
            <div
              class="horse-icon"
              :style="{
                left: horse.progress + '%',
                backgroundColor: horse.color,
              }"
            >
              🐴
            </div>
          </div>
          <div class="finish-line">FINISH</div>
        </div>
      </div>

      <div
        v-if="!raceInProgress && currentRound < 6 && currentRound > 0"
        class="race-complete"
      >
        <p>✅ Round {{ currentRound }} Complete!</p>
        <p>Click "START ROUND {{ currentRound + 1 }}" to continue</p>
      </div>

      <div v-if="currentRound === 6 && !raceInProgress" class="race-complete">
        <p>🏆 All Races Complete!</p>
        <p>Generate a new program to play again</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "RaceTrack",
  setup() {
    const store = useStore();

    const currentRound = computed(() => store.getters.currentRoundNumber);
    const currentDistance = computed(() => store.getters.currentDistance);
    const raceInProgress = computed(() => store.state.raceInProgress);
    const currentRaceHorses = computed(() => store.getters.currentRaceHorses);

    const displayHorses = computed(() => {
      if (currentRaceHorses.value.length > 0) {
        return currentRaceHorses.value;
      }

      if (currentRound.value === 0 && store.state.schedule.length > 0) {
        return store.state.schedule[0].horses.map((h) => ({
          ...h,
          progress: 0,
        }));
      }

      return [];
    });

    return {
      currentRound,
      currentDistance,
      raceInProgress,
      displayHorses,
    };
  },
};
</script>

<style scoped>
.race-track {
  background: linear-gradient(to bottom, #87ceeb 0%, #98d8c8 100%);
  padding: 20px;
  min-height: 650px;
  display: flex;
  flex-direction: column;
  border-right: 2px solid #e0e0e0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: white;
  text-align: center;
}

.empty-state h2 {
  font-size: 32px;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.empty-state p {
  font-size: 18px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.track-info {
  text-align: center;
  color: white;
  margin-bottom: 20px;
}

.track-info h2 {
  font-size: 24px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.track-info p {
  font-size: 18px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.lanes {
  background: #90ee90;
  border: 4px solid #654321;
  border-radius: 8px;
  padding: 15px;
  flex: 1;
}

.lane {
  display: grid;
  grid-template-columns: 30px 1fr 80px;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 2px dashed #666;
}

.lane:last-child {
  border-bottom: none;
}

.lane-number {
  background: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 2px solid #333;
}

.track-line {
  position: relative;
  height: 35px;
  background: linear-gradient(
    to right,
    transparent 0%,
    transparent 98%,
    #ff0000 98%,
    #ff0000 100%
  );
}

.horse-icon {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid #333;
  transition: none;
  will-change: left;
}

.finish-line {
  color: #ff0000;
  font-weight: bold;
  font-size: 12px;
  text-align: center;
}

.race-complete {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin-top: 20px;
}

.race-complete p {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 5px 0;
}
</style>
