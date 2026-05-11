'use client'

interface Props {
  onClose: () => void
  onStartTour: () => void
}

function isLoom(url: string) {
  return url.includes('loom.com')
}

function getLoomEmbed(url: string) {
  // Convert share URL to embed URL if needed
  // https://www.loom.com/share/ID → https://www.loom.com/embed/ID
  return url.replace('loom.com/share/', 'loom.com/embed/')
}

export function OnboardingModal({ onClose, onStartTour }: Props) {
  const videoUrl = process.env.NEXT_PUBLIC_ONBOARDING_VIDEO_URL ?? ''
  const isLoomUrl = videoUrl && isLoom(videoUrl)
  const embedUrl  = isLoomUrl ? getLoomEmbed(videoUrl) : videoUrl

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#161b22',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        width: '100%',
        maxWidth: 720,
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 28px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, background: 'var(--teal)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📦</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 17 }}>Welcome to ITFlow</div>
              <div style={{ fontSize: 12, color: '#8b949e', marginTop: 2 }}>Multi-site IT inventory & transfer platform</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, width: 28, height: 28, color: '#8b949e', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Video */}
        <div style={{
          margin: '0 28px',
          background: '#0d1117',
          borderRadius: 10,
          overflow: 'hidden',
          aspectRatio: '16/9',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {videoUrl ? (
            isLoomUrl ? (
              <iframe
                src={embedUrl}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen"
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            ) : (
              <video
                src={videoUrl}
                controls
                autoPlay
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )
          ) : (
            <div style={{ textAlign: 'center', color: '#8b949e' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>▶</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#e6edf3' }}>Intro video coming soon</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Set NEXT_PUBLIC_ONBOARDING_VIDEO_URL to a Loom or video URL</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 28px' }}>
          <p style={{ fontSize: 13, color: '#8b949e', lineHeight: 1.6, marginBottom: 20 }}>
            You are in the <strong style={{ color: '#F5A623' }}>Demo Environment</strong> — pre-loaded with sample data across 8 locations so you can explore freely. Take the tour to see how each role works.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 6, fontSize: 13, background: 'transparent', color: '#8b949e', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
              Skip intro
            </button>
            <button onClick={onStartTour} style={{ padding: '8px 20px', borderRadius: 6, fontSize: 13, fontWeight: 600, background: 'var(--teal)', color: '#0d1117', border: 'none', cursor: 'pointer' }}>
              Take the tour →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
