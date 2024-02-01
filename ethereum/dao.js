import web3 from './web3';
import DAO from './build/DAO.json'
var address = "0xcbf27eFC3967972c477Dd9CcF8aa1BaA6f23b837"
var contract = new web3.eth.Contract(DAO.abi, address)
export default contract;