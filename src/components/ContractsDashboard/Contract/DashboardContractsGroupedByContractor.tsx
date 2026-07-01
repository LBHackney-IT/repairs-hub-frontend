import { ContractorWithContracts } from './ContractsSection/DashboardContractSection'
import ErrorMessage from '../../Errors/ErrorMessage'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import WarningInfoBox from '../../Template/WarningInfoBox'
dayjs.extend(relativeTime)

interface Props {
  contracts: ContractorWithContracts[]
  warningText?: string
  error?: Error | string | null
  // activeStatus?: string
}

export const DashboardContractsGroupedByContractor = (props: Props) => {
  const { contracts, warningText, error } = props

  return (
    <>
      {(contracts === null || contracts?.length === 0) && (
        <div style={{ width: '90%' }}>
          <WarningInfoBox
            header="No contracts found!"
            text={`${warningText}`}
            name="no-contracts-found"
          />
        </div>
      )}

      {contracts.length > 0 && (
        <ul
          style={{
            display: 'flex',
            flexDirection: 'column',
            // display: 'grid',
            // gridTemplateColumns: 'repeat(auto-fill, 10rem)',
            gap: '1rem',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            marginTop: '15px',
          }}
          // data-test-id={
          //   activeStatus ? `${activeStatus}-contracts-list` : 'contract-list'
          // }
        >
          {contracts.map((x) => (
            <li style={{ marginTop: '0px' }}>
              <Link
                href={`/contractors/${x.contractor.reference}`}
                className="lbh-link"
                style={{
                  // textDecorationColor: "#0b0c0c",
                  textDecoration: 'none',
                  // borderBottom: "1px solid #333",
                }}
              >
                <p className="lbh-heading-h5" style={{ marginTop: '0px' }}>
                  {x.contractor.name} ({x.contractor.reference})
                </p>
              </Link>

              <ul
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgb(240, 240, 240)',
                  // boxSizing: 'content-box',
                  // padding: '10px',
                  borderRadius: '5px',
                  marginTop: '10px',
                  paddingTop: '15px',
                }}
              >
                {x.contracts.map((c) => {
                  const hasExpired =
                    c.terminationDate < new Date().toISOString()

                  return (
                    <li
                      className="lbh-body-s"
                      style={{
                        // display: 'flex',
                        marginTop: '0px',
                        boxSizing: 'border-box',
                        // background: '#eee',
                        width: '100%',
                        padding: '0 15px 10px',
                        // justifyContent: 'space-between',

                        display: 'grid',
                        gridTemplateColumns: '2fr 2fr 4fr',
                        gap: '10px',
                      }}
                    >
                      {/* {c.contractReference} - {c.} */}

                      <p style={{ marginTop: 0, marginLeft: '10px' }}>
                        {c.contractReference}
                      </p>

                      <p
                        style={{
                          marginTop: 0,
                          marginLeft: '10px',
                          color: hasExpired
                            ? 'oklch(44.4% 0.177 26.899)'
                            : 'inherit',
                        }}
                      >
                        <span>{hasExpired ? 'Expired ' : 'Expires '}</span>
                        <span>{dayjs(c.terminationDate).fromNow()}</span>
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
            </li>
          ))}
        </ul>
      )}

      {error && (
        <ErrorMessage
          label={
            error instanceof Error
              ? error.message
              : typeof error === 'string'
              ? error
              : 'An unexpected error occurred'
          }
        />
      )}
    </>
  )
}
