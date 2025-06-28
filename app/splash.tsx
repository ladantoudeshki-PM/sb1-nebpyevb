import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { Heart, Activity, Droplets, Moon } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withDelay,
  withTiming,
  runOnJS
} from 'react-native-reanimated';

export default function SplashScreen() {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const iconScale1 = useSharedValue(0);
  const iconScale2 = useSharedValue(0);
  const iconScale3 = useSharedValue(0);
  const iconScale4 = useSharedValue(0);

  const navigateToWelcome = () => {
    router.replace('/welcome');
  };

  useEffect(() => {
    // Logo animation
    logoScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    logoOpacity.value = withTiming(1, { duration: 800 });
    
    // Text animation
    textOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
    
    // Floating icons animation
    iconScale1.value = withDelay(800, withSpring(1, { damping: 6, stiffness: 120 }));
    iconScale2.value = withDelay(1000, withSpring(1, { damping: 6, stiffness: 120 }));
    iconScale3.value = withDelay(1200, withSpring(1, { damping: 6, stiffness: 120 }));
    iconScale4.value = withDelay(1400, withSpring(1, { damping: 6, stiffness: 120 }));
    
    // Navigate after animations
    const timer = setTimeout(() => {
      runOnJS(navigateToWelcome)();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
      opacity: logoOpacity.value,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
    };
  });

  const icon1AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale1.value }],
    };
  });

  const icon2AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale2.value }],
    };
  });

  const icon3AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale3.value }],
    };
  });

  const icon4AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale4.value }],
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FF6B35', '#F7931E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Floating Icons */}
        <Animated.View style={[styles.floatingIcon, styles.icon1, icon1AnimatedStyle]}>
          <View style={styles.iconContainer}>
            <Heart size={24} color="#ffffff" />
          </View>
        </Animated.View>

        <Animated.View style={[styles.floatingIcon, styles.icon2, icon2AnimatedStyle]}>
          <View style={styles.iconContainer}>
            <Activity size={24} color="#ffffff" />
          </View>
        </Animated.View>

        <Animated.View style={[styles.floatingIcon, styles.icon3, icon3AnimatedStyle]}>
          <View style={styles.iconContainer}>
            <Droplets size={24} color="#ffffff" />
          </View>
        </Animated.View>

        <Animated.View style={[styles.floatingIcon, styles.icon4, icon4AnimatedStyle]}>
          <View style={styles.iconContainer}>
            <Moon size={24} color="#ffffff" />
          </View>
        </Animated.View>

        {/* Main Content */}
        <View style={styles.content}>
          <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>V</Text>
            </View>
          </Animated.View>
          
          <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
            <Text style={styles.appName}>VitaSync</Text>
            <Text style={styles.tagline}>Your Health, Synchronized</Text>
          </Animated.View>
        </View>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  floatingIcon: {
    position: 'absolute',
  },
  icon1: {
    top: '15%',
    left: '10%',
  },
  icon2: {
    top: '25%',
    right: '15%',
  },
  icon3: {
    bottom: '30%',
    left: '15%',
  },
  icon4: {
    bottom: '20%',
    right: '10%',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoText: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#FF6B35',
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  dot1: {
    opacity: 1,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 0.4,
  },
});