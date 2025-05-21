const Operatives = ({ operatives }) => {
  return (
    <p className="lbh-body-xs">
      {`${operatives.length > 1 ? 'Operatives' : 'Operative'}: ${operatives
        .map((operative) => operative.name)
        .join(', ')}`}
    </p>
  )
}

export default Operatives
