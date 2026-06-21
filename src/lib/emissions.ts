/**
 * Carbon Emission Factors (Approximate tons of CO2 per unit per year)
 */

import type { EmissionBreakdown } from '@/types';

export const EMISSION_FACTORS = {
  TRANSPORT: {
    CAR_PETROL: 0.2,
    CAR_EV: 0.05,
    BUS: 0.08,
    FLIGHT_SHORT: 0.15,
    FLIGHT_LONG: 0.25,
  },
  ENERGY: {
    ELECTRICITY_KWH: 0.0004,
    GAS_UNIT: 0.002,
    RENEWABLE_REDUCTION: 0.8,
  },
  DIET: {
    MEAT_HEAVY: 3.3,
    MEAT_MEDIUM: 2.5,
    VEGETARIAN: 1.7,
    VEGAN: 1.5,
  },
  SHOPPING: {
    NEW_CLOTHES: 0.015,
    ELECTRONICS: 0.1,
  },
};

export interface CalculatorInputs {
  transport: {
    carDistance: number;
    fuelType: 'petrol' | 'ev' | 'none';
    busHours: number;
    flights: number;
  };
  energy: {
    monthlyBill: number;
    isRenewable: boolean;
  };
  diet: {
    type: 'heavy' | 'medium' | 'vegetarian' | 'vegan';
  };
  shopping: {
    monthlyClothes: number;
    annualGadgets: number;
  };
}

export interface HistoryEntry {
  date: string;
  score: number;
  breakdown: EmissionBreakdown;
}

export const calculateTotalEmissions = (inputs: CalculatorInputs) => {
  // Transport Calculation
  let transportScore = 0;
  if (inputs.transport.fuelType === 'petrol') {
    transportScore += (inputs.transport.carDistance / 1000) * EMISSION_FACTORS.TRANSPORT.CAR_PETROL;
  } else if (inputs.transport.fuelType === 'ev') {
    transportScore += (inputs.transport.carDistance / 1000) * EMISSION_FACTORS.TRANSPORT.CAR_EV;
  }
  transportScore += inputs.transport.busHours * 52 * EMISSION_FACTORS.TRANSPORT.BUS; // Weekly to annual
  transportScore += inputs.transport.flights * EMISSION_FACTORS.TRANSPORT.FLIGHT_LONG;

  // Energy Calculation
  let energyScore = (inputs.energy.monthlyBill * 12 * 5) * EMISSION_FACTORS.ENERGY.ELECTRICITY_KWH; // Est kWh from bill
  if (inputs.energy.isRenewable) {
    energyScore *= (1 - EMISSION_FACTORS.ENERGY.RENEWABLE_REDUCTION);
  }

  // Diet Calculation
  let dietScore = 0;
  switch (inputs.diet.type) {
    case 'heavy': dietScore = EMISSION_FACTORS.DIET.MEAT_HEAVY; break;
    case 'medium': dietScore = EMISSION_FACTORS.DIET.MEAT_MEDIUM; break;
    case 'vegetarian': dietScore = EMISSION_FACTORS.DIET.VEGETARIAN; break;
    case 'vegan': dietScore = EMISSION_FACTORS.DIET.VEGAN; break;
  }

  // Shopping Calculation
  const shoppingScore = (inputs.shopping.monthlyClothes * 12 * EMISSION_FACTORS.SHOPPING.NEW_CLOTHES) +
                        (inputs.shopping.annualGadgets * EMISSION_FACTORS.SHOPPING.ELECTRONICS);

  const total = transportScore + energyScore + dietScore + shoppingScore;

  return {
    total: parseFloat(total.toFixed(2)),
    breakdown: {
      transport: parseFloat(transportScore.toFixed(2)),
      energy: parseFloat(energyScore.toFixed(2)),
      diet: parseFloat(dietScore.toFixed(2)),
      shopping: parseFloat(shoppingScore.toFixed(2)),
    },
  };
};

export const getCarbonGrade = (score: number) => {
  if (score < 2) return 'A+';
  if (score < 4) return 'A';
  if (score < 7) return 'B';
  if (score < 10) return 'C';
  if (score < 15) return 'D';
  return 'F';
};
