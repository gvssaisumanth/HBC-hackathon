const { ethers } = require('ethers');
const moment = require("moment");

async function getSentEscrowRequestsData(deployPhoneContract, account3)
{
    if(account3 == null) return;
    const filterpRE = deployPhoneContract.filters.escrowPaymentEve(null, account3 , null, null, null);
    const prePayments = await deployPhoneContract.queryFilter(filterpRE);

    const filterpOST = deployPhoneContract.filters.fullfillEscrowPaymentEve(null, account3, null, null, null);
    const postPayments = await deployPhoneContract.queryFilter(filterpOST);


    const successfulRequests = prePayments.filter(preLog => 
    {
        const preTransactionNo = preLog.args.transactionNo.toString();
        return postPayments.some(postLog =>
            postLog.args.transactionNo.toString() === preTransactionNo
        );
    }).map(preLog => 
    {
        return {
        transactionNo: preLog.args.transactionNo.toString(),
        sender: preLog.args.sender,
        receiver: preLog.args.receiver,
        token: preLog.args.token,
        amount: ethers.utils.formatUnits(preLog.args.amount, "ether"),
        date: moment.unix(preLog.args.date.toString()).format("YYYY-MM-DD HH:mm:ss")
        };
    });

    const failedRequests = prePayments.filter(preLog => 
    {
        const preTransactionNo = preLog.args.transactionNo.toString();
        return !postPayments.some(postLog =>
            postLog.args.transactionNo.toString() === preTransactionNo
        );
    }).map(preLog => 
    {
        return {
        transactionNo: preLog.args.transactionNo.toString(),
        sender: preLog.args.sender,
        receiver: preLog.args.receiver,
        token: preLog.args.token,
        amount: ethers.utils.formatUnits(preLog.args.amount, "ether"),
        date: moment.unix(preLog.args.date.toString()).format("YYYY-MM-DD HH:mm:ss")
        };
    });

    return [successfulRequests, failedRequests];
}


async function getReceivedEscrowRequestsData(deployPhoneContract, hashVal)
{
    if(hashVal == null) return; 
    console.log(hashVal)
    const filterpRE = deployPhoneContract.filters.escrowPaymentEve(null, null, hashVal , null, null);
    const prePayments = await deployPhoneContract.queryFilter(filterpRE);

    const filterpOST = deployPhoneContract.filters.fullfillEscrowPaymentEve(null, null, hashVal, null, null);
    const postPayments = await deployPhoneContract.queryFilter(filterpOST);


    const successfulRequests = prePayments.filter(preLog => 
    {
        const preTransactionNo = preLog.args.transactionNo.toString();
        return postPayments.some(postLog =>
            postLog.args.transactionNo.toString() === preTransactionNo
        );
    }).map(preLog => 
        {
            return {
            transactionNo: preLog.args.transactionNo.toString(),
            sender: preLog.args.sender,
            receiver: preLog.args.receiver,
            token: preLog.args.token,
            amount: ethers.utils.formatUnits(preLog.args.amount, "ether"),
            date: moment.unix(preLog.args.date.toString()).format("YYYY-MM-DD HH:mm:ss")
            };
        });

    const failedRequests = prePayments.filter(preLog => 
    {
        const preTransactionNo = preLog.args.transactionNo.toString();
        return !postPayments.some(postLog =>
            postLog.args.transactionNo.toString() === preTransactionNo
        );
    }).map(preLog => 
        {
            return {
            transactionNo: preLog.args.transactionNo.toString(),
            sender: preLog.args.sender,
            receiver: preLog.args.receiver,
            token: preLog.args.token,
            amount: ethers.utils.formatUnits(preLog.args.amount, "ether"),
            date: moment.unix(preLog.args.date.toString()).format("YYYY-MM-DD HH:mm:ss")
            };
        });

    return [successfulRequests, failedRequests];
}

getEscrowdata = async (deployPhoneContract, address, hashVal) => 
{
  let response = {};
  response.sentEscrow = await getSentEscrowRequestsData(deployPhoneContract, address);
  response.receivedEscrow = await getReceivedEscrowRequestsData(deployPhoneContract, hashVal);
  return response;
}

module.exports = getEscrowdata;