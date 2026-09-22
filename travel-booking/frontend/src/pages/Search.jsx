import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search as SearchIcon, MapPin, Star, Hotel as HotelIcon, Compass, SlidersHorizontal } from 'lucide-react'
import api from '../services/api'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('query') || ''
  const initialTab = searchParams.get('tab') || 'destinations'

  const [activeTab, setActiveTab] = useState(initialTab)
  const [queryText, setQueryText] = useState(initialQuery)
  const [priceMax, setPriceMax] = useState(600)
  const [page, setPage] = useState(1)

  const navigate = useNavigate()

  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'destinations')
    setQueryText(searchParams.get('query') || '')
  }, [searchParams])

  // Fetch Destinations
  const { data: destData, isLoading: destLoading } = useQuery({
    queryKey: ['search-destinations', queryText, page],
    queryFn: async () => {
      const res = await api.get(`/destinations?query=${encodeURIComponent(queryText)}&page=${page}&per_page=9`)
      return res.data
    },
    enabled: activeTab === 'destinations',
  })

  // Fetch Hotels
  const { data: hotelsData, isLoading: hotelsLoading } = useQuery({
    queryKey: ['search-hotels', priceMax, page],
    queryFn: async () => {
      const res = await api.get(`/hotels?price_max=${priceMax}&page=${page}&per_page=9`)
      return res.data
    },
    enabled: activeTab === 'hotels',
  })

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchParams({ query: queryText, tab: activeTab })
    setPage(1)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setPage(1)
    setSearchParams({ query: queryText, tab })
  }

  return (
    <div className="section" style={{ minHeight: '85vh' }}>
      {/* Search Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="section-title">Discover Experiences</h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Explore world-class destinations and luxury hotel accommodations.
        </p>
      </div>

      {/* Tabs & Search Bar */}
      <div className="glass" style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '2.5rem',
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid #334155',
          paddingBottom: '0.75rem',
        }}>
          <button
            onClick={() => handleTabChange('destinations')}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              color: activeTab === 'destinations' ? '#ffffff' : '#94a3b8',
              backgroundColor: activeTab === 'destinations' ? '#6366f1' : 'transparent',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}
          >
            <Compass size={18} />
            <span>Destinations</span>
          </button>
          <button
            onClick={() => handleTabChange('hotels')}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              color: activeTab === 'hotels' ? '#ffffff' : '#94a3b8',
              backgroundColor: activeTab === 'hotels' ? '#6366f1' : 'transparent',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}
          >
            <HotelIcon size={18} />
            <span>Hotels</span>
          </button>
        </div>

        {activeTab === 'destinations' ? (
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <SearchIcon size={18} color="#818cf8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="text"
                placeholder="Search by city, country, or keyword..."
                className="input-field"
                style={{ paddingLeft: '2.5rem' }}
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
              Search
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <SlidersHorizontal size={18} color="#818cf8" />
              <span style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 500 }}>
                Max Price: <strong style={{ color: '#818cf8' }}>${priceMax}/night</strong>
              </span>
              <input
                type="range"
                min="100"
                max="800"
                step="25"
                value={priceMax}
                onChange={(e) => { setPriceMax(Number(e.target.value)); setPage(1) }}
                style={{ flex: 1, accentColor: '#6366f1', cursor: 'pointer' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content Grid */}
      {activeTab === 'destinations' && (
        destLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="skeleton" style={{ height: '280px' }} />
            ))}
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
              {destData?.destinations?.map((dest) => (
                <motion.div
                  key={dest.id}
                  whileHover={{ y: -6 }}
                  className="card"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/search?query=${encodeURIComponent(dest.name)}&tab=hotels`)}
                >
                  <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                    <img src={dest.image_url} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'rgba(15, 23, 42, 0.8)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}>
                      <MapPin size={12} color="#818cf8" />
                      <span>{dest.country}</span>
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '0.4rem' }}>{dest.name}</h3>
                    <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>{dest.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {destData && destData.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                >
                  Previous
                </button>
                <span style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', padding: '0 0.5rem' }}>
                  Page {page} of {destData.pages}
                </span>
                <button
                  disabled={page === destData.pages}
                  onClick={() => setPage((p) => Math.min(destData.pages, p + 1))}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )
      )}

      {activeTab === 'hotels' && (
        hotelsLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="skeleton" style={{ height: '320px' }} />
            ))}
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
              {hotelsData?.hotels?.map((hotel) => (
                <motion.div
                  key={hotel.id}
                  whileHover={{ y: -6 }}
                  className="card"
                  onClick={() => navigate(`/hotels/${hotel.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ height: '180px', position: 'relative' }}>
                    <img
                      src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600`}
                      alt={hotel.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '0.75rem',
                      left: '0.75rem',
                      background: 'rgba(15, 23, 42, 0.8)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}>
                      <Star size={12} fill="#f59e0b" color="#f59e0b" />
                      <span>{hotel.rating}</span>
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {hotel.destination_name}
                    </div>
                    <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
                      {hotel.name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                      {hotel.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>${hotel.price_per_night}</span>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}> / night</span>
                      </div>
                      <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.82rem' }}>
                        View Rooms
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {hotelsData && hotelsData.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                >
                  Previous
                </button>
                <span style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', padding: '0 0.5rem' }}>
                  Page {page} of {hotelsData.pages}
                </span>
                <button
                  disabled={page === hotelsData.pages}
                  onClick={() => setPage((p) => Math.min(hotelsData.pages, p + 1))}
                  className="btn-secondary"
                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  )
}
