import { useState, useMemo } from 'react'
import { CATEGORIES, CAT_CLASS } from '../data/playbooks'

function fmtDate(d) {
  if (!d) return ''
  try {
    return new Date(d + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return d }
}

export function TabNews({ news, editMode, updateNews }) {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('Toutes')
  const [showForm, setShowForm] = useState(false)
  const [nn, setNn] = useState({
    title: '', date: new Date().toISOString().slice(0, 10),
    category: 'Produit', source: '', body: '', impact: '', url: '', pinned: false
  })

  const filtered = useMemo(() => {
    let r = [...news].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.date) - new Date(a.date)
    })
    if (catFilter !== 'Toutes') r = r.filter(n => n.category === catFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter(n => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || n.impact.toLowerCase().includes(q))
    }
    return r
  }, [news, catFilter, search])

  function addNews() {
    if (!nn.title.trim()) return
    updateNews([{ ...nn, id: Date.now() }, ...news])
    setNn({ title: '', date: new Date().toISOString().slice(0, 10), category: 'Produit', source: '', body: '', impact: '', url: '', pinned: false })
    setShowForm(false)
  }

  function delNews(id) { updateNews(news.filter(n => n.id !== id)) }
  function togglePin(id) { updateNews(news.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n)) }

  const pinnedCount = news.filter(n => n.pinned).length

  return (
    <div>
      <div className="news-toolbar">
        <input className="news-search" placeholder="Rechercher dans les actualités..." value={search} onChange={e => setSearch(e.target.value)} />
        {editMode && (
          <button className="news-add-btn" onClick={() => setShowForm(v => !v)}>
            {showForm ? 'Annuler' : '+ Ajouter'}
          </button>
        )}
      </div>

      <div className="news-filter-btns">
        {['Toutes', ...CATEGORIES].map(c => (
          <button key={c} className={`news-filter-btn${catFilter === c ? ' active' : ''}`} onClick={() => setCatFilter(c)}>{c}</button>
        ))}
      </div>

      {showForm && editMode && (
        <div className="news-form">
          <div className="news-form-title">Ajouter une actualité</div>
          <div className="form-group">
            <label className="form-label">Titre *</label>
            <input className="form-input" value={nn.title} onChange={e => setNn(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Date</label>
              <input className="form-input" type="date" value={nn.date} onChange={e => setNn(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Catégorie</label>
              <select className="form-input" value={nn.category} onChange={e => setNn(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Source</label>
              <input className="form-input" placeholder="Ex : Microsoft Blog" value={nn.source} onChange={e => setNn(p => ({ ...p, source: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Résumé</label>
            <textarea className="form-input" rows={3} style={{ resize: 'vertical' }} placeholder="Décrivez l'actualité..." value={nn.body} onChange={e => setNn(p => ({ ...p, body: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Impact Atos / Angle commercial</label>
            <textarea className="form-input" rows={2} style={{ resize: 'vertical' }} placeholder="Comment cette actualité crée une opportunité ou un risque pour Atos ?" value={nn.impact} onChange={e => setNn(p => ({ ...p, impact: e.target.value }))} />
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">URL article</label>
              <input className="form-input" placeholder="https://..." value={nn.url} onChange={e => setNn(p => ({ ...p, url: e.target.value }))} />
            </div>
            <div className="form-group" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
              <input type="checkbox" id="pin-new" checked={nn.pinned} onChange={e => setNn(p => ({ ...p, pinned: e.target.checked }))} />
              <label htmlFor="pin-new" style={{ fontSize: 12, cursor: 'pointer' }}>Épingler</label>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={() => setShowForm(false)}>Annuler</button>
            <button className="btn-save" onClick={addNews} disabled={!nn.title.trim()}>Ajouter l'actualité</button>
          </div>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="news-count">
          {filtered.length} actualité{filtered.length > 1 ? 's' : ''}
          {pinnedCount > 0 && ` · ${pinnedCount} épinglée${pinnedCount > 1 ? 's' : ''}`}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="news-empty">
          Aucune actualité{catFilter !== 'Toutes' ? ' dans cette catégorie' : ''}{search ? ' pour cette recherche' : ''}.
          {editMode ? ' Cliquez sur + Ajouter.' : ' Activez le mode édition pour en ajouter.'}
        </div>
      )}

      {filtered.map(n => (
        <div key={n.id} className={`news-card${n.pinned ? ' pinned' : ''}`}>
          {editMode && <button className="btn-del" onClick={() => delNews(n.id)}>×</button>}

          <div className="news-header">
            <span className={`news-cat ${CAT_CLASS[n.category] || ''}`}>{n.category}</span>
            <div className="news-title">{n.title}</div>
          </div>

          <div className="news-meta">
            <span className="news-date">{fmtDate(n.date)}</span>
            {n.source && <span className="news-source">— {n.source}</span>}
          </div>

          {n.body && <div className="news-body">{n.body}</div>}

          {n.impact && (
            <div className="news-impact">
              <div className="news-impact-label">Impact Atos / angle commercial</div>
              {n.impact}
            </div>
          )}

          <div className="news-actions">
            {n.url && <a className="news-link" href={n.url} target="_blank" rel="noreferrer">Lire l'article →</a>}
            <button className={`news-pin-btn${n.pinned ? ' pinned' : ''}`} onClick={() => togglePin(n.id)}>
              {n.pinned ? '★ Épinglée' : '☆ Épingler'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
