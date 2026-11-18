interface Props {
  title: string
  workOrderReference: string
}

export const PageAnnouncement = ({ title, workOrderReference }: Props) => (
  <section className="text-align-left lbh-page-announcement">
    <h3 className="lbh-page-announcement__title">{title}</h3>
    <div className="lbh-page-announcement__content">
      <p>Reference number {workOrderReference}</p>
    </div>
  </section>
)

export default PageAnnouncement
