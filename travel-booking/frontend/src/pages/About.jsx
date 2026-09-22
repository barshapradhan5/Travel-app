import { motion } from 'framer-motion'
import { Compass, Globe, Shield, Award, Users, Heart, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="section" style={{ minHeight: '85vh' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem' }}>
            About Wanderlust
          </span>
          <h1 className="section-title" style={{ fontSize: '2.8rem' }}>
            Redefining How The World <span className="gradient-text">Travels</span>
          </h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Wanderlust is an all-in-one travel technology platform connecting travelers with extraordinary stays, curated activities, and local guides worldwide.
          </p>
        </motion.div>
      </div>

      {/* Mission & Vision Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem',
      }}>
        <div className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
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
            <Globe size={24} color="#818cf8" />
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '0.75rem' }}>Our Mission</h3>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.95rem' }}>
            We empower travelers to discover authentic cultural experiences by eliminating friction in search, booking, and local transport logistics.
          </p>
        </div>

        <div className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(244, 114, 182, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
          }}>
            <Award size={24} color="#f472b6" />
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '0.75rem' }}>Our Standards</h3>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.95rem' }}>
            Every hotel, ticket vendor, and local guide on our platform undergoes rigorous verification to guarantee transparent pricing and safe journeys.
          </p>
        </div>
      </div>

      {/* Leadership & Values */}
      <div style={{ background: '#0f172a', padding: '3.5rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid #1e293b' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          Why Millions Choose Wanderlust
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          {[
            { title: 'Seamless Single-Platform Booking', desc: 'Book hotel stays, entrance tickets, and personal guides in one single checkout.' },
            { title: 'Transparent Pricing & No Hidden Fees', desc: 'What you see is what you pay — zero unexpected service fees at checkout.' },
            { title: 'Instant E-Tickets & Confirmation', desc: 'Receive instant digital receipts and QR codes for seamless check-ins everywhere.' },
          ].map((item, idx) => (
            <div key={idx} style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                {item.title}
              </div>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/search" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
            <span>Start Exploring Now</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
