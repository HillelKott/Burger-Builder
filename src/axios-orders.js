import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://my-burger-954a7.firebaseio.com/'
});

export default instance;