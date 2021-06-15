const Operatives = ({ operatives }) => {
  return (
    <>
      <p className="lbh-body-xs">Operatives</p>
      <ul className="lbh-list">
        {operatives.map((operative) => (
          <li className="lbh-body-xs">{operative.name}</li>
        ))}
      </ul>
    </>
  )
}

export default Operatives
