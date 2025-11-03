import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
// Restore dynamic import from package index to avoid transform-time codegen errors
let SkiaModule: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  SkiaModule = require('@shopify/react-native-skia');
} catch (e) {
  console.warn('[DrawingScreen] Skia module not available:', e);
}
const Canvas = SkiaModule?.Canvas ?? View;
const SkiaPath = SkiaModule?.Path ?? (() => null);
const useCanvasRef = SkiaModule?.useCanvasRef ?? (() => useRef(null));
const Skia = SkiaModule?.Skia;
// Consider Skia available if Canvas exists (module loaded without throwing)
const skiaAvailable = !!SkiaModule?.Canvas;
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

  // Skia touch handler (preferred over RN onTouchStart/Move/End for Canvas)
  const handleCanvasTouch = (touch) => {
    const { x, y, type } = touch;
    if (type === 'start') {
      setCurrentPath({ points: [{ x, y }], color });
    } else if (type === 'active') {
      if (!currentPath) return;
      setCurrentPath((prev) => {
        if (!prev) return prev;
        return { ...prev, points: [...prev.points, { x, y }] };
      });
    } else if (type === 'end') {
      if (!currentPath) return;
      setPaths((prev) => [...prev, currentPath]);
      setCurrentPath(null);
    }
  };
  
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
      const imageData = canvasRef.current?.makeImageSnapshot?.()
        ?.encodeToBase64?.();
      
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
    
    // If Skia is available, convert SVG path string to SkPath; otherwise, keep string
    const skPathVal = Skia?.Path?.MakeFromSVGString
      ? Skia.Path.MakeFromSVGString(d)
      : d;

    return (
      <SkiaPath
        key={index}
        path={skPathVal}
        strokeWidth={5}
        style="stroke"
        color={path.color}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.canvasContainer}>
        {skiaAvailable ? (
          <Canvas
            style={styles.canvas}
            ref={canvasRef}
            onTouch={handleCanvasTouch}
          >
            {paths.map(renderPath)}
            {currentPath && renderPath(currentPath, 'current')}
          </Canvas>
        ) : (
          <View style={styles.canvas} />
        )}
      </View>
      {!skiaAvailable && (
        <Text style={styles.infoText}>
          Drawing is temporarily unavailable. Please ensure Skia is installed.
        </Text>
      )}
      
  <View style={styles.colorPicker}>
        <Text style={styles.debugText}>Skia: {skiaAvailable ? 'ON' : 'OFF'}</Text>
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
  infoText: {
    color: '#cc0000',
    textAlign: 'center',
    marginBottom: 8,
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