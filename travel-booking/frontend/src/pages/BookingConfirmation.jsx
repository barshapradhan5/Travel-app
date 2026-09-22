import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, BookmarkCheck, Compass, ArrowRight, ShieldCheck } from 'lucide-react'

export default function BookingConfirmation() {
  const location = useLocation()
  const booking = location.state?.booking

  return (
    <div className="section" style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '3rem 2.5rem',
          borderRadius: 'var(--radius-xl)',
          textAlign: 'center',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(34, 197, 94, 0.15)',
          border: '2px solid rgba(34, 197, 94, 0.4)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}>
          <CheckCircle2 size={40} color="#22c55e" />
        </div>

        <h1 style={{ fontSize: '2rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem' }}>
          Thank you for choosing Wanderlust. Your booking has been successfully recorded and confirmed.
        </p>

        {booking && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #334155',
            padding: '1.5rem',
            textAlign: 'left',
            marginBottom: '2rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Booking Reference:</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#818cf8' }}>#{booking.id}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Booking Type:</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', textTransform: 'capitalize' }}>
                {booking.booking_type} Booking
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Amount Paid:</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#22c55e' }}>${booking.total_price}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Status:</span>
              <span className="badge badge-success" style={{ textTransform: 'uppercase' }}>
                {booking.status}
              </span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/my-bookings" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            <BookmarkCheck size={18} />
            <span>View My Bookings</span>
          </Link>
          <Link to="/search" className="btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
            <Compass size={18} />
            <span>Explore More</span>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
