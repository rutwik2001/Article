import web3 from './web3';
import Comment from './build/Comment.json'
export default async (address) => {
    var contract = new web3.eth.Contract(Comment.abi, address);
    return contract;
}
