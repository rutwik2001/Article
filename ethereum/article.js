import web3 from './web3';
import Article from './build/Article.json'
var address = "0x8A67D81F265A0345DF8135108F2B89a6a0eb20d7"
var contract = new web3.eth.Contract(Article.abi, address)
export default contract;