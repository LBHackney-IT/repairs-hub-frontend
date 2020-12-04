const { NEXT_PUBLIC_TOKEN } = process.env

export default function AuthHeader() {
  return { Authorization: `Bearer ${NEXT_PUBLIC_TOKEN}` }
}
