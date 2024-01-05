import Link from 'next/link'

const BackOfficeDashboard = () => {
  const links = [
    { description: 'Add SOR Codes', link: '/backoffice/add-sor-codes' },
    {
      description: 'Add SOR contracts to properties',
      link: '/backoffice/sor-contracts',
    },
    {
      description: 'Bulk-close workOrders',
      link: '/backoffice/close-workorders',
    },
    {
      description: 'Operative mobile work order view',
      link: '/backoffice/mobile-view',
    },
  ]
  return (
    <>
      <h1 className="lbh-heading-h1">BackOffice</h1>

      <h2 className="lbh-heading-h2">Tasks</h2>
      <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />

      <br />

      <ul className="govuk-list">
        {links.map(({ description, link }, index) => (
          <li key={index}>
            <Link href={link} className="govuk-link">
              {description}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default BackOfficeDashboard
