const sdk = require('api')('@pinata-cloud/v1.0#12ai2blmsggcsb');
require('dotenv').config();
sdk.auth(process.env.JWT);
//var json = {newKey: 'New Value1111', 'newKey-1': 'New Value', 'hi': 'hi'}
export default async function Upload(json){
    var result = await sdk.postPinningPinjsontoipfs({pinataContent: json})
    return result.data
}



