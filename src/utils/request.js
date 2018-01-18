import axios from 'axios'

const service = axios.create({
  baseURL: 'https://decade.global/api',
  timeout: 5000
})

export default service
