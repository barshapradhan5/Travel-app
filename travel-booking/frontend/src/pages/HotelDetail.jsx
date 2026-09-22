import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Star, MapPin, Wifi, Coffee, Tv, Shield, Calendar, Users, CheckCircle, AlertCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function HotelDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [selectedRoom, setSelectedRoom] = useState(null)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const { data: hotelData, isLoading, isError } = useQuery({
    queryKey: ['hotel', id],
    queryFn: async () => {
      const res = await api.get(`/hotels/${id}`)
      return res.data.hotel
    },
  })

  const openBookingModal = (room) => {
    if (!isAuthenticated) {
      toast('Please log in to complete your booking.', { icon: '🔒' })
      navigate('/login')
      return
    }
    setSelectedRoom(room)
    setModalOpen(true)
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!checkIn || !checkOut) {
      toast.error('Please select both Check-In and Check-Out dates.')
      return
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error('Check-out date must be after Check-in date.')
      return
    }

    setBookingLoading(true)

    try {
      const payload = {
        hotel_id: Number(id),
        room_id: selectedRoom.id,
        check_in: checkIn,
        check_out: checkOut,
        guests: Number(guests),
      }
      const res = await api.post('/bookings/hotel', payload)
      toast.success('Hotel room booked successfully!')
      setModalOpen(false)
      navigate('/booking-confirmation', { state: { booking: res.data.booking } })
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to complete booking.'
      toast.error(typeof msg === 'string' ? msg : 'Validation error')
    } finally {
      setBookingLoading(false)
    }
  }

  // Calculate total nights and price
  const calculateTotal = () => {
    if (!checkIn || !checkOut || !selectedRoom) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
    return nights * selectedRoom.price
  }

  if (isLoading) {
    return (
      <div className="section">
        <div className="skeleton" style={{ height: '350px', marginBottom: '2rem' }} />
        <div className="skeleton" style={{ height: '150px', marginBottom: '1.5rem' }} />
        <div className="skeleton" style={{ height: '200px' }} />
      </div>
    )
  }

  if (isError || !hotelData) {
    return (
      <div className="section" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
        <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
        <h2>Hotel Not Found</h2>
        <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>The requested hotel details could not be loaded.</p>
      </div>
    )
  }

  return (
    <div className="section">
      {/* Hotel Hero Gallery */}
      <div style={{
        position: 'relative',
        height: '380px',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        marginBottom: '2rem',
      }}>
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"
          alt={hotelData.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 60%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span className="badge badge-primary">{hotelData.destination_name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontSize: '0.9rem', fontWeight: 700 }}>
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <span>{hotelData.rating}</span>
            </div>
          </div>
          <h1 style={{ fontSize: '2.4rem', color: '#ffffff', marginBottom: '0.4rem' }}>{hotelData.name}</h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={16} color="#818cf8" />
            <span>Located in {hotelData.destination_name}</span>
          </p>
        </div>
      </div>

      {/* Hotel Description & Amenities */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem',
      }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#f8fafc', marginBottom: '1rem' }}>About the Hotel</h3>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.95rem' }}>
            {hotelData.description}
          </p>
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#f8fafc', marginBottom: '1rem' }}>Featured Amenities</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {hotelData.amenities?.map((item, idx) => (
              <div key={idx} style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                fontSize: '0.85rem',
                fontWeight: 500,
                textTransform: 'capitalize',
              }}>
                ✓ {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Available Rooms Section */}
      <div>
        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Available Rooms & Rates</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {hotelData.rooms?.map((room) => (
            <motion.div key={room.id} whileHover={{ y: -4 }} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', color: '#f8fafc', textTransform: 'capitalize' }}>
                    {room.room_type} Room
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Capacity: Up to {room.capacity} Guests</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>${room.price}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>per night</div>
                </div>
              </div>

              <div style={{
                fontSize: '0.82rem',
                color: room.available_count > 0 ? '#22c55e' : '#ef4444',
                fontWeight: 600,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}>
                <CheckCircle size={14} />
                <span>{room.available_count > 0 ? `${room.available_count} Rooms Available` : 'Sold Out'}</span>
              </div>

              <button
                disabled={room.available_count <= 0}
                onClick={() => openBookingModal(room)}
                className="btn-primary"
                style={{ width: '100%', padding: '0.65rem' }}
              >
                {room.available_count > 0 ? 'Book Room' : 'Unavailable'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {modalOpen && selectedRoom && (
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
              maxWidth: '480px',
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

            <h3 style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '0.25rem' }}>
              Confirm Room Booking
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#818cf8', marginBottom: '1.5rem' }}>
              {hotelData.name} — {selectedRoom.room_type.toUpperCase()} Room
            </p>

            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="input-label">Check-In Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Check-Out Date</label>
                <input
                  type="date"
                  required
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="input-field"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Number of Guests</label>
                <select
                  className="input-field"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  {[...Array(selectedRoom.capacity)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} Guest{i > 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {checkIn && checkOut && new Date(checkOut) > new Date(checkIn) && (
                <div style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Total Calculated:</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
                    ${calculateTotal()}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
              >
                {bookingLoading ? 'Processing...' : 'Confirm & Book Now'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
