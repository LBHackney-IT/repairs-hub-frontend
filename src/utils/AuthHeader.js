const { REPAIRS_SERVICE_API_TOKEN } = process.env

export default function AuthHeader() {
  return { Authorization: `Bearer ${REPAIRS_SERVICE_API_TOKEN}` }
}
