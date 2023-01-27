import { useState } from 'react'

const fileReader = typeof window !== 'undefined' && new window.FileReader()

export const expectedHeaders: Array<string> = [
  'Code',
  'Cost',
  'StandardMinuteValue',
  'ShortDescription',
  'LongDescription',
]

const useFileUpload = () => {
  const [parsedDataArray, setParsedDataArray] = useState<Array<object>>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleFileOnChange = async (e: Event): Promise<void> => {
    const input = e.target as HTMLInputElement;

    if (e === null || input.files.length === 0) {
      setParsedDataArray(null)
      return
    }

    const file = input.files[0]
    setLoading(true)

    const array = await readFile(file)
    setParsedDataArray(array)

    setLoading(false)
  }

  const readFile = (file: File): Promise<Array<object>> => {
    return new Promise((resolve) => {
      if (!file) {
        resolve(null)
        return
      }

      fileReader.onload = function (event) {
        const text = event.target.result as string;
        const array = csvFileToArray(text)

        resolve(array)
      }

      fileReader.readAsText(file)
    })
  }

  const csvFileToArray = (string: string): Array<object> => {
    const csvHeader = string.slice(0, string.indexOf('\n')).trim().split(',')
    const csvRows = string
      .slice(string.indexOf('\n') + 1)
      .trim()
      .split('\n')

    const array: Array<object> = csvRows.map((i) => {
      const values = i.split(',')
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index]
        return object
      }, {})

      return obj
    })

    return array
  }

  const validateFile = () : boolean => {
    const firstRow = parsedDataArray[0]

    let fileContainsAllHeadings = true

    expectedHeaders.forEach((header) => {
      if (!Object.prototype.hasOwnProperty.call(firstRow, header))
        fileContainsAllHeadings = false
    })

    return fileContainsAllHeadings
  }

  return {
    handleFileOnChange,
    parsedDataArray,
    validateFile,
    loading,
  }
}

export default useFileUpload
