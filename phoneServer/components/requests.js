const { ethers } = require('ethers');
const moment = require("moment");

getSentRequestsData = async (deployPhoneContract, account2) => 
{
    const filterpRE = deployPhoneContract.filters.requestPaymentEve(null, account2, null, null, null, null);
    const prePayments = await deployPhoneContract.queryFilter(filterpRE);

    const filterpOST = deployPhoneContract.filters.fullfillRequestPaymentEve(null, account2, null, null, null);
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
            requestedBy: preLog.args.requestedBy,
            requestedFrom: preLog.args.requestedFrom,
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
            requestedBy: preLog.args.requestedBy,
            requestedFrom: preLog.args.requestedFrom,
            token: preLog.args.token,
            amount: ethers.utils.formatUnits(preLog.args.amount, "ether"),
            date: moment.unix(preLog.args.date.toString()).format("YYYY-MM-DD HH:mm:ss")
          };
        });

    return [successfulRequests, failedRequests];
}

getReceiveRequestsData = async (deployPhoneContract, owner) => 
{
    const filterpRE = deployPhoneContract.filters.requestPaymentEve(null, null, owner, null, null, null);
    const prePayments = await deployPhoneContract.queryFilter(filterpRE);

    const filterpOST = deployPhoneContract.filters.fullfillRequestPaymentEve(null, null, owner, null, null);
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
            requestedBy: preLog.args.requestedBy,
            requestedFrom: preLog.args.requestedFrom,
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
            requestedBy: preLog.args.requestedBy,
            requestedFrom: preLog.args.requestedFrom,
            token: preLog.args.token,
            amount: ethers.utils.formatUnits(preLog.args.amount, "ether"),
            date: moment.unix(preLog.args.date.toString()).format("YYYY-MM-DD HH:mm:ss")
          };
        });

    return [successfulRequests, failedRequests];
}


getRequestsdata = async (deployPhoneContract, address) => 
{
  const sentRequests = await getSentRequestsData(deployPhoneContract, address);
  const receivedRequests = await getReceiveRequestsData(deployPhoneContract, address);
  let response = {};
  response.sentRequests = sentRequests[0];
  response.receivedRequests = receivedRequests[0]
  return response;
}

module.exports = getRequestsdata;