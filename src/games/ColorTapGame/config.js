/**
 * Color Tap Game Configuration
 */

// Points per correct tap
export const POINTS_CORRECT = 10;

// Points deducted per wrong tap
export const POINTS_WRONG = 3;

// How many correct taps before levelling up
export const CORRECT_PER_LEVEL = 5;

// Radius of each circle in pixels
export const CIRCLE_RADIUS = 28;

// Duration options shown on the setup screen (milliseconds)
export const TIME_OPTIONS = [
  { label: "30s",  value: 30000 },
  { label: "60s",  value: 60000 },
  { label: "90s",  value: 90000 },
  { label: "2m",   value: 120000 },
  { label: "3m",   value: 180000 },
  { label: "5m",   value: 300000 },
];

// Default selected duration (ms)
export const DEFAULT_TIME = 60000;

// Pop animation duration (ms) — circle fades out on correct tap
export const POP_DURATION = 300;

// Wrong-tap red overlay duration (ms)
export const WRONG_OVERLAY_DURATION = 350;

// Duration the +1 float animation takes (ms)
export const FLOAT_DURATION = 800;