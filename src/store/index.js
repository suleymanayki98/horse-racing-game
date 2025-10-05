import { createStore } from "vuex";

const HORSE_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#FFD93D",
  "#6BCF7F",
  "#C77DFF",
  "#FF8B94",
  "#A8E6CF",
  "#FFB6B9",
  "#8DD3C7",
  "#FEFFB3",
  "#BEB9DB",
  "#FDB462",
  "#80B1D3",
  "#FB8072",
  "#B3DE69",
  "#FCCDE5",
  "#BC80BD",
];

const RACE_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200];

const generateHorses = () => {
  const horses = [];
  for (let i = 1; i <= 20; i++) {
    horses.push({
      id: i,
      name: `Horse ${i}`,
      condition: Math.floor(Math.random() * 100) + 1,
      color: HORSE_COLORS[i - 1],
    });
  }
  return horses;
};

const selectRandomHorses = (horses, count = 10) => {
  const shuffled = [...horses].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export default createStore({
  state: {
    horses: [],
    schedule: [],
    results: [],
    currentRound: 0,
    isRacing: false,
    raceInProgress: false,
    currentRaceState: [],
  },

  getters: {
    allHorses: (state) => state.horses,
    raceSchedule: (state) => state.schedule,
    raceResults: (state) => state.results,
    currentRoundNumber: (state) => state.currentRound,
    isGameStarted: (state) => state.schedule.length > 0,
    isRacing: (state) => state.isRacing,
    currentRaceHorses: (state) => state.currentRaceState,
    currentDistance: (state) => {
      if (
        state.currentRound > 0 &&
        state.currentRound <= state.schedule.length
      ) {
        return state.schedule[state.currentRound - 1].distance;
      }
      return 0;
    },
  },

  mutations: {
    SET_HORSES(state, horses) {
      state.horses = horses;
    },
    SET_SCHEDULE(state, schedule) {
      state.schedule = schedule;
    },
    ADD_RESULT(state, result) {
      state.results.push(result);
    },
    SET_CURRENT_ROUND(state, round) {
      state.currentRound = round;
    },
    SET_IS_RACING(state, status) {
      state.isRacing = status;
    },
    SET_RACE_IN_PROGRESS(state, status) {
      state.raceInProgress = status;
    },
    SET_CURRENT_RACE_STATE(state, horses) {
      state.currentRaceState = horses;
    },
    UPDATE_HORSE_POSITION(state, { horseId, progress }) {
      const index = state.currentRaceState.findIndex((h) => h.id === horseId);
      if (index !== -1) {
        state.currentRaceState[index] = {
          ...state.currentRaceState[index],
          progress: Math.min(progress, 100),
        };
      }
    },
    RESET_GAME(state) {
      state.results = [];
      state.currentRound = 0;
      state.isRacing = false;
      state.raceInProgress = false;
      state.currentRaceState = [];
    },
  },

  actions: {
    initializeHorses({ commit }) {
      const horses = generateHorses();
      commit("SET_HORSES", horses);
    },

    generateSchedule({ commit, state }) {
      // Önce oyunu resetle
      commit("RESET_GAME");

      const schedule = [];

      for (let i = 0; i < 6; i++) {
        const selectedHorses = selectRandomHorses(state.horses, 10);
        schedule.push({
          round: i + 1,
          distance: RACE_DISTANCES[i],
          horses: selectedHorses.map((h) => ({
            id: h.id,
            name: h.name,
            color: h.color,
            condition: h.condition,
          })),
        });
      }

      // Sonra schedule'ı set et
      commit("SET_SCHEDULE", schedule);
    },

    async startRace({ commit, state, dispatch }) {
      if (state.currentRound >= state.schedule.length) {
        return;
      }

      commit("SET_IS_RACING", true);
      commit("SET_RACE_IN_PROGRESS", true);

      const nextRound = state.currentRound + 1;
      commit("SET_CURRENT_ROUND", nextRound);

      const roundData = state.schedule[nextRound - 1];
      const racingHorses = roundData.horses.map((h) => ({
        ...h,
        progress: 0,
        speed: 0,
      }));

      commit("SET_CURRENT_RACE_STATE", racingHorses);

      await dispatch("runRace", { roundData, racingHorses });
    },

    runRace({ commit, state }, { roundData, racingHorses }) {
      return new Promise((resolve) => {
        let finishTimes = [];

        const raceInterval = setInterval(() => {
          let allFinished = true;

          state.currentRaceState.forEach((horse, index) => {
            if (horse.progress < 100) {
              allFinished = false;
              const speedFactor =
                (horse.condition / 100) * (0.5 + Math.random() * 0.5);
              const newProgress = horse.progress + speedFactor * 3;

              if (
                newProgress >= 100 &&
                !finishTimes.find((f) => f.id === horse.id)
              ) {
                finishTimes.push({
                  id: horse.id,
                  name: horse.name,
                  color: horse.color,
                  time: Date.now(),
                });
              }

              commit("UPDATE_HORSE_POSITION", {
                horseId: horse.id,
                progress: Math.min(newProgress, 100),
              });
            }
          });

          if (allFinished) {
            clearInterval(raceInterval);

            const finishOrder = finishTimes.map((h, index) => ({
              position: index + 1,
              id: h.id,
              name: h.name,
              color: h.color,
            }));

            commit("ADD_RESULT", {
              round: roundData.round,
              distance: roundData.distance,
              results: finishOrder,
            });

            commit("SET_RACE_IN_PROGRESS", false);

            resolve();
          }
        }, 50);
      });
    },
  },
});
