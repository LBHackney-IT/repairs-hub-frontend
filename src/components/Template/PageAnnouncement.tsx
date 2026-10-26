interface Props {
  title: string
  workOrderReference: string
}

export const PageAnnouncement = (props: Props) => (
  <section className="text-align-left lbh-page-announcement">
    <h3 className="lbh-page-announcement__title">{props.title}</h3>
    <div className="lbh-page-announcement__content">
      <p>Reference number {props.workOrderReference}</p>
    </div>
  </section>
)

export default PageAnnouncement
