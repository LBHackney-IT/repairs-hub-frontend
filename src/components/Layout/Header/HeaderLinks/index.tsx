import { useContext } from 'react'
import { useRouter } from 'next/router'
import UserContext from '../../../UserContext'
import HeaderLink from '../../HeaderLink'
import { headerLinksForUser } from '@/utils/headerLinks'

const HeaderLinks = () => {
  const { user } = useContext(UserContext)
  const { pathname } = useRouter()

  const links = headerLinksForUser(user, pathname)

  if (links.length === 0) return null

  return (
    <div className="lbh-header__links">
      {links.map((link) => (
        <HeaderLink link={link} key={link.id} />
      ))}
    </div>
  )
}

export default HeaderLinks
