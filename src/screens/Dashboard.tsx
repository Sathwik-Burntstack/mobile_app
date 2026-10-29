import React, { useState } from 'react';
import { View, ScrollView, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, F, inr } from '../theme';
import { useApp } from '../store';
import { Avatar, Btn, Card, Chip, CreatorCard, Heading, JobCard, Row, Select, T, TopBar, statusPill, useGridWidth } from '../components/ui';
import { CREATORS, creatorById } from '../data';

function Screen({ navigation, children }: any) {
  const { openSheet } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <TopBar onBell={() => openSheet('notifications')} onAccount={() => navigation.navigate('More')} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, gap: 22, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </View>
  );
}

const Grid = ({ children }: any) => <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>{children}</View>;

/* ---------------- Home ---------------- */
export function Home({ navigation }: any) {
  const { brandName, openCreator } = useApp();
  const gw = useGridWidth();
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,';
  const Stat = ({ label, value, note, good, to }: any) => (
    <Card onPress={() => navigation.navigate(to)} style={{ flex: 1, gap: 6, padding: 16 }}>
      <T size={12.5} w="med" color={C.muted}>{label}</T>
      <T size={23} w="bold" track={-0.4}>{value}</T>
      <T size={11.5} w="med" color={good ? C.green : C.muted3}>{note}</T>
    </Card>
  );
  return (
    <Screen navigation={navigation}>
      <View style={{ gap: 5 }}>
        <T size={13} w="semi" color={C.pinkText}>{greet}</T>
        <T size={28} w="bold" track={-0.7} style={{ lineHeight: 34 }}>{brandName}</T>
        <T size={14.5} color={C.muted} style={{ lineHeight: 21 }}>Here’s your campaign overview for today.</T>
      </View>
      <Row style={{ gap: 12 }}>
        <Stat label="Active jobs" value="2" note="+1 this week" good to="Jobs" />
        <Stat label="Bids to review" value="18" note="6 new" good to="Jobs" />
      </Row>
      <Row style={{ gap: 12 }}>
        <Stat label="In escrow" value="₹23,500" note="3 orders" to="Orders" />
        <Stat label="Delivered" value="6" note="2 to approve" to="Deliverables" />
      </Row>
      <Row style={{ justifyContent: 'space-between' }}>
        <T size={19} w="bold" track={-0.25}>Top creators for you</T>
        <Pressable onPress={() => navigation.navigate('Search')}><T size={14} w="semi" color={C.pink}>See all</T></Pressable>
      </Row>
      <Grid>
        {CREATORS.slice(0, 4).map((c) => <CreatorCard key={c.id} c={c} width={gw} onPress={() => openCreator(c.id)} />)}
      </Grid>
    </Screen>
  );
}

/* ---------------- Search ---------------- */
export function Search({ navigation }: any) {
  const { openCreator } = useApp();
  const gw = useGridWidth();
  const [q, setQ] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [cat, setCat] = useState('Any category');
  const [sort, setSort] = useState('Recommended');
  const cats = ['Any category', ...Array.from(new Set(CREATORS.map((c) => c.cat)))];
  let list = CREATORS.filter((c) => {
    const text = (c.name + c.city + c.cat).toLowerCase();
    const words = q.toLowerCase().replace(/[“”"]/g, '').split(' ').filter(Boolean);
    return (platform === 'UGC' || c.platform === platform || platform === 'Any') && (cat === 'Any category' || c.cat === cat) && words.every((w) => text.includes(w));
  });
  if (sort === 'Price: low to high') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'Rating') list = [...list].sort((a, b) => b.rating - a.rating);
  const filtered = q || cat !== 'Any category' || platform !== 'Instagram';
  return (
    <Screen navigation={navigation}>
      <Heading title="25,000+ vetted creators" />
      <Card style={{ gap: 12, padding: 14 }}>
        <Row style={{ gap: 10, alignItems: 'flex-start' }}>
          <Select flex value={platform} options={['Instagram', 'YouTube', 'UGC']} onChange={setPlatform} />
          <Select flex value={cat} options={cats} onChange={setCat} />
        </Row>
        <Row style={{ borderWidth: 1, borderColor: C.border2, borderRadius: 10, paddingHorizontal: 12, gap: 8 }}>
          <Ionicons name="search" size={17} color={C.muted} />
          <TextInput value={q} onChangeText={setQ} placeholder="Try “skincare” or “Bengaluru food”" placeholderTextColor="#a4a7ae"
            style={{ flex: 1, paddingVertical: 11, fontFamily: F.reg, fontSize: 14.5, color: C.text }} />
        </Row>
      </Card>
      <Row style={{ justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <T size={13} w="semi" color={C.muted}>{filtered ? `${list.length} creators` : '1,284 creators'}</T>
        </View>
        <View style={{ width: 174 }}><Select value={sort} options={['Recommended', 'Price: low to high', 'Rating']} onChange={setSort} /></View>
      </Row>
      {list.length === 0 ? <T color={C.muted}>No creators match — try a different search.</T> : null}
      <Grid>
        {list.map((c) => <CreatorCard key={c.id} c={c} width={gw} onPress={() => openCreator(c.id)} showBadge={false} />)}
      </Grid>
    </Screen>
  );
}

/* ---------------- Jobs ---------------- */
export function Jobs({ navigation }: any) {
  const { jobs, orders, openSheet } = useApp();
  const [tab, setTab] = useState<'all' | 'open' | 'progress' | 'completed'>('all');
  const shown = jobs.filter((j: any) => tab === 'all' || j.status === tab);
  const count = (s: string) => (s === 'all' ? jobs.length : jobs.filter((j: any) => j.status === s).length);
  const tabs: [any, string][] = [['all', 'All'], ['open', 'Open'], ['progress', 'In progress'], ['completed', 'Completed']];
  return (
    <Screen navigation={navigation}>
      <Heading title="Jobs" sub="Post a budget range. Creators bid, you pick — and pay only when it’s live." />
      <Btn label="Post a job" icon="add" onPress={() => openSheet('postjob')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ borderBottomWidth: 1, borderBottomColor: C.tabBorder, flexGrow: 0 }}>
        {tabs.map(([k, l]) => (
          <Pressable key={k} onPress={() => setTab(k)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingBottom: 11, marginRight: 20, borderBottomWidth: 2.4, borderBottomColor: tab === k ? C.text : 'transparent' }}>
            <T size={14} w={tab === k ? 'semi' : 'med'} color={tab === k ? C.text : C.muted}>{l}</T>
            <View style={{ backgroundColor: tab === k ? C.text : C.border, borderRadius: 99, paddingHorizontal: 6, paddingVertical: 1 }}>
              <T size={11} w="semi" color={tab === k ? '#fff' : C.muted2}>{count(k)}</T>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      {shown.map((j: any) => (
        <JobCard key={j.id} j={j}
          onEdit={() => openSheet('postjob', { editId: j.id })}
          onReview={() => openSheet('reviewbids', { jobId: j.id })}
          onOpenOrder={() => openSheet('order', { orderId: (orders.find((o: any) => o.title === j.title) || orders[0]).id })} />
      ))}
    </Screen>
  );
}

/* ---------------- Orders ---------------- */
export function Orders({ navigation }: any) {
  const { orders, openSheet } = useApp();
  const awaiting = orders.filter((o: any) => o.stage === 'delivered').length;
  const stage = (s: string) => (s === 'working' ? 'In progress' : s === 'delivered' ? 'Needs review' : 'Approved');
  const label = (s: string) => (s === 'working' ? 'Creator working' : s === 'delivered' ? 'Awaiting your approval' : 'Payment released');
  return (
    <Screen navigation={navigation}>
      <Heading title="Orders" sub="Your money stays in escrow until you approve the work." />
      <Card style={{ gap: 14 }}>
        <Row style={{ justifyContent: 'space-between' }}><T color={C.muted}>Held in escrow</T><T size={17} w="bold">₹23,500</T></Row>
        <Row style={{ justifyContent: 'space-between' }}><T color={C.muted}>Released this month</T><T size={17} w="bold">₹17,000</T></Row>
        <Row style={{ justifyContent: 'space-between' }}><T color={C.muted}>Awaiting approval</T><T size={17} w="bold">{awaiting} draft{awaiting === 1 ? '' : 's'}</T></Row>
      </Card>
      {orders.map((o: any) => {
        const c = creatorById(o.creatorId);
        return (
          <Card key={o.id} onPress={() => openSheet('order', { orderId: o.id })} style={{ gap: 10 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T size={12} w="semi" color={C.muted}>Order {o.code}</T>
              {statusPill(stage(o.stage))}
            </Row>
            <T size={17} w="bold">{o.title}</T>
            <Row style={{ justifyContent: 'space-between' }}>
              <Row style={{ gap: 8 }}><Avatar name={c.name} size={28} /><T size={13.5} w="semi">{c.name}</T></Row>
              <T size={15} w="bold">{inr(o.held)}</T>
            </Row>
            <T size={12.5} color={C.muted2}>{label(o.stage)}</T>
          </Card>
        );
      })}
    </Screen>
  );
}

/* ---------------- More ---------------- */
export function More({ navigation }: any) {
  const { brandName, openSheet, showToast, logout } = useApp();
  const Item = ({ icon, label, note, onPress, danger }: any) => (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 14 }}>
      <Ionicons name={icon} size={21} color={danger ? C.red : C.text} />
      <T size={15} w="med" color={danger ? C.red : C.text} style={{ flex: 1 }}>{label}</T>
      {note ? <T size={12.5} color={C.muted}>{note}</T> : null}
      {!danger ? <Ionicons name="chevron-forward" size={17} color={C.muted3} /> : null}
    </Pressable>
  );
  const Group = ({ title, children }: any) => (
    <View style={{ gap: 6 }}>
      <T size={11.5} w="bold" color={C.muted3} track={1}>{title}</T>
      <Card style={{ paddingVertical: 2 }}>{children}</Card>
    </View>
  );
  return (
    <Screen navigation={navigation}>
      <Card style={{ gap: 14 }}>
        <Row style={{ gap: 12 }}>
          <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: C.pinkBg2, alignItems: 'center', justifyContent: 'center' }}>
            <T size={20} w="bold" color={C.pinkText}>N</T>
          </View>
          <View style={{ flex: 1 }}>
            <T size={17} w="bold">{brandName}</T>
            <Row style={{ gap: 4 }}>
              <T size={13} color={C.muted}>Free plan ·</T>
              <Pressable onPress={() => showToast('Upgrade request sent — we’ll call you within a day')}><T size={13} w="semi" color={C.pink}>Upgrade</T></Pressable>
            </Row>
          </View>
        </Row>
        <Btn label="Post a job" icon="add" onPress={() => openSheet('postjob')} />
      </Card>
      <Group title="WORKSPACE">
        <Item icon="bookmark-outline" label="Lists" note="6 lists" onPress={() => navigation.navigate('Lists')} />
        <Item icon="film-outline" label="Deliverables" note="2 to review" onPress={() => navigation.navigate('Deliverables')} />
        <Item icon="stats-chart-outline" label="Reporting" onPress={() => navigation.navigate('Reporting')} />
        <Item icon="chatbubbles-outline" label="Messages" note="3 unread" onPress={() => openSheet('messages')} />
      </Group>
      <Group title="ACCOUNT">
        <Item icon="settings-outline" label="Settings" onPress={() => showToast('Settings are not part of this demo')} />
        <Item icon="help-circle-outline" label="Help & support" onPress={() => showToast('Our team will reply on WhatsApp within 2 hours')} />
        <Item icon="log-out-outline" label="Log out" danger onPress={logout} />
      </Group>
    </Screen>
  );
}
