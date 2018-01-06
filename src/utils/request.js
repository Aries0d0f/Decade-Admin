import axios from 'axios'

const service = axios.create({
  baseURL: 'http://60.249.179.125:1337',
  timeout: 5000
})

export default service
