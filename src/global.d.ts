export {}

declare global {
  interface Window {
    Cypress?: {
      env: (key: string) => unknown
    }
  }
}
