import React, { Component } from "react";
import { Button, Checkbox, Dropdown, Form, Segment, Modal } from "semantic-ui-react";
import { connect } from "react-redux";
import axios from "axios";
import {ethers} from 'ethers';
const phoneAbi = require('../../abis/phone.json');
const erc20Abi = require('../../abis/erc20.json');
const deployedPhoneContractOnTestchain = "0x6E14169F228a8262265D8B97F0C45ba887Df34bf";

export class PaymentForm extends Component {
  constructor() {
    super();
    this.state = {
      dropdownList: [
        { key: "Ethereum", text: "Ethereum", value: "5" },
        { key: "Polygon", text: "Polygon", value: "80001" },
      ],
      selectedChain: "",
      assetModalOpen: false,
    selectedAsset: { displayName: "", value: "" }
    };
  }
  /*state = {
    dropdownList: [
      { key: "Ethereum", text: "Ethereum" },
      { key: "Polygon", text: "Polygon" },
    ],
  };*/

  componentDidUpdate(prevProps,nextProps){
    console.log("Prevprops",prevProps,nextProps)
    if(prevProps.type!=nextProps.type){
      console.log("nextProps",nextProps)
    }
  }

   approveAllowanceCall = async (tokenContract, phoneContract, tokens) => {
    try {
      const tx = await tokenContract.approve(phoneContract.address, tokens);
      await tx.wait();
      console.log("Allowance approved");
    } catch (error) {
      console.error("Error approving allowance:", error);
    }
  }

  transferTokensCall =  async (phoneContract, recipient, tokenContractAddress, tokens) => {
    try {
      const gasPrice = ethers.utils.parseUnits("5", "gwei");
      const gasLimit = 500000;
      const tx = await phoneContract.transferTokens(recipient, tokenContractAddress, tokens, {
        gasPrice: gasPrice,
        gasLimit: gasLimit,
      });
      await tx.wait();
      console.log("Transaction sent:", tx.hash);
    } catch (error) {
      console.error("Error transferring tokens:", error);
    }
  }

  requestPaymentCall =  async (msgSender, recipient, tokenContractAddress, tokens, phoneContract) => {
    try {
      const tx = await phoneContract.requestPayment(msgSender, recipient, tokenContractAddress, tokens);
      await tx.wait();
      console.log("Transaction sent:", tx.hash);
    } catch (error) {
      console.error("Error transferring tokens:", error);
    }
  }


 requestPayment = async () => 
  {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(accounts[0]);

    const phoneContract = new ethers.Contract(deployedPhoneContractOnTestchain, phoneAbi, signer);
    const tokenContract = new ethers.Contract('0x254d06f33bDc5b8ee05b2ea472107E300226659A', erc20Abi, signer);    

    //const tokens = ethers.utils.parseUnits(amount, 6);
    //await this.requestPayment(signer.getAddress(), '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', tokenContract.address, tokens, phoneContract);
    //await deployPhoneContract.connect(owner).fullFillRequestPayment(1, 1);
  }

  processBridgeSentTransaction = async (to, amount, selectedChain, currentChain, selectedTokenAddress) => 
  {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(accounts[0]);

    const phoneContract = new ethers.Contract(deployedPhoneContractOnTestchain, phoneAbi, signer);
    const tokenContract = new ethers.Contract('0x254d06f33bDc5b8ee05b2ea472107E300226659A', erc20Abi, signer);

    const gasPrice = ethers.utils.parseUnits("8", "gwei");
    const gasLimit = 5000000;
    const tokens = ethers.utils.parseUnits(amount, 6);
    await this.approveAllowanceCall(tokenContract, phoneContract, tokens);
    const etherAmount = ethers.utils.parseEther("0.01");
    let txn = await phoneContract.handleCrossChainTransfer(to, "aUSDT", tokens, selectedChain, {
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      value: etherAmount
    });
    const receipt = await txn.wait();
    console.log(receipt);
  }


    
    //OWNER CALL:
    /*
      const adminPrivateKey = process.env.REACT_APP_PRIVATE_KEY;
      const adminWallet = new ethers.Wallet(adminPrivateKey, provider);
      const adminCallPhoneContract = new ethers.Contract('0xBBA13a375b2E9a4d79ed8A8f0FB2313A335B463c', phoneAbi, adminWallet);
      

      const tx = await adminCallPhoneContract.
      */
      // Wait for the transaction to be mined
     // const receipt = await tx.wait();
    

  initiateTransaction = async (event, currentTransactionType) =>
  {
    event.preventDefault(); 
    console.log("currentTransactionType:      =",currentTransactionType)
  
    const mobileNumber = event.target.elements.mobileNumber.value;
    const amount = event.target.elements.amount.value;
    const selectedChain = this.state.selectedChain;
    const selectedAsset = this.state.selectedAsset.value;

    console.log(mobileNumber);
    console.log(amount);
    console.log(selectedChain);
    console.log(selectedAsset);

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(accounts[0]);

    const phoneContract = new ethers.Contract(deployedPhoneContractOnTestchain, phoneAbi, signer);
    const tokenContract = new ethers.Contract('0x254d06f33bDc5b8ee05b2ea472107E300226659A', erc20Abi, signer);

    const tokens = ethers.utils.parseUnits(amount, 6);

    const network = await provider.getNetwork();
    const chainId = network.chainId;

    if(currentTransactionType == "sent")
    {
      if(chainId != selectedChain)
      {
        this.processBridgeSentTransaction("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", amount, selectedChain, chainId, selectedAsset);
      }
      else
      {
        //console.log(ethers.utils.formatUnits(await tokenContract.allowance(await signer.getAddress(), '0xBBA13a375b2E9a4d79ed8A8f0FB2313A335B463c'), 6));
        await this.approveAllowanceCall(tokenContract, phoneContract, tokens);
        await this.transferTokensCall(phoneContract, '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', tokenContract.address, tokens)
      }
    }
    


    /*let receipentPublicAddr = await axios.get(
      "http://localhost:3000/api/transactions/%2B919176029670"
    );*/

    
  }
  
  handleDropdownChange = (event, { value }) => {
    this.setState({ selectedChain: value });
  };

  openAssetModal = () => {
    this.setState({ assetModalOpen: true });
  };
  
  closeAssetModal = () => {
    this.setState({ assetModalOpen: false });
  };
  
  handleAssetSelect = (displayName, value) => {
    this.setState({ selectedAsset: { displayName, value } });
    this.closeAssetModal();
  };

  render() {
    const currentTransactionType = new URL(window.location.href).pathname.split('/').pop();
    const modalStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50%",
      left: "20%",
      top: "20%"
    };
    return (
      <div>
        <Segment style={{ margin: "50px" }}>
          <Form onSubmit={(event) => this.initiateTransaction(event, currentTransactionType)}>
            <Form.Field>
              <label>Mobile Number</label>
              <input name="mobileNumber" placeholder="Mobile Number" />
            </Form.Field>
            
            <Form.Field>
            <label>Asset Name</label>
            <Modal
              onClose={this.closeAssetModal}
              open={this.state.assetModalOpen}
              trigger={<Button onClick={this.openAssetModal}>Choose</Button>}
              style={modalStyle}>
              <Modal.Header>Select an Asset</Modal.Header>
              <Modal.Content>
                <Button onClick={() => this.handleAssetSelect("aUSDC", "0x254d06f33bDc5b8ee05b2ea472107E300226659A")}>
                  aUSDC
                </Button>
              </Modal.Content>
            </Modal>
            {this.state.selectedAsset.displayName && (
              <div style={{ color: "black" }}>Selected asset: {this.state.selectedAsset.displayName}</div>
            )}
            </Form.Field>

            <Form.Field>
              <label>Amount</label>
              <input name="amount" placeholder="Amount" />
            </Form.Field>
            <Form.Field>
              <label>Select Chain</label>
              <Dropdown
                name="selectedChain"
                placeholder="Select Chain"
                fluid
                selection
                value={this.state.selectedChain}
                options={this.state.dropdownList}
                onChange={this.handleDropdownChange}
              />
            </Form.Field>
            <Button type="submit">Submit</Button>
          </Form>
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    signer: state.signer,
  };
};

export default connect(mapStateToProps)(PaymentForm);
