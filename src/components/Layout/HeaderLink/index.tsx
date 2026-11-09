import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { headerLinksForUser } from '@/utils/headerLinks'

type HeaderLinkType = ReturnType<typeof headerLinksForUser>[number]

interface Props {
  link: HeaderLinkType
  className?: string
  onClick?: () => void
}

const HeaderLink = ({ link, className, onClick }: Props) => {
  const { id, href, description, requireFullPageLoad } = link

  // next-auth clears its session, then /api/logout clears the rest and ends the
  // Cognito session. The href is the fallback if the click isn't intercepted.
  const handleSignOut = (event: React.MouseEvent) => {
    event.preventDefault()
    onClick?.()
    signOut({ callbackUrl: href })
  }

  const props = {
    id,
    href,
    className,
    onClick: id === 'signout' ? handleSignOut : onClick,
    target: id === 'support-page' ? '_blank' : undefined,
    rel: 'noreferrer',
  }

  // A client side transition won't do for some links, e.g. signing out has to
  // fully reload the page so the cleared session cookies are picked up
  if (requireFullPageLoad) {
    return <a {...props}>{description}</a>
  }

  return <Link {...props}>{description}</Link>
}

export default HeaderLink
