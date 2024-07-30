export interface ErrorWithResponse extends Error {
  response?: unknown // or a more specific type if known
}
