import { useEffect } from 'react'

const usePageVisibility = (onVisible) => {
  useEffect(() => {
    // Function to call when the visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        onVisible() // Call the callback function when the tab is visible
      }
    }

    // Add the event listener for the visibilitychange event
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [onVisible]) // Re-run the effect if the callback changes
}

export default usePageVisibility
