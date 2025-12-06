/**
 * Unit tests for beam calculations
 * Verifies the accuracy of Gaussian beam calculations
 */

import { GaussianBeamCalculator, BeamParameters, LensParameters } from '../beamCalculations';

describe('GaussianBeamCalculator', () => {
  const testBeam: BeamParameters = {
    w0: 1e-4,      // 100 μm beam waist
    z0: 0.0,       // At origin
    lambda: 1.55e-6, // 1550 nm wavelength
    M2: 1.0,       // Perfect Gaussian beam
  };

  const testLens: LensParameters = {
    f: 0.1,        // 100 mm focal length
    z: 0.0,        // At origin
    diameter: 0.025, // 25 mm diameter
    name: 'Test Lens',
  };

  describe('rayleighRange', () => {
    it('should calculate correct Rayleigh range', () => {
      const zR = GaussianBeamCalculator.rayleighRange(testBeam.w0, testBeam.lambda, testBeam.M2);
      const expected = (Math.PI * testBeam.w0 * testBeam.w0) / testBeam.lambda;
      expect(zR).toBeCloseTo(expected, 6);
    });
  });

  describe('beamRadius', () => {
    it('should return beam waist at z=z0', () => {
      const radius = GaussianBeamCalculator.beamRadius(testBeam, testBeam.z0);
      expect(radius).toBeCloseTo(testBeam.w0, 10);
    });

    it('should calculate correct beam radius at Rayleigh range', () => {
      const zR = GaussianBeamCalculator.rayleighRange(testBeam.w0, testBeam.lambda, testBeam.M2);
      const radius = GaussianBeamCalculator.beamRadius(testBeam, testBeam.z0 + zR);
      const expected = testBeam.w0 * Math.sqrt(2);
      expect(radius).toBeCloseTo(expected, 6);
    });
  });

  describe('radiusOfCurvature', () => {
    it('should return infinity at beam waist', () => {
      const R = GaussianBeamCalculator.radiusOfCurvature(testBeam, testBeam.z0);
      expect(R).toBe(Infinity);
    });

    it('should calculate correct radius of curvature', () => {
      const zR = GaussianBeamCalculator.rayleighRange(testBeam.w0, testBeam.lambda, testBeam.M2);
      const R = GaussianBeamCalculator.radiusOfCurvature(testBeam, testBeam.z0 + zR);
      const expected = 2 * zR;
      expect(R).toBeCloseTo(expected, 6);
    });
  });

  describe('gouyPhase', () => {
    it('should return 0 at beam waist', () => {
      const phi = GaussianBeamCalculator.gouyPhase(testBeam, testBeam.z0);
      expect(phi).toBeCloseTo(0, 6);
    });

    it('should return 45 degrees at Rayleigh range', () => {
      const zR = GaussianBeamCalculator.rayleighRange(testBeam.w0, testBeam.lambda, testBeam.M2);
      const phi = GaussianBeamCalculator.gouyPhase(testBeam, testBeam.z0 + zR);
      expect(phi).toBeCloseTo(45, 6);
    });
  });

  describe('focusedSpotSize', () => {
    it('should calculate correct focused spot size', () => {
      const spotSize = GaussianBeamCalculator.focusedSpotSize(testBeam, testLens.f);
      const expected = (4 * testLens.f * testBeam.lambda * testBeam.M2!) / (Math.PI * 2 * testBeam.w0);
      expect(spotSize).toBeCloseTo(expected, 10);
    });
  });

  describe('propagateThroughLens', () => {
    it('should transform beam parameters correctly', () => {
      const outputBeam = GaussianBeamCalculator.propagateThroughLens(testBeam, testLens);
      
      // Basic sanity checks
      expect(outputBeam.lambda).toBe(testBeam.lambda);
      expect(outputBeam.M2).toBe(testBeam.M2);
      expect(typeof outputBeam.w0).toBe('number');
      expect(typeof outputBeam.z0).toBe('number');
      expect(outputBeam.w0).toBeGreaterThan(0);
    });
  });

  describe('generatePropagationData', () => {
    it('should generate correct number of data points', () => {
      const zRange: [number, number] = [0, 1];
      const resolution = 50;
      const data = GaussianBeamCalculator.generatePropagationData(testBeam, zRange, resolution);
      
      expect(data).toHaveLength(resolution);
      
      // Check data structure
      data.forEach(point => {
        expect(point).toHaveProperty('z');
        expect(point).toHaveProperty('w');
        expect(point).toHaveProperty('R');
        expect(point).toHaveProperty('phi');
        expect(point).toHaveProperty('intensity');
      });
    });

    it('should have correct z range', () => {
      const zRange: [number, number] = [-0.5, 0.5];
      const data = GaussianBeamCalculator.generatePropagationData(testBeam, zRange, 10);
      
      expect(data[0].z).toBeCloseTo(zRange[0], 6);
      expect(data[data.length - 1].z).toBeCloseTo(zRange[1], 6);
    });
  });
});



