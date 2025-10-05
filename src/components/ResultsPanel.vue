<template>
  <div class="results-panel">
    <h2>Results</h2>
    <div class="results-scroll">
      <div v-if="results.length === 0" class="empty-message">
        No results yet
      </div>
      <div v-else>
        <div
          v-for="result in results"
          :key="result.round"
          class="result-section"
        >
          <div class="result-header">
            <strong>{{ result.round }}st Lap - {{ result.distance }}m</strong>
          </div>
          <table class="results-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="horse in result.results"
                :key="horse.id"
                :class="{ winner: horse.position === 1 }"
              >
                <td class="position-cell">
                  <span
                    class="position-badge"
                    :class="`position-${horse.position}`"
                  >
                    {{ horse.position }}
                  </span>
                </td>
                <td class="name-cell">
                  <span
                    class="color-dot"
                    :style="{ backgroundColor: horse.color }"
                  ></span>
                  {{ horse.name }}
                  <span v-if="horse.position === 1" class="trophy">🏆</span>
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
  name: "ResultsPanel",
  setup() {
    const store = useStore();
    const results = computed(() => store.getters.raceResults);

    return {
      results,
    };
  },
};
</script>

<style scoped>
.results-panel {
  background: #fff3e0;
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.results-panel h2 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #f57c00;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid #ffb74d;
}

.results-scroll {
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

.result-section {
  background: white;
  margin-bottom: 12px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.result-header {
  background: #f57c00;
  color: white;
  padding: 8px 12px;
  font-size: 13px;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.results-table thead {
  background: #f5f5f5;
}

.results-table th {
  padding: 6px 8px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #ddd;
}

.results-table td {
  padding: 6px 8px;
  border-bottom: 1px solid #eee;
}

.results-table tbody tr:last-child td {
  border-bottom: none;
}

.results-table tbody tr:hover {
  background: #f9f9f9;
}

.winner {
  background: #fff9c4 !important;
}

.position-cell {
  width: 60px;
  text-align: center;
}

.position-badge {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  line-height: 24px;
  text-align: center;
  font-weight: bold;
  font-size: 11px;
  color: white;
}

.position-1 {
  background: #ffd700;
  color: #333;
  box-shadow: 0 2px 6px rgba(255, 215, 0, 0.5);
}

.position-2 {
  background: #c0c0c0;
  color: #333;
}

.position-3 {
  background: #cd7f32;
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

.trophy {
  margin-left: auto;
  font-size: 16px;
}
</style>
