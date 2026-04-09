import Contract from '@/root/src/models/contract'

interface Props {
  contract: Contract
  index: number
  children: React.ReactNode
}

export const ContractListItem = (props: Props) => {
  const { contract, index, children } = props

  return (
    <li
      data-id={index}
      style={{
        border: '5px solid #00664F',
        borderRadius: '20px',
        boxSizing: 'border-box',
        padding: '1rem',
        display: 'flex',
        marginTop: '1rem',
        justifyContent: 'center',
      }}
    >
      <div className="contract-details">
        <h5
          style={{
            whiteSpace: 'nowrap',
          }}
        >
          {contract.contractReference}
        </h5>

        {children}
      </div>
    </li>
  )
}
