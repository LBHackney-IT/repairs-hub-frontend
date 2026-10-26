interface Props {
  detail?: string
  text?: string
}

const TenureDetail = ({ text, detail }: Props) => (
  <>
    {detail && (
      <li className="bg-orange">
        {text}: {detail}
      </li>
    )}
  </>
)

export default TenureDetail
