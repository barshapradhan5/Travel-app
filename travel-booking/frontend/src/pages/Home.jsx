import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, MapPin, Calendar, Star, Compass, Hotel as HotelIcon, Ticket as TicketIcon, UserCheck, Shield, Sparkles, ArrowRight } from 'lucide-react'
import api from '../services/api'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  // Fetch featured destinations
  const { data: destData, isLoading: destLoading } = useQuery({
    queryKey: ['home-destinations'],
    queryFn: async () => {
      const res = await api.get('/destinations?per_page=6')
      return res.data
    },
  })

  // Fetch featured hotels
  const { data: hotelsData, isLoading: hotelsLoading } = useQuery({
    queryKey: ['home-hotels'],
    queryFn: async () => {
      const res = await api.get('/hotels?per_page=4')
      return res.data
    },
  })

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/search')
    }
  }

  return (
    <div>
      {/* ── Hero Section ── */}
      <section style={{
        position: 'relative',
        minHeight: '82vh',
        background: 'radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.25) 0%, rgba(15, 23, 42, 0.95) 70%), url("https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600") center/cover no-repeat',
        backgroundBlendMode: 'overlay',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
      }}>
        <div style={{ maxWidth: '1000px', width: '100%', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(129, 140, 248, 0.3)',
              color: '#818cf8',
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}>
              <Sparkles size={16} />
              <span>Explore The World Without Limits</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}>
              Find Your Next Extraordinary <span className="gradient-text">Adventure</span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: '#cbd5e1',
              maxWidth: '680px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6,
            }}>
              Discover iconic destinations, book luxury hotels, reserve attraction tickets, and hire local expert guides all in one seamless platform.
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.form
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass"
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-xl)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              alignItems: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ position: 'relative' }}>
              <label className="input-label">Where to?</label>
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <MapPin size={18} color="#818cf8" style={{ position: 'absolute', left: '12px' }} />
                <input
                  type="text"
                  placeholder="Paris, Tokyo, Bali..."
                  className="input-field"
                  style={{ paddingLeft: '2.4rem' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="input-label">Travel Dates</label>
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <Calendar size={18} color="#818cf8" style={{ position: 'absolute', left: '12px' }} />
                <input
                  type="text"
                  placeholder="Select dates"
                  className="input-field"
                  style={{ paddingLeft: '2.4rem' }}
                  readOnly
                  onClick={() => navigate('/search')}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
              >
                <Search size={18} />
                <span>Search Places</span>
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* ── Stats Highlights ── */}
      <section style={{ background: '#0b1120', padding: '2.5rem 1.5rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center',
        }}>
          {[
            { label: 'Global Destinations', value: '10+' },
            { label: 'Verified Hotels', value: '25+' },
            { label: 'Attraction Tickets', value: '50+' },
            { label: 'Expert Guides', value: '30+' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc' }} className="gradient-text">
                {stat.value}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Destinations ── */}
      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">Hand-picked iconic locations favored by travelers around the globe.</p>
          </div>
          <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {destLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="skeleton" style={{ height: '280px' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {destData?.destinations?.map((dest) => (
              <motion.div
                key={dest.id}
                whileHover={{ y: -6 }}
                className="card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/search?query=${encodeURIComponent(dest.name)}`)}
              >
                <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={dest.image_url}
                    alt={dest.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(8px)',
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
                  <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '0.4rem' }}>
                    {dest.name}
                  </h3>
                  <p style={{
                    fontSize: '0.88rem',
                    color: '#94a3b8',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {dest.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── Featured Hotels ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <h2 className="section-title">Top Rated Hotels</h2>
            <p className="section-subtitle">Unwind in world-class comfort with premium amenities and breathtaking views.</p>
          </div>
          <Link to="/search?tab=hotels" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <span>Browse Hotels</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {hotelsLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="skeleton" style={{ height: '320px' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
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
                    backdropFilter: 'blur(8px)',
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
                  <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
                    {hotel.name}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>${hotel.price_per_night}</span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}> / night</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600 }}>Book &rarr;</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── Feature Highlights ── */}
      <section style={{ background: '#0f172a', padding: '5rem 1.5rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 className="section-title">Everything You Need For a Perfect Journey</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              We bring discovery, stay options, local logistics, and expert support together into one seamless trip planner.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { icon: HotelIcon, title: 'Luxury & Boutique Hotels', desc: 'Browse verified stays, check room availability, and lock in direct rates instantly.' },
              { icon: TicketIcon, title: 'Attraction & Transport Tickets', desc: 'Book fast-track museum passes, train tickets, and island ferries hassle-free.' },
              { icon: UserCheck, title: 'Verified Travel Guides', desc: 'Hire certified local guides speaking your language for bespoke city walking tours.' },
              { icon: Compass, title: 'Interactive Map Discovery', desc: 'Explore attractions and hotels geographically with our interactive Leaflet map.' },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="glass"
                style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'left' }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}>
                  <feature.icon size={24} color="#818cf8" />
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
