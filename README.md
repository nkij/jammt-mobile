# jamMT Mobile

The original jamMT was created by [Ian MacMillan](https://www.ian-macmillan.com/JamMT/). I've always wanted a more user friendly version of it so this is my attempt to create one. I've checked the answer from this app against alamode and jamMT itself. 

## 🚀 Quick Start (Easiest Option)

For a quick calculation without any setup, simply open the standalone HTML file:

**📄 [`jamMT-mobile.html`](jamMT-mobile.html)**

Just open this file in any modern web browser - no installation, no dependencies, no setup required! Perfect for:
- Quick beam propagation calculations
- Testing parameters on the fly
- Demonstrations or presentations
- When you don't want to install anything

The HTML version includes:
- Full Gaussian beam propagation calculations
- Lens transformation analysis
- Interactive beam visualization
- All calculations matching the mobile app

---

## 📱 Mobile App Option

For a more complete experience with mobile-friendly interfaces, use the Expo mobile app version:

**📁 [`LaserOpticsCalculatorExpo/`](LaserOpticsCalculatorExpo/)**

The Expo version is the easiest way to get a mobile app running:

- ✅ **Quick Setup**: Minimal configuration required
- ✅ **Test on Your Phone**: Use Expo Go app (no build needed)
- ✅ **Cross-Platform**: Works on iOS, Android, and Web
- ✅ **Live Reload**: See changes instantly

**Setup:**
```bash
cd LaserOpticsCalculatorExpo
npm install
npx expo start
```

See the [full README](LaserOpticsCalculatorExpo/README.md) for detailed instructions.

---

## 📊 Feature Comparison

| Feature | HTML File | Expo Version |
|---------|-----------|--------------|
| **Setup Time** | Instant | ~5 minutes |
| **Dependencies** | None | Node.js + Expo Go |
| **Platform** | Browser | iOS/Android/Web |
| **Offline Use** | ✅ | ✅ |
| **Mobile Optimized** | ⚠️ Limited | ✅ |

---

## 🔬 What Can You Calculate?

Both versions provide the same core functionality:

- **Beam Propagation**: Calculate beam radius at any position
- **Rayleigh Range**: Determine beam waist characteristics
- **Lens Transformation**: See how lenses affect beam parameters
- **Focused Spot Size**: Calculate minimum beam size after focusing
- **Beam Visualization**: Graphical representation of beam propagation
- **Gouy Phase**: Calculate phase shift through optical systems



---

## 🛠️ Technical Details

Both versions implement the same mathematical foundation:

### Core Calculations

1. **Gaussian Beam Propagation**
   - Beam radius: `w(z) = w₀√(1 + ((z-z₀)/zR)²)`
   - Rayleigh range: `zR = πw₀²M²/λ`

2. **Lens Transformation**
   - Thin lens formula with radius of curvature
   - Beam parameter transformation

3. **Focusing Calculations**
   - Focused spot size: `s = 4fλM²/(πd)`

### Mathematical Accuracy

The calculations are based on standard Gaussian beam optics theory and match the behavior of the original jamMT desktop application.

---

## 📖 Documentation

- **HTML Version**: Just open the file and start using it!
- **Expo Version**: See [`LaserOpticsCalculatorExpo/README.md`](LaserOpticsCalculatorExpo/README.md)

---

## 🤔 Which Version Should I Use?

**Use the HTML file if:**
- You need a quick calculation right now
- You don't want to install anything
- You're on a computer/tablet with a browser

**Use the Expo version if:**
- You want a mobile app experience
- You want to test on your phone quickly
- You prefer easier setup

---

## 🔄 Original jamMT

This project is based on the original **jamMT** (just another mode matching tool) desktop application created by **[Ian MacMillan](https://www.ian-macmillan.com/JamMT/)**. The original application provides more advanced features like:
- Multiple lens systems
- Cavity resonator analysis
- Material database
- Advanced fitting algorithms
- Full desktop GUI

For the original desktop application and more advanced features, visit [Ian MacMillan's jamMT page](https://www.ian-macmillan.com/JamMT/).

---

## 💡 Quick Links

- **Quick Start**: Open [`jamMT-mobile.html`](jamMT-mobile.html) in your browser
- **Mobile App**: Check out [`LaserOpticsCalculatorExpo/`](LaserOpticsCalculatorExpo/)

---

**Enjoy calculating laser beam propagation! 🔬✨**

