import { useEffect, useState } from 'react'

import PropTypes from 'prop-types'
import WarningText from '../../Template/WarningText'
import ContactsTable from './ContactsTable'
import { frontEndApiRequest } from '@/root/src/utils/frontEndApiClient/requests'
import ErrorMessage from '../../Errors/ErrorMessage'
import Spinner from '../../Spinner'
import TenantContactsTable from './TenantsContactTable'

const warningText = (contacts) => {
  if (contacts.length < 1) {
    return 'No contact details available for this property'
  } else if (contacts[0] === 'REMOVED') {
    return 'You are not permitted to view contact details'
  }
}



const Contacts = (props) => {
  const { tenureId } = props

  const [contacts, setContacts] = useState(null)
  const [error, setError] = useState()

  const loadContactDetails = async () => {
    if (!tenureId) {
      // no tenure to associate contacts with
      setContacts([])
      return
    }

    try {
      const contactDetails = (contactDetails = await frontEndApiRequest({
        method: 'get',
        path: `/api/contact-details/${tenureId}`,
      }))

      setContacts(contactDetails)
    } catch (e) {
      console.error('An error has occurred:', e.response)
      setError(
        `Oops an error occurred with error status: ${e.response?.status} with message: ${e.response?.data?.message}`
      )
    }
  }

  useEffect(() => {
    loadContactDetails()
  }, [])

  if (error) {
    return <ErrorMessage label={error} />
  }

  if (contacts === null) {
    return (
      <div>
        <Spinner />
      </div>
    )
  }

  const text = warningText(contacts)

  const tenants = contacts.filter((x) => x.tenureType === 'Tenant')
  const householdMembers = contacts.filter(
    (x) => x.tenureType === 'HouseholdMember'
  )

  return text ? (
    <WarningText text={text} />
  ) : (
    <>
      {/* <pre>{JSON.stringify(contacts, null, 2)}</pre> */}

      <h3>Tenants</h3>
    <TenantContactsTable tenants={tenants} />
    

      {/* <ContactsTable contacts={tenants} /> */}

      <h3>Household members</h3>
      <ContactsTable contacts={householdMembers} />
    </>
  )
}

Contacts.propTypes = {
  // contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  tenureId: PropTypes.string,
}

export default Contacts
