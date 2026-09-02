// src/pages/public/passion/sections/VoidSection.tsx
import { useWanderRotation } from '../hooks/useWanderRotation'
export function VoidSection({ onTrigger }: { onTrigger: () => void }) {
  const rotation = useWanderRotation()
  return (
    <div className="passion-void">
      <div className="passion-scatterable passion-void__wrap">
        <button
          type="button"
          className="passion-void__text"
          style={{ transform: `rotate(${rotation}deg)` }}
          onClick={onTrigger}
        >
          NOTYOU
        </button>
      </div>
    </div>
  )
}