import web3 from './web3';
import Article from './build/Article.json'
var address = "0x4e2159d1E071150aE7f603645aF37b42D11E1F1E"
var contract = new web3.eth.Contract(Article.abi, address)
export default contract;