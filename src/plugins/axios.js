import axios from 'axios'

const options = {
  timeout: 5000,
  baseURL: 'http://60.249.179.125:1337'
}

const Axios = axios.create(options)

export default Axios
