<template>
  <div class="horse-list">
    <h2>Horse List (1-20)</h2>
    <div class="horse-list-scroll">
      <div v-for="horse in horses" :key="horse.id" class="horse-item">
        <div class="horse-info">
          <span class="horse-name">{{ horse.name }}</span>
        </div>
        <div class="horse-condition">{{ horse.condition }}</div>
        <div
          class="horse-color"
          :style="{ backgroundColor: horse.color }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "HorseList",
  setup() {
    const store = useStore();
    const horses = computed(() => store.getters.allHorses);

    return {
      horses,
    };
  },
};
</script>

<style scoped>
.horse-list {
  background: #fffacd;
  padding: 15px;
  display: flex;
  flex-direction: column;
  border-right: 2px solid #e0e0e0;
}

.horse-list h2 {
  font-size: 16px;
  margin-bottom: 12px;
  color: #333;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0e68c;
}

.horse-list-scroll {
  overflow-y: auto;
  max-height: 600px;
}

.horse-item {
  background: white;
  padding: 10px;
  margin-bottom: 6px;
  border-radius: 6px;
  display: grid;
  grid-template-columns: 1fr 40px 30px;
  gap: 8px;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.horse-item:hover {
  transform: translateX(3px);
}

.horse-info {
  display: flex;
  flex-direction: column;
}

.horse-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.horse-condition {
  font-size: 12px;
  font-weight: bold;
  color: #666;
  text-align: center;
}

.horse-color {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
