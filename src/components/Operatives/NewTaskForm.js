import { useForm } from 'react-hook-form'
import Button from '../Form/Button'
import BackButton from '../Layout/BackButton'
import RateScheduleItem from '../WorkElement/RateScheduleItem'

const NewTaskForm = () => {
  const { register } = useForm()
  const codes = [
    {
      code: 'PLP5R082',
      shortDescription: 'RE ENAMEL ANY SIZE BATH',
      longDescription:
        'Prepare and reenamel surface of bath including removing and replacing plumbing fittings as required  Any size bath',
      priority: {
        priorityCode: 4,
        description: '5 [N] NORMAL',
      },
      cost: 148.09,
    },
    {
      code: '20000030',
      shortDescription: 'DAYWORK PLUMBER BAND 3',
      priority: {
        priorityCode: 4,
        description: '5 [N] NORMAL',
      },
    },
    {
      code: '20060020',
      shortDescription: 'BATHROOM PLUMBING REPAIRS',
      priority: {
        priorityCode: 4,
        description: '5 [N] NORMAL',
      },
      cost: 50.17,
    },
  ]
  return (
    <>
      <BackButton />
      <h1 className="lbh-heading-h2 govuk-!-margin-bottom-4">New SOR</h1>
      <RateScheduleItem sorCodesList={codes} register={register} />
      <div className="button-pair">
        <Button
          width="one-third"
          label="Confirm"
          type="submit"
          isSecondary={false}
        />
      </div>
    </>
  )
}

export default NewTaskForm
