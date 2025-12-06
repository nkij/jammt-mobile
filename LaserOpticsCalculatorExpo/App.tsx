/**
 * Laser Optics Calculator - Expo App
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
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Provider as PaperProvider, Appbar, FAB, Card, Text, TextInput, DataTable, Button, Dialog, Portal, MD3LightTheme } from 'react-native-paper';
import {
  BeamParameters,
  LensParameters,
  GaussianBeamCalculator,
} from './src/utils/beamCalculations';
import BeamVisualization from './src/components/BeamVisualization';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    background: '#ffffff',
    surface: '#ffffff',
    onSurface: '#000000',
    onBackground: '#000000',
  },
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // Default beam parameters
  const [inputBeam, setInputBeam] = useState<BeamParameters>({
    w0: 160e-6, // 160 μm beam waist
    z0: 0,      // 0 mm waist position
    lambda: 1064e-9, // 1064 nm wavelength
    M2: 1.0,    // Perfect Gaussian beam
  });

  const [lens, setLens] = useState<LensParameters>({
    f: 175e-3,  // 175 mm focal length
    z: 500e-3,  // 500 mm position
    diameter: 0.025, // 25 mm diameter
    name: 'L1',
  });

  const [outputBeam, setOutputBeam] = useState<BeamParameters>(inputBeam);
  const [propagationData, setPropagationData] = useState<any[]>([]);
  const [showData, setShowData] = useState(false);
  const [errorDialog, setErrorDialog] = useState({ visible: false, message: '' });

  // Input validation functions
  const validateInput = (value: number, field: string, min: number = 0, max: number = Infinity): boolean => {
    if (isNaN(value) || !isFinite(value)) {
      setErrorDialog({ 
        visible: true, 
        message: `Invalid ${field}: Please enter a valid number.` 
      });
      return false;
    }
    if (value < min) {
      setErrorDialog({ 
        visible: true, 
        message: `${field} must be at least ${min}.` 
      });
      return false;
    }
    if (value > max) {
      setErrorDialog({ 
        visible: true, 
        message: `${field} must be no more than ${max}.` 
      });
      return false;
    }
    return true;
  };

  const validateBeamParameters = (beam: BeamParameters): boolean => {
    if (!validateInput(beam.w0, 'Beam waist', 1e-9, 1e-2)) return false; // 1nm to 10mm
    if (!validateInput(beam.lambda, 'Wavelength', 1e-9, 1e-5)) return false; // 1nm to 10μm
    if (!validateInput(beam.M2 || 1.0, 'M² factor', 0.1, 100)) return false;
    return true;
  };

  const validateLensParameters = (lens: LensParameters): boolean => {
    if (!validateInput(lens.f, 'Focal length', 1e-6, 10)) return false; // 1μm to 10m
    if (!validateInput(lens.z, 'Lens position', -10, 10)) return false; // -10m to 10m
    return true;
  };

  // Calculate beam propagation when parameters change
  const calculatePropagation = useCallback(() => {
    try {
      // Validate inputs first
      if (!validateBeamParameters(inputBeam)) {
        return;
      }
      if (!validateLensParameters(lens)) {
        return;
      }

      // Calculate output beam after lens
      const newOutputBeam = GaussianBeamCalculator.propagateThroughLens(inputBeam, lens);
      setOutputBeam(newOutputBeam);

      // Generate propagation data for visualization
      // Show beam profile from input waist to output waist
      const inputZ = inputBeam.z0;
      const outputZ = newOutputBeam.z0;
      const lensZ = lens.z;
      
      // Create a range that covers the entire beam path
      const startZ = Math.min(inputZ - 0.5, lensZ - 0.5); // 500mm before input waist or lens
      const endZ = Math.max(outputZ + 0.5, lensZ + 0.5);   // 500mm after output waist or lens
      const zRange: [number, number] = [startZ, endZ];
      
      // Generate data points for the entire range
      const numPoints = 50;
      const data = [];
      const step = (endZ - startZ) / (numPoints - 1);
      
      for (let i = 0; i < numPoints; i++) {
        const z = startZ + i * step;
        let beamRadius: number;
        
        if (z <= lensZ) {
          // Before or at lens - use input beam propagation
          beamRadius = GaussianBeamCalculator.beamRadius(inputBeam, z);
        } else {
          // After lens - use output beam propagation
          beamRadius = GaussianBeamCalculator.beamRadius(newOutputBeam, z);
        }
        
        const gouyPhase = GaussianBeamCalculator.gouyPhase(inputBeam, z);
        
        data.push({
          z,
          w: beamRadius,
          phi: gouyPhase
        });
      }
      
      setPropagationData(data);
    } catch (error) {
      console.error('Calculation error:', error);
      setErrorDialog({ 
        visible: true, 
        message: 'Calculation error: Invalid input parameters. Please check your values.' 
      });
    }
  }, [inputBeam, lens]);

  // Calculate focused spot size
  const focusedSpotSize = GaussianBeamCalculator.focusedSpotSize(inputBeam, lens.f);
  const rayleighRange = GaussianBeamCalculator.rayleighRange(inputBeam.w0, inputBeam.lambda, inputBeam.M2);

  // Helper function to clean up floating point precision issues
  const cleanFloat = (value: number, decimals: number = 10) => {
    // Use toFixed for better control over decimal places instead of toPrecision
    return parseFloat(value.toFixed(decimals));
  };

  // Helper function to format display values without losing precision
  const formatDisplayValue = (value: number, multiplier: number = 1) => {
    const displayValue = value * multiplier;
    // Only clean up if there are floating point artifacts (like 0.0000000001)
    if (Math.abs(displayValue - Math.round(displayValue)) < 1e-10) {
      return Math.round(displayValue).toString();
    }
    return displayValue.toString();
  };

  // Update beam parameters
  const updateBeamParameter = useCallback((field: keyof BeamParameters, value: number) => {
    setInputBeam(prev => ({ ...prev, [field]: cleanFloat(value) }));
  }, []);

  // Update lens parameters
  const updateLensParameter = useCallback((field: keyof LensParameters, value: number | string) => {
    if (typeof value === 'number') {
      setLens(prev => ({ ...prev, [field]: cleanFloat(value) }));
    } else {
      setLens(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  const formatValue = (value: number, unit: string, decimals: number = 3) => {
    if (Math.abs(value) < 1e-10) return '0';
    if (Math.abs(value) < 1e-3) {
      return `${(value * 1e6).toFixed(decimals)} μ${unit}`;
    } else if (Math.abs(value) < 1) {
      return `${(value * 1e3).toFixed(decimals)} m${unit}`;
    } else {
      return `${value.toFixed(decimals)} ${unit}`;
    }
  };


  const backgroundStyle = {
    backgroundColor: '#ffffff',
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={[styles.container, backgroundStyle]}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="#ffffff"
          />
          
          <Appbar.Header>
            <Appbar.Content title="Jammt Mobile" subtitle="Gaussian Beam Analysis" />
            <Appbar.Action 
              icon="keyboard-close" 
              onPress={Keyboard.dismiss}
              accessibilityLabel="Dismiss Keyboard"
            />
          </Appbar.Header>

          <ScrollView 
            style={styles.scrollView} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            bounces={true}
            scrollEventThrottle={16}
            nestedScrollEnabled={true}
          >
            <View style={styles.content}>
            {/* Input Parameters */}
            <Card style={styles.card}>
              <Card.Title title="Input Beam Parameters" />
              <Card.Content>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    <Text style={styles.symbol}>w₀</Text> Beam Waist (μm)
                  </Text>
                  <TextInput
                    mode="outlined"
                    value={formatDisplayValue(inputBeam.w0, 1e6)}
                    onChangeText={(text) => {
                      const value = parseFloat(text) || 0;
                      updateBeamParameter('w0', value * 1e-6);
                    }}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    <Text style={styles.symbol}>z₀</Text> Waist Position (mm)
                  </Text>
                  <TextInput
                    mode="outlined"
                    value={formatDisplayValue(inputBeam.z0, 1000)}
                    onChangeText={(text) => {
                      const value = parseFloat(text) || 0;
                      updateBeamParameter('z0', value * 1e-3);
                    }}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    <Text style={styles.symbol}>λ</Text> Wavelength (nm)
                  </Text>
                  <TextInput
                    mode="outlined"
                    value={formatDisplayValue(inputBeam.lambda, 1e9)}
                    onChangeText={(text) => {
                      const value = parseFloat(text) || 0;
                      updateBeamParameter('lambda', value * 1e-9);
                    }}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    <Text style={styles.symbol}>M²</Text> M² Factor
                  </Text>
                  <TextInput
                    mode="outlined"
                    value={formatDisplayValue(inputBeam.M2 || 1.0, 1)}
                    onChangeText={(text) => {
                      const value = parseFloat(text) || 1.0;
                      updateBeamParameter('M2', value);
                    }}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
              </Card.Content>
            </Card>

            {/* Lens Parameters */}
            <Card style={styles.card}>
              <Card.Title title={`Lens: ${lens.name || 'Unnamed'}`} />
              <Card.Content>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    <Text style={styles.symbol}>⚬</Text> Name
                  </Text>
                  <TextInput
                    mode="outlined"
                    value={lens.name || ''}
                    onChangeText={(text) => updateLensParameter('name', text)}
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    <Text style={styles.symbol}>f</Text> Focal Length (mm)
                  </Text>
                  <TextInput
                    mode="outlined"
                    value={formatDisplayValue(lens.f, 1000)}
                    onChangeText={(text) => {
                      const value = parseFloat(text) || 0;
                      updateLensParameter('f', value * 1e-3);
                    }}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>
                    <Text style={styles.symbol}>z</Text> Position (mm)
                  </Text>
                  <TextInput
                    mode="outlined"
                    value={formatDisplayValue(lens.z, 1000)}
                    onChangeText={(text) => {
                      const value = parseFloat(text) || 0;
                      updateLensParameter('z', value * 1e-3);
                    }}
                    keyboardType="numeric"
                    style={styles.input}
                  />
                </View>
              </Card.Content>
            </Card>

            {/* Results */}
            <Card style={styles.card}>
              <Card.Title title="Calculation Results" />
              <Card.Content>
                <DataTable>
                  <DataTable.Row>
                    <DataTable.Cell>Rayleigh Range</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {formatValue(rayleighRange, 'm')}
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Focused Spot Size</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {formatValue(focusedSpotSize, 'm')}
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Output Beam Waist</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {formatValue(outputBeam.w0, 'm')}
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Output Waist Position</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {formatValue(outputBeam.z0, 'm')}
                    </DataTable.Cell>
                  </DataTable.Row>
                  <DataTable.Row>
                    <DataTable.Cell>Magnification</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {(outputBeam.w0 / inputBeam.w0).toFixed(3)}
                    </DataTable.Cell>
                  </DataTable.Row>
                </DataTable>
              </Card.Content>
            </Card>

            {/* Beam Propagation Data */}
            <Card style={styles.card}>
              <Card.Title title="Beam Propagation Data" />
              <Card.Content>
                <Button 
                  mode="outlined" 
                  onPress={() => setShowData(!showData)}
                  style={styles.button}
                >
                  {showData ? 'Hide' : 'Show'} Propagation Data
                </Button>
                
                {showData && propagationData.length > 0 && (
                  <DataTable>
                    <DataTable.Header>
                      <DataTable.Title>Position (mm)</DataTable.Title>
                      <DataTable.Title numeric>Radius (μm)</DataTable.Title>
                      <DataTable.Title numeric>Gouy Phase (°)</DataTable.Title>
                    </DataTable.Header>
                    {propagationData.slice(0, 10).map((point, index) => (
                      <DataTable.Row key={index}>
                        <DataTable.Cell>{(point.z * 1000).toFixed(1)}</DataTable.Cell>
                        <DataTable.Cell numeric>{(point.w * 1e6).toFixed(1)}</DataTable.Cell>
                        <DataTable.Cell numeric>{point.phi.toFixed(1)}</DataTable.Cell>
                      </DataTable.Row>
                    ))}
                    {propagationData.length > 10 && (
                      <DataTable.Row>
                        <DataTable.Cell>...</DataTable.Cell>
                        <DataTable.Cell numeric>...</DataTable.Cell>
                        <DataTable.Cell numeric>...</DataTable.Cell>
                      </DataTable.Row>
                    )}
                  </DataTable>
                )}
              </Card.Content>
            </Card>

            {/* Beam Visualization */}
            <BeamVisualization
              propagationData={propagationData}
              inputBeam={inputBeam}
              outputBeam={outputBeam}
              lens={lens}
              title="Beam Propagation Visualization"
            />

            {/* Invisible touchable area for keyboard dismissal */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.keyboardDismissArea} />
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>

        <FAB
          style={styles.fab}
          icon="calculator"
          label="Calculate"
          onPress={calculatePropagation}
        />

        {/* Error Dialog */}
        <Portal>
          <Dialog visible={errorDialog.visible} onDismiss={() => setErrorDialog({ visible: false, message: '' })}>
            <Dialog.Title>Input Error</Dialog.Title>
            <Dialog.Content>
              <Text>{errorDialog.message}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setErrorDialog({ visible: false, message: '' })}>
                OK
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
  card: {
    margin: 10,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: '#000000',
  },
  symbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6200ee',
    marginRight: 6,
  },
  input: {
    backgroundColor: '#fff',
  },
  button: {
    marginBottom: 15,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  keyboardDismissArea: {
    height: 100,
    backgroundColor: 'transparent',
  },
});

export default App;