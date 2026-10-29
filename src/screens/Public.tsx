import React, { useState } from 'react';
import { View, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { C, BRAND } from '../theme';
import { useApp } from '../store';
import { Avatar, Btn, Chip, Field, Logo, LogoMark, Row, T } from '../components/ui';
import { CATEGORIES, CREATORS } from '../data';

/* ---------------- Welcome ---------------- */
export function Landing({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const illustrationHeight = Math.min(250, Math.max(170, height * 0.27));
  const rolePicker = (mode: 'login' | 'signup') => navigation.navigate('RoleSelection', { mode });
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{
        flex: 1, paddingTop: insets.top + 10, paddingBottom: Math.max(insets.bottom, 12) + 10,
        paddingHorizontal: 24, justifyContent: 'space-between',
      }}>
        <View style={{ alignItems: 'flex-start' }}>
          <Logo size={18} />
        </View>
        <View style={{ alignItems: 'center', justifyContent: 'center', height: illustrationHeight, marginVertical: 4 }}>
          <View style={{ position: 'absolute', width: 112, height: 112, borderRadius: 26, backgroundColor: C.pinkBg2, top: 12, right: '12%', transform: [{ rotate: '9deg' }] }} />
          <View style={{ position: 'absolute', width: 84, height: 84, borderRadius: 20, backgroundColor: '#fce8a8', bottom: 18, left: '12%', transform: [{ rotate: '-8deg' }] }} />
          <View style={{ position: 'absolute', width: 138, height: 78, borderRadius: 18, backgroundColor: '#e8d8ff', bottom: 12, right: '8%' }} />
          <LinearGradient colors={['#f5a1c7', '#dd4e8d']} style={{ position: 'absolute', width: 100, height: 100, borderRadius: 50, left: '13%', top: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#fff' }}>
            <Avatar name={CREATORS[0].name} size={76} ring />
          </LinearGradient>
          <View style={{ position: 'absolute', top: '25%', right: '10%', width: 122, height: 90, borderRadius: 16, backgroundColor: '#fff', padding: 6, transform: [{ rotate: '3deg' }], shadowColor: '#292335', shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 3 }}>
            <LinearGradient colors={['#f4bca3', '#7b4759']} style={{ flex: 1, borderRadius: 13, alignItems: 'center', justifyContent: 'center' }}>
              <Avatar name={CREATORS[2].name} size={42} ring />
              <T size={9} w="semi" color="#fff" style={{ marginTop: 3 }}>{CREATORS[2].name}</T>
            </LinearGradient>
          </View>
          <LinearGradient colors={['#f4729b', '#a41b53']} style={{ position: 'absolute', width: 70, height: 74, borderRadius: 16, bottom: 0, left: '34%', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#fff', transform: [{ rotate: '-5deg' }] }}>
            <Avatar name={CREATORS[3].name} size={44} ring />
          </LinearGradient>
          <View style={{ position: 'absolute', top: 16, left: '53%', width: 12, height: 12, borderRadius: 6, backgroundColor: C.gold }} />
          <View style={{ position: 'absolute', bottom: 4, right: '23%', width: 9, height: 9, borderRadius: 5, backgroundColor: C.logoGreen }} />
        </View>
        <View style={{ alignItems: 'center', gap: 9, paddingHorizontal: 2 }}>
          <T size={30} w="bold" track={-0.7} style={{ textAlign: 'center', lineHeight: 36 }}>
            Create meaningful brand collaborations
          </T>
          <T size={14.5} color={C.muted} style={{ textAlign: 'center', lineHeight: 21 }}>
            Discover creators, build campaigns, and bring great ideas to life.
          </T>
        </View>
        <View style={{ gap: 10, marginTop: 12 }}>
          <Btn label="Sign Up" onPress={() => rolePicker('signup')} style={{ minHeight: 52, borderRadius: 12 }} />
          <Btn label="Log In" variant="outline" onPress={() => rolePicker('login')} style={{ minHeight: 52, borderRadius: 12, borderColor: C.border }} />
        </View>
      </View>
    </View>
  );
}

/* ---------------- Account role selection ---------------- */
export function RoleSelection({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const mode = route.params?.mode === 'login' ? 'login' : 'signup';
  const roles = [
    { key: 'brand', title: 'Brand', description: 'Find creators and manage campaigns', icon: 'briefcase-outline' },
    { key: 'creator', title: 'Creator', description: 'Partner with brands and grow your work', icon: 'sparkles-outline' },
    { key: 'admin', title: 'Admin', description: 'Manage the BrandSide platform', icon: 'settings-outline' },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, paddingTop: insets.top }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 54 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </Pressable>
        <Logo size={17} />
      </View>
      <View style={{ flex: 1, padding: 24, paddingTop: 26, gap: 22 }}>
        <View style={{ gap: 8 }}>
          <T size={30} w="bold" track={-0.7} style={{ lineHeight: 37 }}>
            {mode === 'signup' ? 'Join BrandSide' : 'Welcome back'}
          </T>
          <T size={15} color={C.muted} style={{ lineHeight: 22 }}>
            Choose how you’d like to {mode === 'signup' ? 'get started' : 'continue'}.
          </T>
        </View>
        <View style={{ gap: 12 }}>
          {roles.map((role) => (
            <Pressable
              key={role.key}
              onPress={() => role.key === 'brand'
                ? navigation.navigate('Auth', { mode })
                : navigation.navigate('ComingSoon', { role: role.title })}
              style={({ pressed }) => ({
                flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff',
                borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 18,
                opacity: pressed ? 0.82 : 1,
              })}
            >
              <View style={{ width: 48, height: 48, borderRadius: 15, backgroundColor: role.key === 'brand' ? C.pinkBg : C.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={role.icon as any} size={22} color={role.key === 'brand' ? C.pinkText : C.muted2} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <T size={16} w="bold">{role.title}</T>
                <T size={13} color={C.muted} style={{ lineHeight: 19 }}>{role.description}</T>
              </View>
              <Ionicons name="chevron-forward" size={19} color={C.muted3} />
            </Pressable>
          ))}
        </View>
        <View style={{ flex: 1 }} />
        <T size={12} color={C.muted3} style={{ textAlign: 'center', lineHeight: 18 }}>
          Creator and Admin accounts are not available yet. Their experiences are still in progress.
        </T>
      </View>
    </View>
  );
}

/* ---------------- Roles in progress ---------------- */
export function ComingSoon({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const role = route.params?.role === 'Admin' ? 'Admin' : 'Creator';
  const isCreator = role === 'Creator';
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 20) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 54 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </Pressable>
        <Logo size={17} />
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 }}>
        <View style={{ width: 94, height: 94, borderRadius: 30, backgroundColor: C.pinkBg, alignItems: 'center', justifyContent: 'center', marginBottom: 26 }}>
          <Ionicons name={isCreator ? 'sparkles-outline' : 'settings-outline'} size={42} color={C.pinkText} />
        </View>
        <T size={29} w="bold" track={-0.6} style={{ textAlign: 'center', lineHeight: 36 }}>
          {role} experience is in progress
        </T>
        <T size={15} color={C.muted} style={{ textAlign: 'center', lineHeight: 23, marginTop: 12 }}>
          {isCreator
            ? 'We’re building a better way for creators to connect and work with brands. Please check back soon.'
            : 'The Admin workspace is still being built and is not available yet.'}
        </T>
      </View>
      <View style={{ paddingHorizontal: 24 }}>
        <Btn label="Back to role selection" variant="outline" onPress={() => navigation.goBack()} style={{ minHeight: 54 }} />
      </View>
    </View>
  );
}

/* ---------------- Auth ---------------- */
export function Auth({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { login, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>(route.params?.mode || 'login');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const submit = () => {
    if (!email.includes('@') || pw.length < 4) return showToast('Enter a valid email and a password (4+ characters)');
    if (mode === 'signup') navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    else login();
  };
  const compact = height < 760;
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: insets.top + (compact ? 8 : 16), paddingBottom: Math.max(insets.bottom, 12) }}>
      <Pressable onPress={() => navigation.canGoBack() && navigation.goBack()} hitSlop={10} style={{ height: 38, justifyContent: 'center' }}><Ionicons name="chevron-back" size={24} color={C.text} /></Pressable>
      <View style={{ flex: 1, justifyContent: 'center', gap: compact ? 12 : 18 }}>
      <View style={{ alignItems: 'center', gap: compact ? 4 : 8 }}>
        <LogoMark size={compact ? 34 : 40} />
        <T size={19} w="xbold" track={-0.5}>{BRAND}</T>
        <T size={compact ? 19 : 22} w="bold" track={-0.6} style={{ textAlign: 'center', lineHeight: compact ? 25 : 28 }}>Hire creators you trust.</T>
        <T size={12} color={C.muted}>Pay only when it’s live.</T>
      </View>
      <Row style={{ backgroundColor: C.bg, borderRadius: 12, padding: 4 }}>
        {(['signup', 'login'] as const).map((m) => (
          <Pressable key={m} onPress={() => setMode(m)} style={{ flex: 1, paddingVertical: 10, borderRadius: 9, backgroundColor: mode === m ? '#fff' : 'transparent', alignItems: 'center' }}>
            <T size={14} w="semi" color={mode === m ? C.text : C.muted}>{m === 'signup' ? 'Sign up' : 'Log in'}</T>
          </Pressable>
        ))}
      </Row>
      <Field label="Work email" value={email} onChangeText={setEmail} placeholder="you@brand.com" keyboardType="email-address" />
      <Field label="Password" value={pw} onChangeText={setPw} placeholder="••••••••" secure />
      <Btn label={mode === 'signup' ? 'Create account' : 'Log in'} onPress={submit} />
      <Btn label="Continue with Google" variant="outline" icon="logo-google" onPress={() => showToast('Google sign-in is a demo button')} />
      <T size={12} color={C.muted} style={{ textAlign: 'center' }}>By continuing you agree to our Terms and Privacy Policy.</T>
      </View>
    </View>
  );
}

/* ---------------- Onboarding ---------------- */
export function Onboarding() {
  const insets = useSafeAreaInsets();
  const { setBrandName, login } = useApp();
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cats, setCats] = useState<string[]>([]);
  const toggle = (c: string) => setCats((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  const go = () => { if (brand.trim()) setBrandName(brand.trim()); login(); };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ padding: 20, paddingTop: insets.top + 24, gap: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <View style={{ gap: 6 }}>
        <T size={26} w="bold" track={-0.6}>Tell us about your brand</T>
        <T size={14.5} color={C.muted}>A few quick details so creators know who they’re working with.</T>
      </View>
      <Field label="Name of the brand" value={brand} onChangeText={setBrand} placeholder="e.g. Nimbu Foods" />
      <Field label="Your full name" value={name} onChangeText={setName} placeholder="e.g. Priya Sharma" />
      <Field label="Mobile number" prefix="IN  +91" value={phone} onChangeText={setPhone} placeholder="98765 43210" keyboardType="phone-pad" />
      <View style={{ gap: 8 }}>
        <Row style={{ gap: 6 }}><T size={13} w="semi">Category of your brand</T><T size={12} color={C.muted}>· pick one or more</T></Row>
        <Row style={{ flexWrap: 'wrap', gap: 8 }}>
          {CATEGORIES.map((c) => <Chip key={c} label={c} active={cats.includes(c)} onPress={() => toggle(c)} />)}
        </Row>
      </View>
      <Btn label="Continue to dashboard" onPress={go} />
      <Pressable onPress={go} style={{ alignItems: 'center' }}><T size={14} w="semi" color={C.muted}>Skip for now</T></Pressable>
    </ScrollView>
  );
}
