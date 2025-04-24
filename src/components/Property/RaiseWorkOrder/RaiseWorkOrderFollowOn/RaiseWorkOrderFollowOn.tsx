import { useEffect, useState } from 'react'
import Radios from '../../../Form/Radios'
import FollowOnLookup from './FollowOnLookup'

interface Props {
  register: any
  watch: any
  propertyReference: string
  errors: { [key: string]: { message: string } }
}

const RADIO_OPTIONS = [
  { text: 'Yes', value: 'true' },
  { text: 'No', value: 'false' },
]

const RaiseWorkOrderFollowOn = (props: Props) => {
  const { register, errors, watch, propertyReference } = props

  const [showFollowOnLookup, setShowFollowOnLookup] = useState<boolean>(false)

  const isFollowOnWatchedValue = watch('isFollowOn')

  useEffect(() => {
    setShowFollowOnLookup(() => isFollowOnWatchedValue == 'true')
  }, [isFollowOnWatchedValue])

  return (
    <div
      style={{
        background: '#f9f9f9',
        padding: '15px',
      }}
    >
      <Radios
        name="isFollowOn"
        label="Is this for follow on works?"
        labelSize={'s'}
        options={RADIO_OPTIONS.map((x) => ({
          ...x,
          children:
            x.value === 'true' ? (
              <FollowOnLookup
                visible={showFollowOnLookup}
                propertyReference={propertyReference}
                register={register}
                errors={errors}
              />
            ) : null,
        }))}
        error={errors && errors.isFollowOn}
        register={register({
          required: 'Please select an option',
        })}
      />

      <div>
        <a
          className="lbh-link"
          href={`/search`}
          target="_blank"
          rel="noreferrer"
        >
          Look up work order number
        </a>
      </div>
    </div>
  )
}

export default RaiseWorkOrderFollowOn
