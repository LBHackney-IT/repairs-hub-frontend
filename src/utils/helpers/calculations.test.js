import {
  calculateTotal,
  calculateCostBeforeVariation,
  calculateChangeInCost,
  calculateTotalVariedCost,
  calculateSMV,
  strippingZeroes,
} from './calculations'

describe('calculateTotal', () => {
  const arrayOfObjects = [
    { code: '21000019', cost: '2', quantity: 1 },
    { code: '21000029', cost: '5', quantity: 2 },
    { code: '21000039', cost: '14', quantity: 3 },
    { code: '21000049', cost: '10', quantity: 0 },
    { code: '21000059', cost: '7.50', quantity: 2.34 },
  ]

  it('returns total from cost and quantity fields in array of objects', () => {
    expect(calculateTotal(arrayOfObjects, 'cost', 'quantity')).toEqual(71.55)
  })
})

describe('calculateCostBeforeVariation', () => {
  const arrayOfObjects = [
    {
      code: '21000019',
      unitCost: '10',
      currentQuantity: 1,
      originalQuantity: 1,
      variedQuantity: 10,
    },
    {
      code: '21000017',
      unitCost: '20',
      currentQuantity: 1,
      originalQuantity: 1,
      variedQuantity: 10,
    },
  ]

  it('returns cost before variation', () => {
    expect(calculateCostBeforeVariation(arrayOfObjects)).toEqual(30)
  })
})

describe('calculateChangeInCost', () => {
  const arrayOfObjects = [
    {
      code: '21000019',
      unitCost: '10',
      currentQuantity: 1,
      originalQuantity: 1,
      variedQuantity: 10,
    },
    {
      code: '21000017',
      unitCost: '20',
      currentQuantity: 1,
      originalQuantity: 1,
      variedQuantity: 10,
    },
  ]

  it('returns change is cost', () => {
    expect(calculateChangeInCost(arrayOfObjects)).toEqual(270)
  })
})

describe('calculateTotalVariedCost', () => {
  const arrayOfObjects = [
    {
      code: '21000019',
      unitCost: '10',
      currentQuantity: 1,
      originalQuantity: 1,
      variedQuantity: 10,
    },
    {
      code: '21000017',
      unitCost: '20',
      currentQuantity: 1,
      originalQuantity: 1,
      variedQuantity: 10,
    },
  ]

  it('returns change is cost', () => {
    expect(calculateTotalVariedCost(arrayOfObjects)).toEqual(300)
  })
})

describe('calculateSMV and strippingZeroes', () => {
  it('returns 25.31', () => {
    expect(calculateSMV('33.3%', 76)).toEqual('25.31')
  })
  it('returns 38', () => {
    expect(calculateSMV('50%', 76)).toEqual('38')
  })
})
