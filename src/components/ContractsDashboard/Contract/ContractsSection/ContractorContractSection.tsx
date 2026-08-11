import Contract from '@/root/src/models/contract'
import { NoContractsFoundMessage } from './NoContractsFoundMessage'
import { ContractsSectionWrapper } from './ContractSection'
import { ContractListItems } from '../ContractListItems'
import { ContractListItem } from '../ContractListItem'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

interface Props {
  heading?: string
  contracts: Contract[]
  isLoading: boolean
  warningText: string
  error: Error
  activeStatus?: string
}

export const ContractorContractSection = (props: Props) => {
  const {
    heading,
    contracts,
    isLoading,
    warningText,
    error,
    activeStatus,
  } = props

  return (
    <>
      <ContractsSectionWrapper
        heading={heading}
        isLoading={isLoading}
        error={error}
      >
        <>
          {contracts && contracts?.length > 0 && (
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgb(240, 240, 240)',
                borderRadius: '5px',
                marginTop: '10px',
                paddingTop: '15px',
              }}
            >
              {contracts?.map((contract, index) => {
                const hasExpired =
                  contract.terminationDate < new Date().toISOString()

                return (
                  <li
                      className="lbh-body-s"
                      style={{
                        marginTop: '0px',
                        boxSizing: 'border-box',
                        width: '100%',
                        padding: '0 15px 10px',
                        display: 'grid',
                        gridTemplateColumns: '2fr 2fr 4fr',
                        gap: '10px',
                      }}
                    >
                        <div>{contract.contractReference}</div>
                    <p
                      style={{
                        margin: 0,
                        color: hasExpired
                          ? 'oklch(44.4% 0.177 26.899)'
                          : 'inherit',
                      }}
                    >
                      {hasExpired ? `Expired ` : `Expires `}
                      <span>
                        <span>{dayjs(contract.terminationDate).fromNow()}</span>
                      </span>
                    </p>

                      <p style={{ marginTop: 0, marginLeft: '10px' }}>
                        <span
                          style={{
                            color: 'hsl(180 4% 40% / 1)',
                            marginRight: '10px',
                            fontWeight: '200',
                          }}
                        >
                          Manager:
                        </span>
                        <a
                          className="lbh-link"
                          href={`mailto:callum.macpherson@hackney.gov.uk`}
                        >
                          callum.macpherson@hackney.gov.uk
                        </a>
                      </p>
                  </li>
                )
              })}
            </ul>
          )}

          {contracts === null ||
            (contracts?.length === 0 && (
              <NoContractsFoundMessage warningText={warningText} />
            ))}
        </>
      </ContractsSectionWrapper>
    </>
  )
}
