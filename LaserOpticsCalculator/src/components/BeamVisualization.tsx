import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Text, Card } from 'react-native-paper';
import { BeamPropagation } from '../utils/beamCalculations';

interface BeamVisualizationProps {
  propagationData: BeamPropagation[];
  title?: string;
}

const BeamVisualization: React.FC<BeamVisualizationProps> = ({
  propagationData,
  title = "Beam Propagation"
}) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40;

  // Prepare data for the chart
  const chartData = {
    labels: propagationData.map((_, index) => 
      index % Math.ceil(propagationData.length / 6) === 0 
        ? propagationData[index].z.toFixed(1) 
        : ''
    ),
    datasets: [
      {
        data: propagationData.map(point => point.w * 1e6), // Convert to micrometers
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 3,
      },
      {
        data: propagationData.map(point => -point.w * 1e6), // Negative values for symmetric plot
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  // Calculate key parameters
  const maxRadius = Math.max(...propagationData.map(p => p.w));
  const minRadius = Math.min(...propagationData.map(p => p.w));
  const maxRadiusUm = maxRadius * 1e6;
  const minRadiusUm = minRadius * 1e6;

  return (
    <Card style={styles.card}>
      <Card.Title title={title} />
      <Card.Content>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Max Radius</Text>
            <Text style={styles.statValue}>{maxRadiusUm.toFixed(2)} μm</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Min Radius</Text>
            <Text style={styles.statValue}>{minRadiusUm.toFixed(2)} μm</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots={false}
            withShadow={false}
            withScrollableDot={false}
          />
          <Text style={styles.chartLabel}>Beam Radius vs Position</Text>
          <Text style={styles.chartSubLabel}>Position (m) | Radius (μm)</Text>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  chartSubLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default BeamVisualization;

