import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NotificationContext = createContext(null)

let idCounter = 0

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;

  const insets = useSafeAreaInsets();

  const show = useCallback((type, message, duration = 3000, onClose) => {
    setNotification({ type, message });

    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setNotification(null);
        onClose?.();
      });
    }, duration);
  }, []);

  const value = {
    success: (msg, d) => show("success", msg, d),
    error: (msg, d) => show("error", msg, d),
    info: (msg, d) => show("info", msg, d),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {notification && (
        <Animated.View
          style={[
            styles.container,
            styles[notification.type],
            { 
              top: insets.top + 8,
              opacity 
            },
          ]}
        >
          <Text style={styles.text}>{notification.message}</Text>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used inside NotificationProvider')
  }
  return context
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    elevation: 6,
    maxWidth: '90%',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  success: {
    backgroundColor: '#2e7d32',
  },
  error: {
    backgroundColor: '#c62828',
  },
  info: {
    backgroundColor: '#2f80ed',
  },
});