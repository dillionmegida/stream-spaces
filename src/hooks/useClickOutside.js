import { useEffect } from 'react'

export default function useClickOutside({ ref, cb }, dependencies) {
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!ref || !ref.current) return

      if (!ref.current.contains(e.target)) cb()
    }

    window.addEventListener('click', onClickOutside)

    return () => window.removeEventListener('click', onClickOutside)
  }, [...dependencies])
}
