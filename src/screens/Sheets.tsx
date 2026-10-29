import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, inr } from '../theme';
import { useApp } from '../store';
import { Avatar, Btn, Card, Field, Row, Select, Sheet, T } from '../components/ui';
import { MESSAGES, NOTIFICATIONS, PLATFORMS, creatorById } from '../data';

export function SheetHost() {
  const { sheet } = useApp();
  if (!sheet) return null;
  switch (sheet.type) {
    case 'notifications': return <Notifications />;
    case 'messages': return <Messages />;
    case 'postjob': return <PostJob editId={sheet.params?.editId} />;
    case 'newlist': return <NewList />;
    case 'reviewbids': return <ReviewBids jobId={sheet.params.jobId} />;
    case 'order': return <OrderDetails orderId={sheet.params.orderId} />;
    case 'deliverable': return <DeliverablePreview id={sheet.params.id} />;
    case 'savetolist': return <SaveToList creatorId={sheet.params.creatorId} />;
    default: return null;
  }
}

function Notifications() {
  const { closeSheet } = useApp();
  return (
    <Sheet visible onClose={closeSheet} title="Notifications" footer={<Btn label="Close" variant="outline" onPress={closeSheet} />}>
      {NOTIFICATIONS.map((n) => (
        <Row key={n.id} style={{ gap: 12, alignItems: 'flex-start' }}>
          <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: C.pink, marginTop: 6 }} />
          <T size={14} style={{ flex: 1, lineHeight: 20 }}>{n.text}</T>
          <T size={12} color={C.muted}>{n.time}</T>
        </Row>
      ))}
    </Sheet>
  );
}

function Messages() {
  const { closeSheet, showToast } = useApp();
  return (
    <Sheet visible onClose={closeSheet} title="Messages" sub="2 unread" footer={<Btn label="Close" variant="outline" onPress={closeSheet} />}>
      {MESSAGES.map((m) => (
        <Pressable key={m.id} onPress={() => showToast(`Chat with ${m.name} opens here`)}>
          <Row style={{ gap: 12 }}>
            <Avatar name={m.name} size={42} />
            <View style={{ flex: 1, gap: 2 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <T size={14.5} w="bold">{m.name}</T>
                <T size={12} color={C.muted}>{m.time}</T>
              </Row>
              <Row style={{ gap: 6 }}>
                <T size={13.5} color={m.unread ? C.text : C.muted} w={m.unread ? 'semi' : 'reg'} style={{ flex: 1 }} numberOfLines={1}>{m.text}</T>
                {m.unread ? <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: C.pink }} /> : null}
              </Row>
            </View>
          </Row>
        </Pressable>
      ))}
    </Sheet>
  );
}

function PostJob({ editId }: { editId?: string }) {
  const { closeSheet, addJob, updateJob, showToast, jobs } = useApp();
  const existing = jobs.find((j: any) => j.id === editId);
  const [title, setTitle] = useState(existing?.title || '');
  const [platform, setPlatform] = useState(existing?.platform || 'Instagram');
  const [desc, setDesc] = useState('');
  const [from, setFrom] = useState(existing ? String(existing.min) : '5000');
  const [to, setTo] = useState(existing ? String(existing.max) : '15000');
  const [date, setDate] = useState('');
  const submit = () => {
    if (!title.trim()) return showToast('Please add a job title');
    const min = parseInt(from.replace(/\D/g, '') || '0', 10);
    const max = parseInt(to.replace(/\D/g, '') || '0', 10);
    if (max < min) return showToast('Budget “to” must be above “from”');
    if (existing) {
      updateJob(existing.id, { title: title.trim(), platform, min, max });
      closeSheet();
      showToast('Job updated');
      return;
    }
    addJob({ title: title.trim(), platform, deliverables: desc.trim() ? desc.trim().slice(0, 28) : 'Content', min, max, closes: date ? `Apply by ${date}` : 'Closes in 7 days' });
    closeSheet();
    showToast('Job posted — creators can start bidding');
  };
  return (
    <Sheet
      visible onClose={closeSheet} title={existing ? 'Edit job' : 'Post a job'}
      sub="Creators bid within your budget. You pay only when you approve the content."
      footer={<Row style={{ gap: 10 }}><Btn label="Cancel" variant="outline" onPress={closeSheet} /><Btn label={existing ? 'Save' : 'Post job'} flex onPress={submit} /></Row>}
    >
      <Field label="Job title" value={title} onChangeText={setTitle} placeholder="e.g. Diwali gift box unboxing Reel" />
      <Select label="Platform" value={platform} options={PLATFORMS} onChange={setPlatform} />
      <Field label="What do you need?" value={desc} onChangeText={setDesc} multiline placeholder="Describe the content, key message, and any must-haves…" />
      <Row style={{ gap: 12, alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}><Field label="Budget from" prefix="₹" value={from} onChangeText={setFrom} keyboardType="number-pad" placeholder="5,000" /></View>
        <View style={{ flex: 1 }}><Field label="Budget to" prefix="₹" value={to} onChangeText={setTo} keyboardType="number-pad" placeholder="15,000" /></View>
      </Row>
      <Field label="Apply by" value={date} onChangeText={setDate} placeholder="Pick a date · e.g. 10 Nov 2026" />
    </Sheet>
  );
}

function NewList() {
  const { closeSheet, addList, showToast } = useApp();
  const [name, setName] = useState('');
  return (
    <Sheet
      visible onClose={closeSheet} title="Create a list" sub="Group creators for a campaign so you can compare and invite them later."
      footer={
        <Row style={{ gap: 10 }}>
          <Btn label="Cancel" variant="outline" onPress={closeSheet} />
          <Btn label="Create list" flex onPress={() => { if (!name.trim()) return showToast('Give your list a name'); addList(name.trim()); closeSheet(); }} />
        </Row>
      }
    >
      <Field label="List name" value={name} onChangeText={setName} placeholder="e.g. Diwali shortlist" />
    </Sheet>
  );
}

function ReviewBids({ jobId }: { jobId: string }) {
  const { closeSheet, jobs, hireBid } = useApp();
  const job = jobs.find((j: any) => j.id === jobId);
  if (!job) return null;
  return (
    <Sheet
      visible onClose={closeSheet} title={job.title}
      sub={`Budget ${inr(job.min)} – ${inr(job.max)} · ${job.bidsCount} bids · ${job.closes}`}
      footer={<Btn label="Done" onPress={closeSheet} />}
    >
      {job.bids.length === 0 ? <T color={C.muted}>No bids to show yet.</T> : null}
      {job.bids.map((b: any) => {
        const c = creatorById(b.creatorId);
        return (
          <Card key={b.id} style={{ gap: 10 }}>
            <Row style={{ gap: 10 }}>
              <Avatar name={c.name} size={40} />
              <View style={{ flex: 1 }}>
                <T size={15} w="bold">{c.name}</T>
                <T size={12} color={C.muted}>{c.followers} · {c.platform} · ★ {c.rating.toFixed(1)}</T>
              </View>
              <T size={16} w="bold">{inr(b.price)}</T>
            </Row>
            <T size={13.5} color={C.muted2} style={{ lineHeight: 19 }}>“{b.note}”</T>
            <Btn label="Select & pay into escrow" small onPress={() => { hireBid(job.id, b); closeSheet(); }} />
          </Card>
        );
      })}
    </Sheet>
  );
}

function OrderDetails({ orderId }: { orderId: string }) {
  const { closeSheet, orders, approveOrder, openSheet, showToast } = useApp();
  const o = orders.find((x: any) => x.id === orderId) || orders[0];
  const c = creatorById(o.creatorId);
  const done = (cond: boolean) => (cond ? C.green : C.border2);
  const steps = [
    { t: 'Paid into escrow', s: `${o.paidOn} · ${inr(o.held)} held safely`, ok: true },
    { t: 'Creator working', s: `Draft due ${o.draftDue}`, ok: true },
    { t: 'Content delivered', s: o.deliveredOn ? `${o.deliveredOn} · draft 1 ready to review` : 'Waiting for the creator', ok: o.stage !== 'working' },
    { t: 'Payment released', s: o.stage === 'released' ? 'Released to the creator' : 'After you approve', ok: o.stage === 'released' },
  ];
  return (
    <Sheet visible onClose={closeSheet} title={`Order ${o.code}`} sub={`${o.title} · ${o.kind}`}>
      <Row style={{ gap: 12 }}>
        <Avatar name={c.name} size={44} />
        <View>
          <T size={15} w="bold">{c.name}</T>
          <T size={12.5} color={C.muted}>{c.city} · {c.cat} · {c.followers} followers</T>
        </View>
      </Row>
      <View style={{ gap: 0 }}>
        {steps.map((s, i) => (
          <Row key={s.t} style={{ alignItems: 'flex-start', gap: 12 }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: done(s.ok), alignItems: 'center', justifyContent: 'center' }}>
                {s.ok ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
              </View>
              {i < steps.length - 1 ? <View style={{ width: 2, height: 30, backgroundColor: done(steps[i + 1].ok) }} /> : null}
            </View>
            <View style={{ paddingBottom: 14, flex: 1 }}>
              <T size={14} w="semi">{s.t}</T>
              <T size={12.5} color={C.muted}>{s.s}</T>
            </View>
          </Row>
        ))}
      </View>
      <Card style={{ gap: 8 }}>
        <Row style={{ justifyContent: 'space-between' }}><T color={C.muted2}>Creator fee</T><T w="semi">{inr(o.fee)}</T></Row>
        <Row style={{ justifyContent: 'space-between' }}><T color={C.muted2}>Platform fee (5%)</T><T w="semi">{inr(o.platformFee)}</T></Row>
        <Row style={{ justifyContent: 'space-between' }}><T color={C.muted2}>GST on fee (18%)</T><T w="semi">{inr(o.gst)}</T></Row>
        <View style={{ height: 1, backgroundColor: C.border }} />
        <Row style={{ justifyContent: 'space-between' }}><T w="bold">Held in escrow</T><T w="bold">{inr(o.held)}</T></Row>
      </Card>
      {o.stage === 'delivered' ? (
        <Row style={{ gap: 10 }}>
          <Btn label="Request changes" variant="outline" flex onPress={() => { showToast('Change request sent to the creator'); closeSheet(); }} />
          <Btn label="Approve & pay" variant="pink" flex onPress={() => { approveOrder(o.id); closeSheet(); }} />
        </Row>
      ) : null}
      <Btn label="Message creator" variant="outline" icon="chatbubble-outline" onPress={() => openSheet('messages')} />
    </Sheet>
  );
}

function DeliverablePreview({ id }: { id: string }) {
  const { closeSheet, deliverables, showToast } = useApp();
  const d = deliverables.find((x: any) => x.id === id);
  if (!d) return null;
  return (
    <Sheet visible onClose={closeSheet} title={d.title} sub={`${d.job} · ${d.by} · ${d.date}`}>
      <View style={{ height: 210, borderRadius: 14, backgroundColor: '#15151b', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="play" size={26} color="#fff" />
        </View>
        <T size={12} color="rgba(255,255,255,0.6)" style={{ marginTop: 10 }}>Preview (demo)</T>
      </View>
      <Btn label="Download" icon="download-outline" onPress={() => { showToast('Download started · 1 file'); closeSheet(); }} />
    </Sheet>
  );
}

function SaveToList({ creatorId }: { creatorId: string }) {
  const { closeSheet, lists, saveCreator } = useApp();
  const c = creatorById(creatorId);
  return (
    <Sheet visible onClose={closeSheet} title="Save to list" sub={`Add ${c.name} to a shortlist`}>
      {lists.map((l: any) => (
        <Card key={l.id} onPress={() => { saveCreator(creatorId, l.id); closeSheet(); }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <View><T size={14.5} w="bold">{l.name}</T><T size={12} color={C.muted}>{l.count} creators</T></View>
            <Ionicons name="add-circle-outline" size={22} color={C.pink} />
          </Row>
        </Card>
      ))}
    </Sheet>
  );
}
