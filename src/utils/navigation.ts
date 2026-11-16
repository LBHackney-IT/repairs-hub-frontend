// A full page load, as opposed to a client side transition. It lives in its own
// module so tests can mock it: jsdom doesn't let window.location be replaced.
export const navigateToPage = (url: string) => {
  window.location.assign(url)
}
