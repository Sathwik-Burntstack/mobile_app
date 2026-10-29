import React, { createContext, useContext, useRef, useState } from 'react';
import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';
import { CREATORS, DELIVERABLES, JOBS, LISTS, ORDERS, Job, Bid } from './data';

export const navRef = createNavigationContainerRef<any>();

type Sheet = { type: string; params?: any } | null;
const Ctx = createContext<any>(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [brandName, setBrandName] = useState('Nimbu Foods');
  const [jobs, setJobs] = useState<Job[]>(JOBS);
  const [lists, setLists] = useState(LISTS);
  const [saved, setSaved] = useState<string[]>(['c3']);
  const [deliverables, setDeliverables] = useState(DELIVERABLES);
  const [orders, setOrders] = useState(ORDERS);
  const [unread, setUnread] = useState(4);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [pendingCreator, setPendingCreator] = useState<string | null>(null);
  const timer = useRef<any>(null);

  const showToast = (m: string) => {
    setToast(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  };
  const openSheet = (type: string, params?: any) => {
    if (type === 'notifications') setUnread(0);
    setSheet({ type, params });
  };
  const closeSheet = () => setSheet(null);

  const reset = (routes: any[]) =>
    navRef.isReady() && navRef.dispatch(CommonActions.reset({ index: routes.length - 1, routes }));

  const login = () => {
    setLoggedIn(true);
    if (pendingCreator) {
      const id = pendingCreator;
      setPendingCreator(null);
      reset([{ name: 'Main' }, { name: 'CreatorProfile', params: { id } }]);
    } else reset([{ name: 'Main' }]);
  };
  const logout = () => {
    setLoggedIn(false);
    reset([{ name: 'Landing' }]);
  };

  // Login gate: opening a creator profile while logged out goes to Log in first.
  const openCreator = (id: string) => {
    if (!loggedIn) {
      setPendingCreator(id);
      navRef.navigate('RoleSelection', { mode: 'login' });
    } else navRef.navigate('CreatorProfile', { id });
  };

  const addJob = (j: Partial<Job>) =>
    setJobs((p) => [
      { id: 'j' + Date.now(), title: j.title || 'Untitled job', platform: j.platform || 'Instagram', deliverables: j.deliverables || 'Content',
        min: j.min || 5000, max: j.max || 15000, status: 'open', bidsCount: 0, closes: j.closes || 'Closes soon', bidders: [], bids: [] },
      ...p,
    ]);
  const updateJob = (id: string, patch: Partial<Job>) => setJobs((p) => p.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  const hireBid = (jobId: string, bid: Bid) => {
    setJobs((p) => p.map((j) => (j.id === jobId ? { ...j, status: 'progress', hired: bid.creatorId, escrow: bid.price, closes: '', bids: [] } : j)));
    const name = CREATORS.find((c) => c.id === bid.creatorId)?.name;
    showToast(`Hired ${name} · money held in escrow`);
  };
  const addList = (name: string) => setLists((p) => [{ id: 'l' + Date.now(), name, count: 0, updated: 'Updated just now' }, ...p]);
  const saveCreator = (creatorId: string, listId?: string) => {
    const list = lists.find((l) => l.id === listId) || lists[0];
    setSaved((p) => (p.includes(creatorId) ? p : [...p, creatorId]));
    setLists((p) => p.map((l) => (l.id === list.id ? { ...l, count: l.count + 1, updated: 'Updated just now' } : l)));
    showToast(`Saved to “${list.name}”`);
  };
  const unsaveCreator = (id: string) => setSaved((p) => p.filter((x) => x !== id));
  const approveOrder = (id: string) => {
    setOrders((p) => p.map((o) => (o.id === id ? { ...o, stage: 'released' } : o)));
    setDeliverables((p) => p.map((d) => (d.status === 'Needs review' ? { ...d, status: 'Approved' } : d)));
    showToast('Approved — payment released to the creator');
  };

  return (
    <Ctx.Provider value={{
      loggedIn, login, logout, brandName, setBrandName, jobs, addJob, updateJob, hireBid, lists, addList, saved, saveCreator, unsaveCreator,
      deliverables, orders, approveOrder, unread, sheet, openSheet, closeSheet, toast, showToast, openCreator, setPendingCreator, reset,
    }}>
      {children}
    </Ctx.Provider>
  );
}
