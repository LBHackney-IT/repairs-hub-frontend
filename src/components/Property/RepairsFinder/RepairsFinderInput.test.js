import { render, screen, act, within, waitFor } from '@testing-library/react'
import RepairsFinderInput from './RepairsFinderInput'
import { FormProvider, useForm } from 'react-hook-form'
import userEvent from '@testing-library/user-event'
import axios from 'axios'

jest.mock('axios')

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

const priority = priorities.find((x) => (x.description = '[N] NORMAL'))
const priorityCode = priority.priorityCode
const priorityDescription = priority.description

const quantity = 1
const code = 'FAKE0012'
const comments = 'Soem comments blah blah blah blah'
const contractorReference = 'H02'

const validCode = `<?xml version="1.0" standalone="yes"?><RF_INFO><RESULT>SUCCESS</RESULT><PROPERTY></PROPERTY><WORK_PROGRAMME>${contractorReference}</WORK_PROGRAMME><CAUSED_BY></CAUSED_BY><NOTIFIED_DEFECT>Sink taps are broken</NOTIFIED_DEFECT><DEFECT><DEFECT_CODE></DEFECT_CODE><DEFECT_LOC_CODE></DEFECT_LOC_CODE><DEFECT_COMMENTS></DEFECT_COMMENTS><DEFECT_PRIORITY></DEFECT_PRIORITY><DEFECT_QUANTITY></DEFECT_QUANTITY></DEFECT><SOR><SOR_CODE>${code}</SOR_CODE><PRIORITY>${priorityCode}</PRIORITY><QUANTITY>${quantity}</QUANTITY><SOR_LOC_CODE>PRO</SOR_LOC_CODE><SOR_COMMENTS>${comments}</SOR_COMMENTS><SOR_CLASS>M52</SOR_CLASS></SOR></RF_INFO>`

describe('RepairsFinderInput', () => {
  // beforeEach(() => {
  //   axios.mockClear()
  //   jest.clearAllMocks()
  // })

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

  it('Should show error when invalid code', async () => {
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

    const invalidCode = '<xml>some invalid code</xml>'

    const textInput = screen.getByTestId('xmlContent')
    await act(async () => await userEvent.type(textInput, invalidCode))
    expect(textInput.value).toBe(invalidCode)

    expect(await screen.findByText('Invalid code format')).toBeInTheDocument()

    expect(asFragment()).toMatchSnapshot()
  })

  it('Should show error when match not found', async () => {
    const mockError = new Error('Request failed with status code 404')
    mockError.response = {
      status: 400,
      data: {
        message: 'Failed to matching SOR code matching 11111111, H01',
      },
    }

    axios.mockRejectedValue(mockError)

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

    const textInput = screen.getByTestId('xmlContent')

    const user = userEvent.setup()
    textInput.focus()
    await user.paste(validCode)

    await screen.findByText(
      `Failed to matching SOR code matching 11111111, H01`
    )

    expect(asFragment()).toMatchSnapshot()
  })

  it('Should show error when no property contract', async () => {
    axios.mockResolvedValueOnce({
      status: 200,
      data: {
        sorCode: {
          code: '11111111',
          shortDescription: 'Short Description',
          longDescription: 'Long Description',
          priority: null,
          cost: 63.78,
          tradeCode: null,
          standardMinuteValue: 0,
          displayPriority: 0,
        },
        tradeCode: 'PL',
        trade: 'Plumbing',
        contractReference: 'F22-H01-MTCG',
        contractorReference: 'H01',
        contractor: 'HH General Building Repai',
        contractTerminationDate: '2026-03-31T00:00:00Z',
        contractEffectiveDate: '2022-09-18T23:00:00Z',
        hasPropertyContract: false,
      },
    })

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

    const textInput = screen.getByTestId('xmlContent')

    const user = userEvent.setup()
    textInput.focus()
    await user.paste(validCode)

    expect(
      await screen.findByText(
        `Repair of this type cannot be raised on this property`
      )
    ).toBeInTheDocument()

    expect(
      await screen.findByText(
        `The selected work order cannot be raised against this property.`
      )
    ).toBeInTheDocument()

    expect(asFragment()).toMatchSnapshot()
  })

  it('Should show details when matching code found', async () => {
    axios.mockResolvedValueOnce({
      status: 200,
      data: {
        sorCode: {
          code: '11111111',
          shortDescription: 'Short Description',
          longDescription: 'Long Description',
          priority: null,
          cost: 63.78,
          tradeCode: null,
          standardMinuteValue: 0,
          displayPriority: 0,
        },
        tradeCode: 'PL',
        trade: 'Plumbing',
        contractReference: 'F22-H01-MTCG',
        contractorReference: 'H01',
        contractor: 'HH General Building Repai',
        contractTerminationDate: '2026-03-31T00:00:00Z',
        contractEffectiveDate: '2022-09-18T23:00:00Z',
        hasPropertyContract: true,
      },
    })

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

    const textInput = screen.getByTestId('xmlContent')

    const user = userEvent.setup()
    textInput.focus()
    await user.paste(validCode)

    await waitFor(async () => {
      await expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/api/repairs-finder/matching-sor-codes',
        })
      )
    })

    const table = screen.getByRole('table')

    expect(await within(table).findByText('Plumbing - PL')).toBeInTheDocument()
    expect(
      await within(table).findByText('HH General Building Repai')
    ).toBeInTheDocument()
    expect(
      await within(table).findByText('63.78 - Short Description')
    ).toBeInTheDocument()
    expect(await within(table).findByText(quantity)).toBeInTheDocument()
    expect(await within(table).findByText(comments)).toBeInTheDocument()
    expect(
      await within(table).findByText(priorityDescription)
    ).toBeInTheDocument()

    expect(asFragment()).toMatchSnapshot()
  })
})
