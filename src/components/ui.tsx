import React, { useState } from 'react';
import {
  View, Text, Pressable, TextInput, Modal, ScrollView, StyleSheet, KeyboardAvoidingView, Platform,
  TextProps, ViewStyle, useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F, shadow, BRAND, inr } from '../theme';
import { Creator, Job, creatorById } from '../data';
import { useApp } from '../store';

/* ---------- Text ---------- */
type TP = TextProps & { size?: number; w?: 'reg' | 'med' | 'semi' | 'bold' | 'xbold'; color?: string; track?: number };
export function T({ size = 14, w = 'reg', color = C.text, track, style, children, ...rest }: TP) {
  return (
    <Text {...rest} style={[{ fontFamily: F[w], fontSize: size, color, letterSpacing: track }, style]}>
      {children}
    </Text>
  );
}

/* ---------- Buttons ---------- */
type BtnProps = {
  label: string; onPress?: () => void; variant?: 'dark' | 'outline' | 'pink' | 'danger';
  icon?: any; small?: boolean; style?: ViewStyle; flex?: boolean;
};
export function Btn({ label, onPress, variant = 'dark', icon, small, style, flex }: BtnProps) {
  const bg = variant === 'dark' ? C.dark : variant === 'pink' ? C.pink : 'transparent';
  const fg = variant === 'dark' || variant === 'pink' ? '#fff' : variant === 'danger' ? C.red : C.text;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: bg, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8,
          paddingVertical: small ? 10 : 14, paddingHorizontal: small ? 15 : 18, opacity: pressed ? 0.84 : 1,
          borderWidth: variant === 'outline' || variant === 'danger' ? 1 : 0,
          borderColor: variant === 'danger' ? C.red : C.border2,
        },
        flex ? { flex: 1 } : null,
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={small ? 15 : 17} color={fg} /> : null}
      <T size={small ? 13.5 : 15} w="semi" color={fg}>{label}</T>
    </Pressable>
  );
}

/* ---------- Small pieces ---------- */
export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.28, backgroundColor: C.logoGreen, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: size * 0.42, height: size * 0.42, borderRadius: size * 0.21, borderWidth: 2.2, borderColor: '#fff' }} />
    </View>
  );
}
export function Logo({ size = 18 }: { size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
      <LogoMark size={size + 6} />
      <T size={size} w="xbold" track={-0.54}>{BRAND}</T>
    </View>
  );
}

const PALETTE: [string, string][] = [
  ['#f9a8d4', '#be185d'], ['#fdba74', '#c2410c'], ['#86efac', '#15803d'], ['#93c5fd', '#1d4ed8'],
  ['#c4b5fd', '#6d28d9'], ['#fcd34d', '#b45309'], ['#5eead4', '#0f766e'], ['#fca5a5', '#b91c1c'],
];
export const paletteFor = (name: string) => PALETTE[name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];
export const initials = (n: string) => n.split(' ').map((x) => x[0]).slice(0, 2).join('');

// Creator photos in the Figma file are demo images. Until real image URLs come from an API,
// each creator gets a coloured gradient avatar with initials.
export function Avatar({ name, size = 36, ring }: { name: string; size?: number; ring?: boolean }) {
  const [a, b] = paletteFor(name);
  return (
    <LinearGradient
      colors={[a, b]}
      style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center', borderWidth: ring ? 2 : 0, borderColor: '#fff' }}
    >
      <T size={size * 0.36} w="bold" color="#fff">{initials(name)}</T>
    </LinearGradient>
  );
}

export function Pill({ label, bg, fg, dot }: { label: string; bg: string; fg: string; dot?: boolean }) {
  return (
    <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: bg, borderRadius: 99, paddingVertical: 4, paddingHorizontal: 10 }}>
      {dot ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: fg }} /> : null}
      <T size={11.5} w="semi" color={fg}>{label}</T>
    </View>
  );
}
export const statusPill = (s: string) => {
  const map: any = {
    'Open for bids': [C.greenBg, C.green], 'In progress': [C.amberBg, C.amber], Completed: ['#eef0f4', C.muted2],
    Approved: [C.greenBg, C.green], Live: ['#e0ecff', '#1d4ed8'], 'Needs review': [C.amberBg, C.amber], 'Revision asked': [C.redBg, '#b42318'],
  };
  const [bg, fg] = map[s] || ['#eef0f4', C.muted2];
  return <Pill label={s} bg={bg} fg={fg} dot />;
};

export function Card({ children, style, onPress }: { children: React.ReactNode; style?: ViewStyle; onPress?: () => void }) {
  const base: ViewStyle = { backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 18, ...shadow };
  if (onPress) return <Pressable onPress={onPress} style={({ pressed }) => [base, style, pressed ? { opacity: 0.88 } : null]}>{children}</Pressable>;
  return <View style={[base, style]}>{children}</View>;
}

export function Heading({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={{ gap: 6 }}>
      <T size={27} w="bold" track={-0.65} style={{ lineHeight: 34 }}>{title}</T>
      {sub ? <T size={14.5} color={C.muted} style={{ lineHeight: 21 }}>{sub}</T> : null}
    </View>
  );
}

export function Row({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>;
}

/* ---------- Form controls ---------- */
export function Field({
  label, value, onChangeText, placeholder, prefix, multiline, keyboardType, secure,
}: {
  label?: string; value: string; onChangeText: (t: string) => void; placeholder?: string; prefix?: string;
  multiline?: boolean; keyboardType?: any; secure?: boolean;
}) {
  return (
    <View style={{ gap: 6 }}>
      {label ? <T size={13} w="semi">{label}</T> : null}
      <View style={{ flexDirection: 'row', alignItems: multiline ? 'flex-start' : 'center', borderWidth: 1, borderColor: C.border2, borderRadius: 12, backgroundColor: '#fff', paddingHorizontal: 14 }}>
        {prefix ? <T size={14.5} color={C.muted} style={{ marginRight: 6 }}>{prefix}</T> : null}
        <TextInput
          value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#a4a7ae"
          multiline={multiline} keyboardType={keyboardType} secureTextEntry={secure} autoCapitalize="none"
          style={{ flex: 1, fontFamily: F.reg, fontSize: 14.5, color: C.text, paddingVertical: 13, minHeight: multiline ? 100 : undefined, textAlignVertical: multiline ? 'top' : 'center' }}
        />
      </View>
    </View>
  );
}

export function Select({ label, value, options, onChange, flex }: { label?: string; value: string; options: string[]; onChange: (v: string) => void; flex?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 6, flex: flex ? 1 : undefined }}>
      {label ? <T size={13} w="semi">{label}</T> : null}
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: open ? C.pink : C.border2, borderRadius: 12, backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 13 }}
      >
        <T size={14.5}>{value}</T>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={C.muted} />
      </Pressable>
      {open ? (
        <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 10, backgroundColor: '#fff', overflow: 'hidden' }}>
          {options.map((o) => (
            <Pressable key={o} onPress={() => { onChange(o); setOpen(false); }} style={{ paddingVertical: 11, paddingHorizontal: 12, backgroundColor: o === value ? C.pinkBg : '#fff', flexDirection: 'row', justifyContent: 'space-between' }}>
              <T size={14} w={o === value ? 'semi' : 'reg'}>{o}</T>
              {o === value ? <Ionicons name="checkmark" size={16} color={C.pink} /> : null}
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function Chip({ label, active, onPress, icon }: { label: string; active?: boolean; onPress?: () => void; icon?: any }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 13, borderRadius: 99, borderWidth: 1, borderColor: active ? C.dark : C.border2, backgroundColor: active ? C.dark : '#fff' }}
    >
      {icon ? <Ionicons name={icon} size={14} color={active ? '#fff' : C.text} /> : null}
      <T size={13} w="semi" color={active ? '#fff' : C.text}>{label}</T>
    </Pressable>
  );
}

/* ---------- Top bar & headers ---------- */
export function TopBar({ onAccount, onBell }: { onAccount: () => void; onBell: () => void }) {
  const insets = useSafeAreaInsets();
  const { unread } = useApp();
  return (
    <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: C.border, paddingTop: insets.top }}>
      <View style={{ height: 68, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
        <Logo />
        <Row style={{ gap: 10 }}>
          <Pressable onPress={onBell} style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="notifications-outline" size={19} color={C.text} />
            {unread > 0 ? (
              <View style={{ position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: C.red, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <T size={10} w="bold" color="#fff">{unread}</T>
              </View>
            ) : null}
          </Pressable>
          <Pressable onPress={onAccount} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: C.pinkBg2, alignItems: 'center', justifyContent: 'center' }}>
            <T size={15} w="bold" color={C.pinkText}>N</T>
          </Pressable>
        </Row>
      </View>
    </View>
  );
}

export function StackHeader({ title, onBack, right }: { title: string; onBack: () => void; right?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: C.border, paddingTop: insets.top }}>
      <View style={{ height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}>
        <Pressable onPress={onBack} hitSlop={10} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </Pressable>
        <T size={17} w="bold" style={{ flex: 1 }}>{title}</T>
        {right}
      </View>
    </View>
  );
}

/* ---------- Bottom sheet ---------- */
export function Sheet({ visible, onClose, title, sub, children, footer }: { visible: boolean; onClose: () => void; title?: string; sub?: string; children: React.ReactNode; footer?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const { toast } = useApp();
  const { height } = useWindowDimensions();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill}>
          <View style={{ flex: 1, backgroundColor: 'rgba(17,17,24,0.45)' }} />
        </Pressable>
        <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: height * 0.92, paddingBottom: insets.bottom + 8 }}>
          <View style={{ alignItems: 'center', paddingTop: 10 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.border2 }} />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, gap: 16 }}>
            {title ? (
              <View style={{ gap: 4 }}>
                <T size={22} w="bold" track={-0.4}>{title}</T>
                {sub ? <T size={13.5} color={C.muted}>{sub}</T> : null}
              </View>
            ) : null}
            {children}
          </ScrollView>
          {footer ? <View style={{ paddingHorizontal: 20, paddingTop: 4 }}>{footer}</View> : null}
        </View>
        {toast ? (
          <View pointerEvents="none" style={{ position: 'absolute', top: insets.top + 16, left: 16, right: 16, alignItems: 'center' }}>
            <View style={{ backgroundColor: '#1d1d23', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16 }}>
              <T size={13.5} w="med" color="#fff">{toast}</T>
            </View>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* ---------- Toast ---------- */
export function ToastHost() {
  const { toast } = useApp();
  const insets = useSafeAreaInsets();
  if (!toast) return null;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 16, right: 16, bottom: insets.bottom + 92, alignItems: 'center', zIndex: 100, elevation: 20 }}>
      <View style={{ backgroundColor: '#1d1d23', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Ionicons name="checkmark-circle" size={18} color={C.logoGreen} />
        <T size={13.5} w="med" color="#fff" style={{ flexShrink: 1 }}>{toast}</T>
      </View>
    </View>
  );
}

/* ---------- Creator card (2-col grid) ---------- */
export function CreatorCard({ c, width, onPress, showBadge = true }: { c: Creator; width: number; onPress: () => void; showBadge?: boolean }) {
  const { saved, saveCreator, unsaveCreator, loggedIn } = useApp();
  const isSaved = saved.includes(c.id);
  const [a, b] = paletteFor(c.name);
  const h = (width * 1.14);
  return (
    <Pressable onPress={onPress} style={{ width, gap: 9 }}>
      <View style={{ width, height: h, borderRadius: 18, overflow: 'hidden' }}>
        <LinearGradient colors={[a, b]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={{ position: 'absolute', top: h * 0.1, left: 0, right: 0, alignItems: 'center' }}>
          <T size={width * 0.55} w="xbold" color="rgba(255,255,255,0.35)">{c.name[0]}</T>
        </View>
        <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.72)']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 90 }} />
        {showBadge && c.badge ? (
          <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(18,18,18,0.82)', borderRadius: 6, paddingVertical: 4, paddingHorizontal: 7 }}>
            <T size={10} w="semi" color="#fff">{c.badge}</T>
          </View>
        ) : null}
        <Pressable
          hitSlop={8}
          onPress={() => (!loggedIn ? onPress() : isSaved ? unsaveCreator(c.id) : saveCreator(c.id))}
          style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(25,22,30,0.28)', alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={19} color={isSaved ? C.pink : '#fff'} />
        </Pressable>
        <View style={{ position: 'absolute', left: 10, bottom: 10, gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#fff', borderRadius: 99, paddingVertical: 2, paddingHorizontal: 6, alignSelf: 'flex-start' }}>
            <Ionicons name={c.platform === 'YouTube' ? 'logo-youtube' : 'logo-instagram'} size={10} color={C.text} />
            <T size={10.5} w="semi">{c.followers}</T>
          </View>
          <Row style={{ gap: 6 }}>
            <T size={13.5} w="bold" color="#fff">{c.name}</T>
            <T size={11.5} w="semi" color={C.gold}>★ {c.rating.toFixed(1)}</T>
          </Row>
        </View>
      </View>
      <Row style={{ justifyContent: 'space-between' }}>
        <T size={12} color={C.muted}>{c.city} · {c.cat}</T>
        <T size={13} w="bold">{inr(c.price)}</T>
      </Row>
    </Pressable>
  );
}

export function useGridWidth() {
  const { width } = useWindowDimensions();
  return (width - 40 - 14) / 2;
}

/* ---------- Budget bar ---------- */
export function BudgetBar({ marks }: { marks: number[] }) {
  return (
    <View style={{ height: 7 }}>
      <LinearGradient colors={[C.blue, C.indigo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 7, borderRadius: 4 }} />
      {marks.map((m, i) => (
        <View key={i} style={{ position: 'absolute', left: `${Math.min(96, Math.max(2, m))}%`, top: -4.5, width: 3, height: 16, borderRadius: 1.5, backgroundColor: C.text }} />
      ))}
    </View>
  );
}

export function JobCard({ j, onReview, onOpenOrder, onEdit }: { j: Job; onReview: () => void; onOpenOrder: () => void; onEdit: () => void }) {
  const label = j.status === 'open' ? 'Open for bids' : j.status === 'progress' ? 'In progress' : 'Completed';
  const span = Math.max(1, j.max - j.min);
  const marks = j.bids.length
    ? j.bids.map((b) => ((b.price - j.min) / span) * 100)
    : j.status === 'open' ? [12, 40, 66]
    : j.escrow ? [((j.escrow - j.min) / span) * 100] : [];
  const hiredName = j.hired ? creatorById(j.hired).name : '';
  return (
    <Card style={{ gap: 14 }}>
      {statusPill(label)}
      <T size={17} w="bold">{j.title}</T>
      <T size={13} color={C.muted}>{j.platform} · {j.deliverables}</T>
      <Row style={{ justifyContent: 'space-between' }}>
        <T size={12.5} w="semi">Budget {inr(j.min)}</T>
        <T size={12.5} w="semi">{inr(j.max)}</T>
      </Row>
      <BudgetBar marks={marks} />
      <Row style={{ justifyContent: 'space-between' }}>
        <Row style={{ gap: 8 }}>
          <Row>
            {j.bidders.slice(0, 4).map((id, i) => (
              <View key={id} style={{ marginLeft: i ? -8 : 0 }}><Avatar name={creatorById(id).name} size={26} ring /></View>
            ))}
          </Row>
          <T size={13} w="semi">{j.status === 'open' ? `${j.bidsCount} bids` : `Hired ${hiredName}`}</T>
        </Row>
        <Row style={{ gap: 4 }}>
          <Ionicons name={j.status === 'open' ? 'time-outline' : 'shield-checkmark-outline'} size={14} color={C.muted2} />
          <T size={12} w="med" color={C.muted2}>
            {j.status === 'open' ? j.closes : j.status === 'progress' ? `${inr(j.escrow || 0)} held in escrow` : 'Paid out'}
          </T>
        </Row>
      </Row>
      <Row style={{ gap: 10 }}>
        <Btn label="Edit" variant="outline" small onPress={onEdit} />
        <Btn label={j.status === 'open' ? 'Review bids' : 'Open order'} small flex onPress={j.status === 'open' ? onReview : onOpenOrder} />
      </Row>
    </Card>
  );
}
