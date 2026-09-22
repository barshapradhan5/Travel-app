import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Compass, MapPin, Hotel as HotelIcon, SlidersHorizontal } from 'lucide-react'
import api from '../services/api'

// Leaflet icon fix for React bundled apps
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function MapPage() {
  const [filterType, setFilterType] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['map-points'],
    queryFn: async () => {
      const res = await api.get('/map/points')
      return res.data.points
    },
  })

  const filteredPoints = data?.filter((p) => {
    if (filterType === 'all') return true
    return p.type === filterType
  }) || []

  return (
    <div style={{ height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Filter Bar */}
      <div style={{
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 500,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Compass size={20} color="#818cf8" />
          <h2 style={{ fontSize: '1.15rem', color: '#f8fafc', margin: 0 }}>
            Interactive Travel Map
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SlidersHorizontal size={16} color="#94a3b8" />
          {['all', 'destination', 'hotel'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              style={{
                padding: '0.35rem 0.9rem',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: filterType === t ? '#6366f1' : '#334155',
                background: filterType === t ? '#6366f1' : 'transparent',
                color: filterType === t ? '#ffffff' : '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {t === 'all' ? 'All Markers' : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div style={{ flex: 1, width: '100%', position: 'relative' }}>
        {isLoading ? (
          <div style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f172a',
            color: '#94a3b8',
          }}>
            Loading interactive map pins...
          </div>
        ) : (
          <MapContainer
            center={[20.0, 0.0]}
            zoom={3}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', background: '#0f172a' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredPoints.map((pt) => (
              <Marker key={`${pt.type}-${pt.id}`} position={[pt.lat, pt.lng]}>
                <Popup>
                  <div style={{ color: '#0f172a', minWidth: '180px' }}>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: pt.type === 'destination' ? '#6366f1' : '#059669',
                      textTransform: 'uppercase',
                      marginBottom: '0.2rem',
                    }}>
                      {pt.type}
                    </div>
                    <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '1rem', fontWeight: 700 }}>
                      {pt.name}
                    </h4>
                    <p style={{ fontSize: '0.82rem', margin: '0 0 0.6rem 0', color: '#475569' }}>
                      {pt.summary}
                    </p>
                    <Link
                      to={pt.link}
                      style={{
                        display: 'inline-block',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#4f46e5',
                        textDecoration: 'underline',
                      }}
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  )
}
