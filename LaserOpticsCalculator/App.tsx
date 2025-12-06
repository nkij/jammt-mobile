/**
 * Laser Optics Calculator - Mobile App
 * Based on JAMMT functionality for Gaussian beam analysis
 */

import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { Provider as PaperProvider, Appbar, FAB } from 'react-native-paper';
import {
  BeamParameters,
  LensParameters,
  GaussianBeamCalculator,
} from './src/utils/beamCalculations';
import BeamParameterInput from './src/components/BeamParameterInput';
import LensParameterInput from './src/components/LensParameterInput';
import BeamVisualization from './src/components/BeamVisualization';
import CalculationResults from './src/components/CalculationResults';

const theme = {
  colors: {
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
    surface: '#ffffff',
    text: '#000000',
    onSurface: '#000000',
    disabled: '#000000',
    placeholder: '#000000',
    backdrop: '#000000',
    onBackground: '#000000',
    notification: '#6200ee',
  },
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // Default beam parameters (similar to JAMMT example)
  const [inputBeam, setInputBeam] = useState<BeamParameters>({
    w0: 1.7e-4, // 170 μm beam waist
    z0: 0.9,    // 900 mm from reference
    lambda: 1.55e-6, // 1550 nm wavelength
    M2: 1.0,    // Perfect Gaussian beam
  });

  const [lens, setLens] = useState<LensParameters>({
    f: 0.1,     // 100 mm focal length
    z: 0.0,     // At origin
    diameter: 0.025, // 25 mm diameter
    name: 'L1',
  });

  const [outputBeam, setOutputBeam] = useState<BeamParameters>(inputBeam);
  const [propagationData, setPropagationData] = useState<any[]>([]);

  // Calculate beam propagation when parameters change
  const calculatePropagation = useCallback(() => {
    try {
      // Calculate output beam after lens
      const newOutputBeam = GaussianBeamCalculator.propagateThroughLens(inputBeam, lens);
      setOutputBeam(newOutputBeam);

      // Generate propagation data for visualization
      const zRange: [number, number] = [-0.5, 2.0]; // -500mm to 2000mm
      const data = GaussianBeamCalculator.generatePropagationData(newOutputBeam, zRange, 100);
      setPropagationData(data);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  }, [inputBeam, lens]);

  // Calculate focused spot size
  const focusedSpotSize = GaussianBeamCalculator.focusedSpotSize(inputBeam, lens.f);

  // Update beam parameters
  const updateBeamParameter = useCallback((field: keyof BeamParameters, value: number) => {
    setInputBeam(prev => ({ ...prev, [field]: value }));
  }, []);

  // Update lens parameters
  const updateLensParameter = useCallback((field: keyof LensParameters, value: number | string) => {
    setLens(prev => ({ ...prev, [field]: value }));
  }, []);

  // Recalculate when parameters change
  React.useEffect(() => {
    calculatePropagation();
  }, [calculatePropagation]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#121212' : '#f6f6f6',
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={[styles.container, backgroundStyle]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        
        <Appbar.Header>
          <Appbar.Content title="Jammt Mobile" subtitle="Gaussian Beam Analysis" />
        </Appbar.Header>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* Input Parameters */}
            <BeamParameterInput
              beamParams={inputBeam}
              onParameterChange={updateBeamParameter}
              title="Input Beam Parameters"
            />

            <LensParameterInput
              lens={lens}
              onParameterChange={updateLensParameter}
              showActions={false}
            />

            {/* Results */}
            <CalculationResults
              inputBeam={inputBeam}
              outputBeam={outputBeam}
              lens={lens}
              focusedSpotSize={focusedSpotSize}
            />

            {/* Visualization */}
            {propagationData.length > 0 && (
              <BeamVisualization
                propagationData={propagationData}
                title="Beam Propagation Visualization"
              />
            )}
          </View>
        </ScrollView>

        <FAB
          style={styles.fab}
          icon="calculator"
          label="Recalculate"
          onPress={calculatePropagation}
        />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 80, // Space for FAB
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default App;