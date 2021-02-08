import { deleteSession } from '../utils/GoogleAuth'
import { AGENT_ROLE, CONTRACTOR_ROLE } from '../utils/user'

const Logout = () => null

export const getServerSideProps = async ({ res }) => {
  deleteSession(res)
  return { props: {} }
}

Logout.permittedRoles = [AGENT_ROLE, CONTRACTOR_ROLE]

export default Logout
