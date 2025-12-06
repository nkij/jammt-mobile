import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, DataTable, Divider } from 'react-native-paper';
import { BeamParameters, LensParameters } from '../utils/beamCalculations';

interface CalculationResultsProps {
  inputBeam: BeamParameters;
  outputBeam: BeamParameters;
  lens: LensParameters;
  focusedSpotSize?: number;
  rayleighRange?: number;
}

const CalculationResults: React.FC<CalculationResultsProps> = ({
  inputBeam,
  outputBeam,
  lens,
  focusedSpotSize,
  rayleighRange
}) => {
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

  const calculateRayleighRange = (w0: number, lambda: number, M2: number = 1.0) => {
    return (Math.PI * w0 * w0 * M2) / lambda;
  };

  const inputRayleigh = calculateRayleighRange(inputBeam.w0, inputBeam.lambda, inputBeam.M2);
  const outputRayleigh = calculateRayleighRange(outputBeam.w0, outputBeam.lambda, outputBeam.M2);

  return (
    <Card style={styles.card}>
      <Card.Title title="Calculation Results" />
      <Card.Content>
        <ScrollView style={styles.scrollView}>
          {/* Input Beam Parameters */}
          <Text style={styles.sectionTitle}>Input Beam Parameters</Text>
          <DataTable>
            <DataTable.Row>
              <DataTable.Cell>Beam Waist</DataTable.Cell>
              <DataTable.Cell numeric>
                {formatValue(inputBeam.w0, 'm')}
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Waist Position</DataTable.Cell>
              <DataTable.Cell numeric>
                {formatValue(inputBeam.z0, 'm')}
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Wavelength</DataTable.Cell>
              <DataTable.Cell numeric>
                {formatValue(inputBeam.lambda, 'm')}
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>M² Factor</DataTable.Cell>
              <DataTable.Cell numeric>
                {inputBeam.M2?.toFixed(2) || '1.00'}
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Rayleigh Range</DataTable.Cell>
              <DataTable.Cell numeric>
                {formatValue(inputRayleigh, 'm')}
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>

          <Divider style={styles.divider} />

          {/* Lens Parameters */}
          <Text style={styles.sectionTitle}>Lens Parameters</Text>
          <DataTable>
            <DataTable.Row>
              <DataTable.Cell>Name</DataTable.Cell>
              <DataTable.Cell numeric>
                {lens.name || 'Unnamed'}
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Focal Length</DataTable.Cell>
              <DataTable.Cell numeric>
                {formatValue(lens.f, 'm')}
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Position</DataTable.Cell>
              <DataTable.Cell numeric>
                {formatValue(lens.z, 'm')}
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Diameter</DataTable.Cell>
              <DataTable.Cell numeric>
                {formatValue(lens.diameter || 0.025, 'm')}
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>

          <Divider style={styles.divider} />

          {/* Output Beam Parameters */}
          <Text style={styles.sectionTitle}>Output Beam Parameters</Text>
          <DataTable>
            <DataTable.Row>
              <DataTable.Cell>New Beam Waist</DataTable.Cell>
              <DataTable.Cell numeric>
                {formatValue(outputBeam.w0, 'm')}
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>New Waist Position</DataTable.Cell>
              <DataTable.Cell numeric>
                {formatValue(outputBeam.z0, 'm')}
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>New Rayleigh Range</DataTable.Cell>
              <DataTable.Cell numeric>
                {formatValue(outputRayleigh, 'm')}
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>Magnification</DataTable.Cell>
              <DataTable.Cell numeric>
                {(outputBeam.w0 / inputBeam.w0).toFixed(3)}
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>

          {focusedSpotSize && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.sectionTitle}>Focusing Results</Text>
              <DataTable>
                <DataTable.Row>
                  <DataTable.Cell>Focused Spot Size</DataTable.Cell>
                  <DataTable.Cell numeric>
                    {formatValue(focusedSpotSize, 'm')}
                  </DataTable.Cell>
                </DataTable.Row>
                <DataTable.Row>
                  <DataTable.Cell>Focal Spot Diameter</DataTable.Cell>
                  <DataTable.Cell numeric>
                    {formatValue(focusedSpotSize * 2, 'm')}
                  </DataTable.Cell>
                </DataTable.Row>
              </DataTable>
            </>
          )}
        </ScrollView>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    elevation: 4,
  },
  scrollView: {
    maxHeight: 400,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  divider: {
    marginVertical: 10,
  },
});

export default CalculationResults;
