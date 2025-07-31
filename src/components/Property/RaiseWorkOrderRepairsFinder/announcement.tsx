interface Props {
  announcementMessage: string
}

const Announcement = ({ announcementMessage }: Props) => {
  if (!announcementMessage) return null

  return (
    <section className="lbh-page-announcement">
      <div className="lbh-page-announcement__content">
        <strong className="govuk-!-font-size-24">{announcementMessage}</strong>
      </div>
    </section>
  )
}

export default Announcement
