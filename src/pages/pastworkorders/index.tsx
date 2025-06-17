import Meta from '@/components/Meta'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { getQueryProps } from '@/utils/helpers/serverSideProps'
import { OPERATIVE_ROLE } from '@/root/src/utils/auth/user'
import MobileWorkingPastWorkOrdersView from '../../components/PastWorkOrders/MobileWorkingPastWorkOrdersView/MobileWorkingPastWorkOrdersView'
import CurrentUserWrapper from '../../components/WorkOrders/CurrentUserWrapper'
import TabsVersionTwo from '../../components/TabsVersionTwo/Index'

const PastWorkOrderPage = () => {
  const router = useRouter()

  const titles = ['Current Work Orders', 'Past Work Orders']

  const handleTabClick = (index: number) => {
    index === 0 && router.push('/')
  }

  const ariaSelected = useMemo(() => {
    return router.pathname === '/pastworkorders' ? 1 : 0
  }, [router.pathname])
  return (
    <>
      <Meta title={`Past Work Orders`} />
      <TabsVersionTwo
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

PastWorkOrderPage.permittedRoles = [OPERATIVE_ROLE]

export default PastWorkOrderPage
