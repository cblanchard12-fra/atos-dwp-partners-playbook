import { useState } from 'react'

const RESOURCE_CATEGORIES = ['Présentation', 'Contrat', 'Guide technique', 'Case study', 'Tarification', 'Formation', 'Marketing', 'Autre']

const CAT_BADGE = {
  'Présentation': { bg: '#E6F1FB', color: '#0C447C' },
  'Contrat':      { bg: '#FCEBEB', color: '#791F1F' },
  'Guide technique': { bg: '#EAF3DE', color: '#27500A' },
  'Case study':   { bg: '#EEEDFE', color: '#3C3489' },
  'Tarification': { bg: '#FAEEDA', color: '#633806' },
  'Formation':    { bg: '#E1F5EE', color: '#085041' },
  'Marketing':    { bg: '#F5C4B3', color: '#712B13' },
  'Autre':        { bg: '#F1EFE8', color: '#444441' },
}

export function TabResources({ resources, editMode, updateResources }) {
  const [showForm, setShowForm] = useState(false)
  const [catFilter, setCatFilter] = useState('Toutes')
  const [nr, setNr] = useState({ title: '', url: '', category: 'Présentation', description: '' })

  function addResource() {
    if (!nr.title.trim() || !nr.url.trim()) return
    updateResources([{ ...nr, id: Date.now() }, ...(resources || [])])
    setNr({ title: '', url: '', category: 'Présentation', description: '' })
    setShowForm(false)
  }

  function delResource(id) {
    updateResources(resources.filter(r => r.id !== id))
  }

  function updResource(id, field, val) {
    updateResources(resources.map(r => r.id === id ? { ...r, [field]: val } : r))
  }

  const filtered = catFilter === 'Toutes'
    ? (resources || [])
    : (resources || []).filter(r => r.category === catFilter)

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        {editMode && (
          <button
            onClick={() => setShowForm(v => !v)}
            style={{ padding: '6px 12px', background: '#003189', color: 'white', border: 'none', borderRadius: 8, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            {showForm ? 'Annuler' : '+ Ajouter une ressource'}
          </button>
        )}
      </div>

      {/* Filtres catégorie */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
        {['Toutes', ...RESOURCE_CATEGORIES].map(c => (
          <button key={c}
            onClick={() => setCatFilter(c)}
            style={{ padding: '4px 9px', border: '0.5px solid var(--border2)', borderRadius: 8, fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', background: catFilter === c ? '#003189' : 'none', color: catFilter === c ? 'white' : 'var(--text2)', borderColor: catFilter === c ? '#003189' : undefined }}>
            {c}
          </button>
        ))}
      </div>

      {/* Formulaire d'ajout */}
      {showForm && editMode && (
        <div style={{ background: 'var(--surface)', border: '1px dashed #003189', borderRadius: 12, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#003189', marginBottom: 12 }}>Nouvelle ressource</div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 3 }}>Titre *</label>
            <input className="form-input" value={nr.title} onChange={e => setNr(p => ({ ...p, title: e.target.value }))} placeholder="Ex : Présentation partenaire Q1 2025" />
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 2 }}>
              <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 3 }}>URL du document *</label>
              <input className="form-input" value={nr.url} onChange={e => setNr(p => ({ ...p, url: e.target.value }))} placeholder="https://..." />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 3 }}>Catégorie</label>
              <select className="form-input" value={nr.category} onChange={e => setNr(p => ({ ...p, category: e.target.value }))}>
                {RESOURCE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: 'var(--text2)', display: 'block', marginBottom: 3 }}>Description</label>
            <textarea className="form-input" rows={2} style={{ resize: 'vertical' }}
              value={nr.description} onChange={e => setNr(p => ({ ...p, description: e.target.value }))}
              placeholder="Décrivez le contenu et l'utilité de ce document..." />
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowForm(false)}
              style={{ padding: '7px 14px', border: '0.5px solid var(--border2)', borderRadius: 8, background: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', color: 'var(--text)' }}>
              Annuler
            </button>
            <button
              onClick={addResource}
              disabled={!nr.title.trim() || !nr.url.trim()}
              style={{ padding: '7px 14px', background: !nr.title.trim() || !nr.url.trim() ? '#ccc' : '#003189', color: 'white', border: 'none', borderRadius: 8, cursor: !nr.title.trim() || !nr.url.trim() ? 'not-allowed' : 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
              Ajouter
            </button>
          </div>
        </div>
      )}

      {/* Liste des ressources */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 32, color: 'var(--text2)', fontSize: 13 }}>
          Aucune ressource{catFilter !== 'Toutes' ? ' dans cette catégorie' : ''}.
          {editMode ? ' Cliquez sur + Ajouter une ressource.' : ' Activez le mode édition pour en ajouter.'}
        </div>
      )}

      {filtered.map(r => {
        const badge = CAT_BADGE[r.category] || CAT_BADGE['Autre']
        return (
          <div key={r.id} style={{ background: 'var(--surface)', border: '0.5px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 10, position: 'relative' }}>
            {editMode && (
              <button onClick={() => delResource(r.id)}
                style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, border: 'none', background: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 13, lineHeight: 1, padding: 0, borderRadius: 3 }}
                onMouseEnter={e => { e.target.style.color = '#A32D2D'; e.target.style.background = '#FCEBEB' }}
                onMouseLeave={e => { e.target.style.color = 'var(--text3)'; e.target.style.background = 'none' }}>×</button>
            )}

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 8, whiteSpace: 'nowrap', flexShrink: 0, marginTop: 2, background: badge.bg, color: badge.color }}>
                {r.category}
              </span>
              <div style={{ flex: 1 }}>
                {editMode
                  ? <input className="add-input" style={{ width: '100%', fontSize: 13, fontWeight: 500 }} value={r.title}
                      onChange={e => updResource(r.id, 'title', e.target.value)} />
                  : <div style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</div>}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 10 }}>
              {editMode
                ? <textarea className="form-input" rows={2} style={{ resize: 'vertical', fontSize: 12 }}
                    value={r.description || ''}
                    onChange={e => updResource(r.id, 'description', e.target.value)}
                    placeholder="Description du document..." />
                : r.description && <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{r.description}</p>}
            </div>

            {/* URL + actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {editMode
                ? <input className="add-input" style={{ flex: 1, fontSize: 11 }} value={r.url}
                    onChange={e => updResource(r.id, 'url', e.target.value)}
                    placeholder="https://..." />
                : (
                  <>
                    <span style={{ fontSize: 10, color: 'var(--text3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      🔗 {r.url.replace(/^https?:\/\//, '').substring(0, 60)}{r.url.length > 60 ? '...' : ''}
                    </span>
                    <a href={r.url.startsWith('http') ? r.url : 'https://' + r.url} target="_blank" rel="noreferrer"
                      style={{ fontSize: 11, color: '#003189', textDecoration: 'none', padding: '4px 10px', border: '0.5px solid #003189', borderRadius: 6, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      Ouvrir →
                    </a>
                  </>
                )}
              {editMode && (
                <select style={{ fontSize: 10, padding: '4px 6px', border: '0.5px solid var(--border2)', borderRadius: 6, fontFamily: 'inherit', background: 'var(--surface)', cursor: 'pointer', flexShrink: 0 }}
                  value={r.category} onChange={e => updResource(r.id, 'category', e.target.value)}>
                  {RESOURCE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
