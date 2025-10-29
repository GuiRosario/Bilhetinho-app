import { NativeModules, Platform } from 'react-native';

interface WidgetModuleInterface {
  updateWidget(imageUrl: string, text: string): Promise<boolean>;
}

// Default implementation that works when native module is not available
const defaultModule: WidgetModuleInterface = {
  updateWidget: async () => {
    console.warn('Widget module is not available on this platform');
    return false;
  }
};

// Get the native module if available
const nativeModule = NativeModules.BilhetinhoWidgetModule || defaultModule;

export const WidgetModule: WidgetModuleInterface = {
  updateWidget: async (imageUrl: string, text: string): Promise<boolean> => {
    try {
      return await nativeModule.updateWidget(imageUrl, text);
    } catch (error) {
      console.error('Error updating widget:', error);
      return false;
    }
  }
};

// Helper function to update widget when a new notelet is received
export const updateWidgetWithNotelet = async (imageUrl: string, text: string): Promise<boolean> => {
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return await WidgetModule.updateWidget(imageUrl, text);
  }
  return false;
};