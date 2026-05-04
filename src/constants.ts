export const SERVICE_LEVELS = [
  { id: 'express', name: 'Express Priority', rate: 2.5, time: '1-2 Days' },
  { id: 'standard', name: 'Standard Freight', rate: 1.2, time: '3-5 Days' },
  { id: 'economy', name: 'Economy Saver', rate: 0.8, time: '7-10 Days' },
];

export const VOLUMETRIC_CONSTANT = 5000;

export const NEXUS_HUBS = [
  { name: 'Lagos Gateway', lat: 6.45, lng: 3.39, code: 'LOS-01' },
  { name: 'London Gateway', lat: 51.51, lng: 0.44, code: 'LDN-01' },
  { name: 'Shanghai Port', lat: 31.23, lng: 121.47, code: 'SHA-01' },
  { name: 'New York Hub', lat: 40.71, lng: -74.01, code: 'NYC-01' },
  { name: 'Singapore Terminal', lat: 1.35, lng: 103.82, code: 'SIN-01' },
];

export const DEFAULT_HUB = NEXUS_HUBS[0]; // Lagos
