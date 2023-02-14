export const sanitizeInput = value => {
    return value.trim().replaceAll(' ', '')
}

export const saveContractChangesToDatabase = async (data) => {
    await frontEndApiRequest({
        method: 'POST',
        path: `/api/backOffice/sor-contracts`,
        requestData: data,
      })
  }