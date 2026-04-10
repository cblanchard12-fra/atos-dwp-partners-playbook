import { useState } from 'react'
import { EditField, EditList, PersonaFilters } from './ui'
import { TIER_BADGE, TIERS, PERSONAS, PERSONA_CLASS } from '../data/playbooks'

// ---- Tab 0: Fiche Identité ----
export function TabIdentity({ partner, editMode, updatePartner }) {
  const up = fn => updatePartner(fn)

  // Logo partenaire — utilise logo_url si définie, sinon initiales
  const LogoOrInitials = () => {
    if (partner.logo_url && !editMode) {
      return (
        <div style={{ width: 60, height: 60, borderRadius: 12, border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, padding: 6, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <img
            src={partner.logo_url}
            alt={partner.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={e => {
              e.target.parentNode.innerHTML = `<div style="width:60px;height:60px;border-radius:12px;background:${partner.color}22;color:${partner.color};display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:600">${partner.initials}</div>`
            }}
          />
        </div>
      )
    }
    return (
      <div style={{ width: 60, height: 60, borderRadius: 12, background: partner.color + '22', color: partner.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600, flexShrink: 0 }}>
        {editMode
          ? <EditField val={partner.initials} onSave={v => up(p => ({ initials: v }))} style={{ width: 38, textAlign: 'center' }} />
          : partner.initials}
      </div>
    )
  }

  return (
    <div>
      <div className={`card${editMode ? ' editing' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <LogoOrInitials />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {editMode ? <EditField val={partner.name} onSave={v => up(p => ({ name: v }))} style={{ fontSize: 18 }} /> : partner.name}
              </div>
              {!editMode && partner.website && (
                <a href={partner.website.startsWith('http') ? partner.website : 'https://' + partner.website}
                   target="_blank" rel="noreferrer"
                   style={{ fontSize: 11, color: 'var(--blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                  🌐 {partner.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 5, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              {editMode ? <EditField val={partner.hq} onSave={v => up(p => ({ hq: v }))} placeholder="Siège" /> : partner.hq}
              {' · '}
              {editMode
                ? <EditField val={String(partner.founded)} onSave={v => up(p => ({ founded: parseInt(v) || p.founded }))} style={{ width: 50 }} />
                : `Fondé en ${partner.founded}`}
              {' · '}
              <span className={`badge ${TIER_BADGE[partner.tier] || 'badge-blue'}`}>
                {editMode
                  ? <select value={partner.tier} onChange={e => up(p => ({ tier: e.target.value }))} style={{ border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 10, cursor: 'pointer', color: 'inherit' }}>
                    {TIERS.map(t => <option key={t}>{t}</option>)}
                  </select>
                  : `${partner.tier} Partner`}
              </span>
            </div>
            {editMode && (
              <div style={{ marginTop: 8, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>
                  URL Logo : <EditField val={partner.logo_url || ''} onSave={v => up(p => ({ logo_url: v }))} placeholder="https://logo.clearbit.com/microsoft.com" style={{ fontSize: 11, minWidth: 200 }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>
                  Site web : <EditField val={partner.website || ''} onSave={v => up(p => ({ website: v }))} placeholder="https://microsoft.com" style={{ fontSize: 11, minWidth: 160 }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Métriques CA + Effectifs */}
        <div className="grid2" style={{ marginBottom: 12 }}>
          <div className="metric">
            <div className="metric-label">Chiffre d'affaires</div>
            <div className="metric-value">
              {editMode ? <EditField val={partner.revenue} onSave={v => up(p => ({ revenue: v }))} style={{ fontSize: 16 }} /> : partner.revenue}
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">Effectifs</div>
            <div className="metric-value">
              {editMode ? <EditField val={partner.employees} onSave={v => up(p => ({ employees: v }))} style={{ fontSize: 16 }} /> : partner.employees}
            </div>
          </div>
        </div>

        {/* Certifications Atos — 3 colonnes */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Certifications Atos</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'Atos Group', field: 'cert_group' },
              { label: 'Atos France', field: 'cert_france' },
              { label: 'Atos DWP', field: 'cert_dwp' },
            ].map(({ label, field }) => (
              <div key={field} className="metric">
                <div className="metric-label">{label}</div>
                <div className="metric-value" style={{ fontSize: 22 }}>
                  {editMode
                    ? <EditField val={String(partner[field] ?? 0)} onSave={v => up(p => ({ [field]: parseInt(v) || 0 }))} style={{ fontSize: 22, width: 50 }} />
                    : (partner[field] ?? 0)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Liste des certifications */}
        {editMode
          ? <EditList items={partner.certifications} onSave={v => up(p => ({ certifications: v }))} placeholder="Ajouter une certification..." />
          : <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {partner.certifications.map((c, i) => <span key={i} className="badge badge-blue">{c}</span>)}
          </div>}
      </div>

      {partner.key_figures?.length > 0 && (
        <div className={`card${editMode ? ' editing' : ''}`}>
          <div className="card-title">Chiffres clés</div>
          {partner.key_figures.map((kf, i) => (
            <div key={i} className="table-row">
              <span style={{ color: 'var(--text2)' }}>
                {editMode ? <EditField val={kf.label} onSave={v => up(p => ({ key_figures: p.key_figures.map((f, j) => j === i ? { ...f, label: v } : f) }))} /> : kf.label}
              </span>
              <span style={{ fontWeight: 500 }}>
                {editMode ? <EditField val={kf.value} onSave={v => up(p => ({ key_figures: p.key_figures.map((f, j) => j === i ? { ...f, value: v } : f) }))} /> : kf.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---- Tab 1: Pitch & Marché ----
export function TabPitch({ offer, editMode, updateOffer }) {
  const uo = fn => updateOffer(fn)
  return (
    <div>
      <div className="pitch-box">
        <h3>Pitch de l'offre</h3>
        {editMode
          ? <EditField val={offer.pitch} onSave={v => uo(o => ({ pitch: v }))} multiline rows={4} className="ef-area-white" />
          : <p>{offer.pitch}</p>}
      </div>

      <div className={`card${editMode ? ' editing' : ''}`}>
        <div className="card-title">Contexte marché</div>
        {editMode
          ? <EditField val={offer.market} onSave={v => uo(o => ({ market: v }))} multiline rows={4} />
          : <p style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--text2)' }}>{offer.market}</p>}
      </div>

      <div className={`card${editMode ? ' editing' : ''}`}>
        <div className="card-title">Mots-clés & positionnement</div>
        {editMode
          ? <EditList items={offer.keywords || []} onSave={v => uo(o => ({ keywords: v }))} placeholder="Ajouter un mot-clé..." />
          : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(offer.keywords || []).map((k, i) => <span key={i} className="badge badge-blue">{k}</span>)}
          </div>}
      </div>
    </div>
  )
}

// ---- Tab 2: Valeur Ajoutée ----
export function TabValue({ offer, editMode, updateOffer }) {
  const uo = fn => updateOffer(fn)
  return (
    <div>
      <div className={`card${editMode ? ' editing' : ''}`}>
        <div className="card-title">Proposition de valeur</div>
        {editMode
          ? <EditField val={offer.value_prop} onSave={v => uo(o => ({ value_prop: v }))} multiline rows={4} />
          : <p style={{ fontSize: 12, lineHeight: 1.7 }}>{offer.value_prop}</p>}
      </div>

      <div className={`card${editMode ? ' editing' : ''}`}>
        <div className="card-title">ROI & Indicateurs clés</div>
        {(offer.roi || []).map((r, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
              {editMode
                ? <EditField val={r.metric} onSave={v => uo(o => ({ roi: o.roi.map((x, j) => j === i ? { ...x, metric: v } : x) }))} />
                : <span>{r.metric}</span>}
              <span style={{ fontWeight: 500, color: 'var(--blue)' }}>
                {editMode
                  ? <EditField val={String(r.value)} onSave={v => uo(o => ({ roi: o.roi.map((x, j) => j === i ? { ...x, value: parseInt(v) || x.value } : x) }))} style={{ width: 40, textAlign: 'right' }} />
                  : r.value} {r.unit}
              </span>
            </div>
            <div className="roi-bar">
              <div className="roi-fill" style={{ width: `${Math.min(r.value, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className={`card${editMode ? ' editing' : ''}`}>
        <div className="card-title">Pourquoi Atos + ce partenaire ?</div>
        {editMode
          ? <EditField val={offer.why_atos} onSave={v => uo(o => ({ why_atos: v }))} multiline rows={4} />
          : <p style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--text2)' }}>{offer.why_atos}</p>}
      </div>
    </div>
  )
}

// ---- Tab 3: Références ----
export function TabRefs({ offer, editMode, updateOffer }) {
  const uo = fn => updateOffer(fn)
  const [nr, setNr] = useState({ client: '', industry: '', use_case: '', outcome: '' })
  const [npr, setNpr] = useState({ client: '', industry: '', use_case: '', outcome: '' })

  function RefCard({ r, i, type }) {
    return (
      <div className="ref-item">
        <div className="ref-client">
          {editMode ? <EditField val={r.client} onSave={v => uo(o => ({ [type]: o[type].map((x, j) => j === i ? { ...x, client: v } : x) }))} /> : r.client}
          {' '}
          <span className={`badge ${type === 'joint_refs' ? 'badge-purple' : 'badge-green'}`} style={{ marginLeft: 6 }}>
            {editMode ? <EditField val={r.industry} onSave={v => uo(o => ({ [type]: o[type].map((x, j) => j === i ? { ...x, industry: v } : x) }))} /> : r.industry}
          </span>
          {editMode && <button className="list-del" style={{ float: 'right' }} onClick={() => uo(o => ({ [type]: o[type].filter((_, j) => j !== i) }))}>×</button>}
        </div>
        <div className="ref-detail"><b>Cas d'usage : </b>{editMode ? <EditField val={r.use_case} onSave={v => uo(o => ({ [type]: o[type].map((x, j) => j === i ? { ...x, use_case: v } : x) }))} /> : r.use_case}</div>
        <div className="ref-detail"><b>Résultat : </b>{editMode ? <EditField val={r.outcome} onSave={v => uo(o => ({ [type]: o[type].map((x, j) => j === i ? { ...x, outcome: v } : x) }))} /> : r.outcome}</div>
      </div>
    )
  }

  function AddRefForm({ state, setState, type }) {
    return (
      <div style={{ marginTop: 10, padding: 10, background: 'var(--bg)', borderRadius: 'var(--radius)' }}>
        <div className="form-row" style={{ gap: 8, marginBottom: 6 }}>
          <input className="add-input" placeholder="Client" value={state.client} onChange={e => setState(v => ({ ...v, client: e.target.value }))} />
          <input className="add-input" placeholder="Secteur" value={state.industry} onChange={e => setState(v => ({ ...v, industry: e.target.value }))} />
        </div>
        <input className="add-input" style={{ width: '100%', marginBottom: 6 }} placeholder="Cas d'usage" value={state.use_case} onChange={e => setState(v => ({ ...v, use_case: e.target.value }))} />
        <div className="form-row" style={{ gap: 8 }}>
          <input className="add-input" style={{ flex: 1 }} placeholder="Résultat obtenu" value={state.outcome} onChange={e => setState(v => ({ ...v, outcome: e.target.value }))} />
          <button className="add-btn-sm" onClick={() => {
            if (state.client) { uo(o => ({ [type]: [...(o[type] || []), { ...state }] })); setState({ client: '', industry: '', use_case: '', outcome: '' }) }
          }}>+ Ajouter</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className={`card${editMode ? ' editing' : ''}`}>
        <div className="card-title">Références communes Atos × Partenaire</div>
        {(offer.joint_refs || []).map((r, i) => <RefCard key={i} r={r} i={i} type="joint_refs" />)}
        {(offer.joint_refs || []).length === 0 && !editMode && <div className="empty-state">Aucune référence commune. Activez l'édition pour en ajouter.</div>}
        {editMode && <AddRefForm state={nr} setState={setNr} type="joint_refs" />}
      </div>

      <div className={`card${editMode ? ' editing' : ''}`}>
        <div className="card-title">Références partenaire</div>
        {(offer.partner_refs || []).map((r, i) => <RefCard key={i} r={r} i={i} type="partner_refs" />)}
        {(offer.partner_refs || []).length === 0 && !editMode && <div className="empty-state">Aucune référence partenaire. Activez l'édition pour en ajouter.</div>}
        {editMode && <AddRefForm state={npr} setState={setNpr} type="partner_refs" />}
      </div>
    </div>
  )
}

// ---- Tab 4: SWOT ----
export function TabSWOT({ offer, editMode, updateOffer }) {
  const uo = fn => updateOffer(fn)
  const { s = [], w = [], o = [], t = [] } = offer.swot || {}

  function SwotCell({ title, items, cls, field, sym }) {
    return (
      <div className={`swot-cell ${cls}`}>
        <div className="swot-title">{sym} {title}</div>
        {editMode
          ? <EditList items={items} onSave={v => uo(x => ({ swot: { ...x.swot, [field]: v } }))} placeholder="Ajouter un point..." />
          : items.map((it, i) => <div key={i} className="swot-item">• {it}</div>)}
      </div>
    )
  }

  return (
    <div className={`card${editMode ? ' editing' : ''}`}>
      <div className="swot-grid">
        <SwotCell title="Forces"       items={s} cls="swot-s" field="s" sym="✚" />
        <SwotCell title="Faiblesses"   items={w} cls="swot-w" field="w" sym="−" />
        <SwotCell title="Opportunités" items={o} cls="swot-o" field="o" sym="◆" />
        <SwotCell title="Menaces"      items={t} cls="swot-t" field="t" sym="▲" />
      </div>
    </div>
  )
}

// ---- Tab 5: Battle Card ----
export function TabBattlecard({ offer, editMode, updateOffer }) {
  const uo = fn => updateOffer(fn)
  const cols = ['Points forts Partenaire', 'Points forts Concurrent', 'Arguments gagnants', 'Pièges à éviter']
  const keys = ['strengths', 'their_strengths', 'wins', 'traps']

  if (!offer.battlecard?.length && !editMode) {
    return <div className="empty-state">Aucune battle card. Activez l'édition pour en ajouter.</div>
  }

  return (
    <div>
      {(offer.battlecard || []).map((bc, bi) => (
        <div key={bi} className={`card${editMode ? ' editing' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span>⚔️</span>
            <div className="card-title" style={{ margin: 0 }}>vs {editMode
              ? <EditField val={bc.competitor} onSave={v => uo(o => ({ battlecard: o.battlecard.map((x, j) => j === bi ? { ...x, competitor: v } : x) }))} style={{ fontSize: 13 }} />
              : bc.competitor}
            </div>
            {editMode && <button className="list-del" style={{ marginLeft: 'auto' }} onClick={() => uo(o => ({ battlecard: o.battlecard.filter((_, j) => j !== bi) }))}>×</button>}
          </div>

          {editMode ? (
            <div className="grid2">
              {keys.map((k, ki) => (
                <div key={k} style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text2)', marginBottom: 6 }}>{cols[ki].toUpperCase()}</div>
                  <EditList items={bc[k] || []} onSave={v => uo(o => ({ battlecard: o.battlecard.map((x, j) => j === bi ? { ...x, [k]: v } : x) }))} placeholder="Ajouter..." />
                </div>
              ))}
            </div>
          ) : (
            <table className="bc-table">
              <thead><tr>{cols.map((c, i) => <th key={i}>{c}</th>)}</tr></thead>
              <tbody>
                <tr>
                  {keys.map((k, ki) => (
                    <td key={ki}>
                      {(bc[k] || []).map((s, si) => (
                        <div key={si} style={{ marginBottom: 3 }}>
                          {ki === 0 ? '✓ ' : ki === 2 ? '→ ' : ki === 3 ? '⚠ ' : '• '}{s}
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      ))}

      {editMode && (
        <button className="add-btn-sm" style={{ marginTop: 4 }}
          onClick={() => uo(o => ({ battlecard: [...(o.battlecard || []), { competitor: 'Nouveau concurrent', strengths: [], their_strengths: [], wins: [], traps: [] }] }))}>
          + Ajouter un concurrent
        </button>
      )}
    </div>
  )
}

// ---- Tab 6: Qualification ----
export function TabQualification({ offer, editMode, updateOffer }) {
  const uo = fn => updateOffer(fn)
  const [sel, setSel] = useState('Tous')
  const [nq, setNq] = useState({ q: '', persona: 'RSSI', intent: '' })
  const qs = offer.questions || []
  const filtered = sel === 'Tous' ? qs : qs.filter(q => q.persona === sel)

  return (
    <div>
      <PersonaFilters selected={sel} onSelect={setSel} personas={PERSONAS} />

      {filtered.map((q, i) => {
        const ri = qs.indexOf(q)
        return (
          <div key={i} className="q-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              {editMode
                ? <select value={q.persona} style={{ fontSize: 10, padding: '2px 6px', border: '0.5px solid var(--border2)', borderRadius: 8, fontFamily: 'inherit', background: 'var(--surface)', cursor: 'pointer' }}
                  onChange={e => uo(o => ({ questions: o.questions.map((x, j) => j === ri ? { ...x, persona: e.target.value } : x) }))}>
                  {PERSONAS.map(p => <option key={p}>{p}</option>)}
                </select>
                : <span className={`persona-badge ${PERSONA_CLASS[q.persona] || ''}`}>{q.persona}</span>}
              {editMode && <button className="list-del" style={{ marginLeft: 'auto' }} onClick={() => uo(o => ({ questions: o.questions.filter((_, j) => j !== ri) }))}>×</button>}
            </div>
            <div className="q-text">
              {editMode ? <EditField val={q.q} onSave={v => uo(o => ({ questions: o.questions.map((x, j) => j === ri ? { ...x, q: v } : x) }))} multiline rows={2} /> : q.q}
            </div>
            <div className="q-intent">Objectif : {editMode ? <EditField val={q.intent} onSave={v => uo(o => ({ questions: o.questions.map((x, j) => j === ri ? { ...x, intent: v } : x) }))} /> : q.intent}</div>
          </div>
        )
      })}

      {filtered.length === 0 && <div className="empty-state">Aucune question pour ce persona.</div>}

      {editMode && (
        <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: 14, marginTop: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text2)', marginBottom: 8 }}>Ajouter une question</div>
          <textarea className="add-input" style={{ width: '100%', minHeight: 50, padding: '5px 7px', resize: 'vertical', marginBottom: 6 }}
            placeholder="Question de qualification..." value={nq.q} onChange={e => setNq(v => ({ ...v, q: e.target.value }))} />
          <div className="form-row" style={{ gap: 6 }}>
            <select className="add-input" value={nq.persona} onChange={e => setNq(v => ({ ...v, persona: e.target.value }))}>
              {PERSONAS.map(p => <option key={p}>{p}</option>)}
            </select>
            <input className="add-input" style={{ flex: 2 }} placeholder="Objectif de la question" value={nq.intent} onChange={e => setNq(v => ({ ...v, intent: e.target.value }))} />
          </div>
          <button className="add-btn-sm" style={{ marginTop: 6 }} onClick={() => {
            if (nq.q.trim()) { uo(o => ({ questions: [...(o.questions || []), { ...nq }] })); setNq({ q: '', persona: 'RSSI', intent: '' }) }
          }}>+ Ajouter la question</button>
        </div>
      )}
    </div>
  )
}
