# Laser Optics Calculator Mobile App

A React Native mobile application that replicates the functionality of JAMMT (Java-based laser beam analysis tool) for Gaussian beam propagation calculations and optical system design.

## Features

Based on the original JAMMT application, this mobile app provides:

### Core Functionality
- **Beam Parameter Input**: Specify starting beam waist, wavelength, and beam quality factor (M²)
- **Lens Configuration**: Define lens focal length, position, and diameter
- **Real-time Calculations**: 
  - Beam propagation through lenses
  - Focused spot size calculation
  - Rayleigh range determination
  - Gouy phase calculation
  - Beam radius of curvature

### Visualization
- **Beam Propagation Plot**: Graphical representation of beam radius vs. position
- **Parameter Display**: Comprehensive results showing input/output beam parameters
- **Statistics**: Key metrics like maximum/minimum beam radius

### Key Calculations Implemented

1. **Gaussian Beam Propagation**
   - Beam radius: `w(z) = w₀√(1 + ((z-z₀)/zR)²)`
   - Rayleigh range: `zR = πw₀²M²/λ`
   - Radius of curvature: `R(z) = (z-z₀)(1 + (zR/(z-z₀))²)`

2. **Lens Transformation**
   - ABCD matrix formalism for thin lenses
   - Beam parameter transformation through optical elements

3. **Focusing Calculations**
   - Focused spot size: `s = 4fλM²/(πd)`
   - Depth of focus calculations

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- React Native development environment
- iOS Simulator (for iOS) or Android Studio (for Android)

### Installation Steps

1. **Install Dependencies**
   ```bash
   cd LaserOpticsCalculator
   npm install
   ```

2. **iOS Setup** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Run the App**
   
   For iOS:
   ```bash
   npm run ios
   ```
   
   For Android:
   ```bash
   npm run android
   ```

## Usage

### Input Parameters

1. **Beam Parameters**
   - **Beam Waist**: Initial beam waist radius (in micrometers)
   - **Waist Position**: Position of the beam waist along the optical axis (in millimeters)
   - **Wavelength**: Laser wavelength (in nanometers)
   - **M² Factor**: Beam quality factor (1.0 for perfect Gaussian beam)

2. **Lens Parameters**
   - **Name**: Identifier for the lens
   - **Focal Length**: Lens focal length (in millimeters)
   - **Position**: Lens position along optical axis (in millimeters)
   - **Diameter**: Lens aperture diameter (in millimeters)

### Output Results

The app provides comprehensive results including:
- Input beam parameters and calculated Rayleigh range
- Lens configuration details
- Output beam parameters after lens transformation
- Magnification ratio
- Focused spot size (if applicable)
- Beam propagation visualization

## Technical Implementation

### Architecture
- **React Native**: Cross-platform mobile framework
- **TypeScript**: Type-safe development
- **React Native Paper**: Material Design UI components
- **React Native Chart Kit**: Data visualization

### Key Components
- `GaussianBeamCalculator`: Core calculation engine
- `BeamParameterInput`: Input form for beam parameters
- `LensParameterInput`: Input form for lens parameters
- `BeamVisualization`: Chart component for beam propagation
- `CalculationResults`: Results display component

### Mathematical Foundation

The app implements the standard Gaussian beam optics theory:

- **Complex Beam Parameter**: `q = z + izR`
- **ABCD Matrix Formalism**: For optical element transformations
- **Beam Quality**: M² factor for non-ideal beams

## Comparison with Original JAMMT

This mobile app replicates the core functionality of the original JAMMT desktop application:

| Feature | JAMMT (Desktop) | Mobile App |
|---------|----------------|------------|
| Beam Parameters | ✅ | ✅ |
| Lens Configuration | ✅ | ✅ |
| Propagation Calculations | ✅ | ✅ |
| Visualization | ✅ | ✅ |
| Multiple Lenses | ✅ | 🔄 (Basic) |
| Cavity Analysis | ✅ | ❌ |
| Database Management | ✅ | ❌ |
| Advanced Fitting | ✅ | ❌ |

## Future Enhancements

Potential improvements for future versions:
- Multiple lens systems
- Cavity resonator analysis
- Material database integration
- Advanced mode matching algorithms
- Export functionality
- Save/load configurations

## License

This project is based on the open-source JAMMT application and maintains compatibility with its core functionality while providing a modern mobile interface.

## Contributing

Contributions are welcome! Areas for improvement:
- Enhanced calculation accuracy
- Additional optical elements
- Improved visualization
- Performance optimizations
- Cross-platform compatibility improvements