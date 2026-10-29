// `custom:groups` can be an array or a string split by `,` or `;`.
const SEPARATOR = /[;,]/

export function parseCognitoGroups(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [value]

  return values
    .filter((item): item is string => typeof item === 'string')
    .flatMap((item) => item.replace(/^\[|\]$/g, '').split(SEPARATOR))
    .map((group) => group.trim())
    .filter(Boolean)
}
