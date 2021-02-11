import AppointmentView from '../../../../components/Property/Appointment/AppointmentView'

const AppointmentPage = ({ query }) => {
  return <AppointmentView reference={query.id} />
}
export const getServerSideProps = async (ctx) => {
  const { query } = ctx

  return {
    props: {
      query,
    },
  }
}

export default AppointmentPage
