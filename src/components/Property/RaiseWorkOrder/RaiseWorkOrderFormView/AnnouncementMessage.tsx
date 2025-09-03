interface Props {
  announcementMessage: string
}

const AnnouncementMessage = ({ announcementMessage }: Props) => {
  return (
    <section className="lbh-page-announcement">
      <div className="lbh-page-announcement__content">
        <strong className="govuk-!-font-size-24">{announcementMessage}</strong>
      </div>
    </section>
  )
}

export default AnnouncementMessage
