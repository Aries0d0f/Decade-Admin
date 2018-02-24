import axios from 'axios'

const service = axios.create({
  baseURL: 'https://decade.global/api',
  timeout: 10000
})

export default service
