import { useState } from 'react'
import { EditField } from './ui'
import { CONTACT_TYPES, CONTACT_TYPE_BADGE, getInitials } from '../data/playbooks'

export function TabContacts({ pid, contacts, editMode, updateContacts, partnerColor }) {
  const [showForm, setShowForm] = useState(false)
  const [nc, setNc] = useState({ name: '', role: '', type: 'Alliance Manager', email: '', phone: '', linkedin: '', note: '', color: partnerColor || '#003189' })

  function addContact() {
    if (!nc.name.trim()) return
    updateContacts([...contacts, { ...nc, id: Date.now() }])
    setNc({ name: '', role: '', type: 'Alliance Manager', email: '', phone: '', linkedin: '', note: '', color: partnerColor || '#003189' })
    setShowForm(false)
  }

  function delContact(id) { updateContacts(contacts.filter(c => c.id !== id)) }
  function updContact(id, field, val) { updateContacts(contacts.map(c => c.id === id ? { ...c, [field]: val } : c)) }

  return (
    <div>
      <div className="contacts-grid">
        {contacts.map(c => (
          <div key={c.id} className={`contact-card${editMode ? ' editing' : ''}`}>
            {editMode && <button className="btn-del" onClick={() => delContact(c.id)}>×</button>}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
              <div className="contact-avatar" style={{ background: c.color + '22', color: c.color }}>
                {getInitials(c.name)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="contact-name">
                  {editMode ? <EditField val={c.name} onSave={v => updContact(c.id, 'name', v)} style={{ fontSize: 13, fontWeight: 500 }} /> : c.name}
                </div>
                <div className="contact-role">
                  {editMode ? <EditField val={c.role} onSave={v => updContact(c.id, 'role', v)} placeholder="Titre / poste" /> : c.role}
                </div>
                <div style={{ marginTop: 5 }}>
                  {editMode
                    ? <select value={c.type} onChange={e => updContact(c.id, 'type', e.target.value)} style={{ fontSize: 10, padding: '2px 6px', border: '0.5px solid var(--border2)', borderRadius: 8, fontFamily: 'inherit', background: 'var(--surface)', cursor: 'pointer' }}>
                      {CONTACT_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                    : <span className={`badge ${CONTACT_TYPE_BADGE[c.type] || 'badge-gray'}`}>{c.type}</span>}
                </div>
              </div>
            </div>

            <div className="contact-info">
              {c.email && <span>
                ✉{' '}
                {editMode
                  ? <EditField val={c.email} onSave={v => updContact(c.id, 'email', v)} style={{ color: 'var(--blue)' }} />
                  : <a href={`mailto:${c.email}`}>{c.email}</a>}
              </span>}
              {c.phone && <span>
                ☎{' '}
                {editMode ? <EditField val={c.phone} onSave={v => updContact(c.id, 'phone', v)} /> : c.phone}
              </span>}
              {c.linkedin && <span>
                in{' '}
                {editMode
                  ? <EditField val={c.linkedin} onSave={v => updContact(c.id, 'linkedin', v)} style={{ color: 'var(--blue)' }} />
                  : <a href={`https://${c.linkedin}`} target="_blank" rel="noreferrer">{c.linkedin}</a>}
              </span>}
            </div>

            {(c.note || editMode) && (
              <div className="contact-note">
                {editMode
                  ? <EditField val={c.note || ''} onSave={v => updContact(c.id, 'note', v)} multiline rows={2} placeholder="Note / contexte relationnel..." />
                  : c.note}
              </div>
            )}
          </div>
        ))}
      </div>

      {contacts.length === 0 && !editMode && <div className="empty-state">Aucun contact renseigné. Activez l'édition pour en ajouter.</div>}

      {editMode && !showForm && (
        <button className="btn-dashed" onClick={() => setShowForm(true)}>+ Ajouter un contact</button>
      )}

      {editMode && showForm && (
        <div className="card editing" style={{ marginTop: 12 }}>
          <div className="card-title">Nouveau contact</div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Nom *</label>
              <input className="form-input" value={nc.name} onChange={e => setNc(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Couleur avatar</label>
              <input className="form-input" type="color" value={nc.color} style={{ height: 34, padding: 2 }} onChange={e => setNc(p => ({ ...p, color: e.target.value }))} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Titre / Poste</label>
              <input className="form-input" value={nc.role} onChange={e => setNc(p => ({ ...p, role: e.target.value }))} />
            </div>
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Type</label>
              <select className="form-input" value={nc.type} onChange={e => setNc(p => ({ ...p, type: e.target.value }))}>
                {CONTACT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={nc.email} onChange={e => setNc(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Téléphone</label>
              <input className="form-input" value={nc.phone} onChange={e => setNc(p => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">LinkedIn</label>
            <input className="form-input" placeholder="linkedin.com/in/..." value={nc.linkedin} onChange={e => setNc(p => ({ ...p, linkedin: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Note / Contexte relationnel</label>
            <textarea className="form-input" rows={2} style={{ resize: 'vertical' }} value={nc.note} onChange={e => setNc(p => ({ ...p, note: e.target.value }))} />
          </div>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={() => setShowForm(false)}>Annuler</button>
            <button className="btn-save" onClick={addContact} disabled={!nc.name.trim()}>Ajouter ce contact</button>
          </div>
        </div>
      )}
    </div>
  )
}
