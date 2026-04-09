import { useState, useMemo } from 'react'
import { TIERS } from '../data/playbooks'

export function Sidebar({ data, selPartner, selOffer, onSelectPartner, onSelectOffer, editMode, onToggleEdit, onAddPartner, onAddOffer }) {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [np, setNp] = useState({ name: '', color: '#003189', initials: '', tier: 'Gold', founded: '', hq: '', revenue: '', employees: '', offerTitle: '', keywords: '' })
  const [no, setNo] = useState({ title: '', keywords: '' })

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    return data.filter(p => {
      if (p.partner.name.toLowerCase().includes(q)) return true
      return p.offers.some(o =>
        o.title.toLowerCase().includes(q) ||
        o.keywords.some(k => k.toLowerCase().includes(q)) ||
        o.pitch.toLowerCase().includes(q)
      )
    })
  }, [data, search])

  function handleAdd() {
    if (!np.name.trim()) return
    const { id, oid } = onAddPartner(np)
    onSelectPartner(id)
    onSelectOffer(oid)
    setShowModal(false)
    setNp({ name: '', color: '#003189', initials: '', tier: 'Gold', founded: '', hq: '', revenue: '', employees: '', offerTitle: '', keywords: '' })
  }

  function handleAddOffer() {
    if (!no.title.trim()) return
    const oid = onAddOffer(selPartner, no)
    onSelectOffer(oid)
    setShowOfferModal(false)
    setNo({ title: '', keywords: '' })
  }

  const selPartnerName = data.find(p => p.id === selPartner)?.partner.name || ''

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-head">
          <div className="logo">ATOS — Sales Playbook · {data.length} partenaires</div>
          <input className="search-input" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Partenaires</div>
          {filtered.map(p => (
            <div key={p.id}>
              <div
                className={`partner-item${selPartner === p.id ? ' active' : ''}`}
                onClick={() => { onSelectPartner(p.id); onSelectOffer(p.offers[0].id) }}
              >
                <div className="partner-dot" style={{ background: selPartner === p.id ? 'rgba(255,255,255,0.2)' : p.partner.color + '22', color: selPartner === p.id ? 'white' : p.partner.color }}>
                  {p.partner.initials}
                </div>
                <span className="partner-name">{p.partner.name}</span>
                <span className={`partner-count ${selPartner === p.id ? 'white' : 'gray'}`}>{p.offers.length}</span>
              </div>

              {selPartner === p.id && (
                <>
                  {p.offers.map(o => (
                    <div key={o.id} className={`offer-item${selOffer === o.id ? ' active' : ''}`} onClick={() => onSelectOffer(o.id)}>
                      ▸ {o.title}
                    </div>
                  ))}
                  {editMode && (
                    <button
                      onClick={() => setShowOfferModal(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 9px 5px 42px', width: '100%', background: 'none', border: '1px dashed var(--blue)', borderRadius: 'var(--radius)', color: 'var(--blue)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', marginTop: 3 }}
                    >
                      ＋ Nouvelle offre
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-add" onClick={() => setShowModal(true)}>+ Partenaire</button>
          <button className={`btn-edit${editMode ? ' active' : ''}`} onClick={onToggleEdit}>
            {editMode ? '✏ ON' : '✏ Éditer'}
          </button>
        </div>
      </aside>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Ajouter un partenaire</div>
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}><label className="form-label">Nom *</label><input className="form-input" value={np.name} onChange={e => setNp(p => ({ ...p, name: e.target.value }))} /></div>
              <div className="form-group" style={{ flex: 1 }}><label className="form-label">Initiales</label><input className="form-input" maxLength={2} value={np.initials} onChange={e => setNp(p => ({ ...p, initials: e.target.value.toUpperCase() }))} /></div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}><label className="form-label">Couleur</label><input className="form-input" type="color" value={np.color} style={{ height: 34, padding: 2 }} onChange={e => setNp(p => ({ ...p, color: e.target.value }))} /></div>
              <div className="form-group" style={{ flex: 2 }}><label className="form-label">Tier</label><select className="form-input" value={np.tier} onChange={e => setNp(p => ({ ...p, tier: e.target.value }))}>{TIERS.map(t => <option key={t}>{t}</option>)}</select></div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}><label className="form-label">Siège</label><input className="form-input" value={np.hq} onChange={e => setNp(p => ({ ...p, hq: e.target.value }))} /></div>
              <div className="form-group" style={{ flex: 1 }}><label className="form-label">CA</label><input className="form-input" value={np.revenue} onChange={e => setNp(p => ({ ...p, revenue: e.target.value }))} /></div>
            </div>
            <div className="form-group"><label className="form-label">Titre offre principale</label><input className="form-input" value={np.offerTitle} onChange={e => setNp(p => ({ ...p, offerTitle: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Mots-clés (séparés par virgule)</label><input className="form-input" placeholder="cloud, sécurité..." value={np.keywords} onChange={e => setNp(p => ({ ...p, keywords: e.target.value }))} /></div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn-save" onClick={handleAdd} disabled={!np.name.trim()}>Créer le playbook</button>
            </div>
          </div>
        </div>
      )}

      {showOfferModal && (
        <div className="modal-overlay" onClick={() => setShowOfferModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Nouvelle offre — {selPartnerName}</div>
            <div className="form-group">
              <label className="form-label">Titre de l'offre *</label>
              <input className="form-input" placeholder="Ex : Azure Sentinel, Copilot M365..." value={no.title} onChange={e => setNo(p => ({ ...p, title: e.target.value }))} autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Mots-clés (séparés par virgule)</label>
              <input className="form-input" placeholder="Ex : cloud, sécurité, SIEM..." value={no.keywords} onChange={e => setNo(p => ({ ...p, keywords: e.target.value }))} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text2)', marginTop: 8 }}>L'offre sera créée avec des contenus vides. Remplis chaque onglet en mode édition.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowOfferModal(false)}>Annuler</button>
              <button className="btn-save" onClick={handleAddOffer} disabled={!no.title.trim()}>Créer l'offre</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
