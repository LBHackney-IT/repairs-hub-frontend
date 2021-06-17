const Operatives = ({ operatives }) => {
  return (
    <p className="lbh-body-xs">
      {`Operatives: ${operatives
        .map((operative) => operative.name)
        .join(', ')}`}
    </p>
  )
}

export default Operatives
