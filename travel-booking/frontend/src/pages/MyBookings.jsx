import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BookmarkCheck, Hotel as HotelIcon, Ticket as TicketIcon, UserCheck, Calendar, DollarSign, ArrowRight } from 'lucide-react'
import api from '../services/api'

export default function MyBookings() {
  const [activeFilter, setActiveFilter] = useState('all')

  const { data: bookingsData, isLoading, isError } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/me')
      return res.data.bookings
    },
  })

  const filteredBookings = bookingsData?.filter((b) => {
    if (activeFilter === 'all') return true
    return b.booking_type === activeFilter
  }) || []

  return (
    <div className="section" style={{ minHeight: '85vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title">My Bookings</h1>
          <p className="section-subtitle">Manage all your confirmed hotels, attraction tickets, and guide itineraries.</p>
        </div>
        <Link to="/search" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.88rem' }}>
          <span>Explore More</span>
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['all', 'hotel', 'ticket', 'guide'].map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            style={{
              padding: '0.4rem 1.1rem',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: activeFilter === type ? '#6366f1' : '#334155',
              background: activeFilter === type ? '#6366f1' : 'transparent',
              color: activeFilter === type ? '#ffffff' : '#94a3b8',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s',
            }}
          >
            {type === 'all' ? 'All Bookings' : `${type}s`}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton" style={{ height: '120px' }} />
          ))}
        </div>
      ) : isError || filteredBookings.length === 0 ? (
        <div className="glass" style={{ textAlign: 'center', padding: '4rem 1.5rem', borderRadius: 'var(--radius-xl)' }}>
          <BookmarkCheck size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#f8fafc', marginBottom: '0.5rem' }}>No Bookings Found</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {activeFilter === 'all'
              ? "You haven't made any bookings yet. Start planning your trip today!"
              : `You don't have any ${activeFilter} bookings.`}
          </p>
          <Link to="/search" className="btn-primary">
            Browse Destinations
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredBookings.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass"
              style={{
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: b.booking_type === 'hotel'
                    ? 'rgba(99, 102, 241, 0.15)'
                    : b.booking_type === 'ticket'
                    ? 'rgba(244, 114, 182, 0.15)'
                    : 'rgba(34, 197, 94, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {b.booking_type === 'hotel' && <HotelIcon size={26} color="#818cf8" />}
                  {b.booking_type === 'ticket' && <TicketIcon size={26} color="#f472b6" />}
                  {b.booking_type === 'guide' && <UserCheck size={26} color="#22c55e" />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                    <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>
                      {b.status}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Ref #{b.id}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '0.3rem' }}>
                    {b.booking_type === 'hotel' && (b.hotel_booking?.hotel_name || 'Hotel Stay')}
                    {b.booking_type === 'ticket' && (b.ticket_booking?.ticket_title || 'Attraction Ticket')}
                    {b.booking_type === 'guide' && `Travel Guide: ${b.guide_booking?.guide_name || 'Guide'}`}
                  </h3>

                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {b.booking_type === 'hotel' && b.hotel_booking && (
                      <span>
                        Dates: {b.hotel_booking.check_in} to {b.hotel_booking.check_out} ({b.hotel_booking.guests} guests)
                      </span>
                    )}
                    {b.booking_type === 'ticket' && b.ticket_booking && (
                      <span>
                        Travel Date: {b.ticket_booking.travel_date} ({b.ticket_booking.quantity} ticket{b.ticket_booking.quantity > 1 ? 's' : ''})
                      </span>
                    )}
                    {b.booking_type === 'guide' && b.guide_booking && (
                      <span>
                        Date: {b.guide_booking.date} ({b.guide_booking.time_slot})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                  ${b.total_price}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Booked on {new Date(b.created_at).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
