import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, Card } from 'react-native-paper';
import { BeamParameters } from '../utils/beamCalculations';

interface BeamParameterInputProps {
  beamParams: BeamParameters;
  onParameterChange: (field: keyof BeamParameters, value: number) => void;
  title?: string;
}

const BeamParameterInput: React.FC<BeamParameterInputProps> = ({
  beamParams,
  onParameterChange,
  title = "Beam Parameters"
}) => {
  return (
    <Card style={styles.card}>
      <Card.Title title={title} />
      <Card.Content>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            <Text style={styles.symbol}>w₀</Text> Beam Waist (μm)
          </Text>
          <TextInput
            mode="outlined"
            value={(beamParams.w0 * 1e6).toString()}
            onChangeText={(text) => {
              const value = parseFloat(text) || 0;
              onParameterChange('w0', value * 1e-6);
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
            value={(beamParams.z0 * 1000).toString()}
            onChangeText={(text) => {
              const value = parseFloat(text) || 0;
              onParameterChange('z0', value * 1e-3);
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
            value={(beamParams.lambda * 1e9).toString()}
            onChangeText={(text) => {
              const value = parseFloat(text) || 0;
              onParameterChange('lambda', value * 1e-9);
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
            value={(beamParams.M2 || 1.0).toString()}
            onChangeText={(text) => {
              const value = parseFloat(text) || 1.0;
              onParameterChange('M2', value);
            }}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
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
    color: '#333',
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
});

export default BeamParameterInput;
