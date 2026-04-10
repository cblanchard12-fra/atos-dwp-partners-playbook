import { useState, useCallback } from 'react'
import { Sidebar } from './components/Sidebar'
import { Login } from './components/Login'
import { TabIdentity, TabPitch, TabValue, TabRefs, TabSWOT, TabBattlecard, TabQualification } from './components/OfferTabs'
import { TabContacts } from './components/ContactsTab'
import { TabNews } from './components/NewsTab'
import { TabResources } from './components/ResourcesTab'
import { Toast } from './components/ui'
import { usePlaybook, useAuth, useEditAuth } from './hooks/usePlaybook'
import { TABS } from './data/playbooks'

export default function App() {
  const { authed, login, logout } = useAuth()
  const { editAuthed, unlockEdit, lockEdit } = useEditAuth()
  const { data, updatePartner, updateOffer, updateContacts, updateNews, updateResources, addPartner, addOffer, deletePartner, deleteOffer, resetData } = usePlaybook()
  const [selPartner, setSelPartner] = useState(data[0]?.id || 1)
  const [selOffer, setSelOffer] = useState(data[0]?.offers[0]?.id || 101)
  const [activeTab, setActiveTab] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editPwd, setEditPwd] = useState('')
  const [editPwdError, setEditPwdError] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg = '✓ Modification enregistrée') => {
    setToast(msg)
    setTimeout(() => setToast(null), 1800)
  }, [])

  // ---- Auth guard ----
  if (!authed) return <Login onLogin={login} />

  const partner = data.find(p => p.id === selPartner)
  const offer = partner?.offers.find(o => o.id === selOffer)

  const handleUpdatePartner = useCallback((pid, fn) => { updatePartner(pid, fn); showToast() }, [updatePartner, showToast])
  const handleUpdateOffer = useCallback((pid, oid, fn) => { updateOffer(pid, oid, fn); showToast() }, [updateOffer, showToast])
  const handleUpdateContacts = useCallback((pid, contacts) => { updateContacts(pid, contacts); showToast() }, [updateContacts, showToast])
  const handleUpdateNews = useCallback((pid, news) => { updateNews(pid, news); showToast() }, [updateNews, showToast])
  const handleUpdateResources = useCallback((pid, resources) => { updateResources(pid, resources); showToast() }, [updateResources, showToast])

  function handleSelectPartner(id) {
    setSelPartner(id)
    const p = data.find(p => p.id === id)
    if (p) setSelOffer(p.offers[0].id)
    setActiveTab(0)
  }

  function handleSelectOffer(oid) {
    setSelOffer(oid)
    setActiveTab(0)
  }

  function handleAddPartner(partnerData) {
    const result = addPartner(partnerData)
    showToast('✓ Partenaire créé')
    return result
  }

  function handleDeletePartner(pid) {
    const deleted = deletePartner(pid)
    if (deleted) {
      const remaining = data.filter(p => p.id !== pid)
      if (remaining.length > 0) {
        setSelPartner(remaining[0].id)
        setSelOffer(remaining[0].offers[0].id)
      }
      showToast('🗑 Partenaire supprimé')
    }
  }

  function handleDeleteOffer(pid, oid) {
    const p = data.find(p => p.id === pid)
    if (p && p.offers.length <= 1) {
      alert('Impossible de supprimer la dernière offre d\'un partenaire. Supprimez le partenaire entier.')
      return
    }
    const deleted = deleteOffer(pid, oid)
    if (deleted) {
      const updatedP = data.find(p => p.id === pid)
      const remaining = updatedP?.offers.filter(o => o.id !== oid)
      if (remaining?.length > 0) setSelOffer(remaining[0].id)
      showToast('🗑 Offre supprimée')
    }
  }

  // ---- Toggle edit mode — demande le mot de passe si pas encore déverrouillé ----
  function handleToggleEdit() {
    if (editMode) {
      setEditMode(false)
      return
    }
    if (editAuthed) {
      setEditMode(true)
      return
    }
    // Pas encore authentifié en édition → afficher la modale
    setEditPwd('')
    setEditPwdError(false)
    setShowEditModal(true)
  }

  function handleEditLogin(e) {
    e.preventDefault()
    if (unlockEdit(editPwd)) {
      setShowEditModal(false)
      setEditMode(true)
      setEditPwd('')
      showToast('✓ Mode édition déverrouillé')
    } else {
      setEditPwdError(true)
      setEditPwd('')
    }
  }

  function handleLogout() {
    lockEdit()
    setEditMode(false)
    logout()
  }

  // ---- Export JSON ----
  function handleExportJSON() {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `atos-playbook-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('✓ Données exportées')
  }

  // ---- Import JSON ----
  function handleImportJSON(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result)
        if (Array.isArray(imported) && imported.length > 0) {
          if (window.confirm(`Importer ${imported.length} partenaires ? Cela remplacera toutes les données actuelles.`)) {
            localStorage.setItem('atos_playbook_v1', JSON.stringify(imported))
            window.location.reload()
          }
        } else {
          alert("Fichier invalide — ce fichier n'est pas un playbook Atos.")
        }
      } catch {
        alert('Erreur de lecture du fichier JSON.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // ---- PDF Export ----
  function handleExportPDF() {
    const partnerName = partner?.partner.name || 'Playbook'
    const offerTitle = offer?.title || ''
    document.title = `${partnerName} — ${offerTitle}`
    window.print()
    setTimeout(() => { document.title = 'Atos — Sales Playbook' }, 1000)
  }

  const newsCount = partner?.news?.filter(n => n.pinned).length || 0

  return (
    <>
      <style>{`
        @media print {
          .sidebar, .topbar, .tabs, .edit-banner, .no-print { display: none !important; }
          .main { overflow: visible !important; }
          .content { overflow: visible !important; padding: 0 !important; }
          .card { break-inside: avoid; border: 1px solid #ccc !important; }
          body { background: white !important; }
          .app { display: block !important; height: auto !important; }
        }
      `}</style>

      <div className="app">
        <Sidebar
          data={data}
          selPartner={selPartner}
          selOffer={selOffer}
          onSelectPartner={handleSelectPartner}
          onSelectOffer={handleSelectOffer}
          editMode={editMode}
          onToggleEdit={handleToggleEdit}
          onAddPartner={handleAddPartner}
          onAddOffer={(pid, offerData) => { const oid = addOffer(pid, offerData); showToast('✓ Offre créée'); return oid }}
          onDeletePartner={handleDeletePartner}
          onDeleteOffer={handleDeleteOffer}
          onLogout={handleLogout}
        />

        <main className="main">
          <div className="topbar">
            <div className="breadcrumb" style={{ flex: 1 }}>
              Playbook › <strong>{partner?.partner.name}</strong>
              {activeTab < 7 && offer && <> › <strong>{offer.title}</strong></>}
            </div>
            {activeTab === 8 && newsCount > 0 && (
              <span className="tag">★ {newsCount} épinglée{newsCount > 1 ? 's' : ''}</span>
            )}
            {activeTab < 8 && offer && (offer.keywords || []).slice(0, 3).map((k, i) => (
              <span key={i} className="tag">{k}</span>
            ))}
            <button
              onClick={handleExportPDF}
              className="no-print"
              style={{ fontSize: 11, padding: '4px 10px', border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)', background: 'none', cursor: 'pointer', color: 'var(--text2)', fontFamily: 'inherit' }}
              title="Exporter en PDF"
            >⬇ PDF</button>
            <button
              onClick={handleExportJSON}
              className="no-print"
              style={{ fontSize: 11, padding: '4px 10px', border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)', background: 'none', cursor: 'pointer', color: '#27500A', fontFamily: 'inherit', borderColor: '#C0DD97' }}
              title="Sauvegarder toutes les données en JSON"
            >💾 Sauvegarder</button>
            <label
              className="no-print"
              style={{ fontSize: 11, padding: '4px 10px', border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)', background: 'none', cursor: 'pointer', color: '#0C447C', fontFamily: 'inherit', borderColor: '#B5D4F4' }}
              title="Restaurer des données depuis un fichier JSON"
            >
              📂 Restaurer
              <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
            </label>
            <button
              onClick={resetData}
              className="no-print"
              style={{ fontSize: 10, padding: '4px 8px', border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)', background: 'none', cursor: 'pointer', color: 'var(--text3)', fontFamily: 'inherit' }}
              title="Réinitialiser toutes les données"
            >↺ Reset</button>
          </div>

          {editMode && (
            <div className="edit-banner">
              ✏ Mode édition actif — cliquez sur n'importe quel champ souligné en pointillés pour le modifier
            </div>
          )}

          <div className="content">
            <div className="tabs">
              {TABS.map((t, i) => (
                <button key={i} className={`tab-btn${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
                  {i === 7 ? `👤 ${t}` : i === 8 ? `📰 ${t}` : i === 9 ? `📁 ${t}` : t}
                </button>
              ))}
            </div>

            {partner && offer && activeTab < 7 && (
              <>
                {activeTab === 0 && <TabIdentity partner={partner.partner} editMode={editMode} updatePartner={fn => handleUpdatePartner(selPartner, fn)} />}
                {activeTab === 1 && <TabPitch offer={offer} editMode={editMode} updateOffer={fn => handleUpdateOffer(selPartner, selOffer, fn)} />}
                {activeTab === 2 && <TabValue offer={offer} editMode={editMode} updateOffer={fn => handleUpdateOffer(selPartner, selOffer, fn)} />}
                {activeTab === 3 && <TabRefs offer={offer} editMode={editMode} updateOffer={fn => handleUpdateOffer(selPartner, selOffer, fn)} />}
                {activeTab === 4 && <TabSWOT offer={offer} editMode={editMode} updateOffer={fn => handleUpdateOffer(selPartner, selOffer, fn)} />}
                {activeTab === 5 && <TabBattlecard offer={offer} editMode={editMode} updateOffer={fn => handleUpdateOffer(selPartner, selOffer, fn)} />}
                {activeTab === 6 && <TabQualification offer={offer} editMode={editMode} updateOffer={fn => handleUpdateOffer(selPartner, selOffer, fn)} />}
              </>
            )}
            {partner && activeTab === 7 && (
              <TabContacts pid={selPartner} contacts={partner.contacts || []} editMode={editMode} updateContacts={c => handleUpdateContacts(selPartner, c)} partnerColor={partner.partner.color} />
            )}
            {partner && activeTab === 8 && (
              <TabNews news={partner.news || []} editMode={editMode} updateNews={n => handleUpdateNews(selPartner, n)} />
            )}
            {partner && activeTab === 9 && (
              <TabResources resources={partner.resources || []} editMode={editMode} updateResources={r => handleUpdateResources(selPartner, r)} />
            )}
          </div>
        </main>

        {toast && <Toast message={toast} />}

        {/* Modal mot de passe édition */}
        {showEditModal && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 360, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🔒</div>
              <div className="modal-title" style={{ textAlign: 'center' }}>Mode édition protégé</div>
              <p style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 16 }}>
                Entrez le mot de passe pour modifier les contenus du Playbook.
              </p>
              <form onSubmit={handleEditLogin}>
                <input
                  type="password"
                  placeholder="Mot de passe édition"
                  value={editPwd}
                  onChange={e => { setEditPwd(e.target.value); setEditPwdError(false) }}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    border: `1px solid ${editPwdError ? '#E24B4A' : 'var(--border2)'}`,
                    borderRadius: 8,
                    fontSize: 13,
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    fontFamily: 'inherit',
                    outline: 'none',
                    textAlign: 'center',
                    letterSpacing: 3,
                    marginBottom: 6,
                  }}
                />
                {editPwdError && (
                  <div style={{ fontSize: 11, color: '#E24B4A', marginBottom: 8 }}>
                    Mot de passe incorrect
                  </div>
                )}
                <div className="modal-actions" style={{ marginTop: 10 }}>
                  <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Annuler</button>
                  <button type="submit" className="btn-save" disabled={!editPwd.trim()}>Déverrouiller</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
