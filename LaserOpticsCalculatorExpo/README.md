# Laser Optics Calculator - Expo Version

A mobile application that replicates the functionality of JAMMT (Java-based laser beam analysis tool) for Gaussian beam propagation calculations and optical system design.

## 🚀 Quick Start with Expo Go

### Prerequisites
- [Expo Go app](https://expo.dev/client) installed on your phone (iOS/Android)
- Node.js installed on your computer

### Running the App

1. **Install dependencies:**
   ```bash
   cd LaserOpticsCalculatorExpo
   npm install
   ```

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Open on your phone:**
   - Scan the QR code with your phone's camera (iOS) or Expo Go app (Android)
   - The app will load directly on your device!

### Alternative Methods

**Web Browser:**
```bash
npx expo start --web
```

**iOS Simulator (macOS only):**
```bash
npx expo start --ios
```

**Android Emulator:**
```bash
npx expo start --android
```

## 📱 Features

### Core Functionality
- **Beam Parameter Input**: Specify starting beam waist, wavelength, and beam quality factor (M²)
- **Lens Configuration**: Define lens focal length, position, and diameter
- **Real-time Calculations**: 
  - Beam propagation through lenses
  - Focused spot size calculation
  - Rayleigh range determination
  - Gouy phase calculation
  - Beam radius of curvature

### User Interface
- **Modern Design**: Material Design with React Native Paper
- **Responsive Layout**: Optimized for mobile devices
- **Real-time Updates**: Calculations update as you type
- **Comprehensive Results**: Detailed parameter display and beam propagation data

### Key Calculations
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

## 🧮 Example Usage

1. **Input your beam parameters:**
   - Beam Waist: 170 μm
   - Waist Position: 900 mm
   - Wavelength: 1550 nm
   - M² Factor: 1.0

2. **Configure your lens:**
   - Focal Length: 100 mm
   - Position: 0 mm

3. **View results:**
   - Rayleigh Range: 58.6 mm
   - Focused Spot Size: 2.96 μm
   - Output Beam Waist: 29.6 μm
   - Magnification: 0.174

## 📊 What You'll See

The app displays:
- **Input Parameters**: Your beam and lens settings
- **Calculation Results**: Key metrics like Rayleigh range, focused spot size
- **Output Parameters**: Transformed beam parameters after the lens
- **Beam Propagation Data**: Detailed table showing beam radius and Gouy phase at different positions

## 🔧 Technical Details

### Built With
- **Expo**: Cross-platform development framework
- **React Native**: Mobile app framework
- **TypeScript**: Type-safe development
- **React Native Paper**: Material Design components

### Mathematical Foundation
The app implements standard Gaussian beam optics theory:
- Complex beam parameter formalism
- ABCD matrix transformations
- Beam quality factor (M²) support

## 🆚 Comparison with Original JAMMT

| Feature | JAMMT (Desktop) | Mobile App |
|---------|----------------|------------|
| Beam Parameters | ✅ | ✅ |
| Lens Configuration | ✅ | ✅ |
| Propagation Calculations | ✅ | ✅ |
| Real-time Updates | ✅ | ✅ |
| Mobile Interface | ❌ | ✅ |
| Easy Testing | ❌ | ✅ (Expo Go) |

## 🐛 Troubleshooting

**App won't load in Expo Go:**
- Make sure you're connected to the same WiFi network as your computer
- Try refreshing the QR code
- Check that the development server is running

**Calculations seem wrong:**
- Verify your input units (μm, mm, nm)
- Check that M² factor is reasonable (typically 1.0-5.0)
- Ensure focal length is positive for converging lenses

**Performance issues:**
- Close other apps on your phone
- Try restarting the Expo development server

## 📱 Testing on Different Devices

The app works on:
- **iOS**: iPhone and iPad (iOS 13+)
- **Android**: Android 6+ devices
- **Web**: Modern browsers (limited functionality)

## 🔄 Updates

To update the app:
1. Pull latest changes: `git pull`
2. Install new dependencies: `npm install`
3. Restart Expo: `npx expo start`

## 📞 Support

If you encounter issues:
1. Check the console output in your terminal
2. Try restarting the Expo development server
3. Clear Expo Go cache and reload the app

---

**Enjoy calculating laser beam propagation on your mobile device! 🔬📱**



