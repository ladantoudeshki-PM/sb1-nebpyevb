import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronRight, ArrowRight } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { useEffect } from 'react';

export default function DailyRoutinesScreen() {
  const imageScale = useSharedValue(0);
  const imageOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);

  useEffect(() => {
    // Image animation
    imageScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    imageOpacity.value = withTiming(1, { duration: 800 });
    
    // Text animations
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    subtitleOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    
    // Button animation
    buttonOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    buttonScale.value = withDelay(800, withSpring(1, { damping: 6, stiffness: 120 }));
  }, []);

  const handleNext = () => {
    router.push('/login');
  };

  const handleSkip = () => {
    router.push('/login');
  };

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: imageScale.value }],
      opacity: imageOpacity.value,
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
    };
  });

  const subtitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: subtitleOpacity.value,
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonOpacity.value,
      transform: [{ scale: buttonScale.value }],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
            <ChevronRight size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
            <Image
              source={require('../assets/images/Daily Routines.png')}
              style={styles.routinesImage}
              resizeMode="contain"
            />
          </Animated.View>

          <View style={styles.textContent}>
            <Animated.View style={titleAnimatedStyle}>
              <Text style={styles.title}>Build Daily Routines</Text>
            </Animated.View>
            
            <Animated.View style={subtitleAnimatedStyle}>
              <Text style={styles.subtitle}>
                Create healthy habits that stick. Track your progress and build sustainable routines for a better lifestyle.
              </Text>
            </Animated.View>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Progress Indicator */}
          <View style={styles.progressIndicator}>
            <View style={styles.progressDot} />
            <View style={styles.progressDot} />
            <View style={[styles.progressDot, styles.activeDot]} />
          </View>

          {/* Next Button */}
          <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <LinearGradient
                colors={['#FF6B35', '#F7931E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Get Started</Text>
                <ArrowRight size={20} color="#ffffff" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 16,
    paddingBottom: 32,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    gap: 4,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  routinesImage: {
    width: 300,
    height: 300,
  },
  textContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  bottomSection: {
    paddingBottom: 32,
    alignItems: 'center',
  },
  progressIndicator: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  activeDot: {
    backgroundColor: '#FF6B35',
    width: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 12,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
});