import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from './theme';
import { T } from './components/ui';
import { Landing, RoleSelection, ComingSoon, Auth, Onboarding } from './screens/Public';
import { Home, Search, Jobs, Orders, More } from './screens/Dashboard';
import { Lists, Deliverables, Reporting, CreatorProfile } from './screens/Workspace';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TABS: Record<string, [string, string, string]> = {
  Home: ['Home', 'home-outline', 'home'],
  Search: ['Search', 'search-outline', 'search'],
  Jobs: ['Jobs', 'megaphone-outline', 'megaphone'],
  Orders: ['Orders', 'chatbox-outline', 'chatbox'],
  More: ['More', 'ellipsis-horizontal', 'ellipsis-horizontal'],
};

function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: C.border, paddingTop: 8, paddingHorizontal: 8, paddingBottom: Math.max(insets.bottom, 8), elevation: 8 }}>
      {state.routes.map((r, i) => {
        const active = state.index === i;
        const [label, off, on] = TABS[r.name];
        return (
          <Pressable
            key={r.key}
            onPress={() => { const e = navigation.emit({ type: 'tabPress', target: r.key, canPreventDefault: true }); if (!active && !e.defaultPrevented) navigation.navigate(r.name); }}
            style={{ flex: 1, alignItems: 'center', gap: 4, minHeight: 48 }}
          >
            <View style={{ width: 44, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? C.pinkBg : 'transparent' }}>
              <Ionicons name={(active ? on : off) as any} size={21} color={active ? C.pink : C.muted} />
            </View>
            <T size={11.5} w={active ? 'semi' : 'med'} color={active ? C.text : C.muted}>{label}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

function Main() {
  return (
    <Tab.Navigator id="MainTabs" tabBar={(p) => <TabBar {...p} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen name="Jobs" component={Jobs} />
      <Tab.Screen name="Orders" component={Orders} />
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
}

export function RootStack() {
  return (
    <Stack.Navigator id="RootStack" initialRouteName="Landing" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="RoleSelection" component={RoleSelection} />
      <Stack.Screen name="ComingSoon" component={ComingSoon} />
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Lists" component={Lists} />
      <Stack.Screen name="Deliverables" component={Deliverables} />
      <Stack.Screen name="Reporting" component={Reporting} />
      <Stack.Screen name="CreatorProfile" component={CreatorProfile} />
    </Stack.Navigator>
  );
}
