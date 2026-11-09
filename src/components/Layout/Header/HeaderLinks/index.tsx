import { useContext } from 'react'
import UserContext from '../../../UserContext'
import HeaderLink from '../../HeaderLink'
import { headerLinksForUser } from '@/utils/headerLinks'

const HeaderLinks = () => {
  const { user } = useContext(UserContext)

  if (!user) return null

  return (
    <div className="lbh-header__links">
      {headerLinksForUser(user).map((link) => (
        <HeaderLink link={link} key={link.id} />
      ))}
    </div>
  )
}

export default HeaderLinks
