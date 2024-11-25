export const filterOperatives = (operatives, operativeFilter) => {
  if (!operativeFilter) return operatives;

  return operatives.filter((x) =>
    x.id?.toString().includes(operativeFilter) ||
    x.name?.toLowerCase().includes(operativeFilter) ||
    x.payrollNumber?.toLowerCase().includes(operativeFilter)
  );
}
