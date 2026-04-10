import { useState, useMemo } from 'react'
import { TIERS } from '../data/playbooks'

export function Sidebar({ data, selPartner, selOffer, onSelectPartner, onSelectOffer, editMode, onToggleEdit, onAddPartner, onAddOffer, onDeletePartner, onDeleteOffer, onLogout }) {
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <svg width="70" height="24" viewBox="0 0 138 46" xmlns="http://www.w3.org/2000/svg" aria-label="Atos" style={{flexShrink:0}}>
              <style>{".st0{fill:#0073E6;}.st1{fill-rule:evenodd;clip-rule:evenodd;fill:#0073E6;}"}</style>
              <path className="st0" d="M137.3,31.8c0,9-8.1,13.5-17.6,13.5c-6.2,0-11.8-1.4-16.4-4c1.2-1.8,3-4.8,3.8-6.7c3.2,1.3,8.3,2.9,12.9,2.9c4.5,0,8.1-1.9,8.1-4.4c0-2.2-0.8-3.9-8-6.2c-9.2-2.9-14.5-5.8-14.5-13.6c0-8.2,7.6-12.7,17.1-12.7c4.1,0,9.1,0.9,12.3,1.7l-0.5,11.9l-6.8-0.1l0.1-5.9c-1.1-0.3-2.5-0.4-4.5-0.4c-5.2,0-8.7,1.7-8.7,4.8c0,2.1,2,4.1,9.2,6.4C133.1,22,137.3,24.8,137.3,31.8z"/>
              <path className="st1" d="M43.3,39.1h3.5v5.4H30.2v-5.4h3.4l-2.1-6H14.7l-2.2,6h3.7v5.4H0.7v-5.4h3.7L15.9,6.4h-4.6V0.9h18.5L43.3,39.1z M29.1,26.3L23,9.3l-6,17H29.1z"/>
              <path className="st1" d="M104.7,26.1c0,10.6-8.7,19.2-19.2,19.2c-5.2,0-9.8-2.1-13.3-5.4c-2.3,2.9-6.6,5.3-11.8,5.3c-6.2,0-12.7-3-12.7-12.2V15h-6.5V8.2h6.5V0.8h8.9v7.4h9.9V15h-9.9v17.1c0,3.7,2.3,6.2,5.5,6.2c2.3,0,4.8-1.1,6.6-3c-1.5-2.8-2.4-5.9-2.4-9.2c0-8.5,5.5-15.8,13.3-18.3c-1.6,2.4-2.7,7.8-2.7,10.8c-1.5,2.1-2.5,4.6-2.5,7.5c0,6.5,5,11.8,11.1,11.8c2.2,0,4.3-0.7,6-1.9c-6.9-2.9-11.7-9.8-11.7-17.7c0-4.3,1.4-8.2,3.7-11.4c0.7-0.1,1.3-0.1,2-0.1c2.7,0,5.2,0.6,7.5,1.5C99.9,11.3,104.7,18.1,104.7,26.1z M96.6,26.1c0-5.5-3.5-10.1-8.1-11.4c-0.4,1.1-0.6,2.3-0.6,3.6c0,5.4,3.5,10,8.1,11.4C96.4,28.6,96.6,27.4,96.6,26.1z"/>
            </svg>
            <div style={{ lineHeight: 1.4 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', letterSpacing: '0.1px' }}>DWP Sales Playbook</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 400 }}>{data.length} partenaires</div>
            </div>
          </div>
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
                {editMode && selPartner === p.id && (
                  <button
                    title="Supprimer ce partenaire"
                    onClick={e => { e.stopPropagation(); onDeletePartner(p.id) }}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 14, padding: '0 0 0 4px', lineHeight: 1, flexShrink: 0 }}
                  >🗑</button>
                )}
              </div>

              {selPartner === p.id && (
                <>
                  {p.offers.map(o => (
                    <div key={o.id} style={{ display: 'flex', alignItems: 'center' }}>
                      <div
                        className={`offer-item${selOffer === o.id ? ' active' : ''}`}
                        style={{ flex: 1 }}
                        onClick={() => onSelectOffer(o.id)}
                      >▸ {o.title}</div>
                      {editMode && (
                        <button
                          title="Supprimer cette offre"
                          onClick={() => onDeleteOffer(p.id, o.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 12, padding: '0 6px', lineHeight: 1, flexShrink: 0 }}
                        >🗑</button>
                      )}
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
          <button
            onClick={onLogout}
            title="Se déconnecter"
            style={{ padding: '7px 9px', border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', background: 'none', color: 'var(--text2)' }}
          >⎋</button>
        </div>
      </aside>

      {/* Modal — Ajouter un partenaire */}
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

      {/* Modal — Ajouter une offre */}
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
