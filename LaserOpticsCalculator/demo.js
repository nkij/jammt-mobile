/**
 * Demo script showing the laser optics calculations
 * This demonstrates the core functionality of the mobile app
 */

const { GaussianBeamCalculator } = require('./src/utils/beamCalculations.ts');

console.log('🔬 Laser Optics Calculator Demo');
console.log('================================\n');

// Example beam parameters (similar to JAMMT example)
const inputBeam = {
  w0: 1.7e-4,      // 170 μm beam waist
  z0: 0.9,         // 900 mm from reference
  lambda: 1.55e-6, // 1550 nm wavelength
  M2: 1.0          // Perfect Gaussian beam
};

const lens = {
  f: 0.1,          // 100 mm focal length
  z: 0.0,          // At origin
  diameter: 0.025, // 25 mm diameter
  name: 'L1'
};

console.log('📊 Input Parameters:');
console.log(`Beam Waist: ${(inputBeam.w0 * 1e6).toFixed(1)} μm`);
console.log(`Waist Position: ${(inputBeam.z0 * 1000).toFixed(1)} mm`);
console.log(`Wavelength: ${(inputBeam.lambda * 1e9).toFixed(0)} nm`);
console.log(`M² Factor: ${inputBeam.M2}`);
console.log(`Lens Focal Length: ${(lens.f * 1000).toFixed(0)} mm\n`);

// Calculate key parameters
const rayleighRange = GaussianBeamCalculator.rayleighRange(inputBeam.w0, inputBeam.lambda, inputBeam.M2);
const focusedSpotSize = GaussianBeamCalculator.focusedSpotSize(inputBeam, lens.f);

console.log('📈 Calculated Parameters:');
console.log(`Rayleigh Range: ${(rayleighRange * 1000).toFixed(1)} mm`);
console.log(`Focused Spot Size: ${(focusedSpotSize * 1e6).toFixed(2)} μm\n`);

// Calculate beam propagation through lens
const outputBeam = GaussianBeamCalculator.propagateThroughLens(inputBeam, lens);

console.log('🔍 Output Beam Parameters:');
console.log(`New Beam Waist: ${(outputBeam.w0 * 1e6).toFixed(1)} μm`);
console.log(`New Waist Position: ${(outputBeam.z0 * 1000).toFixed(1)} mm`);
console.log(`Magnification: ${(outputBeam.w0 / inputBeam.w0).toFixed(3)}\n`);

// Generate propagation data for visualization
const propagationData = GaussianBeamCalculator.generatePropagationData(
  outputBeam, 
  [-0.5, 2.0], // -500mm to 2000mm
  10 // 10 points for demo
);

console.log('📊 Beam Propagation Data:');
console.log('Position (mm) | Beam Radius (μm)');
console.log('----------------|-----------------');
propagationData.forEach((point, index) => {
  if (index % 2 === 0) { // Show every other point for brevity
    console.log(`${(point.z * 1000).toFixed(1).padStart(13)} | ${(point.w * 1e6).toFixed(1).padStart(15)}`);
  }
});

console.log('\n✅ Demo completed successfully!');
console.log('The mobile app provides this same functionality with a graphical interface.');



