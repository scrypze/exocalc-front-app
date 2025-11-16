export const starCalculations = {
  calculatePlanets(): number {
    return Math.floor(Math.random() * 10) + 1;
  },

  calculateHabitableZone(): string {
    const min = (Math.random() * 2).toFixed(2);
    const max = (parseFloat(min) + Math.random() * 3).toFixed(2);
    return `${min} - ${max} а.е.`;
  },
};
