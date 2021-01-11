import { deleteSession } from '../utils/GoogleAuth'

const Logout = () => null

export const getServerSideProps = async ({ res }) => {
  deleteSession(res)
  return { props: {} }
}

export default Logout
