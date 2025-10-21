import { render } from '@testing-library/react'
// import PropertyFlags from '.'

import RepairsFinderInput from './RepairsFinderInput'
import { FormProvider, useForm } from 'react-hook-form'

// jest.mock('axios', () => jest.fn())

const priorities = [
  {
    priorityCode: 1,
    description: '[I] IMMEDIATE',
    priorityCharacter: 'I',
    daysToComplete: 0,
    enabled: true,
    displayOrder: 1,
  },
  {
    priorityCode: 2,
    description: '[E] EMERGENCY',
    priorityCharacter: 'E',
    daysToComplete: 1,
    enabled: true,
    displayOrder: 2,
  },
  {
    priorityCode: 3,
    description: '[U] URGENT',
    priorityCharacter: 'U',
    daysToComplete: 5,
    enabled: true,
    displayOrder: 3,
  },
  {
    priorityCode: 4,
    description: '[N] NORMAL',
    priorityCharacter: 'N',
    daysToComplete: 21,
    enabled: true,
    displayOrder: 4,
  },
]

const Wrapper = ({ children }) => {
  const methods = useForm()
  const {
    register,
    trigger,
    formState: { errors, isSubmitted },
  } = methods

  return (
    <FormProvider {...methods}>
      <form>
        {children({
          register,
          errors,
          trigger,
          isSubmitted,
        })}
      </form>
    </FormProvider>
  )
}

describe('RepairsFinderInput', () => {
  it('Should render input', async () => {
    const { asFragment } = render(
      <Wrapper>
        {({ register, errors, trigger }) => (
          <RepairsFinderInput
            propertyReference={'1234'}
            register={register}
            errors={errors}
            setTotalCost={() => {}}
            setContractorReference={() => {}}
            setTradeCode={() => {}}
            priorities={priorities}
            trigger={trigger}
            isSubmitted={true}
          />
        )}
      </Wrapper>
    )

    expect(asFragment()).toMatchSnapshot()
  })

//    it('Should render input', async () => {

//     const invalidCode = "sdlksdfj"

//     const { asFragment } = render(
//       <Wrapper>
//         {({ register, errors, trigger }) => (
//           <RepairsFinderInput
//             propertyReference={'1234'}
//             register={register}
//             errors={errors}
//             setTotalCost={() => {}}
//             setContractorReference={() => {}}
//             setTradeCode={() => {}}
//             priorities={priorities}
//             trigger={trigger}
//             isSubmitted={true}
//           />
//         )}
//       </Wrapper>
//     )

//     expect(asFragment()).toMatchSnapshot()
//   })

})
