describe("Horse Racing Game - E2E Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  describe("Initial Page Load", () => {
    it("should display the game title", () => {
      cy.contains("Horse Racing Game").should("be.visible");
    });

    it("should show Generate Program and Start buttons", () => {
      cy.contains("GENERATE PROGRAM").should("be.visible");
      cy.contains("button", "START").should("be.visible");
    });

    it("should display 20 horses in the list", () => {
      cy.get(".horse-item").should("have.length", 20);
    });

    it("should show empty state message", () => {
      cy.contains("Welcome to Horse Racing Game").should("be.visible");
    });

    it("should have Start button disabled initially", () => {
      cy.contains("button", "START").should("be.disabled");
    });
  });

  describe("Program Generation", () => {
    it("should generate race program", () => {
      cy.contains("GENERATE PROGRAM").click();
      cy.get(".round-section").should("have.length", 6);
    });

    it("should show correct distances", () => {
      cy.contains("GENERATE PROGRAM").click();
      cy.contains("1200m").should("be.visible");
      cy.contains("1400m").should("be.visible");
      cy.contains("2200m").should("be.visible");
    });

    it("should select 10 horses per round", () => {
      cy.contains("GENERATE PROGRAM").click();
      cy.get(".round-section")
        .first()
        .within(() => {
          cy.get("tbody tr").should("have.length", 10);
        });
    });

    it("should enable Start button", () => {
      cy.contains("GENERATE PROGRAM").click();
      cy.contains("button", "START").should("not.be.disabled");
    });
  });

  describe("Race Execution", () => {
    beforeEach(() => {
      cy.contains("GENERATE PROGRAM").click();
    });

    it("should start race", () => {
      cy.contains("button", "START").click();
      cy.contains("Round 1").should("be.visible");
      cy.get(".lane").should("have.length", 10);
    });

    it("should animate horses", () => {
      cy.contains("button", "START").click();
      cy.get(".horse-icon").first().should("exist");
      cy.wait(1000);
      cy.get(".horse-icon").first().should("not.have.css", "left", "0%");
    });

    it("should show RACING button text", () => {
      cy.contains("button", "START").click();
      cy.contains("button", "RACING...").should("exist");
    });

    it("should complete race and show results", () => {
      cy.contains("button", "START").click();
      cy.contains("Round 1 Complete", { timeout: 10000 });
      cy.get(".result-section").should("have.length", 1);
    });
  });

  describe("Race Results", () => {
    beforeEach(() => {
      cy.contains("GENERATE PROGRAM").click();
    });

    it("should show results after race", () => {
      cy.contains("button", "START").click();
      cy.contains("Round 1 Complete", { timeout: 10000 });
      cy.get(".result-section tbody tr").should("have.length", 10);
    });

    it("should show winner with trophy", () => {
      cy.contains("button", "START").click();
      cy.contains("Round 1 Complete", { timeout: 10000 });
      cy.get(".result-section tbody tr").first().should("contain", "🏆");
    });

    it("should highlight winner", () => {
      cy.contains("button", "START").click();
      cy.contains("Round 1 Complete", { timeout: 10000 });
      cy.get(".result-section tbody tr.winner").should("exist");
    });
  });

  describe("Multiple Rounds", () => {
    beforeEach(() => {
      cy.contains("GENERATE PROGRAM").click();
    });

    it("should update button for next round", () => {
      cy.contains("button", "START").click();
      cy.contains("Round 1 Complete", { timeout: 10000 });
      cy.contains("button", "START ROUND 2").should("be.visible");
    });

    it("should highlight active round", () => {
      cy.contains("button", "START").click();
      cy.get(".active-round").should("have.length", 1);
    });

    it("should complete all 6 rounds", () => {
      for (let i = 1; i <= 6; i++) {
        cy.contains("button", /START/).click();
        cy.contains(`Round ${i} Complete`, { timeout: 10000 });
      }
      cy.get(".result-section").should("have.length", 6);
      cy.contains("All Races Complete").should("be.visible");
    });

    it("should show FINISHED after all rounds", () => {
      for (let i = 1; i <= 6; i++) {
        cy.contains("button", /START/).click();
        cy.wait(6000);
      }
      cy.contains("button", "FINISHED").should("be.visible");
    });
  });

  describe("UI Interactions", () => {
    it("should disable Generate during race", () => {
      cy.contains("GENERATE PROGRAM").click();
      cy.contains("button", "START").click();
      cy.contains("button", "GENERATE PROGRAM").should("be.disabled");
    });

    it("should have three column layout", () => {
      cy.get(".horse-list").should("be.visible");
      cy.get(".race-track").should("be.visible");
      cy.get(".right-panel").should("be.visible");
    });
  });

  describe("Reset Functionality", () => {
    it("should reset when regenerating program", () => {
      cy.contains("GENERATE PROGRAM").click();
      cy.contains("button", "START").click();
      cy.wait(6000);

      cy.get(".result-section").should("have.length", 1);
      cy.contains("GENERATE PROGRAM").click();
      cy.get(".result-section").should("have.length", 0);
    });
  });
});
