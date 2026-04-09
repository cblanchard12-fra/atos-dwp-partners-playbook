import { useState, useEffect } from 'react'
import { INITIAL_DATA } from '../data/playbooks'

const STORAGE_KEY = 'atos_playbook_v1'

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

  const resetData = () => {
    if (window.confirm('Réinitialiser toutes les données ? Cette action est irréversible.')) {
      setData(INITIAL_DATA)
    }
  }

  return { data, updatePartner, updateOffer, updateContacts, updateNews, addPartner, resetData }
}
