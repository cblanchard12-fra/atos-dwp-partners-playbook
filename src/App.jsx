import { useState, useCallback } from 'react'
import { Sidebar } from './components/Sidebar'
import { TabIdentity, TabPitch, TabValue, TabRefs, TabSWOT, TabBattlecard, TabQualification } from './components/OfferTabs'
import { TabContacts } from './components/ContactsTab'
import { TabNews } from './components/NewsTab'
import { Toast } from './components/ui'
import { usePlaybook } from './hooks/usePlaybook'
import { TABS } from './data/playbooks'

export default function App() {
  const { data, updatePartner, updateOffer, updateContacts, updateNews, addPartner, resetData } = usePlaybook()
  const [selPartner, setSelPartner] = useState(data[0]?.id || 1)
  const [selOffer, setSelOffer] = useState(data[0]?.offers[0]?.id || 101)
  const [activeTab, setActiveTab] = useState(0)
  const [editMode, setEditMode] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = useCallback((msg = '✓ Modification enregistrée') => {
    setToast(msg)
    setTimeout(() => setToast(null), 1800)
  }, [])

  const partner = data.find(p => p.id === selPartner)
  const offer = partner?.offers.find(o => o.id === selOffer)

  const handleUpdatePartner = useCallback((pid, fn) => {
    updatePartner(pid, fn)
    showToast()
  }, [updatePartner, showToast])

  const handleUpdateOffer = useCallback((pid, oid, fn) => {
    updateOffer(pid, oid, fn)
    showToast()
  }, [updateOffer, showToast])

  const handleUpdateContacts = useCallback((pid, contacts) => {
    updateContacts(pid, contacts)
    showToast()
  }, [updateContacts, showToast])

  const handleUpdateNews = useCallback((pid, news) => {
    updateNews(pid, news)
    showToast()
  }, [updateNews, showToast])

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
    setEditMode(true)
    showToast('✓ Partenaire créé')
    return result
  }

  const newsCount = partner?.news?.filter(n => n.pinned).length || 0

  return (
    <div className="app">
      <Sidebar
        data={data}
        selPartner={selPartner}
        selOffer={selOffer}
        onSelectPartner={handleSelectPartner}
        onSelectOffer={handleSelectOffer}
        editMode={editMode}
        onToggleEdit={() => setEditMode(v => !v)}
        onAddPartner={handleAddPartner}
      />

      <main className="main">
        {/* Topbar */}
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
            onClick={resetData}
            style={{ fontSize: 10, padding: '4px 8px', border: '0.5px solid var(--border2)', borderRadius: 'var(--radius)', background: 'none', cursor: 'pointer', color: 'var(--text3)', fontFamily: 'inherit' }}
            title="Réinitialiser toutes les données"
          >↺ Reset</button>
        </div>

        {/* Edit banner */}
        {editMode && (
          <div className="edit-banner">
            ✏ Mode édition actif — cliquez sur n'importe quel champ souligné en pointillés pour le modifier
          </div>
        )}

        {/* Content */}
        <div className="content">
          {/* Tabs */}
          <div className="tabs">
            {TABS.map((t, i) => (
              <button key={i} className={`tab-btn${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
                {i === 7 ? `👤 ${t}` : i === 8 ? `📰 ${t}` : t}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {partner && offer && activeTab < 7 && (
            <>
              {activeTab === 0 && (
                <TabIdentity
                  partner={partner.partner}
                  editMode={editMode}
                  updatePartner={fn => handleUpdatePartner(selPartner, fn)}
                />
              )}
              {activeTab === 1 && (
                <TabPitch
                  offer={offer}
                  editMode={editMode}
                  updateOffer={fn => handleUpdateOffer(selPartner, selOffer, fn)}
                />
              )}
              {activeTab === 2 && (
                <TabValue
                  offer={offer}
                  editMode={editMode}
                  updateOffer={fn => handleUpdateOffer(selPartner, selOffer, fn)}
                />
              )}
              {activeTab === 3 && (
                <TabRefs
                  offer={offer}
                  editMode={editMode}
                  updateOffer={fn => handleUpdateOffer(selPartner, selOffer, fn)}
                />
              )}
              {activeTab === 4 && (
                <TabSWOT
                  offer={offer}
                  editMode={editMode}
                  updateOffer={fn => handleUpdateOffer(selPartner, selOffer, fn)}
                />
              )}
              {activeTab === 5 && (
                <TabBattlecard
                  offer={offer}
                  editMode={editMode}
                  updateOffer={fn => handleUpdateOffer(selPartner, selOffer, fn)}
                />
              )}
              {activeTab === 6 && (
                <TabQualification
                  offer={offer}
                  editMode={editMode}
                  updateOffer={fn => handleUpdateOffer(selPartner, selOffer, fn)}
                />
              )}
            </>
          )}

          {partner && activeTab === 7 && (
            <TabContacts
              pid={selPartner}
              contacts={partner.contacts || []}
              editMode={editMode}
              updateContacts={c => handleUpdateContacts(selPartner, c)}
              partnerColor={partner.partner.color}
            />
          )}

          {partner && activeTab === 8 && (
            <TabNews
              news={partner.news || []}
              editMode={editMode}
              updateNews={n => handleUpdateNews(selPartner, n)}
            />
          )}
        </div>
      </main>

      {toast && <Toast message={toast} />}
    </div>
  )
}
