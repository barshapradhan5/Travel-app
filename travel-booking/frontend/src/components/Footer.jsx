import { Compass, Mail, Phone, MapPin, Heart, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: '#090d16',
      borderTop: '1px solid #1e293b',
      color: '#94a3b8',
      paddingTop: '4rem',
      paddingBottom: '2rem',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1.5rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem',
        }}>
          {/* Brand Info */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Compass size={20} color="#ffffff" />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.3rem',
                color: '#f8fafc',
              }}>
                Wander<span style={{ color: '#818cf8' }}>lust</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#94a3b8', marginBottom: '1.5rem' }}>
              Discover unforgettable destinations, hand-picked hotels, local expert guides, and curated experiences worldwide.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {['Twitter', 'Instagram', 'Facebook', 'YouTube'].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#cbd5e1',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Home</Link></li>
              <li><Link to="/search" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Destinations & Hotels</Link></li>
              <li><Link to="/tickets" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Travel Tickets</Link></li>
              <li><Link to="/guides" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Hire Travel Guides</Link></li>
              <li><Link to="/map" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Interactive Map</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Get In Touch
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={18} color="#818cf8" />
                <span>742 Evergreen Terrace, San Francisco, CA</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={18} color="#818cf8" />
                <span>+1 (800) 555-WANDER</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={18} color="#818cf8" />
                <span>support@wanderlust-travel.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Newsletter
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Subscribe to receive exclusive travel deals, destination guides, and secret discounts.
            </p>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field"
                style={{ padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-md)' }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem',
        }}>
          <div>
            © {new Date().getFullYear()} Wanderlust Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#94a3b8' }}>
            <span>Made with</span>
            <Heart size={14} color="#ec4899" fill="#ec4899" />
            <span>for global travelers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
