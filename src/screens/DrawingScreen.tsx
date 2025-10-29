import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Canvas, Path, useCanvasRef } from '@shopify/react-native-skia';
import { sendNotelet } from '../services/firebase';

const COLORS = ['#000000', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFBE0B', '#8A2BE2'];

const DrawingScreen = ({ route, navigation }) => {
  const { userId, recipientId } = route.params;
  const canvasRef = useCanvasRef();
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);
  const [color, setColor] = useState('#000000');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleTouchStart = (event) => {
    const { x, y } = event.nativeEvent;
    const newPath = { points: [{ x, y }], color };
    setCurrentPath(newPath);
  };

  const handleTouchMove = (event) => {
    if (!currentPath) return;
    
    const { x, y } = event.nativeEvent;
    const updatedPoints = [...currentPath.points, { x, y }];
    const updatedPath = { ...currentPath, points: updatedPoints };
    setCurrentPath(updatedPath);
  };

  const handleTouchEnd = () => {
    if (!currentPath) return;
    
    setPaths([...paths, currentPath]);
    setCurrentPath(null);
  };

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath(null);
  };

  const handleSend = async () => {
    if (paths.length === 0 && !text.trim()) {
      Alert.alert('Error', 'Please draw something or add a text message');
      return;
    }

    setLoading(true);
    try {
      // Convert canvas to image data URL
      const imageData = canvasRef.current?.makeImageSnapshot().encodeToBase64();
      
      if (!imageData && !text.trim()) {
        Alert.alert('Error', 'Failed to capture drawing. Please try again.');
        setLoading(false);
        return;
      }
      
      // Send the notelet
      await sendNotelet(userId, recipientId, imageData || '', text.trim());
      
      Alert.alert(
        'Success', 
        'Your notelet has been sent!',
        [
          { 
            text: 'Send Another', 
            onPress: () => {
              clearCanvas();
              setText('');
            } 
          },
          { 
            text: 'Done', 
            onPress: () => navigation.goBack(),
            style: 'default'
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send notelet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPath = (path, index) => {
    if (!path || !path.points || path.points.length < 2) return null;
    
    let d = `M ${path.points[0].x} ${path.points[0].y}`;
    for (let i = 1; i < path.points.length; i++) {
      d += ` L ${path.points[i].x} ${path.points[i].y}`;
    }
    
    return (
      <Path
        key={index}
        path={d}
        strokeWidth={5}
        style="stroke"
        color={path.color}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.canvasContainer}>
        <Canvas
          style={styles.canvas}
          ref={canvasRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {paths.map(renderPath)}
          {currentPath && renderPath(currentPath, 'current')}
        </Canvas>
      </View>
      
      <View style={styles.colorPicker}>
        {COLORS.map((colorOption) => (
          <TouchableOpacity
            key={colorOption}
            style={[
              styles.colorOption,
              { backgroundColor: colorOption },
              color === colorOption && styles.selectedColor,
            ]}
            onPress={() => setColor(colorOption)}
          />
        ))}
      </View>
      
      <TextInput
        style={styles.textInput}
        placeholder="Add a short message (optional)"
        value={text}
        onChangeText={setText}
        maxLength={100}
      />
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.clearButton]} 
          onPress={clearCanvas}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSend}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send Notelet</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  canvasContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  canvas: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#333',
  },
  textInput: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    backgroundColor: '#f0f0f0',
  },
  clearButtonText: {
    color: '#666',
  },
});

export default DrawingScreen;