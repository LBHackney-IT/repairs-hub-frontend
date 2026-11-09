export const convertToSentenceCases = (text: string): string => {
  return text.charAt(0) + text.slice(1).toLocaleLowerCase()
}
