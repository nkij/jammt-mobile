import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text, Card, Button } from 'react-native-paper';
import { LensParameters } from '../utils/beamCalculations';

interface LensParameterInputProps {
  lens: LensParameters;
  onParameterChange: (field: keyof LensParameters, value: number | string) => void;
  onAddLens?: () => void;
  onRemoveLens?: () => void;
  showActions?: boolean;
}

const LensParameterInput: React.FC<LensParameterInputProps> = ({
  lens,
  onParameterChange,
  onAddLens,
  onRemoveLens,
  showActions = true
}) => {
  return (
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
            onChangeText={(text) => onParameterChange('name', text)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            <Text style={styles.symbol}>f</Text> Focal Length (mm)
          </Text>
          <TextInput
            mode="outlined"
            value={(lens.f * 1000).toString()}
            onChangeText={(text) => {
              const value = parseFloat(text) || 0;
              onParameterChange('f', value * 1e-3);
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
            value={(lens.z * 1000).toString()}
            onChangeText={(text) => {
              const value = parseFloat(text) || 0;
              onParameterChange('z', value * 1e-3);
            }}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            <Text style={styles.symbol}>d</Text> Diameter (mm)
          </Text>
          <TextInput
            mode="outlined"
            value={((lens.diameter || 0.025) * 1000).toString()}
            onChangeText={(text) => {
              const value = parseFloat(text) || 0.025;
              onParameterChange('diameter', value * 1e-3);
            }}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        {showActions && (
          <View style={styles.buttonContainer}>
            {onAddLens && (
              <Button 
                mode="contained" 
                onPress={onAddLens}
                style={styles.button}
                icon="plus"
              >
                Add Lens
              </Button>
            )}
            {onRemoveLens && (
              <Button 
                mode="outlined" 
                onPress={onRemoveLens}
                style={styles.button}
                icon="minus"
              >
                Remove
              </Button>
            )}
          </View>
        )}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default LensParameterInput;
