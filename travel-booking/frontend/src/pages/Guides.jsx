import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { UserCheck, Star, Languages, MapPin, Calendar, Clock, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Guides() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [selectedGuide, setSelectedGuide] = useState(null)
  const [guideDate, setGuideDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('full-day')
  const [modalOpen, setModalOpen] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  const { data: guidesData, isLoading } = useQuery({
    queryKey: ['guides-list'],
    queryFn: async () => {
      const res = await api.get('/guides?per_page=20')
      return res.data
    },
  })

  const openBookingModal = (guide) => {
    if (!isAuthenticated) {
      toast('Please log in to hire a travel guide.', { icon: '🔒' })
      navigate('/login')
      return
    }
    setSelectedGuide(guide)
    setGuideDate(new Date().toISOString().split('T')[0])
    setTimeSlot('full-day')
    setModalOpen(true)
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!guideDate) {
      toast.error('Please select a date for your guide.')
      return
    }

    setBookingLoading(true)

    try {
      const payload = {
        guide_id: selectedGuide.id,
        date: guideDate,
        time_slot: timeSlot,
      }
      const res = await api.post('/bookings/guide', payload)
      toast.success('Travel guide requested successfully!')
      setModalOpen(false)
      navigate('/booking-confirmation', { state: { booking: res.data.booking } })
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to hire guide.'
      toast.error(typeof msg === 'string' ? msg : 'Booking error')
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <div className="section" style={{ minHeight: '85vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="section-title">Hire Local Expert Guides</h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Connect with licensed, multilingual local guides for customized itineraries and insider culture.
        </p>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="skeleton" style={{ height: '280px' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
          {guidesData?.guides?.map((guide) => (
            <motion.div key={guide.id} whileHover={{ y: -6 }} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <img
                  src={guide.avatar_url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200`}
                  alt={guide.name}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6366f1' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '0.2rem' }}>
                    {guide.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span>{guide.rating} ★</span>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.5rem' }}>
                <MapPin size={14} />
                <span>{guide.destination_name}</span>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <Languages size={14} color="#a855f7" />
                <span>{guide.languages?.join(', ')}</span>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {guide.bio}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>${guide.price_per_day}</span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}> / day</span>
                </div>
                <button
                  onClick={() => openBookingModal(guide)}
                  className="btn-primary"
                  style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
                >
                  Hire Guide
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {modalOpen && selectedGuide && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass"
            style={{
              width: '100%',
              maxWidth: '440px',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', color: '#f8fafc', marginBottom: '0.25rem' }}>
              Hire {selectedGuide.name}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#818cf8', marginBottom: '1.5rem' }}>
              {selectedGuide.destination_name} — ${selectedGuide.price_per_day} / day
            </p>

            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="input-label">Date of Service</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                  value={guideDate}
                  onChange={(e) => setGuideDate(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Time Slot</label>
                <select
                  className="input-field"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  <option value="full-day">Full Day (8 Hours)</option>
                  <option value="morning">Morning Slot (9 AM - 1 PM)</option>
                  <option value="afternoon">Afternoon Slot (2 PM - 6 PM)</option>
                </select>
              </div>

              <div style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Daily Fee:</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
                  ${selectedGuide.price_per_day}
                </span>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {bookingLoading ? 'Processing...' : 'Confirm Guide Request'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
