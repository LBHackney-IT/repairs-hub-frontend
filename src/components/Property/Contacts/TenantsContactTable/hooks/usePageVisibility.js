import { useEffect } from 'react'

const usePageVisibility = (onVisibleCallback) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        onVisibleCallback()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [onVisibleCallback])
}

export default usePageVisibility
