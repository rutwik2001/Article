const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK('f5e4c80919f6704ca0c7', '41ff7483ed5b4da4d0a8790aaf88b5ef2df35a8f1a178676d72dd0cf9a0a2c37');
async function main(){
    const res = await pinata.testAuthentication()
    console.log(res)
}

main()
export default function Pinata(){
    return pinata
}
