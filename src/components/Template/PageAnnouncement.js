import PropTypes from 'prop-types'

export const PageAnnouncement = (props) => (
  <section className="text-align-left lbh-page-announcement">
    <h3 className="lbh-page-announcement__title">{props.title}</h3>
    <div className="lbh-page-announcement__content">
      <p>Reference number {props.workOrderReference}</p>
    </div>
  </section>
)

PageAnnouncement.propTypes = {
  title: PropTypes.string.isRequired,
  workOrderReference: PropTypes.string.isRequired,
}

export default PageAnnouncement
