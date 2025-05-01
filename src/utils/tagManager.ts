interface GTMEvent {
  event: string
  [key: string]: any
}

declare global {
  interface Window {
    dataLayer: GTMEvent[]
  }
}
/*
 * Emits a Google Tag Manager event to the dataLayer to be picked up by Google Analytics.
 * @param {GTMEvent} eventData - The event data to be emitted.
 * @returns {void}
 */
export function emitTagManagerEvent(eventData: GTMEvent): void {
  try {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push(eventData)
      console.log('GTM event emitted:', eventData)
    } else {
      console.warn('Window object not found. GTM event not emitted:', eventData)
    }
  } catch (error) {
    console.error('Error emitting GTM event:', error)
  }
}
