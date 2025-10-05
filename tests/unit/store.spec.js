import { describe, it, expect, beforeEach } from "vitest";
import { createStore } from "vuex";
import storeConfig from "../../src/store";

describe("Horse Racing Store - Unit Tests", () => {
  let store;

  beforeEach(() => {
    store = createStore(storeConfig);
  });

  describe("Horse Generation", () => {
    it("should initialize 20 horses", () => {
      store.dispatch("initializeHorses");
      const horses = store.getters.allHorses;
      expect(horses).toHaveLength(20);
    });

    it("should generate horses with correct properties", () => {
      store.dispatch("initializeHorses");
      const horses = store.getters.allHorses;

      horses.forEach((horse, index) => {
        expect(horse).toHaveProperty("id", index + 1);
        expect(horse).toHaveProperty("name");
        expect(horse).toHaveProperty("condition");
        expect(horse).toHaveProperty("color");
        expect(horse.name).toBe(`Horse ${index + 1}`);
        expect(horse.condition).toBeGreaterThanOrEqual(1);
        expect(horse.condition).toBeLessThanOrEqual(100);
      });
    });

    it("should assign unique colors to each horse", () => {
      store.dispatch("initializeHorses");
      const horses = store.getters.allHorses;
      const colors = horses.map((h) => h.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(20);
    });
  });

  describe("Schedule Generation", () => {
    beforeEach(() => {
      store.dispatch("initializeHorses");
    });

    it("should generate 6 rounds", () => {
      store.dispatch("generateSchedule");
      const schedule = store.getters.raceSchedule;
      expect(schedule).toHaveLength(6);
    });

    it("should have correct distances for each round", () => {
      store.dispatch("generateSchedule");
      const schedule = store.getters.raceSchedule;
      const expectedDistances = [1200, 1400, 1600, 1800, 2000, 2200];

      schedule.forEach((round, index) => {
        expect(round.distance).toBe(expectedDistances[index]);
        expect(round.round).toBe(index + 1);
      });
    });

    it("should select 10 horses for each round", () => {
      store.dispatch("generateSchedule");
      const schedule = store.getters.raceSchedule;

      schedule.forEach((round) => {
        expect(round.horses).toHaveLength(10);
      });
    });

    it("should reset game state when generating new schedule", () => {
      store.dispatch("generateSchedule");
      store.commit("SET_CURRENT_ROUND", 3);
      store.commit("ADD_RESULT", { round: 1, results: [] });

      store.dispatch("generateSchedule");

      expect(store.getters.currentRoundNumber).toBe(0);
      expect(store.getters.raceResults).toHaveLength(0);
    });
  });

  describe("Getters", () => {
    beforeEach(() => {
      store.dispatch("initializeHorses");
    });

    it("should return all horses", () => {
      const horses = store.getters.allHorses;
      expect(horses).toHaveLength(20);
    });

    it("should return game started status correctly", () => {
      expect(store.getters.isGameStarted).toBe(false);
      store.dispatch("generateSchedule");
      expect(store.getters.isGameStarted).toBe(true);
    });

    it("should return current distance correctly", () => {
      store.dispatch("generateSchedule");
      expect(store.getters.currentDistance).toBe(0);

      store.commit("SET_CURRENT_ROUND", 1);
      expect(store.getters.currentDistance).toBe(1200);
    });
  });

  describe("Mutations", () => {
    it("should set horses", () => {
      const testHorses = [
        { id: 1, name: "Test Horse 1", condition: 80, color: "#FF0000" },
      ];
      store.commit("SET_HORSES", testHorses);
      expect(store.state.horses).toEqual(testHorses);
    });

    it("should update horse position", () => {
      const horses = [{ id: 1, name: "Horse 1", progress: 0 }];
      store.commit("SET_CURRENT_RACE_STATE", horses);
      store.commit("UPDATE_HORSE_POSITION", { horseId: 1, progress: 50 });

      const updatedHorse = store.state.currentRaceState.find((h) => h.id === 1);
      expect(updatedHorse.progress).toBe(50);
    });

    it("should not allow progress over 100", () => {
      const horses = [{ id: 1, name: "Horse 1", progress: 95 }];
      store.commit("SET_CURRENT_RACE_STATE", horses);
      store.commit("UPDATE_HORSE_POSITION", { horseId: 1, progress: 150 });

      const updatedHorse = store.state.currentRaceState.find((h) => h.id === 1);
      expect(updatedHorse.progress).toBe(100);
    });
  });

  describe("Race Flow", () => {
    beforeEach(() => {
      store.dispatch("initializeHorses");
      store.dispatch("generateSchedule");
    });

    it("should start race and increment round", async () => {
      expect(store.getters.currentRoundNumber).toBe(0);
      const racePromise = store.dispatch("startRace");
      expect(store.getters.currentRoundNumber).toBe(1);
      await racePromise;
    });

    it("should add results after race completes", async () => {
      await store.dispatch("startRace");
      const results = store.getters.raceResults;
      expect(results).toHaveLength(1);
      expect(results[0].results).toHaveLength(10);
    });
  });
});
