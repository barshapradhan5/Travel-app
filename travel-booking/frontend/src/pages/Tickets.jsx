import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Ticket as TicketIcon, Calendar, Users, MapPin, CheckCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Tickets() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [selectedTicket, setSelectedTicket] = useState(null)
  const [travelDate, setTravelDate] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)

  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ['tickets-list'],
    queryFn: async () => {
      const res = await api.get('/tickets?per_page=20')
      return res.data
    },
  })

  const openBookingModal = (ticket) => {
    if (!isAuthenticated) {
      toast('Please log in to purchase tickets.', { icon: '🔒' })
      navigate('/login')
      return
    }
    setSelectedTicket(ticket)
    setTravelDate(new Date().toISOString().split('T')[0])
    setQuantity(1)
    setModalOpen(true)
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    if (!travelDate) {
      toast.error('Please select a travel date.')
      return
    }

    setBookingLoading(true)

    try {
      const payload = {
        ticket_id: selectedTicket.id,
        quantity: Number(quantity),
        travel_date: travelDate,
      }
      const res = await api.post('/bookings/ticket', payload)
      toast.success('Tickets booked successfully!')
      setModalOpen(false)
      navigate('/booking-confirmation', { state: { booking: res.data.booking } })
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to book ticket.'
      toast.error(typeof msg === 'string' ? msg : 'Booking error')
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <div className="section" style={{ minHeight: '85vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="section-title">Attraction & Travel Tickets</h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Skip the line with direct entry passes, museum tickets, and scenic transit passes worldwide.
        </p>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="skeleton" style={{ height: '260px' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
          {ticketsData?.tickets?.map((ticket) => (
            <motion.div key={ticket.id} whileHover={{ y: -6 }} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span className="badge badge-primary" style={{ textTransform: 'uppercase' }}>
                  {ticket.ticket_type}
                </span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
                  ${ticket.price}
                </span>
              </div>

              <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginBottom: '0.4rem' }}>
                {ticket.title}
              </h3>

              <div style={{ fontSize: '0.85rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
                <MapPin size={14} />
                <span>{ticket.destination_name}</span>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {ticket.description}
              </p>

              <button
                disabled={ticket.available_count <= 0}
                onClick={() => openBookingModal(ticket)}
                className="btn-primary"
                style={{ width: '100%', padding: '0.65rem', fontSize: '0.88rem' }}
              >
                {ticket.available_count > 0 ? 'Book Ticket' : 'Sold Out'}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {modalOpen && selectedTicket && (
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
              Book Ticket
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#818cf8', marginBottom: '1.5rem' }}>
              {selectedTicket.title} (${selectedTicket.price}/ea)
            </p>

            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="input-label">Date of Travel / Visit</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={Math.min(20, selectedTicket.available_count)}
                  className="input-field"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
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
                <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Total Amount:</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc' }}>
                  ${selectedTicket.price * quantity}
                </span>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {bookingLoading ? 'Processing...' : 'Confirm Ticket Booking'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
