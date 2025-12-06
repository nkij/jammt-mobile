/**
 * Laser Beam Propagation Calculations
 * Based on JAMMT functionality for Gaussian beam analysis
 */

export interface BeamParameters {
  w0: number;        // Beam waist radius (m)
  z0: number;        // Waist position (m)
  lambda: number;    // Wavelength (m)
  M2?: number;       // Beam quality factor (default 1.0)
}

export interface LensParameters {
  f: number;         // Focal length (m)
  z: number;         // Position (m)
  diameter?: number; // Lens diameter (m)
  name?: string;
}

export interface BeamPropagation {
  z: number;         // Position along propagation axis
  w: number;         // Beam radius at position z
  R: number;         // Radius of curvature
  phi: number;       // Gouy phase
  intensity: number; // Relative intensity
}

export class GaussianBeamCalculator {
  /**
   * Calculate beam radius at distance z from waist
   */
  static beamRadius(beamParams: BeamParameters, z: number): number {
    const { w0, lambda, M2 = 1.0 } = beamParams;
    const zR = this.rayleighRange(w0, lambda, M2);
    return w0 * Math.sqrt(1 + Math.pow((z - beamParams.z0) / zR, 2));
  }

  /**
   * Calculate Rayleigh range
   */
  static rayleighRange(w0: number, lambda: number, M2: number = 1.0): number {
    return (Math.PI * w0 * w0 * M2) / lambda;
  }

  /**
   * Calculate radius of curvature
   */
  static radiusOfCurvature(beamParams: BeamParameters, z: number): number {
    const { w0, z0, lambda, M2 = 1.0 } = beamParams;
    const zR = this.rayleighRange(w0, lambda, M2);
    const deltaZ = z - z0;
    
    if (Math.abs(deltaZ) < 1e-10) return Infinity;
    return deltaZ * (1 + Math.pow(zR / deltaZ, 2));
  }

  /**
   * Calculate Gouy phase
   */
  static gouyPhase(beamParams: BeamParameters, z: number): number {
    const { w0, z0, lambda, M2 = 1.0 } = beamParams;
    const zR = this.rayleighRange(w0, lambda, M2);
    return Math.atan((z - z0) / zR) * (180 / Math.PI); // Convert to degrees
  }

  /**
   * Calculate beam propagation through a lens using ABCD matrix formalism
   */
  static propagateThroughLens(
    beamParams: BeamParameters, 
    lens: LensParameters
  ): BeamParameters {
    const { w0, z0, lambda, M2 = 1.0 } = beamParams;
    const { f } = lens;
    
    // Calculate q parameter before lens
    const zR = this.rayleighRange(w0, lambda, M2);
    const deltaZ = z0 - lens.z;
    
    // ABCD matrix for lens
    const A = 1;
    const B = 0;
    const C = -1 / f;
    const D = 1;
    
    // Calculate q parameter after lens: q2 = (A*q1 + B)/(C*q1 + D)
    // For complex q = qReal + i*qImag
    const q1Real = deltaZ;
    const q1Imag = zR;
    
    const denominator = C * q1Real + D;
    const q2Real = (A * q1Real + B) / denominator;
    const q2Imag = q1Imag / denominator;
    
    // Extract new beam parameters from complex q parameter
    // q = z - z0 + i*zR, so zR = -1/Im(q) and z0 = z - Re(q)
    if (Math.abs(q2Imag) < 1e-10) {
      // Handle case where beam is collimated (infinite Rayleigh range)
      return {
        w0: w0,
        z0: lens.z + q2Real,
        lambda,
        M2
      };
    }
    
    const newZR = -1 / q2Imag;
    if (newZR < 0) {
      // This shouldn't happen for physical beams, but handle it gracefully
      return {
        w0: w0,
        z0: lens.z + q2Real,
        lambda,
        M2
      };
    }
    
    const newW0 = Math.sqrt(newZR * lambda / (Math.PI * M2));
    const newZ0 = lens.z - q2Real;
    
    return {
      w0: newW0,
      z0: newZ0,
      lambda,
      M2
    };
  }

  /**
   * Calculate focused spot size
   */
  static focusedSpotSize(beamParams: BeamParameters, focalLength: number): number {
    const { w0, lambda, M2 = 1.0 } = beamParams;
    const beamDiameter = 2 * w0;
    return (4 * focalLength * lambda * M2) / (Math.PI * beamDiameter);
  }

  /**
   * Generate beam propagation data for plotting
   */
  static generatePropagationData(
    beamParams: BeamParameters, 
    zRange: [number, number], 
    resolution: number = 100
  ): BeamPropagation[] {
    const [zMin, zMax] = zRange;
    const step = (zMax - zMin) / (resolution - 1);
    const data: BeamPropagation[] = [];
    
    for (let i = 0; i < resolution; i++) {
      const z = zMin + i * step;
      const w = this.beamRadius(beamParams, z);
      const R = this.radiusOfCurvature(beamParams, z);
      const phi = this.gouyPhase(beamParams, z);
      
      // Calculate relative intensity (inverse of beam area)
      const intensity = Math.pow(beamParams.w0 / w, 2);
      
      data.push({ z, w, R, phi, intensity });
    }
    
    return data;
  }

  /**
   * Find optimal lens position for mode matching
   */
  static findOptimalLensPosition(
    inputBeam: BeamParameters,
    targetBeam: BeamParameters,
    lensFocalLength: number
  ): number[] {
    // This is a simplified version - the full JAMMT has more sophisticated algorithms
    const solutions: number[] = [];
    
    // Calculate required magnification
    const magnification = targetBeam.w0 / inputBeam.w0;
    
    // For thin lens approximation
    const zR_input = this.rayleighRange(inputBeam.w0, inputBeam.lambda, inputBeam.M2);
    const zR_target = this.rayleighRange(targetBeam.w0, targetBeam.lambda, targetBeam.M2);
    
    // Simplified calculation - in practice, this would be more complex
    const d1 = zR_input * Math.sqrt(magnification - 1);
    const d2 = lensFocalLength * magnification;
    
    solutions.push(inputBeam.z0 + d1);
    solutions.push(inputBeam.z0 - d1);
    
    return solutions;
  }
}

