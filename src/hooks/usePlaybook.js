import { useState, useEffect } from 'react'
import { INITIAL_DATA } from '../data/playbooks'

const STORAGE_KEY = 'atos_playbook_v1'
const AUTH_KEY = 'atos_playbook_auth'
const EDIT_KEY = 'atos_playbook_edit'
const PASSWORD = 'AtosDWPpartners'
const EDIT_PASSWORD = 'AppsEdition'

export function useAuth() {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem(AUTH_KEY) === '1' } catch { return false }
  })

  function login(pwd) {
    if (pwd === PASSWORD) {
      try { sessionStorage.setItem(AUTH_KEY, '1') } catch {}
      setAuthed(true)
      return true
    }
    return false
  }

  function logout() {
    try {
      sessionStorage.removeItem(AUTH_KEY)
      sessionStorage.removeItem(EDIT_KEY)
    } catch {}
    setAuthed(false)
  }

  return { authed, login, logout }
}

export function useEditAuth() {
  const [editAuthed, setEditAuthed] = useState(() => {
    try { return sessionStorage.getItem(EDIT_KEY) === '1' } catch { return false }
  })

  function unlockEdit(pwd) {
    if (pwd === EDIT_PASSWORD) {
      try { sessionStorage.setItem(EDIT_KEY, '1') } catch {}
      setEditAuthed(true)
      return true
    }
    return false
  }

  function lockEdit() {
    try { sessionStorage.removeItem(EDIT_KEY) } catch {}
    setEditAuthed(false)
  }

  return { editAuthed, unlockEdit, lockEdit }
}

export function usePlaybook() {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : INITIAL_DATA
    } catch {
      return INITIAL_DATA
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.warn('localStorage write failed:', e)
    }
  }, [data])

  const updatePartner = (pid, fn) =>
    setData(prev => prev.map(p => p.id === pid ? { ...p, partner: { ...p.partner, ...fn(p.partner) } } : p))

  const updateOffer = (pid, oid, fn) =>
    setData(prev => prev.map(p => p.id === pid
      ? { ...p, offers: p.offers.map(o => o.id === oid ? { ...o, ...fn(o) } : o) }
      : p))

  const updateContacts = (pid, contacts) =>
    setData(prev => prev.map(p => p.id === pid ? { ...p, contacts } : p))

  const updateNews = (pid, news) =>
    setData(prev => prev.map(p => p.id === pid ? { ...p, news } : p))

  const updateResources = (pid, resources) =>
    setData(prev => prev.map(p => p.id === pid ? { ...p, resources } : p))

  const addPartner = (partnerData) => {
    const id = Date.now()
    const oid = id + 1
    setData(prev => [...prev, {
      id,
      partner: {
        name: partnerData.name,
        color: partnerData.color || '#003189',
        initials: partnerData.initials || partnerData.name.slice(0, 2).toUpperCase(),
        tier: partnerData.tier || 'Gold',
        founded: parseInt(partnerData.founded) || 2020,
        hq: partnerData.hq || '',
        revenue: partnerData.revenue || 'N/A',
        employees: partnerData.employees || 'N/A',
        certifications: [],
        key_figures: [],
      },
      contacts: [],
      news: [],
      offers: [{
        id: oid,
        title: partnerData.offerTitle || 'Offre principale',
        keywords: partnerData.keywords ? partnerData.keywords.split(',').map(k => k.trim()) : [],
        pitch: 'À compléter.',
        market: 'À compléter.',
        value_prop: 'À compléter.',
        roi: [],
        why_atos: 'À compléter.',
        joint_refs: [],
        partner_refs: [],
        swot: { s: [], w: [], o: [], t: [] },
        battlecard: [],
        questions: [],
      }]
    }])
    return { id, oid }
  }

  const deletePartner = (pid) => {
    if (window.confirm('Supprimer ce partenaire et toutes ses offres ? Cette action est irréversible.')) {
      setData(prev => prev.filter(p => p.id !== pid))
      return true
    }
    return false
  }

  const deleteOffer = (pid, oid) => {
    if (window.confirm('Supprimer cette offre ? Cette action est irréversible.')) {
      setData(prev => prev.map(p => p.id === pid
        ? { ...p, offers: p.offers.filter(o => o.id !== oid) }
        : p))
      return true
    }
    return false
  }

  const addOffer = (pid, offerData) => {
    const oid = Date.now()
    setData(prev => prev.map(p => p.id === pid ? {
      ...p,
      offers: [...p.offers, {
        id: oid,
        title: offerData.title,
        keywords: offerData.keywords ? offerData.keywords.split(',').map(k => k.trim()).filter(Boolean) : [],
        pitch: 'À compléter.',
        market: 'À compléter.',
        value_prop: 'À compléter.',
        roi: [],
        why_atos: 'À compléter.',
        joint_refs: [],
        partner_refs: [],
        swot: { s: [], w: [], o: [], t: [] },
        battlecard: [],
        questions: [],
      }]
    } : p))
    return oid
  }

  const resetData = () => {
    if (window.confirm('Réinitialiser toutes les données ? Cette action est irréversible.')) {
      setData(INITIAL_DATA)
    }
  }

  return { data, updatePartner, updateOffer, updateContacts, updateNews, updateResources, addPartner, addOffer, deletePartner, deleteOffer, resetData }
}
