import * as HttpStatus from 'http-status-codes'
import {
  serviceAPIRequest,
  authoriseServiceAPIRequest,
} from '../../../utils/service-api-client'
import { readFile, writeFile } from 'fs/promises'
import {
  CompletionTimesCalculator,
  PriorityCodeError,
} from '../../../utils/helpers/completionDateTimes'
import axios from 'axios'

const { TEMP_BANK_HOLIDAYS_PATH, BANK_HOLIDAYS_API_URL } = process.env

const getBankHolidays = async () => {
  try {
    const bankHolidays = JSON.parse(await readFile(TEMP_BANK_HOLIDAYS_PATH))

    console.log('Using cached bank holidays.')

    return bankHolidays
  } catch (e) {
    console.log(
      'Bank holiday data unavailable in cache. Fetching data from API.'
    )

    const { data } = await axios.get(BANK_HOLIDAYS_API_URL)
    const bankHolidays = data['england-and-wales']['events']

    await writeFile(TEMP_BANK_HOLIDAYS_PATH, JSON.stringify(bankHolidays))

    return bankHolidays
  }
}

const getCompletionDateTime = async (req, res) => {
  try {
    const priorityCode = req.body?.priority?.priorityCode
    const bankHolidays = await getBankHolidays()

    const completionTimesCalculator = new CompletionTimesCalculator(
      priorityCode,
      bankHolidays
    )

    return completionTimesCalculator.completionDateTime()
  } catch (error) {
    if (error instanceof PriorityCodeError) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      })
    } else {
      console.error(
        'Unable to fetch bank holidays for completion time calculation',
        error.message
      )

      const errorResponse = error.response

      if (errorResponse) {
        res
          .status(errorResponse?.status)
          .json({ message: errorResponse?.data || 'Bank holiday API error' })
      } else {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Bank holiday API request setup error' })
      }
    }
  }
}

export default authoriseServiceAPIRequest(async (req, res) => {
  req.query = { path: ['workOrders', 'schedule'] }

  const completionDateTime = await getCompletionDateTime(req, res)

  if (completionDateTime) {
    req.body = {
      ...req.body,
      priority: {
        ...req.body.priority,
        requiredCompletionDateTime: completionDateTime,
      },
    }

    const data = await serviceAPIRequest(req)

    res.status(HttpStatus.OK).json(data)
  }
})
