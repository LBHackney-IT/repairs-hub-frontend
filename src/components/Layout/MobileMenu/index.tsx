import { useContext } from 'react'
import UserContext from '../../UserContext'
import HeaderLink from '../HeaderLink'
import { headerLinksForUser } from '@/utils/headerLinks'

interface MobileMenuProps {
  onLinkClick: () => void
}

const MobileMenu = ({ onLinkClick }: MobileMenuProps) => {
  const { user } = useContext(UserContext)

  return (
    <div className="mobile-menu-container">
      <ol className="mobile-menu">
        {user &&
          headerLinksForUser(user).map((link) => {
            return (
              <li key={link.id}>
                <HeaderLink
                  link={link}
                  className="lbh-link lbh-body-l"
                  onClick={onLinkClick}
                />
              </li>
            )
          })}
      </ol>
    </div>
  )
}

export default MobileMenu
