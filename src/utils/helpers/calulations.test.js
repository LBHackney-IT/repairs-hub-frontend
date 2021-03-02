import { calculateTotalCost } from './calculations'

describe('calculateTotalCost', () => {
  const arrayOfObjects = [
    { code: '21000019', cost: '2', quantity: 1 },
    { code: '21000029', cost: '5', quantity: 2 },
    { code: '21000039', cost: '14', quantity: 3 },
    { code: '21000049', cost: '10', quantity: 0 },
  ]

  it('returns total from cost and quantity fields in array of objects', () => {
    expect(calculateTotalCost(arrayOfObjects, 'cost', 'quantity')).toEqual(54)
  })
})
