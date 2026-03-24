import { useState, useRef, useEffect, useCallback } from 'react'

// 80+ curated Pexels food/fine-dining photos (CDN URLs — no API key required)
const pexels = (id) => ({
  url: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
  thumb: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&h=350&w=940`,
})

const COURSES = [
  'Amuse Bouche',
  'Cold Starter',
  'Warm Starter',
  'Seafood',
  'Pasta',
  'Risotto',
  'Fish Main',
  'Meat Main',
  'Vegetable',
  'Cheese',
  'Pre-Dessert',
  'Dessert',
  'Petit Four',
]

const RAW_PHOTOS = [
  { id: 1640777, photographer: 'Pixabay', avg_color: '#8b7355' },
  { id: 1640774, photographer: 'Pixabay', avg_color: '#6b5a3e' },
  { id: 1279330, photographer: 'Engin Akyurt', avg_color: '#4a3728' },
  { id: 2641886, photographer: 'Terje Sollie', avg_color: '#c8b89a' },
  { id: 2641887, photographer: 'Terje Sollie', avg_color: '#d4c4a8' },
  { id: 825661,  photographer: 'Lisa Fotios', avg_color: '#7a5c44' },
  { id: 1633578, photographer: 'Ella Olsson', avg_color: '#9e8060' },
  { id: 2664216, photographer: 'Malidate Van', avg_color: '#5c4a36' },
  { id: 3535383, photographer: 'Abhinav Goswami', avg_color: '#3d2d1e' },
  { id: 1199960, photographer: 'Pixabay', avg_color: '#c6a882' },
  { id: 1126359, photographer: 'Pixabay', avg_color: '#d4a574' },
  { id: 2271107, photographer: 'Fabian Wiktor', avg_color: '#6e8c7a' },
  { id: 1268549, photographer: 'Pixabay', avg_color: '#8c6040' },
  { id: 1437267, photographer: 'Foodie Factor', avg_color: '#c4a46a' },
  { id: 1410235, photographer: 'Naim Benjelloun', avg_color: '#f0e0c0' },
  { id: 2147449, photographer: 'Pixabay', avg_color: '#b08060' },
  { id: 3026808, photographer: 'Krisztina Papp', avg_color: '#a0c4b0' },
  { id: 2673353, photographer: 'Valeria Boltneva', avg_color: '#d4b896' },
  { id: 1581384, photographer: 'Sebastian Coman Travel', avg_color: '#8c6e50' },
  { id: 2097090, photographer: 'Ash', avg_color: '#e8d8b8' },
  { id: 1860208, photographer: 'Malidate Van', avg_color: '#6e5840' },
  { id: 4397280, photographer: 'Karolina Grabowska', avg_color: '#c4a06a' },
  { id: 6210933, photographer: 'Shameel mukkath', avg_color: '#a08060' },
  { id: 5908767, photographer: 'Ahmed Aqtai', avg_color: '#d0c0a0' },
  { id: 4518608, photographer: 'Dana Tentis', avg_color: '#7c6040' },
  { id: 5949903, photographer: 'Gonzalo Guzman', avg_color: '#c8b090' },
  { id: 3763453, photographer: 'Pixabay', avg_color: '#5a4030' },
  { id: 2983101, photographer: 'Pixabay', avg_color: '#c0a870' },
  { id: 3338942, photographer: 'Pixabay', avg_color: '#8a7050' },
  { id: 1640780, photographer: 'Pixabay', avg_color: '#9a8060' },
  { id: 1640769, photographer: 'Pixabay', avg_color: '#b09070' },
  { id: 1640768, photographer: 'Pixabay', avg_color: '#a08060' },
  { id: 2546952, photographer: 'Ruslan Khmelevsky', avg_color: '#c8b890' },
  { id: 2092906, photographer: 'Horizon Content', avg_color: '#6e5840' },
  { id: 262978,  photographer: 'Pixabay', avg_color: '#d4c4a0' },
  { id: 461382,  photographer: 'Pixabay', avg_color: '#f0e0b0' },
  { id: 1640782, photographer: 'Pixabay', avg_color: '#8c7050' },
  { id: 3763441, photographer: 'Pixabay', avg_color: '#a08870' },
  { id: 3535388, photographer: 'Abhinav Goswami', avg_color: '#4a3020' },
  { id: 5949874, photographer: 'Gonzalo Guzman', avg_color: '#c8a868' },
  { id: 4397271, photographer: 'Karolina Grabowska', avg_color: '#d0b890' },
  { id: 6210941, photographer: 'Shameel mukkath', avg_color: '#b09870' },
  { id: 2664228, photographer: 'Malidate Van', avg_color: '#4a3828' },
  { id: 1279340, photographer: 'Engin Akyurt', avg_color: '#6a5040' },
  { id: 1279342, photographer: 'Engin Akyurt', avg_color: '#7a6040' },
  { id: 3026818, photographer: 'Krisztina Papp', avg_color: '#90b8a0' },
  { id: 2983105, photographer: 'Pixabay', avg_color: '#c8b880' },
  { id: 4397265, photographer: 'Karolina Grabowska', avg_color: '#d8c8a0' },
  { id: 2092916, photographer: 'Horizon Content', avg_color: '#7a6040' },
  { id: 5949862, photographer: 'Gonzalo Guzman', avg_color: '#b8a060' },
  { id: 2546962, photographer: 'Ruslan Khmelevsky', avg_color: '#d0c098' },
  { id: 7363102, photographer: 'Cottonbro', avg_color: '#c0a878' },
  { id: 7363115, photographer: 'Cottonbro', avg_color: '#a89060' },
  { id: 7363128, photographer: 'Cottonbro', avg_color: '#c8b080' },
  { id: 6210950, photographer: 'Shameel mukkath', avg_color: '#a89060' },
  { id: 3535392, photographer: 'Abhinav Goswami', avg_color: '#5a3820' },
  { id: 4397290, photographer: 'Karolina Grabowska', avg_color: '#c8a870' },
  { id: 1581390, photographer: 'Sebastian Coman Travel', avg_color: '#9a7050' },
  { id: 2097080, photographer: 'Ash', avg_color: '#e0d0b0' },
  { id: 3763460, photographer: 'Pixabay', avg_color: '#8a7060' },
  { id: 2092920, photographer: 'Horizon Content', avg_color: '#8a6840' },
  { id: 1268552, photographer: 'Pixabay', avg_color: '#a08860' },
  { id: 825670,  photographer: 'Lisa Fotios', avg_color: '#9a7850' },
  { id: 1633584, photographer: 'Ella Olsson', avg_color: '#c0a880' },
  { id: 2147460, photographer: 'Pixabay', avg_color: '#c0a878' },
  { id: 1860218, photographer: 'Malidate Van', avg_color: '#7a5840' },
  { id: 5908778, photographer: 'Ahmed Aqtai', avg_color: '#c8b898' },
  { id: 4518618, photographer: 'Dana Tentis', avg_color: '#9a7850' },
  { id: 2271116, photographer: 'Fabian Wiktor', avg_color: '#70988a' },
  { id: 3338948, photographer: 'Pixabay', avg_color: '#9a8060' },
  { id: 6210960, photographer: 'Shameel mukkath', avg_color: '#b09870' },
  { id: 1199968, photographer: 'Pixabay', avg_color: '#c8a880' },
  { id: 1126368, photographer: 'Pixabay', avg_color: '#d8a870' },
  { id: 1437278, photographer: 'Foodie Factor', avg_color: '#c8b070' },
  { id: 2664230, photographer: 'Malidate Van', avg_color: '#5a4030' },
  { id: 3535396, photographer: 'Abhinav Goswami', avg_color: '#4a3020' },
  { id: 7363140, photographer: 'Cottonbro', avg_color: '#b8a070' },
  { id: 5949850, photographer: 'Gonzalo Guzman', avg_color: '#c0a860' },
  { id: 2673360, photographer: 'Valeria Boltneva', avg_color: '#d0b890' },
  { id: 2546970, photographer: 'Ruslan Khmelevsky', avg_color: '#c8b890' },
  { id: 1410240, photographer: 'Naim Benjelloun', avg_color: '#e8d8b0' },
]

const PHOTOS = RAW_PHOTOS.map((p, i) => ({
  ...p,
  ...pexels(p.id),
  category: COURSES[i % COURSES.length],
}))

// ─── gesture config ────────────────────────────────────────────────────────────
const SWIPE_THRESHOLD = 80
const ROTATION_FACTOR = 0.12

export default function PlatingSwiperApp() {
  const [index, setIndex] = useState(0)
  const [saved, setSaved] = useState([])   // array of photo objects
  const [history, setHistory] = useState([]) // for undo
  const [tab, setTab] = useState('swipe')   // 'swipe' | 'moodboard'
  const [flyAnim, setFlyAnim] = useState(null) // null | 'left' | 'right'
  const done = index >= PHOTOS.length

  // ─── drag state ──────────────────────────────────────────────────────────────
  const dragging = useRef(false)
  const startX = useRef(0)
  const startY = useRef(0)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const cardRef = useRef(null)

  const swipe = useCallback((direction) => {
    setFlyAnim(direction)
    setTimeout(() => {
      const current = PHOTOS[index]
      setHistory(h => [...h, { index, saved: [...saved] }])
      if (direction === 'right') setSaved(s => [...s, current])
      setIndex(i => i + 1)
      setOffset({ x: 0, y: 0 })
      setFlyAnim(null)
    }, 350)
  }, [index, saved])

  const undo = useCallback(() => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setSaved(prev.saved)
    setIndex(prev.index)
    setOffset({ x: 0, y: 0 })
    setFlyAnim(null)
  }, [history])

  // Pointer events
  const onPointerDown = (e) => {
    if (flyAnim) return
    dragging.current = true
    startX.current = e.clientX
    startY.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragging.current) return
    setOffset({
      x: e.clientX - startX.current,
      y: e.clientY - startY.current,
    })
  }
  const onPointerUp = () => {
    if (!dragging.current) return
    dragging.current = false
    if (offset.x > SWIPE_THRESHOLD) swipe('right')
    else if (offset.x < -SWIPE_THRESHOLD) swipe('left')
    else setOffset({ x: 0, y: 0 })
  }

  const direction = flyAnim || (offset.x > 20 ? 'right' : offset.x < -20 ? 'left' : null)
  const progress = Math.min(index, PHOTOS.length)

  const removeFromMoodboard = (id) => setSaved(s => s.filter(p => p.id !== id))

  return (
    <div style={styles.root}>
      {/* ── Google Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0c0b09; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #1a1810; }
        ::-webkit-scrollbar-thumb { background: #c8aa64; border-radius: 2px; }
      `}</style>

      {/* ── Header ── */}
      <header style={styles.header}>
        <p style={styles.headerSub}>LOCANDA SAN VIGILIO</p>
        <h1 style={styles.headerTitle}>Plating Studio</h1>
      </header>

      {/* ── Tabs ── */}
      <nav style={styles.tabs}>
        <button style={{ ...styles.tab, ...(tab === 'swipe' ? styles.tabActive : {}) }} onClick={() => setTab('swipe')}>
          Inspire
        </button>
        <button style={{ ...styles.tab, ...(tab === 'moodboard' ? styles.tabActive : {}) }} onClick={() => setTab('moodboard')}>
          Moodboard {saved.length > 0 && <span style={styles.badge}>{saved.length}</span>}
        </button>
      </nav>

      {/* ── Swipe View ── */}
      {tab === 'swipe' && (
        <div style={styles.swipeView}>
          {/* Progress */}
          <div style={styles.progressWrap}>
            <div style={{ ...styles.progressBar, width: `${(progress / PHOTOS.length) * 100}%` }} />
          </div>
          <p style={styles.progressLabel}>{progress} / {PHOTOS.length}</p>

          {done ? (
            <div style={styles.doneScreen}>
              <div style={styles.doneIcon}>✦</div>
              <h2 style={styles.doneTitle}>Curation Complete</h2>
              <p style={styles.doneCount}>{saved.length} plates saved</p>
              <button style={styles.doneBtn} onClick={() => { setIndex(0); setSaved([]); setHistory([]); }}>
                Start Over
              </button>
              {saved.length > 0 && (
                <button style={{ ...styles.doneBtn, marginTop: 10, background: 'transparent', border: '1px solid #c8aa64', color: '#c8aa64' }}
                  onClick={() => setTab('moodboard')}>
                  View Moodboard
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Card Stack */}
              <div style={styles.cardStack}>
                {[2, 1, 0].map((offset3) => {
                  const cardIndex = index + offset3
                  if (cardIndex >= PHOTOS.length) return null
                  const photo = PHOTOS[cardIndex]
                  const isTop = offset3 === 0
                  const scale = 1 - offset3 * 0.04
                  const translateY = offset3 * 12

                  let transform = `scale(${scale}) translateY(${translateY}px)`
                  let cardStyle = { ...styles.card, transform, zIndex: 10 - offset3 }

                  if (isTop) {
                    const rot = offset.x * ROTATION_FACTOR
                    const tx = flyAnim === 'right' ? 600 : flyAnim === 'left' ? -600 : offset.x
                    const ty = flyAnim ? offset.y - 100 : offset.y
                    const opacity = flyAnim ? 0 : 1
                    cardStyle = {
                      ...styles.card,
                      zIndex: 20,
                      transform: `translate(${tx}px, ${ty}px) rotate(${flyAnim ? (flyAnim === 'right' ? 20 : -20) : rot}deg)`,
                      transition: flyAnim ? 'transform 0.35s ease, opacity 0.35s ease' : dragging.current ? 'none' : 'transform 0.3s ease',
                      opacity: flyAnim ? 0 : 1,
                      cursor: 'grab',
                      touchAction: 'none',
                    }
                  }

                  return (
                    <div
                      key={photo.id}
                      ref={isTop ? cardRef : null}
                      style={cardStyle}
                      onPointerDown={isTop ? onPointerDown : undefined}
                      onPointerMove={isTop ? onPointerMove : undefined}
                      onPointerUp={isTop ? onPointerUp : undefined}
                      onPointerCancel={isTop ? onPointerUp : undefined}
                    >
                      <img
                        src={photo.url}
                        alt={photo.category}
                        style={styles.cardImg}
                        draggable={false}
                        onError={(e) => { e.target.src = photo.thumb }}
                      />
                      {/* gradient overlay */}
                      <div style={styles.cardGradient} />
                      {/* labels */}
                      <div style={styles.cardLabels}>
                        <span style={styles.cardCategory}>{photo.category}</span>
                        <span style={styles.cardPhotographer}>{photo.photographer}</span>
                      </div>

                      {/* SAVE / SKIP badges */}
                      {isTop && direction === 'right' && (
                        <div style={{ ...styles.badge2, ...styles.saveBadge }}>SAVE</div>
                      )}
                      {isTop && direction === 'left' && (
                        <div style={{ ...styles.badge2, ...styles.skipBadge }}>SKIP</div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Buttons */}
              <div style={styles.controls}>
                <button style={{ ...styles.btn, ...styles.btnSkip }} onClick={() => swipe('left')} title="Skip">✕</button>
                <button style={{ ...styles.btn, ...styles.btnUndo }} onClick={undo} title="Undo" disabled={history.length === 0}>↩</button>
                <button style={{ ...styles.btn, ...styles.btnSave }} onClick={() => swipe('right')} title="Save">♥</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Moodboard View ── */}
      {tab === 'moodboard' && (
        <div style={styles.moodboard}>
          {saved.length === 0 ? (
            <div style={styles.emptyMoodboard}>
              <p style={styles.emptyIcon}>◇</p>
              <p style={styles.emptyText}>No plates saved yet</p>
              <button style={styles.doneBtn} onClick={() => setTab('swipe')}>Start Swiping</button>
            </div>
          ) : (
            <>
              <p style={styles.moodboardCount}>{saved.length} plates curated</p>
              <div style={styles.moodboardGrid}>
                {saved.map((photo) => (
                  <div key={photo.id} style={styles.moodCell}>
                    <img src={photo.thumb} alt={photo.category} style={styles.moodImg} />
                    <div style={styles.moodOverlay}>
                      <span style={styles.moodCategory}>{photo.category}</span>
                      <button style={styles.removeBtn} onClick={() => removeFromMoodboard(photo.id)}>×</button>
                    </div>
                    <p style={styles.moodCredit}>{photo.photographer}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = {
  root: {
    background: '#0c0b09',
    minHeight: '100vh',
    maxWidth: 440,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    color: '#f0e6d0',
    fontFamily: "'Montserrat', sans-serif",
    position: 'relative',
    overflowX: 'hidden',
  },
  header: {
    padding: '28px 24px 12px',
    textAlign: 'center',
    borderBottom: '1px solid #2a2620',
  },
  headerSub: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 10,
    letterSpacing: '0.35em',
    color: '#c8aa64',
    fontWeight: 500,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  headerTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 34,
    fontWeight: 300,
    letterSpacing: '0.05em',
    color: '#f0e6d0',
    lineHeight: 1.1,
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #2a2620',
  },
  tab: {
    flex: 1,
    padding: '12px 0',
    background: 'none',
    border: 'none',
    color: '#7a6e5a',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 11,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'color 0.2s',
  },
  tabActive: {
    color: '#c8aa64',
    borderBottom: '2px solid #c8aa64',
  },
  badge: {
    background: '#c8aa64',
    color: '#0c0b09',
    borderRadius: 10,
    fontSize: 9,
    fontWeight: 600,
    padding: '1px 5px',
    lineHeight: 1.4,
  },
  // ── Swipe ──
  swipeView: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 16px 24px',
  },
  progressWrap: {
    width: '100%',
    height: 2,
    background: '#2a2620',
    borderRadius: 1,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    background: '#c8aa64',
    borderRadius: 1,
    transition: 'width 0.3s ease',
  },
  progressLabel: {
    fontSize: 10,
    letterSpacing: '0.12em',
    color: '#6a6050',
    marginBottom: 20,
    fontWeight: 500,
  },
  cardStack: {
    position: 'relative',
    width: '100%',
    height: 480,
    marginBottom: 28,
  },
  card: {
    position: 'absolute',
    inset: 0,
    borderRadius: 20,
    overflow: 'hidden',
    border: '1px solid #c8aa64',
    boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
    userSelect: 'none',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    pointerEvents: 'none',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
    background: 'linear-gradient(to top, rgba(12,11,9,0.92) 0%, transparent 100%)',
  },
  cardLabels: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  cardCategory: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 22,
    fontWeight: 400,
    color: '#f0e6d0',
    letterSpacing: '0.04em',
  },
  cardPhotographer: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 9,
    letterSpacing: '0.15em',
    color: '#c8aa64',
    textTransform: 'uppercase',
    fontWeight: 500,
  },
  badge2: {
    position: 'absolute',
    top: 24,
    padding: '6px 16px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.12em',
    fontFamily: "'Montserrat', sans-serif",
    border: '2px solid',
    transform: 'rotate(-12deg)',
  },
  saveBadge: {
    right: 20,
    color: '#4ade80',
    borderColor: '#4ade80',
    background: 'rgba(74,222,128,0.12)',
  },
  skipBadge: {
    left: 20,
    color: '#f87171',
    borderColor: '#f87171',
    background: 'rgba(248,113,113,0.12)',
  },
  controls: {
    display: 'flex',
    gap: 20,
    alignItems: 'center',
  },
  btn: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    fontSize: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.15s, opacity 0.15s',
    WebkitTapHighlightColor: 'transparent',
  },
  btnSkip: {
    background: 'rgba(248,113,113,0.15)',
    color: '#f87171',
    border: '1px solid rgba(248,113,113,0.3)',
  },
  btnSave: {
    background: 'rgba(74,222,128,0.15)',
    color: '#4ade80',
    border: '1px solid rgba(74,222,128,0.3)',
    width: 64,
    height: 64,
    fontSize: 26,
  },
  btnUndo: {
    background: 'transparent',
    color: '#6a6050',
    border: '1px solid #3a3628',
  },
  // ── Done ──
  doneScreen: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    gap: 16,
    textAlign: 'center',
  },
  doneIcon: {
    fontSize: 48,
    color: '#c8aa64',
    marginBottom: 8,
  },
  doneTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 32,
    fontWeight: 300,
    color: '#f0e6d0',
    letterSpacing: '0.04em',
  },
  doneCount: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 13,
    color: '#c8aa64',
    letterSpacing: '0.1em',
  },
  doneBtn: {
    background: '#c8aa64',
    color: '#0c0b09',
    border: 'none',
    borderRadius: 4,
    padding: '12px 28px',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 11,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
  },
  // ── Moodboard ──
  moodboard: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
  },
  moodboardCount: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 10,
    letterSpacing: '0.15em',
    color: '#6a6050',
    textTransform: 'uppercase',
    marginBottom: 14,
    textAlign: 'center',
  },
  moodboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
  },
  moodCell: {
    borderRadius: 10,
    overflow: 'hidden',
    border: '1px solid #2a2620',
    position: 'relative',
  },
  moodImg: {
    width: '100%',
    aspectRatio: '4/3',
    objectFit: 'cover',
    display: 'block',
  },
  moodOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: '6px 8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(to bottom, rgba(12,11,9,0.7) 0%, transparent 100%)',
  },
  moodCategory: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 13,
    color: '#f0e6d0',
    letterSpacing: '0.03em',
  },
  removeBtn: {
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#f0e6d0',
    borderRadius: '50%',
    width: 22,
    height: 22,
    cursor: 'pointer',
    fontSize: 14,
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodCredit: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: 8,
    letterSpacing: '0.1em',
    color: '#6a6050',
    textTransform: 'uppercase',
    padding: '4px 8px',
    background: '#0c0b09',
  },
  emptyMoodboard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    gap: 12,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    color: '#3a3628',
  },
  emptyText: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 22,
    color: '#6a6050',
    fontStyle: 'italic',
  },
}
