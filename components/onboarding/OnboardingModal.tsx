'use client'

interface Props {
  onClose: () => void
  onStartTour: () => void
}

export function OnboardingModal({ onClose, onStartTour }: Props) {
  const videoUrl = process.env.NEXT_PUBLIC_ONBOARDING_VIDEO_URL ?? ''

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#161b22',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        width: '100%',
        maxWidth: 680,
        overflow: 'hidden',
      }}>
        <div style={{ padding: '28px 32px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, background: 'var(--teal)',
              borderRadius: 8, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 18, flexShrink: 0,
            }}>📦</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 17 }}>Welcome to ITFlow</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                Multi-site IT inventory & transfer platform
              </div>
            </div>
          </div>
        </div>

        <div style={{
          margin: '0 32px',
          background: '#0d1117',
          borderRadius: 10,
          overflow: 'hidden',
          aspectRatio: '16/9',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>▶</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#e6edf3' }}>Intro video coming soon</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                Set NEXT_PUBLIC_ONBOARDING_VIDEO_URL in your env
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '20px 32px' }}>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 20 }}>
            You are currently in the <strong style={{ color: 'var(--amber)' }}>Demo Environment</strong> — 
            it is pre-loaded with sample data so you can explore freely. 
            When you are ready for real operations, switch to Production using the org switcher in the top bar.
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px', borderRadius: 6, fontSize: 13,
                background: 'transparent', color: 'var(--muted)',
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
              }}
            >
              Skip intro
            </button>
            <button
              onClick={onStartTour}
              style={{
                padding: '8px 20px', borderRadius: 6, fontSize: 13,
                fontWeight: 600, background: 'var(--teal)', color: '#0d1117',
                border: 'none', cursor: 'pointer',
              }}
            >
              Take the tour →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
