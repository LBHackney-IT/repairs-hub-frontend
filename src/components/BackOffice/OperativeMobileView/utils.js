export const filterOperatives = (operatives, operativeFilter) => {
  let filteredOperativeList = operatives

  if (operativeFilter !== '') {
    filteredOperativeList = filteredOperativeList.filter((x) =>
      x.name.toLowerCase().includes(operativeFilter.toLowerCase())
    )
  }

  // if (showOnlyOJAT) {
  //   filteredOperativeList = filteredOperativeList.filter(
  //     (x) => x.isOneJobAtATime
  //   )
  // }

  return filteredOperativeList
}
