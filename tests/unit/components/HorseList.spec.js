import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import HorseList from "../../../src/components/HorseList.vue";

describe("HorseList Component", () => {
  let store;
  let wrapper;

  beforeEach(() => {
    const horses = [
      { id: 1, name: "Horse 1", condition: 85, color: "#FF6B6B" },
      { id: 2, name: "Horse 2", condition: 90, color: "#4ECDC4" },
      { id: 3, name: "Horse 3", condition: 75, color: "#45B7D1" },
    ];

    store = createStore({
      state: { horses },
      getters: {
        allHorses: (state) => state.horses,
      },
    });

    wrapper = mount(HorseList, {
      global: {
        plugins: [store],
      },
    });
  });

  it("should render the component", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should display title", () => {
    expect(wrapper.find("h2").text()).toBe("Horse List (1-20)");
  });

  it("should render all horses", () => {
    const horseItems = wrapper.findAll(".horse-item");
    expect(horseItems).toHaveLength(3);
  });

  it("should display horse names correctly", () => {
    const horseNames = wrapper.findAll(".horse-name");
    expect(horseNames[0].text()).toBe("Horse 1");
    expect(horseNames[1].text()).toBe("Horse 2");
  });

  it("should display horse conditions", () => {
    const conditions = wrapper.findAll(".horse-condition");
    expect(conditions[0].text()).toBe("85");
    expect(conditions[1].text()).toBe("90");
  });

  it("should render horse colors", () => {
    const colors = wrapper.findAll(".horse-color");
    expect(colors).toHaveLength(3);
    expect(colors[0].attributes("style")).toContain("background-color");
  });
});
