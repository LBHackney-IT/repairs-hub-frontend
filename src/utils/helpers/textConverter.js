export const convertToSentenceCases = (text) => {
  return text.charAt(0) + text.slice(1).toLocaleLowerCase()
}
