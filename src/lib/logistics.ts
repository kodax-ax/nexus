import { VOLUMETRIC_CONSTANT } from '../constants';

/**
 * Calculates the chargeable weight based on Volumetric Weight vs. Actual Weight.
 * Formula: (L x W x H) / 5000
 */
export function calculateChargeableWeight(
  actualWeight: number,
  l: number,
  w: number,
  h: number
): number {
  const volumetricWeight = (l * w * h) / VOLUMETRIC_CONSTANT;
  return Math.max(actualWeight, volumetricWeight);
}

/**
 * Estimates shipping cost based on weight, distance, and rate.
 */
export function estimateShippingCost(
  chargeableWeight: number,
  baseRate: number,
  distanceKm: number = 100 // Default distance if not calculated
): number {
  // Simple formula: Weight * Rate * (Distance Factor)
  const distanceFactor = Math.max(1, distanceKm / 500);
  return chargeableWeight * baseRate * distanceFactor;
}
