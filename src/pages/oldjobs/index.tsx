import Meta from '@/components/Meta'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useMemo } from 'react'

import { getQueryProps } from '@/utils/helpers/serverSideProps'
import { OPERATIVE_ROLE } from '@/utils/user'
import MobileWorkingPastWorkOrdersView from '../../components/PastWorkOrders/MobileWorkingPastWorkOrdersView/MobileWorkingPastWorkOrdersView'
import CurrentUserWrapper from '../../components/WorkOrders/CurrentUserWrapper'
import NewTabs from '../../components/NewTabs/Index'

const OperativePastWorkOrderPage = () => {
  const router = useRouter()

  const titles = ['Current Work Orders', 'Past Work Orders']

  const handleTabClick = (index: number) => {
    index === 0 && router.push('/')
  }

  const ariaSelected = useMemo(() => {
    return router.pathname === '/oldjobs' ? 1 : 0
  }, [router.pathname])
  return (
    <>
      <Meta title={`Past Work Orders`} />
      <NewTabs
        titles={titles}
        onTabChange={handleTabClick}
        ariaSelected={ariaSelected}
      />
      <CurrentUserWrapper>
        {({ currentUser }) => (
          <MobileWorkingPastWorkOrdersView currentUser={currentUser} />
        )}
      </CurrentUserWrapper>
    </>
  )
}

export const getServerSideProps = getQueryProps

OperativePastWorkOrderPage.permittedRoles = [OPERATIVE_ROLE]

export default OperativePastWorkOrderPage
