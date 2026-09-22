import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !message) {
      toast.error('Please fill out all contact form fields.')
      return
    }

    setLoading(true)

    try {
      await api.post('/contact', { name, email, message })
      toast.success('Your message has been sent!')
      setSubmitted(true)
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to send message.'
      toast.error(typeof msg === 'string' ? msg : 'Submission error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section" style={{ minHeight: '85vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>
          Contact & Support
        </span>
        <h1 className="section-title">We'd Love To Hear From You</h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Have a question about a booking, partnership, or feedback? Send us a message and our support team will respond within 24 hours.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
      }}>
        {/* Contact Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <MapPin size={22} color="#818cf8" />
              </div>
              <div>
                <h4 style={{ color: '#f8fafc', fontSize: '1.05rem', marginBottom: '0.2rem' }}>Global Headquarters</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>742 Evergreen Terrace, San Francisco, CA 94107</p>
              </div>
            </div>
          </div>

          <div className="glass" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(34, 197, 94, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Phone size={22} color="#22c55e" />
              </div>
              <div>
                <h4 style={{ color: '#f8fafc', fontSize: '1.05rem', marginBottom: '0.2rem' }}>Customer Hotline</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>+1 (800) 555-WANDER (24/7 Support)</p>
              </div>
            </div>
          </div>

          <div className="glass" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(244, 114, 182, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Mail size={22} color="#f472b6" />
              </div>
              <div>
                <h4 style={{ color: '#f8fafc', fontSize: '1.05rem', marginBottom: '0.2rem' }}>Email Inquiries</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>support@wanderlust-travel.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle size={48} color="#22c55e" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '0.5rem' }}>Message Received!</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Thank you for contacting Wanderlust. One of our team members will get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-secondary"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="input-label">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="input-label">Your Message</label>
                <textarea
                  rows="5"
                  required
                  placeholder="Tell us how we can help..."
                  className="input-field"
                  style={{ resize: 'vertical' }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                <Send size={18} />
                <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
