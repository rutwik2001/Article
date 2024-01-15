const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');


const Upload = async (json) => {
    const apiUrl = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.JWT}`,
  },
});

var response = await api.post(apiUrl, {pinataContent: json})
  return response
}


export default Upload;