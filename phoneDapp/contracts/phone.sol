//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import { AxelarExecutable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol';
import { IAxelarGateway } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol';
import { IAxelarGasService } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';
/* 
1. NEED TO CHECK THE USAGES OF MSG.SENDER AND SENDER(PARAMETER)
2. Also, use specific uint's
 */
contract PhoneTransfer is Ownable, AxelarExecutable 
{
    using Counters for Counters.Counter;
    struct Payment
    {
        address sender;
        address receiver;
        IERC20 token;     
        uint amount;
        uint Unique_ID;
        uint date;
    }

    struct EscrowPayment
    {
        address sender;
        bytes32 unregisteredReceiver;
        address receiver;
        IERC20 token;     
        uint amount;
        uint Unique_ID;
        uint date;
    }

    enum Action
    {
        CANCEL,
        ACCEPT,
        REJECT,
        CLAIM
    }

    event prePaymentEve
    (
        uint transactionNo, 
        address indexed sender, 
        address indexed receiver, 
        IERC20 token, 
        uint amount,
        bool indexed isCrosschain,
        uint date
    );

    event postPaymentEve
    (
        uint transactionNo,
        address indexed sender,
        address indexed receiver,
        IERC20 token,
        uint amount,
        bool indexed isCrossChain,
        uint date
    );

    event requestPaymentEve
    (
        uint transactionNo,
        address indexed requestedBy,
        address indexed requestedFrom,
        IERC20 token,
        uint amount,
        uint date
    );

    event fullfillRequestPaymentEve
    (
        uint transactionNo,
        address indexed requestedBy,
        address indexed requestedFrom,
        uint status,
        uint date
    );

    event escrowPaymentEve
    (
        uint transactionNo,
        address indexed sender,
        bytes32 indexed receiver,
        IERC20 token,
        uint amount,
        uint date
    );

    event fullfillEscrowPaymentEve
    (
        uint transactionNo,
        address indexed sender,
        bytes32 indexed receiver,
        uint status,
        uint date
    );

    Counters.Counter uniqueTransactionNo;
    mapping(uint => Payment) requestedPayments;
    mapping(uint => EscrowPayment) unregisteredEscrowPayments;
    mapping(address => mapping(address => uint)) escrowedBalances;
    IAxelarGasService public immutable gasService;
    mapping(uint => string) multiChainContractAddress;
    mapping(uint => string) chainIDResolver;

    constructor(address gateway_, address gasReceiver_) AxelarExecutable(gateway_) 
    {
        gasService = IAxelarGasService(gasReceiver_);
    }

    function updateMultiChainContractAddress(uint chainID, string memory contractAddress) public onlyOwner
    {
        multiChainContractAddress[chainID] = contractAddress;
    }

    function updateMultiChainNamesResolver(uint chainID, string memory chainName) public onlyOwner
    {
        chainIDResolver[chainID] = chainName;
    }

    function transferTokens(address to, address tokenAddr, uint256 amount) public 
    {
        Payment memory directTransfer = Payment(msg.sender, to, IERC20(tokenAddr), amount, uniqueTransactionNo.current(), block.timestamp);
        uniqueTransactionNo.increment();
        emit prePaymentEve
        (
            directTransfer.Unique_ID, 
            directTransfer.sender, 
            directTransfer.receiver, 
            directTransfer.token, 
            directTransfer.amount,
            false,
            block.timestamp
        );
        require(IERC20(tokenAddr).allowance(msg.sender, address(this)) >= amount, "TokenTransfer: Not enough allowance");
        IERC20(tokenAddr).transferFrom(msg.sender, to, amount);
        emit postPaymentEve
        (
            directTransfer.Unique_ID,
            directTransfer.sender,
            directTransfer.receiver,
            directTransfer.token,
            directTransfer.amount,
            false,
            block.timestamp
        );
    }
    // You have to handle the approval(offchain) and transfer of tokens from "msg.sender" to this contract
    function handleCrossChainTransfer(address to, string memory symbol, uint256 amount, uint destinationChainID) public payable
    {
        address tokenAddress = gateway.tokenAddresses(symbol);
        Payment memory directTransfer = Payment(msg.sender, to, IERC20(tokenAddress), amount, uniqueTransactionNo.current(), block.timestamp);
        uniqueTransactionNo.increment();
        IERC20(tokenAddress).transferFrom(msg.sender, to, amount);
        IERC20(tokenAddress).approve(address(gateway), amount);
        bytes memory payload = abi.encode(msg.sender, to, directTransfer.Unique_ID);
        string memory destinationChain = chainIDResolver[destinationChainID];
        string memory contractAddress = multiChainContractAddress[destinationChainID];
        if (msg.value > 0) 
        {
            gasService.payNativeGasForContractCallWithToken{ value: msg.value }
            (
                address(this),
                destinationChain,
                contractAddress,
                payload,
                symbol,
                amount,
                msg.sender
            );
        }
        gateway.callContractWithToken(destinationChain, contractAddress, payload, symbol, amount);

        emit prePaymentEve
        (
            directTransfer.Unique_ID, 
            directTransfer.sender, 
            directTransfer.receiver, 
            directTransfer.token, 
            directTransfer.amount,
            true,
            block.timestamp
        );
    }

    function _executeWithToken(
        string calldata,
        string calldata,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    ) internal override {
        (address to, address from, uint256 transactioNo) = abi.decode(payload, (address, address, uint));
        address tokenAddress = gateway.tokenAddresses(tokenSymbol);
        receiveCrossChainTokens(tokenAddress, to, from, transactioNo, amount);
    }

    function receiveCrossChainTokens(address tokenAddress, address to, address from, uint transactionNo, uint amount) internal 
    {
        IERC20(tokenAddress).transfer(to, amount);

        emit postPaymentEve
        (
            transactionNo,
            from,
            to,
            IERC20(tokenAddress),
            amount,
            true,
            block.timestamp
        );
    }

    function requestPayment(address requestedFrom, address requestedBy, address tokenAddr, uint amount) public 
    {
        Payment memory directTransfer = Payment(requestedFrom, requestedBy, IERC20(tokenAddr), amount, uniqueTransactionNo.current(), block.timestamp);
        uniqueTransactionNo.increment();
        requestedPayments[directTransfer.Unique_ID] = directTransfer;
        emit requestPaymentEve
        (
            directTransfer.Unique_ID,
            requestedBy,
            requestedFrom,
            directTransfer.token, 
            amount, 
            block.timestamp
        );
    }

    /* TOKEN APPROVAL SHOULD BE HANDLED IN THE FRONT END BY TAKING THE DATA FROM LOGS */
    //SENDER REPRESENTS THE ONE WHO IS REQUESTED FROM
    //RECEIVER IS A ENTITY WHO INITIATED THE REQUEST
    function fullFillRequestPayment(uint transactionNo, uint status) public
    {
        Payment storage pendingPayment = requestedPayments[transactionNo];
        require(msg.sender == pendingPayment.sender || msg.sender == pendingPayment.receiver, "Unauthorized.");
        require
        (
            status <= uint(Action.REJECT) &&
            ((msg.sender == pendingPayment.sender && status >= uint(Action.ACCEPT)) ||
            (msg.sender == pendingPayment.receiver && status == uint(Action.CANCEL))) , "Invalid Status selected."
        );

        if(status == 1)
        {
            require((pendingPayment.token).allowance(pendingPayment.sender, address(this)) >= pendingPayment.amount, "TokenTransfer: Not enough allowance");
            pendingPayment.token.transferFrom(pendingPayment.sender, pendingPayment.receiver, pendingPayment.amount);
        }
        emit fullfillRequestPaymentEve
        (
            pendingPayment.Unique_ID,
            pendingPayment.receiver,
            pendingPayment.sender,
            status,
            block.timestamp
        );
        delete requestedPayments[transactionNo];
    }

    //unregisteredReceiver should be hash of (encrypted phone string)
    function sendEcrowPayment(bytes32 unregisteredReceiver, address token, uint amount) public
    {
        require(IERC20(token).allowance(msg.sender, address(this)) >= amount, "TokenTransfer: Not enough allowance");
        EscrowPayment memory payment = EscrowPayment(msg.sender, unregisteredReceiver, address(0), IERC20(token), amount, uniqueTransactionNo.current(), block.timestamp);
        uniqueTransactionNo.increment();
        unregisteredEscrowPayments[payment.Unique_ID] = payment;
        payment.token.transferFrom(msg.sender, address(this), amount);
        escrowedBalances[token][msg.sender] += amount;
        emit escrowPaymentEve(payment.Unique_ID, payment.sender, payment.unregisteredReceiver, payment.token, payment.amount, block.timestamp);
    }

    //NEED TO CHECK WHAT HAPPENS WHEN THE DELETED TRANSACTIONNO IS PASSED HERE
    function fullFillEscrowPayment(uint transactionNo, Action status) public
    {
        EscrowPayment memory payment = unregisteredEscrowPayments[transactionNo];
        require
        (
            ((payment.sender == msg.sender || (payment.receiver == msg.sender || payment.receiver == address(0)))
            && ((payment.sender == msg.sender && status == Action.CANCEL)
            || (payment.receiver == msg.sender && status == Action.CLAIM))), "Unauthorized"
        );
        require(escrowedBalances[address(payment.token)][msg.sender] >= payment.amount, "Insufficient balance");
        require(status == Action.CLAIM || status == Action.CANCEL, "Invalid status requested");

        escrowedBalances[address(payment.token)][msg.sender] -= payment.amount;
        payment.token.transfer(msg.sender, payment.amount);
        delete unregisteredEscrowPayments[transactionNo];
        emit fullfillEscrowPaymentEve(transactionNo, payment.sender, payment.unregisteredReceiver, uint(status), block.timestamp);
    }

    function resolvePhonetoPublicAddress(uint transactionNo, string memory unregisteredReceiver, address updatePubKeyOfUnregisteredReceiver) public onlyOwner
    {
        EscrowPayment storage payment = unregisteredEscrowPayments[transactionNo];
        bytes32 unregisteredReceiverHash = keccak256(abi.encodePacked(unregisteredReceiver));

        require(unregisteredReceiverHash == payment.unregisteredReceiver, "Receiver doesn't match");
        require(escrowedBalances[address(payment.token)][payment.sender] >= payment.amount, "Not enough balance in the sender account");

        payment.receiver = updatePubKeyOfUnregisteredReceiver;
        escrowedBalances[address(payment.token)][payment.sender] -= payment.amount;
        escrowedBalances[address(payment.token)][updatePubKeyOfUnregisteredReceiver] += payment.amount;
    }
}