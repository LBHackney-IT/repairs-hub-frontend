interface Props {
  text?: string
  detail?: string
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
