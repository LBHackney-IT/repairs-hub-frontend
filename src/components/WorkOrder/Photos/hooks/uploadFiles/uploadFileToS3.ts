import axios from 'axios'
import { Link } from '../types'

const uploadFileToS3 = async (file: File, link: Link): Promise<void> => {
  await axios.request({
    method: 'PUT',
    url: link.presignedUrl,
    data: file,
  })
}

export default uploadFileToS3
