import React, { useState, useEffect } from 'react'
import InventoryTracker from './components/InventoryTracker.jsx'
import ListingGenerator from './components/ListingGenerator.jsx'
import Dashboard from './components/Dashboard.jsx'
import { LayoutGrid, Tag, BarChart3, Vault } from 'lucide-react'

const TABS = [
  { id: 'inventory', label: 'Inventory', icon: LayoutGrid },
  { id: 'listing', label: 'Listing Generator', icon: Tag },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
]

const STORAGE_KEY = 'mundial-vault-jerseys'

const SAMPLE_DATA = [
  {
    id: '1',
    team: 'Real Madrid',
    player: 'Bellingham',
    number: '5',
    size: 'L',
    type: 'Home',
    quality: 'A',
    costPrice: 28,
    salePrice: 65,
    platform: 'Depop',
    status: 'Listed',
    notes: '',
    dateAdded: '2024-01-15',
  },
  {
    id: '2',
    team: 'Manchester City',
    player: 'Haaland',
    number: '9',
    size: 'M',
    type: 'Home',
    quality: 'A',
    costPrice: 32,
    salePrice: 75,
    platform: 'eBay',
    status: 'Sold',
    notes: '',
    dateAdded: '2024-01-18',
  },
  {
    id: '3',
    team: 'Barcelona',
    player: 'Pedri',
    number: '8',
    size: 'S',
    type: 'Away',
    quality: 'B',
    costPrice: 20,
    salePrice: 45,
    platform: 'Mercari',
    status: 'In Stock',
    notes: 'Small mark on back',
    dateAdded: '2024-02-01',
  },
  {
    id: '4',
    team: 'Arsenal',
    player: 'Saka',
    number: '7',
    size: 'M',
    type: 'Home',
    quality: 'A',
    costPrice: 30,
    salePrice: 70,
    platform: 'Poshmark',
    status: 'Listed',
    notes: '',
    dateAdded: '2024-02-10',
  },
  {
    id: '5',
    team: 'Bayern Munich',
    player: 'Kane',
    number: '9',
    size: 'XL',
    type: 'Home',
    quality: 'A',
    costPrice: 35,
    salePrice: 80,
    platform: 'eBay',
    status: 'Sold',
    notes: '',
    dateAdded: '2024-02-20',
  },
  {
    id: '6',
    team: 'PSG',
    player: 'Mbappe',
    number: '7',
    size: 'L',
    type: 'Third',
    quality: 'B',
    costPrice: 25,
    salePrice: 55,
    platform: 'Depop',
    status: 'In Stock',
    notes: '',
    dateAdded: '2024-03-01',
  },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory')
  const [jerseys, setJerseys] = useState([])
  const [selectedJersey, setSelectedJersey] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setJerseys(JSON.parse(stored))
      } catch {
        setJerseys(SAMPLE_DATA)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA))
      }
    } else {
      setJerseys(SAMPLE_DATA)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA))
    }
  }, [])

  const saveJerseys = (updated) => {
    setJerseys(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const handleSelectForListing = (jersey) => {
    setSelectedJersey(jersey)
    setActiveTab('listing')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0f' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ backgroundColor: '#0a0a0f', borderColor: '#2a2a3d' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6c63ff, #9c8fff)' }}
              >
                <span className="text-white font-bold text-sm">MV</span>
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight" style={{ color: '#e2e8f0' }}>
                  Mundial
                </span>
                <span className="font-bold text-lg tracking-tight" style={{ color: '#6c63ff' }}>
                  {' '}Vault
                </span>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="flex items-center gap-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    color: activeTab === id ? '#6c63ff' : '#94a3b8',
                    backgroundColor: activeTab === id ? 'rgba(108, 99, 255, 0.12)' : 'transparent',
                  }}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </nav>

            {/* Stats pill */}
            <div
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: '#1a1a26', border: '1px solid #2a2a3d', color: '#94a3b8' }}
            >
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              {jerseys.length} jerseys
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'inventory' && (
          <InventoryTracker
            jerseys={jerseys}
            onSave={saveJerseys}
            onSelectForListing={handleSelectForListing}
          />
        )}
        {activeTab === 'listing' && (
          <ListingGenerator
            jerseys={jerseys}
            initialJersey={selectedJersey}
          />
        )}
        {activeTab === 'dashboard' && (
          <Dashboard jerseys={jerseys} />
        )}
      </main>
    </div>
  )
}
