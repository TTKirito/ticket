import axios from 'axios'

const buildClient = ({ req }) =>{
    if(typeof window === 'undefined'){
        return axios.create({
            baseURL:
                'http://35.224.248.242',
                headers: req.headers
        })
    } else {
        return axios.create({
            baseURL: '/'
        })
    }
}

export default buildClient