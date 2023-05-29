import React, { useState, useEffect, Component } from "react";
import { ConnectWallet, useSigner } from "@thirdweb-dev/react";
import NeumorphicContainer from "../NeumorphicContainer/neumorphicContainer";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import "./login.css"

const Login = () => {
  const address = useSigner();
  const dispatch = useDispatch();
  const signer = useSelector((state) => state.signer.signer);

  const handleClick = () => {
    console.log("handle click");
    dispatch({ type: "UPDATE_SIGNER", payload: address });
  };

  console.log("updated signer..", signer);

  return (
    <div>
      <NeumorphicContainer
        element={
          <ConnectWallet onClick={handleClick()} theme="dark" className="connect-wallet">
            Connect!
          </ConnectWallet>
        }
      />
      {address ? <h5>Signer: {address._address}</h5> : <span>Not working</span>}
    </div>
  );
};

export default Login;
