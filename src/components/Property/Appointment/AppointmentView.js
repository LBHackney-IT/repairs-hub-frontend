import PropTypes from 'prop-types'

const AppointmentView = ({ reference }) => {
  return <>Parent component for create appointment for {reference}</>
}

AppointmentView.propTypes = {
  reference: PropTypes.string.isRequired,
}

export default AppointmentView
