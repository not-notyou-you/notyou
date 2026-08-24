// src/pages/public/passion/sections/LeadershipSection.tsx
import { LeadershipIcon } from '../components/LeadershipIcon'
import type { Leadership } from '@/types'
export function LeadershipSection({ items, loading }: { items: Leadership[]; loading: boolean }) {
  return (
    <div className="passion-section-shell">
      <div className="passion-box passion-section-shell__header">
        <h2 className="passion-section__title">Leadership &amp; Committees</h2>
      </div>
      <div className="passion-scroll-v">
        {loading && <p className="passion-section__note">Loading…</p>}
        {!loading && items.length === 0 && <p className="passion-section__note">No leadership roles yet.</p>}
        {!loading &&
          items.map((item, index) => (
            <article
              key={item.id}
              className="passion-box passion-leadership-card"
              style={{ ['--r' as string]: index % 2 === 0 ? '-0.6deg' : '0.6deg' }}
            >
              <div className="passion-leadership-card__icon">
                <LeadershipIcon icon={item.icon_type} />
              </div>
              <div className="passion-leadership-card__body">
                <div className="passion-leadership-card__heading">
                  <div>
                    <h3 className="passion-leadership-card__org">{item.organization}</h3>
                    <div className="passion-leadership-card__role">{item.position}</div>
                  </div>
                  {(item.period || item.start_date) && (
                    <span className="passion-leadership-card__period">
                      {item.period || [item.start_date, item.end_date].filter(Boolean).join(' - ')}
                    </span>
                  )}
                </div>
                <p className="passion-leadership-card__desc">{item.description}</p>
                {item.achievements && item.achievements.length > 0 && (
                  <ul className="passion-leadership-card__achievements">
                    {item.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
      </div>
    </div>
  )
}