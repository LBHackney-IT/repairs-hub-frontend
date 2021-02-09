export const characterCount = () => {
  const characterCount = document.getElementById('character-count')
  const maxLength = characterCount.dataset.maximumLength

  characterCount.innerText = maxLength - event.target.value.length
}
