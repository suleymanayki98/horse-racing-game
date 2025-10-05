<template>
  <div class="program-panel">
    <h2>Program</h2>
    <div class="program-scroll">
      <div v-if="schedule.length === 0" class="empty-message">
        No program generated yet
      </div>
      <div v-else>
        <div
          v-for="round in schedule"
          :key="round.round"
          class="round-section"
          :class="{ 'active-round': round.round === currentRound }"
        >
          <div class="round-header">
            <strong>{{ round.round }}st Lap - {{ round.distance }}m</strong>
          </div>
          <table class="horses-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(horse, index) in round.horses" :key="horse.id">
                <td class="position-cell">{{ index + 1 }}</td>
                <td class="name-cell">
                  <span
                    class="color-dot"
                    :style="{ backgroundColor: horse.color }"
                  ></span>
                  {{ horse.name }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "ProgramPanel",
  setup() {
    const store = useStore();
    const schedule = computed(() => store.getters.raceSchedule);
    const currentRound = computed(() => store.getters.currentRoundNumber);

    return {
      schedule,
      currentRound,
    };
  },
};
</script>

<style scoped>
.program-panel {
  background: #e3f2fd;
  padding: 15px;
  border-bottom: 2px solid #e0e0e0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.program-panel h2 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #1976d2;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid #90caf9;
}

.program-scroll {
  overflow-y: auto;
  max-height: 300px;
  flex: 1;
}

.empty-message {
  text-align: center;
  color: #666;
  padding: 20px;
  font-style: italic;
}

.round-section {
  background: white;
  margin-bottom: 12px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.active-round {
  border: 3px solid #4caf50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.round-header {
  background: #1976d2;
  color: white;
  padding: 8px 12px;
  font-size: 13px;
}

.active-round .round-header {
  background: #4caf50;
}

.horses-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.horses-table thead {
  background: #f5f5f5;
}

.horses-table th {
  padding: 6px 8px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #ddd;
}

.horses-table td {
  padding: 6px 8px;
  border-bottom: 1px solid #eee;
}

.horses-table tbody tr:last-child td {
  border-bottom: none;
}

.horses-table tbody tr:hover {
  background: #f9f9f9;
}

.position-cell {
  width: 60px;
  text-align: center;
  font-weight: 600;
  color: #666;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #333;
  flex-shrink: 0;
}
</style>
