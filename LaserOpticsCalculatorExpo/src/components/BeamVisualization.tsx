import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import Svg, { Path, Circle, Line, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { BeamPropagation, BeamParameters, LensParameters } from '../utils/beamCalculations';

interface BeamVisualizationProps {
  propagationData: BeamPropagation[];
  inputBeam: BeamParameters;
  outputBeam: BeamParameters;
  lens: LensParameters;
  title?: string;
}

const BeamVisualization: React.FC<BeamVisualizationProps> = ({
  propagationData,
  inputBeam,
  outputBeam,
  lens,
  title = "Beam Propagation"
}) => {
  const [screenData, setScreenData] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width: screenWidth, height: screenHeight } = screenData;
  
  // Use landscape orientation for better visualization
  const isLandscape = screenWidth > screenHeight;
  const plotWidth = isLandscape ? screenWidth : screenWidth - 40; // Use full width in landscape
  const plotHeight = isLandscape ? Math.min(screenHeight - 200, 400) : 400; // Use more height in landscape
  
  // Safety check for invalid data
  if (propagationData.length === 0 || 
      propagationData.some(p => isNaN(p.z) || isNaN(p.w) || !isFinite(p.z) || !isFinite(p.w))) {
    return (
      <Card style={styles.card}>
        <Card.Title title={title} />
        <Card.Content>
          <Text style={styles.errorText}>Invalid data: Cannot display beam visualization</Text>
        </Card.Content>
      </Card>
    );
  }

  // Calculate scale factors
  const zMin = Math.min(...propagationData.map(p => p.z));
  const zMax = Math.max(...propagationData.map(p => p.z));
  const wMax = Math.max(...propagationData.map(p => p.w));
  
  const zRange = zMax - zMin;
  const zScale = plotWidth / zRange;
  const wScale = (plotHeight * 0.8) / (wMax * 2); // Leave room for labels
  
  // Convert positions to screen coordinates with NaN protection
  const toScreenX = (z: number) => {
    if (isNaN(z) || !isFinite(z)) return 0;
    return (z - zMin) * zScale;
  };
  const toScreenY = (w: number) => {
    if (isNaN(w) || !isFinite(w)) return plotHeight / 2;
    return plotHeight / 2 - w * wScale;
  };
  const toScreenYNeg = (w: number) => {
    if (isNaN(w) || !isFinite(w)) return plotHeight / 2;
    return plotHeight / 2 + w * wScale;
  };

  // Create beam profile path
  const createBeamPath = () => {
    if (propagationData.length === 0) return '';
    
    let path = `M ${toScreenX(propagationData[0].z)} ${toScreenY(propagationData[0].w)}`;
    
    for (let i = 1; i < propagationData.length; i++) {
      path += ` L ${toScreenX(propagationData[i].z)} ${toScreenY(propagationData[i].w)}`;
    }
    
    // Add negative side
    for (let i = propagationData.length - 1; i >= 0; i--) {
      path += ` L ${toScreenX(propagationData[i].z)} ${toScreenYNeg(propagationData[i].w)}`;
    }
    
    path += ' Z';
    return path;
  };

  // Find waist positions
  const inputWaistZ = inputBeam.z0;
  const outputWaistZ = outputBeam.z0;
  const lensZ = lens.z;

  // Create grid lines matching the tick marks
  const createGridLines = () => {
    const gridLines = [];
    
    // Calculate clean tick marks for x-axis (distance in mm)
    const zMinMm = zMin * 1000;
    const zMaxMm = zMax * 1000;
    const zRangeMm = zMaxMm - zMinMm;
    
    // Calculate appropriate tick interval (same as in createAxisLabels)
    let tickInterval = Math.pow(10, Math.floor(Math.log10(zRangeMm / 6)));
    if (tickInterval > zRangeMm / 6) {
      tickInterval = tickInterval / 2;
    }
    if (tickInterval < zRangeMm / 10) {
      tickInterval = tickInterval * 2;
    }
    
    // Ensure interval is divisible by 5 or 10
    if (tickInterval % 10 !== 0 && tickInterval % 5 !== 0) {
      tickInterval = Math.ceil(tickInterval / 10) * 10;
    }
    
    // Vertical grid lines (position)
    const startTick = Math.ceil(zMinMm / tickInterval) * tickInterval;
    const endTick = Math.floor(zMaxMm / tickInterval) * tickInterval;
    
    for (let tick = startTick; tick <= endTick; tick += tickInterval) {
      const z = tick / 1000; // Convert back to meters
      const x = toScreenX(z);
      gridLines.push(
        <Line
          key={`vline-${tick}`}
          x1={x}
          y1={0}
          x2={x}
          y2={plotHeight}
          stroke="#e0e0e0"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
      );
    }
    
    // Add grid line at 0 if it's within the range and not already included in regular ticks
    if (zMinMm <= 0 && zMaxMm >= 0) {
      const isZeroInRegularTicks = startTick <= 0 && endTick >= 0;
      if (!isZeroInRegularTicks) {
        const x0 = toScreenX(0);
        gridLines.push(
          <Line
            key="vline-0-special"
            x1={x0}
            y1={0}
            x2={x0}
            y2={plotHeight}
            stroke="#ccc"
            strokeWidth="2"
            strokeDasharray="none"
          />
        );
      }
    }
    
    // Calculate clean tick marks for y-axis (beam radius in μm)
    const wMaxUm = wMax * 1e6;
    
    // Calculate appropriate tick interval for y-axis
    let wTickInterval = Math.pow(10, Math.floor(Math.log10(wMaxUm / 4)));
    if (wTickInterval > wMaxUm / 4) {
      wTickInterval = wTickInterval / 2;
    }
    if (wTickInterval < wMaxUm / 6) {
      wTickInterval = wTickInterval * 2;
    }
    
    // Ensure interval is divisible by 5 or 10
    if (wTickInterval % 10 !== 0 && wTickInterval % 5 !== 0) {
      wTickInterval = Math.ceil(wTickInterval / 10) * 10;
    }
    
    // Horizontal grid lines (beam radius)
    for (let tick = 0; tick <= wMaxUm; tick += wTickInterval) {
      const w = tick * 1e-6; // Convert to meters
      const y = toScreenY(w);
      const yNeg = toScreenYNeg(w);
      
      // Positive side
      gridLines.push(
        <Line
          key={`hline-${tick}`}
          x1={0}
          y1={y}
          x2={plotWidth}
          y2={y}
          stroke={tick === 0 ? "#ccc" : "#e0e0e0"}
          strokeWidth={tick === 0 ? "2" : "1"}
          strokeDasharray={tick === 0 ? "none" : "2,2"}
        />
      );
      
      // Negative side (except for 0)
      if (tick > 0) {
        gridLines.push(
          <Line
            key={`hline-neg-${tick}`}
            x1={0}
            y1={yNeg}
            x2={plotWidth}
            y2={yNeg}
            stroke="#e0e0e0"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        );
      }
    }
    
    return gridLines;
  };

  // Create axis labels with clean tick marks
  const createAxisLabels = () => {
    const labels = [];
    
    // Calculate clean tick marks for x-axis (distance in mm)
    const zMinMm = zMin * 1000;
    const zMaxMm = zMax * 1000;
    const zRangeMm = zMaxMm - zMinMm;
    
    // Calculate appropriate tick interval (divisible by 5 or 10)
    let tickInterval = Math.pow(10, Math.floor(Math.log10(zRangeMm / 6)));
    if (tickInterval > zRangeMm / 6) {
      tickInterval = tickInterval / 2;
    }
    if (tickInterval < zRangeMm / 10) {
      tickInterval = tickInterval * 2;
    }
    
    // Ensure interval is divisible by 5 or 10
    if (tickInterval % 10 !== 0 && tickInterval % 5 !== 0) {
      tickInterval = Math.ceil(tickInterval / 10) * 10;
    }
    
    // Generate x-axis labels
    const startTick = Math.ceil(zMinMm / tickInterval) * tickInterval;
    const endTick = Math.floor(zMaxMm / tickInterval) * tickInterval;
    
    for (let tick = startTick; tick <= endTick; tick += tickInterval) {
      const z = tick / 1000; // Convert back to meters
      const x = toScreenX(z);
      labels.push(
        <SvgText
          key={`zlabel-${tick}`}
          x={x}
          y={plotHeight - 5}
          fontSize="12"
          fill="#666"
          textAnchor="middle"
        >
          {tick.toFixed(0)}
        </SvgText>
      );
    }
    
    // Ensure 0 is shown if it's within the range and not already included in regular ticks
    if (zMinMm <= 0 && zMaxMm >= 0) {
      const isZeroInRegularTicks = startTick <= 0 && endTick >= 0;
      if (!isZeroInRegularTicks) {
        const x0 = toScreenX(0);
        labels.push(
          <SvgText
            key="zlabel-0-special"
            x={x0}
            y={plotHeight - 5}
            fontSize="12"
            fill="#666"
            textAnchor="middle"
          >
            0
          </SvgText>
        );
      }
    }
    
    // Calculate clean tick marks for y-axis (beam radius in μm)
    const wMaxUm = wMax * 1e6;
    
    // Calculate appropriate tick interval for y-axis
    let wTickInterval = Math.pow(10, Math.floor(Math.log10(wMaxUm / 4)));
    if (wTickInterval > wMaxUm / 4) {
      wTickInterval = wTickInterval / 2;
    }
    if (wTickInterval < wMaxUm / 6) {
      wTickInterval = wTickInterval * 2;
    }
    
    // Ensure interval is divisible by 5 or 10
    if (wTickInterval % 10 !== 0 && wTickInterval % 5 !== 0) {
      wTickInterval = Math.ceil(wTickInterval / 10) * 10;
    }
    
    // Generate y-axis labels (positive and negative) - limit to max 5 labels
    let tickCount = 0;
    const maxLabels = 5;
    for (let tick = 0; tick <= wMaxUm && tickCount < maxLabels; tick += wTickInterval) {
      const w = tick * 1e-6; // Convert to meters
      const y = toScreenY(w);
      const yNeg = toScreenYNeg(w);
      
      // Positive side
      labels.push(
        <SvgText
          key={`wlabel-${tick}`}
          x={-15}
          y={y + 4}
          fontSize="12"
          fill="#666"
          textAnchor="end"
        >
          {tick.toFixed(0)}
        </SvgText>
      );
      
      // Negative side (except for 0)
      if (tick > 0) {
        labels.push(
          <SvgText
            key={`wlabel-neg-${tick}`}
            x={-20}
            y={yNeg + 4}
            fontSize="12"
            fill="#666"
            textAnchor="end"
          >
            -{tick.toFixed(0)}
          </SvgText>
        );
      }
      
      tickCount++;
    }
    
    return labels;
  };

  return (
    <Card style={[styles.card, isLandscape && { margin: 5 }]}>
      <Card.Title title={title} />
      <Card.Content>
        <View style={styles.orientationHint}>
          <Text style={styles.hintText}>
            {isLandscape ? "📱 Landscape view optimized" : "📱 Rotate device for better view"}
          </Text>
        </View>
        
        <ScrollView 
          horizontal={!isLandscape} 
          showsHorizontalScrollIndicator={false} 
          style={[styles.scrollView, { maxHeight: isLandscape ? screenHeight - 250 : 450 }]}
        >
          <View style={[styles.plotContainer, isLandscape && { width: screenWidth - 10 }]}>
            <Svg width={plotWidth + 100} height={plotHeight + 80} viewBox={`-70 -30 ${plotWidth + 100} ${plotHeight + 80}`}>
              <Defs>
                <LinearGradient id="beamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#4CAF50" stopOpacity="0.8" />
                  <Stop offset="100%" stopColor="#4CAF50" stopOpacity="0.2" />
                </LinearGradient>
              </Defs>
              
              {/* Grid lines */}
              {createGridLines()}
              
              {/* Beam profile */}
              <Path
                d={createBeamPath()}
                fill="url(#beamGradient)"
                stroke="#4CAF50"
                strokeWidth="2"
              />
              
              {/* Center line */}
              <Line
                x1={0}
                y1={plotHeight / 2}
                x2={plotWidth}
                y2={plotHeight / 2}
                stroke="#333"
                strokeWidth="1"
              />
              
              {/* Lens position */}
              <Line
                x1={toScreenX(lensZ)}
                y1={plotHeight / 2 - 30}
                x2={toScreenX(lensZ)}
                y2={plotHeight / 2 + 30}
                stroke="#FF5722"
                strokeWidth="4"
              />
              
              {/* Input waist */}
              <Circle
                cx={toScreenX(inputWaistZ)}
                cy={plotHeight / 2}
                r="6"
                fill="#2196F3"
                stroke="#1976D2"
                strokeWidth="2"
              />
              
              {/* Output waist */}
              <Circle
                cx={toScreenX(outputWaistZ)}
                cy={plotHeight / 2}
                r="6"
                fill="#FF9800"
                stroke="#F57C00"
                strokeWidth="2"
              />
              
              {/* Labels */}
              {createAxisLabels()}
              
              {/* Legend */}
              <G>
                <Circle cx="20" cy="20" r="4" fill="#4CAF50" />
                <SvgText x="30" y="25" fontSize="12" fill="#333">Beam Profile</SvgText>
                
                <Line x1="20" y1="35" x2="20" y2="45" stroke="#FF5722" strokeWidth="3" />
                <SvgText x="30" y="42" fontSize="12" fill="#333">Lens</SvgText>
                
                <Circle cx="20" cy="55" r="4" fill="#2196F3" />
                <SvgText x="30" y="60" fontSize="12" fill="#333">Input Waist</SvgText>
                
                <Circle cx="20" cy="75" r="4" fill="#FF9800" />
                <SvgText x="30" y="80" fontSize="12" fill="#333">Output Waist</SvgText>
              </G>
              
              {/* Axis titles */}
              <SvgText x={plotWidth / 2} y={plotHeight + 40} fontSize="14" fill="#333" textAnchor="middle" fontWeight="bold">
                Distance (mm)
              </SvgText>
              <SvgText x={-50} y={plotHeight / 2} fontSize="14" fill="#333" textAnchor="middle" transform={`rotate(-90, -50, ${plotHeight / 2})`} fontWeight="bold">
                Beam Radius (μm)
              </SvgText>
            </Svg>
          </View>
        </ScrollView>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Input Waist</Text>
            <Text style={styles.statValue}>{(inputBeam.w0 * 1e6).toFixed(1)} μm</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Output Waist</Text>
            <Text style={styles.statValue}>{(outputBeam.w0 * 1e6).toFixed(1)} μm</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Lens Position</Text>
            <Text style={styles.statValue}>{(lens.z * 1000).toFixed(0)} mm</Text>
          </View>
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
  orientationHint: {
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  scrollView: {
    maxHeight: 450,
  },
  plotContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    padding: 20,
  },
});

export default BeamVisualization;
