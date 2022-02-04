import { convertToSentenceCases } from './textConverter'

it('Converts text into sentence case', () => {
  expect(convertToSentenceCases('HELLO WORLD')).toEqual('Hello world')
})
