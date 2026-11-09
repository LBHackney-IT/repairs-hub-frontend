import Link from 'next/link'
import { headerLinksForUser } from '@/utils/headerLinks'

type HeaderLinkType = ReturnType<typeof headerLinksForUser>[number]

interface Props {
  link: HeaderLinkType
  className?: string
  onClick?: () => void
}

const HeaderLink = ({ link, className, onClick }: Props) => {
  const { id, href, description, requireFullPageLoad } = link

  const props = {
    id,
    href,
    className,
    onClick,
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
