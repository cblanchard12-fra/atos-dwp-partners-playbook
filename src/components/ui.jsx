import { useState, useRef, useEffect } from 'react'

// ---- Editable inline text field ----
export function EditField({ val, onSave, className = '', style = {}, multiline = false, rows = 3, placeholder = '' }) {
  const [v, setV] = useState(val)
  const ref = useRef()
  useEffect(() => setV(val), [val])

  if (!multiline) return (
    <input
      ref={ref}
      className={`ef ${className}`}
      value={v}
      style={style}
      placeholder={placeholder}
      onChange={e => setV(e.target.value)}
      onBlur={() => { if (v !== val) onSave(v) }}
      onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setV(val) }}
      onClick={e => e.stopPropagation()}
    />
  )

  return (
    <textarea
      ref={ref}
      className={`ef-area ${className}`}
      value={v}
      style={style}
      rows={rows}
      placeholder={placeholder}
      onChange={e => setV(e.target.value)}
      onBlur={() => { if (v !== val) onSave(v) }}
      onKeyDown={e => { if (e.key === 'Escape') setV(val) }}
      onClick={e => e.stopPropagation()}
    />
  )
}

// ---- Editable list with add/remove + inline edit ----
function EditableItem({ value, onSave, onDelete }) {
  const [v, setV] = useState(value)
  useEffect(() => setV(value), [value])

  return (
    <div className="list-item-row">
      <input
        className="add-input"
        style={{ flex: 1, fontSize: 11 }}
        value={v}
        onChange={e => setV(e.target.value)}
        onBlur={() => { if (v.trim() && v !== value) onSave(v.trim()); else if (!v.trim()) setV(value) }}
        onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setV(value) }}
      />
      <button className="list-del" onClick={onDelete}>×</button>
    </div>
  )
}

export function EditList({ items, onSave, placeholder = 'Ajouter...' }) {
  const [nv, setNv] = useState('')

  return (
    <div>
      {items.map((it, i) => (
        <EditableItem
          key={i}
          value={it}
          onSave={v => onSave(items.map((x, j) => j === i ? v : x))}
          onDelete={() => onSave(items.filter((_, j) => j !== i))}
        />
      ))}
      <div className="add-row">
        <input
          className="add-input"
          placeholder={placeholder}
          value={nv}
          onChange={e => setNv(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && nv.trim()) { onSave([...items, nv.trim()]); setNv('') }
          }}
        />
        <button className="add-btn-sm" onClick={() => { if (nv.trim()) { onSave([...items, nv.trim()]); setNv('') } }}>+ Ajouter</button>
      </div>
    </div>
  )
}

// ---- Toast notification ----
export function Toast({ message }) {
  return <div className="toast">{message}</div>
}

// ---- Persona filter buttons ----
export function PersonaFilters({ selected, onSelect, personas }) {
  return (
    <div className="persona-filters">
      {['Tous', ...personas].map(p => (
        <button
          key={p}
          className={`persona-filter-btn${selected === p ? ' active' : ''}`}
          onClick={() => onSelect(p)}
        >{p}</button>
      ))}
    </div>
  )
}
