import React, { useState } from 'react';
import { View, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { C, F, inr } from '../theme';
import { useApp } from '../store';
import { Avatar, Btn, Card, Heading, Row, StackHeader, T, paletteFor, statusPill } from '../components/ui';
import { MONTHS, creatorById } from '../data';

function Page({ title, navigation, right, children }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StackHeader title={title} onBack={() => navigation.goBack()} right={right} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 22, gap: 20, paddingBottom: 44 }} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </View>
  );
}

/* ---------------- Lists ---------------- */
export function Lists({ navigation }: any) {
  const { lists, openSheet, showToast } = useApp();
  return (
    <Page title="Lists" navigation={navigation}>
      <Heading title={`${lists.length} lists`} sub="Shortlists for every job" />
      <Btn label="New list" icon="add" onPress={() => openSheet('newlist')} />
      {lists.map((l: any) => (
        <Card key={l.id} onPress={() => showToast(`Opening “${l.name}”`)} style={{ gap: 4 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <T size={16} w="bold" style={{ flex: 1 }}>{l.name}</T>
            <Ionicons name="chevron-forward" size={18} color={C.muted3} />
          </Row>
          <T size={13} color={C.muted}>{l.count} creators · {l.updated}</T>
        </Card>
      ))}
    </Page>
  );
}

/* ---------------- Deliverables ---------------- */
export function Deliverables({ navigation }: any) {
  const { deliverables, openSheet, showToast } = useApp();
  const [q, setQ] = useState('');
  const list = deliverables.filter((d: any) => (d.title + d.by + d.job).toLowerCase().includes(q.toLowerCase()));
  return (
    <Page title="Deliverables" navigation={navigation}>
      <Heading title="Deliverables" sub="See all your delivered content in one place." />
      <Row style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C.border2, borderRadius: 10, paddingHorizontal: 12, gap: 8 }}>
        <Ionicons name="search" size={17} color={C.muted} />
        <TextInput value={q} onChangeText={setQ} placeholder="Search your library…" placeholderTextColor="#a4a7ae" style={{ flex: 1, paddingVertical: 11, fontFamily: F.reg, fontSize: 14.5, color: C.text }} />
      </Row>
      <Btn label="Download all" variant="outline" icon="download-outline" onPress={() => showToast('Download started · 6 files')} />
      {list.map((d: any) => (
        <Card key={d.id} onPress={() => openSheet('deliverable', { id: d.id })} style={{ gap: 8 }}>
          <Row style={{ gap: 12 }}>
            <View style={{ width: 54, height: 54, borderRadius: 10, backgroundColor: '#15151b', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="play" size={20} color="#fff" />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <T size={15} w="bold">{d.title}</T>
              <T size={12.5} color={C.muted}>{d.by} · {d.date}</T>
              <T size={12.5} color={C.muted2} numberOfLines={1}>{d.job}</T>
            </View>
          </Row>
          {statusPill(d.status)}
        </Card>
      ))}
    </Page>
  );
}

/* ---------------- Reporting ---------------- */
export function Reporting({ navigation }: any) {
  const { showToast } = useApp();
  const max = 700;
  const chartH = 140;
  const Stat = ({ l, v, d }: any) => (
    <Card style={{ flex: 1, gap: 4 }}>
      <T size={12.5} w="med" color={C.muted}>{l}</T>
      <T size={22} w="bold">{v}</T>
      <T size={11.5} w="med" color={C.green}>{d}</T>
    </Card>
  );
  const spend = [['Instagram', '₹91,200 · 64%', 64, C.pink], ['YouTube', '₹34,200 · 24%', 24, C.blue], ['UGC', '₹17,100 · 12%', 12, C.indigo]];
  const top = [['Priya Nair', '612k views · 6.1% eng.', '₹32'], ['Kabir Singh', '488k views · 5.4% eng.', '₹18'], ['Ananya Rao', '540k views · 4.9% eng.', '₹44'], ['Meera Iyer', '310k views · 4.2% eng.', '₹39']];
  return (
    <Page title="Reporting" navigation={navigation} right={<Btn label="Export" variant="outline" small icon="share-outline" style={{ marginRight: 8 }} onPress={() => showToast('Report exported as CSV')} />}>
      <Row style={{ gap: 12 }}><Stat l="Total spend" v="₹1,42,500" d="+18%" /><Stat l="Total views" v="2.4M" d="+32%" /></Row>
      <Row style={{ gap: 12 }}><Stat l="Engagement" v="4.8%" d="+0.6 pts" /><Stat l="Cost / 1k views" v="₹59" d="−12%" /></Row>
      <Card style={{ gap: 14 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <T size={16} w="bold">Views by month</T>
          <Row style={{ gap: 10 }}>
            <Row style={{ gap: 4 }}><View style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: C.pink }} /><T size={11.5} color={C.muted}>IG</T></Row>
            <Row style={{ gap: 4 }}><View style={{ width: 9, height: 9, borderRadius: 2, backgroundColor: C.indigo }} /><T size={11.5} color={C.muted}>YT</T></Row>
          </Row>
        </Row>
        <Row style={{ alignItems: 'flex-end', justifyContent: 'space-between', height: chartH }}>
          {MONTHS.map((m) => (
            <View key={m.m} style={{ alignItems: 'center', gap: 6, flex: 1 }}>
              <View style={{ justifyContent: 'flex-end', height: chartH - 22 }}>
                <View style={{ width: 22, height: (m.yt / max) * (chartH - 22), backgroundColor: C.indigo, borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
                <View style={{ width: 22, height: (m.ig / max) * (chartH - 22), backgroundColor: C.pink }} />
              </View>
              <T size={11} color={C.muted}>{m.m}</T>
            </View>
          ))}
        </Row>
      </Card>
      <Card style={{ gap: 14 }}>
        <T size={16} w="bold">Spend by platform</T>
        {spend.map(([n, v, p, col]: any) => (
          <View key={n} style={{ gap: 6 }}>
            <Row style={{ justifyContent: 'space-between' }}><T size={13.5} w="semi">{n}</T><T size={13} color={C.muted}>{v}</T></Row>
            <View style={{ height: 7, borderRadius: 4, backgroundColor: C.border }}><View style={{ width: `${p}%`, height: 7, borderRadius: 4, backgroundColor: col }} /></View>
          </View>
        ))}
      </Card>
      <Card style={{ gap: 14 }}>
        <T size={16} w="bold">Top creators</T>
        {top.map(([n, s, c]) => (
          <Row key={n} style={{ gap: 12 }}>
            <Avatar name={n} size={38} />
            <View style={{ flex: 1 }}><T size={14.5} w="bold">{n}</T><T size={12} color={C.muted}>{s}</T></View>
            <View style={{ alignItems: 'flex-end' }}><T size={15} w="bold">{c}</T><T size={11} color={C.muted}>per 1k</T></View>
          </Row>
        ))}
      </Card>
    </Page>
  );
}

/* ---------------- Creator profile ---------------- */
// This screen exists in the coded site but was removed from the Figma file, so the layout here is an
// extrapolation that follows the same card/typography system.
export function CreatorProfile({ navigation, route }: any) {
  const c = creatorById(route.params?.id);
  const { openSheet, saved, unsaveCreator, showToast } = useApp();
  const [a, b] = paletteFor(c.name);
  const isSaved = saved.includes(c.id);
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StackHeader title="Creator profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <LinearGradient colors={[a, b]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: 200, alignItems: 'center', justifyContent: 'center' }}>
          <T size={120} w="xbold" color="rgba(255,255,255,0.35)">{c.name[0]}</T>
        </LinearGradient>
        <View style={{ padding: 16, gap: 16, marginTop: -28 }}>
          <Card style={{ gap: 6 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T size={22} w="bold" track={-0.4}>{c.name}</T>
              <T size={14} w="semi" color="#b7791f">★ {c.rating.toFixed(1)}</T>
            </Row>
            <T size={13.5} color={C.muted}>{c.city} · {c.cat} · {c.followers} on {c.platform}</T>
            {c.badge ? <View style={{ marginTop: 4 }}>{statusPill('Live')}</View> : null}
            <T size={14} color={C.muted2} style={{ marginTop: 6, lineHeight: 20 }}>{c.bio}</T>
          </Card>
          <Row style={{ gap: 12 }}>
            {[['Avg. views', c.reach], ['Engagement', c.eng], ['Delivered', String(c.delivered)]].map(([l, v]) => (
              <Card key={l} style={{ flex: 1, gap: 2, padding: 12 }}><T size={11.5} color={C.muted}>{l}</T><T size={18} w="bold">{v}</T></Card>
            ))}
          </Row>
          <Card style={{ gap: 6 }}>
            <T size={12} w="bold" color={C.muted3} track={1}>STARTING RATE</T>
            <T size={28} w="bold" track={-0.6}>{inr(c.price)}</T>
            <T size={12.5} color={C.muted}>Payment is held in escrow until you approve the content.</T>
          </Card>
          <Btn label="Invite to a job" variant="pink" icon="megaphone-outline" onPress={() => { showToast(`Invite sent to ${c.name}`); }} />
          <Row style={{ gap: 10 }}>
            <Btn label={isSaved ? 'Saved' : 'Save to list'} variant="outline" flex icon={isSaved ? 'heart' : 'heart-outline'} onPress={() => (isSaved ? unsaveCreator(c.id) : openSheet('savetolist', { creatorId: c.id }))} />
            <Btn label="Message" variant="outline" flex icon="chatbubble-outline" onPress={() => openSheet('messages')} />
          </Row>
        </View>
      </ScrollView>
    </View>
  );
}
