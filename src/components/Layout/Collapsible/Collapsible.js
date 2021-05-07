import PropTypes from 'prop-types'
import { useState } from 'react'

const Collapsible = ({
  heading,
  children,
  contentMargin,
  collapsableDivClassName,
}) => {
  const [open, setOpen] = useState(true)

  return (
    <section className="lbh-collapsible">
      <div
        aria-expanded={open}
        className={`lbh-collapsible__button ${collapsableDivClassName}`}
        onClick={() => setOpen(!open)}
      >
        <h2 className="lbh-heading-h2 lbh-collapsible__heading">{heading}</h2>
        <svg width="17" height="10" viewBox="0 0 17 10">
          <path d="M2 1.5L8.5 7.5L15 1.5" strokeWidth="3" />
        </svg>
      </div>
      <div
        className={`lbh-collapsible__content ${contentMargin}`}
        hidden={!open}
      >
        {children}
      </div>
    </section>
  )
}

Collapsible.propTypes = {
  heading: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
  contentMargin: PropTypes.string,
  collapsableDivClassName: PropTypes.string,
}

export default Collapsible
