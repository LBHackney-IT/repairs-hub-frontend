export const mockFile = (name) => {
  const dataBase64 = 'VEhJUyBJUyBUSEUgQU5TV0VSCg=='

  const arrayBuffer = Uint8Array.from(window.atob(dataBase64), (c) =>
    c.charCodeAt(0)
  )

  const blob = new Blob([arrayBuffer], { type: 'text/html' })
  const file = new File([blob], name, { type: 'text/html' })

  return file
}
