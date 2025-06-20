import axios from 'axios'
import { Link } from '../types'

const TEST_ERROR = true

const uploadFileToS3 = async (file: File, link: Link): Promise<void> => {
  if (TEST_ERROR) throw new Error('test upload error')
  await axios.request({
    method: 'PUT',
    url: link.presignedUrl,
    data: file,
  })
}

export default uploadFileToS3
