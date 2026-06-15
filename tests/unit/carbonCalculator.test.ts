import { calculateTotalEmissions, getCarbonGrade } from '@/lib/emissions';

describe('Carbon Calculator', () => {
  test('calculates correct emissions for a typical user', () => {
    const inputs = {
      transport: { carDistance: 12000, fuelType: 'petrol' as const, busHours: 5, flights: 2 },
      energy: { monthlyBill: 150, isRenewable: false },
      diet: { type: 'medium' as const },
      shopping: { monthlyClothes: 3, annualGadgets: 2 },
    };
    const result = calculateTotalEmissions(inputs);
    expect(result.total).toBeCloseTo(30.54, 2);
    expect(result.breakdown.transport).toBeCloseTo(23.7, 1); // 2.4 + 20.8 + 0.5 = 23.7
    expect(result.breakdown.energy).toBeCloseTo(3.6, 1);
    expect(result.breakdown.diet).toBe(2.5);
    expect(result.breakdown.shopping).toBeCloseTo(0.74, 2);
  });

  test('edge case: zero usage', () => {
    const inputs = {
      transport: { carDistance: 0, fuelType: 'none' as const, busHours: 0, flights: 0 },
      energy: { monthlyBill: 0, isRenewable: true },
      diet: { type: 'vegan' as const },
      shopping: { monthlyClothes: 0, annualGadgets: 0 },
    };
    const result = calculateTotalEmissions(inputs);
    expect(result.total).toBe(1.5); // Just the vegan diet base
    expect(getCarbonGrade(result.total)).toBe('A+');
  });

  test('test EV fuel type', () => {
    const inputs = {
      transport: { carDistance: 10000, fuelType: 'ev' as const, busHours: 0, flights: 0 },
      energy: { monthlyBill: 0, isRenewable: true },
      diet: { type: 'vegan' as const },
      shopping: { monthlyClothes: 0, annualGadgets: 0 },
    };
    const result = calculateTotalEmissions(inputs);
    expect(result.breakdown.transport).toBe(0.5); // (10000/1000) * 0.05
  });

  test('test vegetarian diet', () => {
    const inputs = {
      transport: { carDistance: 0, fuelType: 'none' as const, busHours: 0, flights: 0 },
      energy: { monthlyBill: 0, isRenewable: true },
      diet: { type: 'vegetarian' as const },
      shopping: { monthlyClothes: 0, annualGadgets: 0 },
    };
    const result = calculateTotalEmissions(inputs);
    expect(result.breakdown.diet).toBe(1.7);
  });

  test('extreme case: heavy emissions', () => {
    const inputs = {
      transport: { carDistance: 50000, fuelType: 'petrol' as const, busHours: 20, flights: 10 },
      energy: { monthlyBill: 500, isRenewable: false },
      diet: { type: 'heavy' as const },
      shopping: { monthlyClothes: 20, annualGadgets: 10 },
    };
    const result = calculateTotalEmissions(inputs);
    expect(result.total).toBeGreaterThan(20);
    expect(getCarbonGrade(result.total)).toBe('F');
  });

  test('assigns correct carbon grades for all ranges', () => {
    expect(getCarbonGrade(1)).toBe('A+');
    expect(getCarbonGrade(3)).toBe('A');
    expect(getCarbonGrade(5)).toBe('B');
    expect(getCarbonGrade(8)).toBe('C');
    expect(getCarbonGrade(12)).toBe('D');
    expect(getCarbonGrade(20)).toBe('F');
  });
});
