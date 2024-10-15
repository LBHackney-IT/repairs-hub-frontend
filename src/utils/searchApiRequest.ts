import axios from "axios";
import { AxiosRequestConfig } from "axios";


export async function searchApiRequest(searchQuery: string, pageNumber: number) {
    const hackneyToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`hackneyToken=`))
        ?.split('=')[1];

    const config: AxiosRequestConfig = {
      url: `${process.env.NEXT_PUBLIC_SEARCH_API_URL}/search/assets`,
      params: {
        searchText: searchQuery,
        page: pageNumber
      },
      headers: {
        "Authorization": `Bearer ${hackneyToken}`
      }
    }
    const { data } = await axios(config)
    return data
  }