import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard as Edit, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Award, Calendar, TrendingUp, Settings } from 'lucide-react-native';

export default function ProfileScreen() {
  const [scrollY, setScrollY] = useState(0);

  const profileStats = [
    { label: 'Days Tracked', value: '47', icon: Calendar },
    { label: 'Goals Achieved', value: '23', icon: Award },
    { label: 'Avg Mood', value: '4.2', icon: TrendingUp },
  ];

  const settingsItems = [
    { id: 1, icon: Bell, title: 'Notifications', subtitle: 'Manage your alerts' },
    { id: 2, icon: Shield, title: 'Privacy', subtitle: 'Data and security settings' },
    { id: 3, icon: HelpCircle, title: 'Help & Support', subtitle: 'Get help and contact us' },
    { id: 4, icon: Settings, title: 'App Settings', subtitle: 'Theme, language, and more' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollIndicatorContainer}>
        <View style={styles.scrollIndicator}>
          <View style={[styles.scrollThumb, { 
            transform: [{ translateY: Math.min(scrollY * 0.5, 100) }] 
          }]} />
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/3823207/pexels-photo-3823207.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Edit size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Sarah Johnson</Text>
          <Text style={styles.userEmail}>sarah.johnson@email.com</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.statsContainer}>
            {profileStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <stat.icon size={24} color="#FF6B35" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['#FF6B35', '#F7931E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <Calendar size={24} color="#ffffff" />
              <Text style={styles.actionText}>Export Data</Text>
              <ChevronRight size={20} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={['#F7931E', '#FF6B35']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradient}
            >
              <Award size={24} color="#ffffff" />
              <Text style={styles.actionText}>View Achievements</Text>
              <ChevronRight size={20} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsContainer}>
            {settingsItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <item.icon size={20} color="#FF6B35" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollIndicatorContainer: {
    position: 'absolute',
    right: 4,
    top: 60,
    bottom: 60,
    width: 4,
    zIndex: 1000,
  },
  scrollIndicator: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    position: 'relative',
  },
  scrollThumb: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#FF6B35',
    borderRadius: 2,
    opacity: 0.8,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 16,
  },
  settingsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});