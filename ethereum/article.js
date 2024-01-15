import web3 from './web3';
import Article from './build/Article.json'
var address = "0x6382789D07Ad96D5482cA2FfA205E5B9668E12dF"
var contract = new web3.eth.Contract(Article.abi, address)
export default contract;