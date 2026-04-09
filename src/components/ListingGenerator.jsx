import React, { useState, useEffect, useRef } from 'react'
import { Copy, Check, ChevronDown, Tag, Sparkles, RefreshCw } from 'lucide-react'

const PLATFORM_TIPS = {
  Depop: {
    maxTitle: 50,
    note: 'Depop: Keep title under 50 chars for best visibility.',
    hashtagNote: 'Depop hashtags appear in the description.',
  },
  Mercari: {
    maxTitle: 80,
    note: 'Mercari: Keyword-rich titles rank better.',
    hashtagNote: 'Mercari does not use hashtags — removed from output.',
  },
  Poshmark: {
    maxTitle: 80,
    note: 'Poshmark: Style & brand keywords boost search.',
    hashtagNote: 'Poshmark supports hashtags in descriptions.',
  },
  eBay: {
    maxTitle: 80,
    note: 'eBay: Condition keywords (NWT, Grade A) improve search rank.',
    hashtagNote: 'eBay does not use hashtags — removed from output.',
  },
  Vinted: {
    maxTitle: 60,
    note: 'Vinted: Short, clear titles work best.',
    hashtagNote: 'Vinted does not use hashtags.',
  },
  StockX: {
    maxTitle: 80,
    note: 'StockX: Exact product names matter most.',
    hashtagNote: '',
  },
  Other: {
    maxTitle: 80,
    note: '',
    hashtagNote: '',
  },
}

const NO_HASHTAG_PLATFORMS = ['Mercari', 'eBay', 'Vinted', 'StockX']

function sanitizeHashtag(tag) {
  // Remove numbers and special chars, only letters allowed, no leading #
  return tag.replace(/[^a-zA-Z]/g, '')
}

function generateHashtags(jersey) {
  const candidates = []

  // Team tag (remove spaces/special chars)
  if (jersey.team) {
    const teamTag = jersey.team.replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '')
    if (teamTag) candidates.push(teamTag)
  }

  // Player tag (surname only if space, sanitized)
  if (jersey.player) {
    const playerTag = jersey.player.split(' ').pop().replace(/[^a-zA-Z]/g, '')
    if (playerTag) candidates.push(playerTag)
  }

  // Type tag
  const typeMap = { Home: 'HomeKit', Away: 'AwayKit', Third: 'ThirdKit', GK: 'GKJersey', 'Special Edition': 'SpecialEdition' }
  candidates.push(typeMap[jersey.type] || 'FootballJersey')

  // Quality tag
  candidates.push(jersey.quality === 'A' ? 'GradeA' : 'GradeB')

  // Generic tags pool (no numbers)
  const genericPool = [
    'FootballShirt',
    'SoccerJersey',
    'Footballwear',
    'JerseyCollection',
    'RetroFootball',
    'FootballFashion',
    'Kitswap',
    'FootballKit',
    'SoccerShirt',
    'JerseyForSale',
    'SportswearStyle',
    'GoalieKit',
  ]

  // Fill to exactly 5 unique hashtags
  const used = new Set()
  const result = []

  for (const c of candidates) {
    const clean = sanitizeHashtag(c)
    if (clean && !used.has(clean.toLowerCase())) {
      used.add(clean.toLowerCase())
      result.push(clean)
      if (result.length === 5) break
    }
  }

  for (const g of genericPool) {
    if (result.length >= 5) break
    const clean = sanitizeHashtag(g)
    if (clean && !used.has(clean.toLowerCase())) {
      used.add(clean.toLowerCase())
      result.push(clean)
    }
  }

  return result.slice(0, 5).map(t => `#${t}`)
}

function generateListing(jersey, platform) {
  const platformConfig = PLATFORM_TIPS[platform] || PLATFORM_TIPS['Other']
  const useHashtags = !NO_HASHTAG_PLATFORMS.includes(platform)
  const hashtags = generateHashtags(jersey)

  const qualityDesc = jersey.quality === 'A'
    ? 'A-grade quality — clean condition with no visible flaws'
    : 'B-grade — minor cosmetic imperfections (see photos for details)'

  const sizeDesc = {
    S: 'Small (S)',
    M: 'Medium (M)',
    L: 'Large (L)',
    XL: 'Extra Large (XL)',
    XXL: 'XXL',
  }[jersey.size] || jersey.size

  const typeDesc = jersey.type.toLowerCase()
  const playerWithNumber = jersey.number
    ? `${jersey.player} (${jersey.number})`
    : jersey.player

  // Title
  let title = `${jersey.team} ${jersey.player} ${jersey.type} Jersey`
  if (jersey.number) title += ` ${jersey.number}`
  title += ` | Size ${jersey.size}`
  if (platform === 'Depop' && title.length > 50) {
    title = `${jersey.team} ${jersey.player} ${jersey.type} Jersey | ${jersey.size}`
  }

  // Short description (one liner)
  const shortDesc = `${jersey.team} ${playerWithNumber} ${typeDesc} jersey, size ${jersey.size} — ${jersey.quality === 'A' ? 'Grade A, clean condition' : 'Grade B, minor wear'}.`

  // Full description block
  const fullDesc = [
    `Up for sale is this authentic ${jersey.team} ${playerWithNumber} ${typeDesc} football jersey in size ${sizeDesc}.`,
    '',
    `Condition: ${qualityDesc}.${jersey.notes ? ` ${jersey.notes}.` : ''}`,
    '',
    `Details:`,
    `• Team: ${jersey.team}`,
    `• Player: ${jersey.player}${jersey.number ? ` · Number ${jersey.number}` : ''}`,
    `• Type: ${jersey.type}`,
    `• Size: ${jersey.size}`,
    `• Quality: Grade ${jersey.quality}`,
    '',
    `Perfect for fans, collectors, or everyday wear. Happy to answer any questions — feel free to message before buying!`,
    '',
    useHashtags ? hashtags.join(' ') : '',
  ].filter(line => line !== undefined).join('\n').trim()

  return {
    title,
    shortDesc,
    fullDesc,
    hashtags: useHashtags ? hashtags : [],
    platformTip: platformConfig.note,
    platformHashtagNote: platformConfig.hashtagNote,
  }
}

function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
      style={{
        backgroundColor: copied ? 'rgba(34,197,94,0.12)' : 'rgba(108,99,255,0.12)',
        color: copied ? '#22c55e' : '#6c63ff',
        border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(108,99,255,0.3)'}`,
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copied!' : label}
    </button>
  )
}

function ListingBlock({ title: blockTitle, content, children }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid #2a2a3d' }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ backgroundColor: '#12121a', borderBottom: '1px solid #2a2a3d' }}
      >
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
          {blockTitle}
        </span>
        <CopyButton text={content} />
      </div>
      <div
        className="p-4"
        style={{ backgroundColor: '#1a1a26' }}
      >
        {children || (
          <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: '#e2e8f0' }}>
            {content}
          </p>
        )}
      </div>
    </div>
  )
}

export default function ListingGenerator({ jerseys, initialJersey }) {
  const [selectedId, setSelectedId] = useState(initialJersey?.id || jerseys[0]?.id || '')
  const [platform, setPlatform] = useState(initialJersey?.platform || 'Depop')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (initialJersey) {
      setSelectedId(initialJersey.id)
      setPlatform(initialJersey.platform)
    }
  }, [initialJersey])

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectedJersey = jerseys.find(j => j.id === selectedId)
  const listing = selectedJersey ? generateListing(selectedJersey, platform) : null

  const allText = listing
    ? [
        `TITLE:\n${listing.title}`,
        `\nSHORT DESCRIPTION:\n${listing.shortDesc}`,
        `\nFULL LISTING:\n${listing.fullDesc}`,
      ].join('\n')
    : ''

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>Listing Generator</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
            Select a jersey to auto-generate a ready-to-post listing
          </p>
        </div>
        {listing && (
          <CopyButton text={allText} label="Copy All" />
        )}
      </div>

      {jerseys.length === 0 ? (
        <div
          className="glass-card p-12 text-center"
        >
          <Tag size={40} className="mx-auto mb-3" style={{ color: '#2a2a3d' }} />
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Add jerseys to your inventory first, then generate listings here.
          </p>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div
            className="p-4 rounded-xl flex flex-col sm:flex-row gap-4"
            style={{ backgroundColor: '#1a1a26', border: '1px solid #2a2a3d' }}
          >
            {/* Jersey selector */}
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: '#94a3b8' }}>Jersey</label>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: '#0a0a0f',
                    border: '1px solid #2a2a3d',
                    color: '#e2e8f0',
                  }}
                >
                  {selectedJersey ? (
                    <span>
                      {selectedJersey.team} — {selectedJersey.player}
                      <span className="ml-2 text-xs" style={{ color: '#6b7280' }}>
                        {selectedJersey.size} · {selectedJersey.type}
                      </span>
                    </span>
                  ) : (
                    <span style={{ color: '#6b7280' }}>Select a jersey...</span>
                  )}
                  <ChevronDown size={15} style={{ color: '#6b7280', flexShrink: 0 }} />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-30 max-h-64 overflow-y-auto"
                    style={{ backgroundColor: '#12121a', border: '1px solid #2a2a3d', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                  >
                    {jerseys.map(j => (
                      <button
                        key={j.id}
                        onClick={() => {
                          setSelectedId(j.id)
                          setPlatform(j.platform)
                          setDropdownOpen(false)
                        }}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors duration-100 hover:bg-opacity-50"
                        style={{
                          backgroundColor: j.id === selectedId ? 'rgba(108,99,255,0.12)' : 'transparent',
                          color: j.id === selectedId ? '#9c8fff' : '#e2e8f0',
                          borderBottom: '1px solid #2a2a3d',
                        }}
                      >
                        <span>
                          {j.team} — {j.player}
                          <span className="ml-2 text-xs" style={{ color: '#6b7280' }}>
                            {j.size} · {j.type}
                          </span>
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full ml-2"
                          style={{
                            backgroundColor: j.status === 'Sold' ? 'rgba(108,99,255,0.15)' : j.status === 'Listed' ? 'rgba(59,130,246,0.15)' : 'rgba(34,197,94,0.15)',
                            color: j.status === 'Sold' ? '#6c63ff' : j.status === 'Listed' ? '#3b82f6' : '#22c55e',
                          }}
                        >
                          {j.status}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Platform selector */}
            <div className="sm:w-48 flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: '#94a3b8' }}>Platform</label>
              <select
                className="px-3 py-2.5 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#0a0a0f', border: '1px solid #2a2a3d', color: '#e2e8f0' }}
                value={platform}
                onChange={e => setPlatform(e.target.value)}
              >
                {Object.keys(PLATFORM_TIPS).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Platform tip */}
          {listing?.platformTip && (
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
              style={{ backgroundColor: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', color: '#9c8fff' }}
            >
              <Sparkles size={16} className="mt-0.5 flex-shrink-0" />
              <span>{listing.platformTip}</span>
            </div>
          )}

          {listing && (
            <div className="space-y-4">
              {/* Title */}
              <ListingBlock blockTitle="Title" content={listing.title} />

              {/* Short Description */}
              <ListingBlock blockTitle="Short Description" content={listing.shortDesc} />

              {/* Full Listing */}
              <ListingBlock blockTitle="Full Listing Description" content={listing.fullDesc} />

              {/* Hashtags */}
              {listing.hashtags.length > 0 && (
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ border: '1px solid #2a2a3d' }}
                >
                  <div
                    className="flex items-center justify-between px-4 py-2.5"
                    style={{ backgroundColor: '#12121a', borderBottom: '1px solid #2a2a3d' }}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
                      Hashtags (5)
                    </span>
                    <CopyButton text={listing.hashtags.join(' ')} />
                  </div>
                  <div
                    className="p-4 flex flex-wrap gap-2"
                    style={{ backgroundColor: '#1a1a26' }}
                  >
                    {listing.hashtags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-full text-sm font-medium"
                        style={{ backgroundColor: 'rgba(108,99,255,0.12)', color: '#9c8fff', border: '1px solid rgba(108,99,255,0.2)' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {listing.platformHashtagNote && (
                    <div
                      className="px-4 py-2.5 text-xs"
                      style={{ borderTop: '1px solid #2a2a3d', color: '#6b7280', backgroundColor: '#12121a' }}
                    >
                      {listing.platformHashtagNote}
                    </div>
                  )}
                </div>
              )}

              {NO_HASHTAG_PLATFORMS.includes(platform) && (
                <div
                  className="px-4 py-3 rounded-xl text-sm"
                  style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}
                >
                  Hashtags are not used on {platform} — omitted from the output above.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
