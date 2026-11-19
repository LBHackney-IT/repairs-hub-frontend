export {}

declare global {
  interface Window {
    Cypress?: {
      expose: (key: string) => unknown
    }
  }
}
