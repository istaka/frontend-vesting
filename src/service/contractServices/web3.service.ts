/** @format */

import Web3 from "web3";
// import { ethers } from "ethers";

import {
  CallWithERC2771Request,
  GelatoRelay,
  SponsoredCallRequest,
} from "@gelatonetwork/relay-sdk";
import { ethers as ethersV6 } from "ethers-v6";
import {
  BICONOMY_API_KEY,
  POLYGON_URL,
  PAZZA_ADDRESS,
  TRADE_ADDRESS,
  USDC_ADDRESS,
  LOAN_NFT_ADDRESS,
  CHAIN_ID,
  POOL_OF_LOANS_ADDRESS,
  TOKENIZATION_CONTROLLER,
  COUNTRY_RESTRICT_COMPLIANCE,
  BOND_ISSUANCE,
  BONDINGCURVE_ADDRESS,
  GELATO_RELAY_API_KEY,
} from "../../Constants";
import TradeAbi from "../../../src/Assets/abi/Trade.json";
import UsdtAbi from "../../../src/Assets/abi/USDT.json";
// import bondIssuanceAbi from "../../../src/assets/abi/BondIssuance.json";
// import bondIssuanceAbi from "../../../src/Assets/abi/BondIssuance.json";
import loanNftAbi from "../../Assets/abi/LoanNFT.json";
// import loanNftAbi from "../../assets/abi/LoanNFT.json";
import poolOfLoansAbi from "../../Assets/abi/PoolOfLoans.json";
import tokenizationControllerAbi from "../../Assets/abi/TokenizationController.json";
import tokenAbi from "../../Assets/abi/tokenAbi.json";

// import bondingCurve from "../../assets/abi/BondingCurve.json";
// import PazaAbi from "../../../src/assets/abi/Paza.json";

import bondingCurve from "../../Assets/abi/bondingCurve.json";
import PazaAbi from "../../Assets/abi/Paza.json";

// import countryRestrictModuleAbi from "../../assets/abi/CountryRestrictModule.json";
// @ts-ignore
import { toBuffer } from "ethereumjs-util";
import { getValue } from "@testing-library/user-event/dist/utils";
import { error } from "console";
import { BigNumber, Signer } from "ethers";
import ColumnGroup from "antd/lib/table/ColumnGroup";
import axios from "axios";
import { signPermit, signTransferAuthorization } from "./helpers";
// const { Biconomy } = require("@biconomy/mexa");
const sigUtil = require("eth-sig-util");
let abi = require("ethereumjs-abi");
const { keccak256, arrayify } = require("ethers-utils");
const { ethers } = require("ethers");
const defaultAbiCoder = ethers.utils.defaultAbiCoder;

class Web3Service {
  providerUrl: any = POLYGON_URL;
  biconomyApiKey: any = BICONOMY_API_KEY;
  GELATO_RELAY_API_KEY: any = GELATO_RELAY_API_KEY;
  web3: any = Web3;
  newWeb3: any = Web3;
  provider: any = {};
  chainId: any = {};
  gelatoRelay: any = {};
  contract: any = {};
  contractTrade: any = {};
  usdtContract: any = {};
  newUsdtContract: any = {};
  bondIssuanceContract: any = {};
  loanNftContract: any = {};
  biconomy: any = {};
  relay: any = {};
  pazzaAddress: any = PAZZA_ADDRESS;
  usdcAddress: any = USDC_ADDRESS;
  contractBiconomy: any;
  poolOfLoansNFT: any = {};
  tokenizationController: any = {};
  token: any = {};
  countryRestrictModule: any = {};
  poolOfLoansNFTlock: any = {};
  bondingCurve: any = {};
  transferTAData: any = {};
  contractPaza: any = {};
  contractBondingCurve: any = {};
  contractUsdc: any = {};
  private initializationPromise: Promise<void>;

  // constructor() {
  //   this.initializationPromise = this.connectBiconomy();
  // }
  constructor() {
    this.initializationPromise = this.connectBiconomy();
    this.provider = new Web3(Web3.givenProvider || this.providerUrl);
    this.web3 = new Web3(this.provider);
    this.contractPaza = new this.web3.eth.Contract(PazaAbi.abi, PAZZA_ADDRESS);
    // this.contractBondingCurve = new this.web3.eth.Contract(
    //   bondingCurve,
    //   BONDINGCURVE_ADDRESS
    // );
    // this.transferTAData = new this.web3.eth.Contract(tokenAbi, contractAddress);
  }

  async requestAccount() {
    if (!window.ethereum) throw new Error("MetaMask is not installed");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  }
  /**
   * function call in constructor to initialise contract instances
   */
  connectBiconomy = async () => {
    try {
      this.provider = new ethersV6.JsonRpcProvider(this.providerUrl) as any;
      this.chainId = (await this.provider.getNetwork()).chainId;
      this.gelatoRelay = new GelatoRelay();

      const provider = new Web3.providers.HttpProvider(this.providerUrl) as any;

      // this.biconomy = new Biconomy(provider, {
      //   walletProvider: provider,
      //   apiKey: this.biconomyApiKey,ethersV6
      //   debug: false,
      //   strictMode: false,
      // }) as any;
      this.web3 = new Web3(provider);
      this.newWeb3 = new Web3(provider);
      this.contract = new this.web3.eth.Contract(PazaAbi.abi, PAZZA_ADDRESS);
      this.usdtContract = new this.web3.eth.Contract(UsdtAbi.abi, USDC_ADDRESS);
      this.bondingCurve = new this.web3.eth.Contract(
        bondingCurve,
        BONDINGCURVE_ADDRESS
      );

      // this.contractTrade = new this.web3.eth.Contract(
      //   TradeAbi.abi,
      //   TRADE_ADDRESS
      // );
      this.newUsdtContract = new this.newWeb3.eth.Contract(
        UsdtAbi.abi,
        USDC_ADDRESS
      );

      // this.bondIssuanceContract = new this.newWeb3.eth.Contract(
      //   bondIssuanceAbi,
      //   BOND_ISSUANCE
      // );
      // this.loanNftContract = new this.web3.eth.Contract(
      //   loanNftAbi,
      //   LOAN_NFT_ADDRESS
      // );
      // this.poolOfLoansNFT = new this.web3.eth.Contract(
      //   poolOfLoansAbi,
      //   POOL_OF_LOANS_ADDRESS
      // );
      // this.tokenizationController = new this.web3.eth.Contract(
      //   tokenizationControllerAbi,
      //   TOKENIZATION_CONTROLLER
      // );
      // this.countryRestrictModule = new this.web3.eth.Contract(
      //   countryRestrictModuleAbi,
      //   COUNTRY_RESTRICT_COMPLIANCE
      // );

      this.isBiconomyConnected();
    } catch (error) {
      console.error(error, "err");
    }
  };

  /**
   * function to listen to event of biconomy connection status
   * @returns status if biconomy is connected or not
   */

  async isBiconomyConnected() {
    return `connected! Gelato!`;
  }

  /**
   * generate r,s,v ECDSA params for verifying signature
   * @param signature 65 bytes signature of the user
   * @returns r,s,v ECDSA params
   */
  getSignatureParameters = async (signature: any): Promise<any> => {
    if (!this.web3.utils.isHexStrict(signature)) {
      throw new Error(
        'Given value "'.concat(signature, '" is not a valid hex string.')
      );
    }
    var r: any = signature.slice(0, 66);
    var s: any = "0x".concat(signature.slice(66, 130));
    var v: any = "0x".concat(signature.slice(130, 132));
    v = await this.web3.utils.hexToNumber(v);

    if (![27, 28].includes(v)) v += 27;
    return {
      r: r,
      s: s,
      v: v,
    };
  };

  /**
   *function to make a hash for meta transaction process
   * @param nonce random unique number
   * @param chainId chainId of the blockchain network
   * @param functionSignature 65 bytes signature
   * @param contractAddress address of the contract
   * @returns message hash
   */

  constructMetaTransactionMessage = (
    nonce: any,
    chainId: any,
    functionSignature: any,
    contractAddress: any
  ) => {
    return abi.soliditySHA3(
      ["uint256", "address", "uint256", "bytes"],
      [nonce, contractAddress, chainId, toBuffer(functionSignature)]
    );
  };

  /**
   *function to transfer PAZA token
   * @param walletData walletInformation of the user containing address and private key
   * @param toAddress address to which PAZA is to be transferred
   * @param amount amount of PAZA token to transfer
   * @returns hash of the transaction
   */

  transferAmountPAZA = async (
    walletData: any,
    toAddress: string,
    amount: any
  ) => {
    try {
      // await this.initializationPromise; // Ensure connectBiconomy is completed
      //   // let sig = await this.contract.methods
      //   //   .transfer(toAddress, amount)
      //   //   .encodeABI();
      //   const signer: any = new ethersV6.Wallet(walletData.privateKey, this.provider);
      //   const contract = new ethersV6.Contract(PAZZA_ADDRESS, PazaAbi.abi, signer);
      //   const { data } = await contract.transfer.populateTransaction(toAddress, amount);
      //   let obj = {
      //     signer, addr: PAZZA_ADDRESS
      //   }
      //   const getvalue = await this.biconomyMethodForSell(walletData, data, obj);
      //   return getvalue;
      const fromAddress = await this.requestAccount();
      const tx = this.contractPaza.methods.transfer(toAddress, amount);
      const gas = await tx.estimateGas({ from: fromAddress });
      const gasPrice = await this.web3.eth.getGasPrice();

      const txData = {
        from: fromAddress,
        to: PAZZA_ADDRESS,
        data: tx.encodeABI(),
        gas,
        gasPrice,
      };

      return await this.web3.eth.sendTransaction(txData);
    } catch (err: any) {
      throw err;
    }
  };

  /**
   *function to transfer USDC token
   * @param walletData walletInformation of the user containing address and private key
   * @param toAddress address to which USDC is to be transferred
   * @param amount amount of USDC token to transfer
   * @returns hash of the transaction
   */
  transferAmountUSDC = async (
    walletData: any,
    toAddress: string,
    amount: any
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // let sig = await this.usdtContract.methods
      //   .transfer(toAddress, amount)
      //   .encodeABI();

      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const usdc_Contract = new ethersV6.Contract(
        USDC_ADDRESS,
        UsdtAbi.abi,
        signer
      );

      let validAfter: number = Math.floor((Date.now() - 5 * 60 * 1000) / 1000);
      let validBefore: number = Math.floor((Date.now() + 5 * 60 * 1000) / 1000);

      let nonce = ethers.utils.randomBytes(32);
      let signature1 = signTransferAuthorization(
        walletData.address,
        toAddress,
        amount,
        validAfter,
        validBefore,
        nonce,
        await usdc_Contract.DOMAIN_SEPARATOR(), // call usdc contract
        walletData.privateKey
      );

      const { data } =
        await usdc_Contract.transferWithAuthorization.populateTransaction(
          walletData.address,
          toAddress,
          amount,
          validAfter,
          validBefore,
          nonce,
          signature1.v,
          signature1.r,
          signature1.s
        );

      let obj = {
        addr: USDC_ADDRESS,
        signer,
      };

      const getvalue = await this.biconomyUsdtMethod(walletData, data, obj);
      return getvalue;
    } catch (err: any) {
      throw err;
    }
  };

  /**
   * function to give approval to different address
   * @param ownerAddress address which is the owner of that asset
   * @param spenderAddress address to which approval has to be given
   * @returns transaction success object
   */
  approvalForAll = async (ownerAddress: any, spenderAddress: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    return new Promise((r, j) => {
      this?.loanNftContract?.methods
        ?.isApprovedForAll(ownerAddress, spenderAddress)
        .call()
        .then(async (approved: any) => {
          r(approved);
        })
        .catch((err: any) => {
          console.error("### ERROR:", err);
          j("rejected");
        });
    });
  };

  /**
   *function to give approval to all nfts
   * @param walletData walletInformation of the user containing address and private key
   * @param factoryAdd factory address
   * @param bool boolean value to give approval or not
   * @returns transaction hash
   */
  approvalForAllDone = async (
    walletData: any,
    factoryAdd: string,
    bool: boolean
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // let sig = await this.loanNftContract.methods
      //   .setApprovalForAll(factoryAdd, bool)
      //   .encodeABI();
      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        LOAN_NFT_ADDRESS,
        loanNftAbi,
        signer
      );
      const { data } = await contract.setApprovalForAll.populateTransaction(
        factoryAdd,
        bool
      );
      let obj = {
        addr: LOAN_NFT_ADDRESS,
        signer,
      };
      const getvalue = await this.biconomyLoanNftMethod(walletData, data, obj);
      return getvalue;
    } catch (err: any) {
      throw err;
    }
  };

  /**
   * function to give batchApproval of NFTs
   * @param walletData walletInformation of the user containing address and private key
   * @param loan_id loan_id's of the nft to be approved
   * @returns transaction hash
   */
  batchApproval = async (walletData: any, loan_id: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        LOAN_NFT_ADDRESS,
        loanNftAbi,
        signer
      );
      const { data } = await contract.batchApproval.populateTransaction(
        loan_id
      );
      let obj = {
        addr: LOAN_NFT_ADDRESS,
        signer,
      };
      const getvalue = await this.biconomyLoanNftMethod(walletData, data, obj);
      return getvalue;
    } catch (err: any) {
      console.log("err", err);
      throw err;
    }
  };

  poolBatchApproval = async (walletData: any, tokenIds: any, batchId: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // let sig = await this.loanNftContract.methods
      //   .poolBatchApproval(tokenIds, batchId)
      //   .encodeABI();
      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        LOAN_NFT_ADDRESS,
        loanNftAbi,
        signer
      );
      const { data } = await contract.poolBatchApproval.populateTransaction(
        tokenIds,
        batchId
      );
      let obj = {
        addr: LOAN_NFT_ADDRESS,
        signer,
      };
      const getvalue = await this.biconomyLoanNftMethod(walletData, data, obj);
      return getvalue;
    } catch (err: any) {
      console.log("err", err);
      throw err;
    }
  };

  deploySmartContract = async (
    walletData: any,
    poolId: any,
    tokenId: any,
    contractAddress: any
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // this.poolOfLoansNFTlock = new this.web3.eth.Contract(
      //   poolOfLoansAbi,
      //   contractAddress
      // );
      // let sig = await this.poolOfLoansNFTlock.methods
      //   .lockNFT(poolId, tokenId)
      //   .encodeABI();
      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        contractAddress,
        poolOfLoansAbi,
        signer
      );
      const { data } = await contract.lockNFT.populateTransaction(
        poolId,
        tokenId
      );
      let obj = {
        addr: contractAddress,
        signer,
      };
      const getvalue = await this.biconomyLockLoanMethod(walletData, data, obj);
      console.log("getValueInSideWeb3Service", getValue);
      return getvalue;
    } catch (err: any) {
      console.log("err", err);
      throw err;
    }
  };

  transferTA = async (
    walletData: any,
    fromAddress: any,
    toAddress: any,
    amount: any,
    contractAddress: any
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // console.log(fromAddress, toAddress, BigNumber.from(`${amount * 10 ** 18}`))
      // this.transferTAData = new this.web3.eth.Contract(
      //   tokenAbi,
      //   contractAddress
      // )
      // let sig = await this.transferTAData.methods
      //   .transferFrom(fromAddress, toAddress, BigNumber.from(`${amount * 10 ** 18}`))
      //   .encodeABI();
      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(contractAddress, tokenAbi, signer);
      const { data } = await contract.transferTAData.populateTransaction(
        fromAddress,
        toAddress,
        BigNumber.from(`${amount * 10 ** 18}`)
      );
      let obj = {
        addr: contractAddress,
        signer,
      };
      const getvalue = await this.biconomyTransferTAMethod(
        walletData,
        data,
        obj
      );
      console.log("getValueInSideWeb3Service", getValue);
      return getvalue;
    } catch (err: any) {
      console.log("err", err);
      throw err;
    }
  };

  //approval
  approval = async (amount: any, walletDetails: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    console.log("approval - amount payload", amount, "add---", walletDetails);
    try {
      const usdtbalance = await this.usdtContract.methods
        .balanceOf(walletDetails)
        .call();

      console.log("usdtbalance-->", usdtbalance);
      // return balance;
      if (usdtbalance < amount) {
        throw new Error("Insufficient balance");
      }

      const res = await this.newUsdtContract.methods
        .approve(BOND_ISSUANCE, amount)
        .send({ from: walletDetails });
      // .then((tx: any) =>{
      //   console.log('trx res',tx)
      //   return tx;
      // }).catch((err: any) =>{
      //   console.log("err in approval", err)
      // })

      console.log("getValueInSideWeb3Service", res);
      return res;
    } catch (err: any) {
      console.log("err in approval", err);
      throw err;
    }
  };

  allowance = async (walletDetails: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    console.log("allowance - ", walletDetails);
    try {
      const balance = await this.usdtContract.methods
        .allowance(walletDetails, BOND_ISSUANCE)
        .call();

      console.log("balance-->", balance);
      return balance;
    } catch (err: any) {
      console.log("err in approval", err);
      throw err;
    }
  };
  // buy
  buy = async (
    buyAmount: any,
    cusipContractAddress: any,
    uniqueId: any,
    walletDetails: any
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    console.log(
      "buy - buyAmount",
      buyAmount,
      "cusipContractAddress",
      cusipContractAddress
    );
    try {
      let res = await this.bondIssuanceContract.methods
        .buy(cusipContractAddress, buyAmount, uniqueId)
        .send({ from: walletDetails });

      console.log("getValueInSideWeb3Service", res);
      return res;
    } catch (err: any) {
      console.log("err", err);
      throw err;
    }
  };
  //

  securitizeDeploy = async (walletData: any, payload: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    console.log("tc", TOKENIZATION_CONTROLLER);
    try {
      // let sig = await this.tokenizationController.methods
      //   .batchDeployBondContracts(
      //     payload.salt,
      //     payload.tokenDetails,
      //     payload.claimDetails,
      //     payload.totalSupply,
      //     payload.transferAgent
      //   )
      //   .encodeABI();
      console.log("-----------calling securitizeDeploy--");
      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        TOKENIZATION_CONTROLLER,
        tokenizationControllerAbi,
        signer
      );
      const { data } =
        await contract.batchDeployBondContracts.populateTransaction(
          payload.salt,
          payload.tokenDetails,
          payload.claimDetails,
          payload.totalSupply,
          payload.transferAgent
        );
      let obj = {
        signer,
        addr: TOKENIZATION_CONTROLLER,
      };

      const getvalue = await this.biconomyDeployLoanMethod(
        walletData,
        data,
        obj
      );
      console.log("getValueInSideWeb3Service", getValue);
      return getvalue;
    } catch (err: any) {
      console.log("err", err);
      throw err;
    }
  };

  whitelistingUser = async (walletData: any, payload: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      console.log("whitelistingUser w3 payload", payload);
      // let sig = await this.tokenizationController.methods
      //   .batchWhitelistUserInToken(
      //     payload._token,
      //     payload._user,
      //     payload._salt,
      //     payload._countryCode
      //   )
      //   .encodeABI();
      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        TOKENIZATION_CONTROLLER,
        tokenizationControllerAbi,
        signer
      );
      const { data } =
        await contract.batchWhitelistUserInToken.populateTransaction(
          payload._token,
          payload._user,
          payload._salt,
          payload._countryCode
        );
      let obj = {
        signer,
        addr: TOKENIZATION_CONTROLLER,
      };
      const getvalue = await this.biconomyDeployLoanMethod(
        walletData,
        data,
        obj
      );
      console.log("getValueInSideWeb3Service", getValue);
      return getvalue;
    } catch (err: any) {
      console.log("err", err);
      throw err;
    }
  };

  addClaimTopics = async (walletData: any, payload: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      console.log("addClaimTopics w3", payload);
      // let sig = await this.tokenizationController.methods
      //   .batchAddClaimInIdentity(
      //     payload._topic,
      //     payload._scheme,
      //     payload._issuer,
      //     payload._signature,
      //     payload._data,
      //     payload._uri,
      //     payload._identity
      //   )
      //   .encodeABI();
      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        TOKENIZATION_CONTROLLER,
        tokenizationControllerAbi,
        signer
      );
      const { data } =
        await contract.batchAddClaimInIdentity.populateTransaction(
          payload._topic,
          payload._scheme,
          payload._issuer,
          payload._signature,
          payload._data,
          payload._uri,
          payload._identity
        );
      let obj = {
        signer,
        addr: TOKENIZATION_CONTROLLER,
      };
      const getvalue = await this.biconomyDeployLoanMethod(
        walletData,
        data,
        obj
      );
      console.log("getValueInSideWeb3Service", getValue);
      return getvalue;
    } catch (err: any) {
      console.log("err", err);
      throw err;
    }
  };

  generateSig = async (walletData: any, sig: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // console.log("inside generateSig",sig)
      // let nonce: any = await this.tokenizationController.methods
      //   .getNonce(walletData?.address)
      //   .call();

      // let messageToSign = this.constructMetaTransactionMessage(
      //   nonce,
      //   CHAIN_ID,
      //   sig,
      //   TOKENIZATION_CONTROLLER
      // );
      // const signature: any = await this.web3.eth.accounts.sign(
      //   "0x" + sig.toString("hex"),
      //   walletData?.privateKey
      // );
      // console.log("inside generateSig respose--->",signature.signature)
      // return signature.signature;

      const encodedData = defaultAbiCoder.encode(
        ["address", "uint256", "bytes"],
        sig
      );
      const messageHash = keccak256(arrayify(encodedData));
      const signature = await this.web3.eth.accounts.sign(
        messageHash,
        walletData?.privateKey
      );
      console.log("inside generateSig respose--->", signature.signature);
      return signature.signature;
    } catch (err) {
      console.log(err);
    }
  };

  mintTokens = async (walletData: any, payload: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      console.log("mintTokens");
      // let sig = await this.tokenizationController.methods
      //   .batchMintToken(payload._token, payload._toList, payload._amounts)
      //   .encodeABI();
      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        TOKENIZATION_CONTROLLER,
        tokenizationControllerAbi,
        signer
      );
      const { data } = await contract.batchMintToken.populateTransaction(
        payload._token,
        payload._toList,
        payload._amounts
      );
      let obj = {
        signer,
        addr: TOKENIZATION_CONTROLLER,
      };
      const getvalue = await this.biconomyDeployLoanMethod(
        walletData,
        data,
        obj
      );
      console.log("getValueInSideWeb3Service", getValue);
      return getvalue;
    } catch (err: any) {
      console.log("err", err);
      throw err;
    }
  };

  approvalOfTokens = async (wallet_Address: any, payload: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {

      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      // Request account access
      const provider = new ethersV6.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instance
      const contract = new ethersV6.Contract(payload._token, tokenAbi, signer);

      // Check user's token balance
      const balance = await contract.balanceOf(wallet_Address);

      // Check if balance is sufficient
      if (balance < payload._amounts) {
        throw new Error("Insufficient token balance for approval");
      }

      // Send approve transaction via MetaMask
      const tx = await contract.approve(payload._spender, payload._amounts);

      // Wait for confirmation
      const receipt = await tx.wait();

      return receipt;
    } catch (err: any) {
      console.log("err", err);
      
      return {
        error: true,
        ...err,
      };
     
    }
  };

  restrictCountryFunction = async (walletData: any, countryCode: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      let data = await this.countryRestrictModule.methods
        .batchRestrictCountries([...countryCode])
        .encodeABI();
      //   const getvalue = await this.biconomyDeployLoanMethod(walletData, data);
      //  console.log('getValueInSideWeb3Service', getValue);
      return data;
    } catch (err: any) {
      console.log("err", err);
      throw err;
    }
  };
  /**
   * function to fetch userBalance of PAZA token
   * @param userAddress address of the user
   * @returns balance of user
   */
  userBalancePazza = async (userAddress: string) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    return new Promise((r, j) => {
      this?.contract?.methods
        ?.balanceOf(userAddress)
        .call()
        .then(async (bal: any) => {
          r(bal);
        })
        // this.web3.utils.fromWei(await this.web3.utils.toBN(bal), "ether")
        .catch((err: any) => {
          console.error("### ERROR:", err);
          j("rejected");
        });
    });
  };

  /**
   * function to get decimals of PAZA token
   * @returns decimals of PAZA
   */
  getDecimalsPaza = async () => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    return new Promise((r, j) => {
      this?.contract?.methods
        ?.decimals()
        .call()
        .then(async (decimals: any) => {
          r(decimals);
          // await this.web3.utils.toBN(decimals)
        })
        .catch((err: any) => {
          console.error("### ERROR:getDecimalsPaza", err);

          j("rejected");
        });
    });
  };

  /**
   * function to get decimals of USDC token
   * @returns decimals of USDC
   */

  getDecimalsUsdc = async () => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    return new Promise((r, j) => {
      this?.usdtContract?.methods
        ?.decimals()
        .call()
        .then(async (decimals: any) => {
          r(decimals);
        })
        .catch((err: any) => {
          console.error("### ERROR:getDecimalsUsdc", err);
          j("rejected");
        });
    });
  };

  /**
   * function to get price of PAZA token from contract
   * @returns price of PAZA
   */
  getPazaTokenPrice = async () => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    return new Promise((r, j) => {
      this?.contractTrade?.methods
        ?.getTokenPrice()
        .call()
        .then(async (price: any) => {
          // console.log("### BAL: web3 getTokenPrice", price);
          r(price);
          //await this.web3.utils.toBN(price)
        })
        .catch((err: any) => {
          console.error("### ERROR in get Paza Token Price :", err);
          j("rejected");
        });
    });
  };

  /**function to get max Paza token to buy
 @return number of Paza */

  getMaxPazaToken = async () => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    return new Promise((r, j) => {
      this?.bondingCurve?.methods
        ?.MAX_PAZA()
        .call()
        .then(async (tokenCount: number) => {
          // console.log("### BAL: web3 getTokenPrice", price);
          r(tokenCount);
          //await this.web3.utils.toBN(price)
        })
        .catch((err: any) => {
          console.error("### ERROR in get MAX_PAZA :", err);
          j("rejected");
        });
    });
  };

  // Get usdc pool balance
  getUsdcPoolBalance = async () => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    return new Promise((r, j) => {
      this?.bondingCurve?.methods
        ?.usdcPoolBalance()
        .call()
        .then(async (usdcPoolBalance: number) => {
          // console.log("### BAL: web3 getTokenPrice", price);
          r(usdcPoolBalance);
          //await this.web3.utils.toBN(price)
        })
        .catch((err: any) => {
          console.error("### Error is Reading  usdcPoolBalance:", err);
          j("rejected");
        });
    });
  };

  getTotalsuplyPazaToken = async () => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    return new Promise((r, j) => {
      this?.bondingCurve?.methods
        ?.totalSupply()
        .call()
        .then(async (tokenCount: number) => {
          // console.log("### BAL: web3 getTokenPrice", price);
          r(tokenCount);
          //await this.web3.utils.toBN(price)
        })
        .catch((err: any) => {
          console.error("### ERROR in get MAX_PAZA :", err);
          j("rejected");
        });
    });
  };

  /**function to get totalsupply Paza token to buy
 @return number of Paza */

  getBuyUsdcPrice = async (data: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    console.log(
      "getBuyUsdcPrice fn -- this?.bondingCurve?.methods",
      this?.bondingCurve?.methods
    );

    return new Promise((r, j) => {
      this?.bondingCurve?.methods
        ?.buyCalculateTokenAgainstUsdc(data)
        .call()
        .then(async (price: any) => {
          console.log("### BAL: web3 getUsdcPrice", price);
          r(price);
          //await this.web3.utils.toBN(price)
        })
        .catch((err: any) => {
          console.error("### ERROR in get UsdcPrice Price :", err);
          j("rejected");
        });
    });
  };

  getBuyPazaPrice = async (data: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    console.log(
      "this?.bondingCurve?.methods--buyCalculateUsdcAgainstToken",
      data
    );

    return new Promise((r, j) => {
      this?.bondingCurve?.methods
        ?.buyCalculateUsdcAgainstToken(data)
        .call()
        .then(async (price: any) => {
          console.log("### BAL: web3 getPazaPrice", price);
          r(price);
          //await this.web3.utils.toBN(price)
        })
        .catch((err: any) => {
          console.error("### ERROR in get getPazaPrice Price :", err);
          j(`rejected, ${err}`);
        });
    });
  };

  getSellUsdcPrice = async (data: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed

    return new Promise((r, j) => {
      this?.bondingCurve?.methods
        ?.sellCalculateUsdcAgainstToken(data)
        .call()
        .then(async (price: any) => {
          r(price);
          //await this.web3.utils.toBN(price)
        })
        .catch((err: any) => {
          console.error("### ERROR in get getSellUsdcPrice Price :", err);
          j(`rejected, ${err}`);
        });
    });
  };

  getSellPazaPrice = async (data: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    return new Promise((r, j) => {
      this?.bondingCurve?.methods
        ?.sellCalculateTokenAgainstUsdc(data)
        .call()
        .then(async (price: any) => {
          r(price);
          //await this.web3.utils.toBN(price)
        })
        .catch((err: any) => {
          console.error("### ERROR in get getSellPazaPrice Price :", err);
          j("rejected");
        });
    });
  };

  getBuyExactUsdc = async (
    walletData: any,
    amount: any,
    allowance_amount: any,
    slippageTolerance: number,
    deadLine: number
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      console.log("function name -- getBuyExactUsdc--------------------");
      // console.log("amount buyPazzaTokenTrade", amount);
      // let sig = await this.bondingCurve.methods
      //   .buyWithExactUsdc(amount, slippageTolerance, deadLine)
      //   .encodeABI();
      // console.log("getBuyExactUsdc_sig", sig);
      // const usdc_Contract = new ethersV6.Contract(USDC_ADDRESS, UsdtAbi.abi, walletData.privateKey);

      // const signature1 = signPermit(
      //   walletData.address,
      //   BONDINGCURVE_ADDRESS,
      //   amount,
      //   await usdc_Contract.nonces(walletData.address),
      //   deadLine,
      //   await usdc_Contract.DOMAIN_SEPARATOR(), // call usdc contract
      //   walletData.privateKey
      // );
      // console.log("signature1-------", signature1);
      console.log("%^%%%^%^%^%^%^%%^%^%^wallet**************", walletData);

      const signer2: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );

      const usdc_Contract = new ethersV6.Contract(
        USDC_ADDRESS,
        UsdtAbi.abi,
        signer2
      );

      const signature1 = signPermit(
        walletData.address,
        BONDINGCURVE_ADDRESS,
        allowance_amount,
        await usdc_Contract.nonces(walletData.address),
        deadLine,
        await usdc_Contract.DOMAIN_SEPARATOR(), // call usdc contract
        walletData.privateKey
      );

      console.log("signature1-------", signature1);
      const { v, r, s } = signature1;
      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        BONDINGCURVE_ADDRESS,
        bondingCurve,
        signer
      );

      // const { data } = await contract.buyWithExactUsdc.populateTransaction(amount, slippageTolerance, deadLine);
      const { data } =
        await contract.buyWithExactUsdcWithPermit.populateTransaction(
          amount,
          slippageTolerance,
          deadLine,
          walletData.address,
          v,
          r,
          s
        );
      let obj = {
        addr: BONDINGCURVE_ADDRESS,
        signer,
      };

      return await this.biconomyMethodforBuyExactUsdc(walletData, data, obj);
    } catch (err: any) {
      console.log("error in getBuyExactUsdc", err);
      return {
        error: true,
        ...err,
      };
    }
  };

  // sell with exact USDC

  getsellWithExactUsdc = async (
    walletData: any,
    amount: any,
    slippageTolerance: number,
    deadLine: number
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      console.log("calling getsellWithExactUsdc----->>");
      console.log(
        "walletData",
        walletData,
        amount,
        slippageTolerance,
        deadLine,
        "input parameters of getsellWithExactUsdc"
      );
      // Ensure MetaMask is available
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      // Connect MetaMask
      const provider = new ethersV6.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instance
      console.log("BONDINGCURVE_ADDRESS", BONDINGCURVE_ADDRESS);
      console.log("bondingCurve", bondingCurve);
      const contract = new ethersV6.Contract(
        BONDINGCURVE_ADDRESS,
        bondingCurve,
        signer
      );
      console.log(
        amount,
        slippageTolerance,
        deadLine,
        "input parameters of ----getsellWithExactUsdc"
      );

      // Send transaction via MetaMask
      const tx = await contract.sellWithExactUsdc(
        amount,
        slippageTolerance,
        deadLine
      );
      console.log("Transaction sent:", tx);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      return receipt;
    } catch (err: any) {
      console.log("error in getsellWithExactUsdc", err);
      return { error: true, ...err };
    }
  };

  getbuyWithExactToken = async (
    walletData: any,
    amount: any,
    allowance_amount: any,
    slippageTolerance: number,
    deadLine: number
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    console.log("this?.bondingCurve?.methods", this?.bondingCurve?.methods);
    try {
      // console.log("amount buyPazzaTokenTrade", amount);
      // let sig = await this.bondingCurve.methods
      //   .buyWithExactToken(amount, slippageTolerance, deadLine)
      //   .encodeABI();
      // console.log("getBuyWithExactToken_sig", sig);

      const signer2: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const usdc_Contract = new ethersV6.Contract(
        USDC_ADDRESS,
        UsdtAbi.abi,
        signer2
      );

      allowance_amount = slippageTolerance;

      const signature1 = signPermit(
        walletData.address,
        BONDINGCURVE_ADDRESS,
        allowance_amount, //this amount is the 2nd field amount that is not amount
        await usdc_Contract.nonces(walletData.address),
        deadLine,
        await usdc_Contract.DOMAIN_SEPARATOR(), // call usdc contract
        walletData.privateKey
      );

      console.log("signature1-------", signature1);
      const { v, r, s } = signature1;
      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        BONDINGCURVE_ADDRESS,
        bondingCurve,
        signer
      );
      const { data } =
        await contract.buyWithExactTokenWithPermit.populateTransaction(
          amount,
          allowance_amount,
          slippageTolerance,
          deadLine,
          walletData.address,
          v,
          r,
          s
        );

      let obj = {
        addr: BONDINGCURVE_ADDRESS,
        signer,
      };
      return await this.biconomyMethodforBuyExactToken(walletData, data, obj);
    } catch (err: any) {
      console.log("error in buyPazzaTokenTrade-4", err);
      return {
        error: true,
        ...err,
      };
    }
  };

  // sell with Token

  getsellWithExactToken = async (
    walletData: any,
    amount: any,
    slippageTolerance: number,
    deadLine: number
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      const provider = new ethersV6.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create contract instance
      const contract = new ethersV6.Contract(
        BONDINGCURVE_ADDRESS,
        bondingCurve,
        signer
      );

      console.log(
        amount,
        slippageTolerance,
        deadLine,
        "Input parameters of getsellWithExactUsdc"
      );

      // Ensure slippage tolerance is calculated correctly
      // slippageTolerance = (amount - (amount * slippageTolerance / 100));
      console.log(slippageTolerance, "slippage tolerance+++999999++++++++");

      // Send transaction via MetaMask
      const tx = await contract.sellWithExactToken(
        amount,
        slippageTolerance,
        deadLine
      );

      console.log("Transaction sent:", tx);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      return receipt;
    } catch (err: any) {
      console.log("error in getsellWithExactToken", err);
      return {
        error: true,
        ...err,
      };
    }
  };

  /**
   * function to fetch userBalance of USDT token
   * @param userAddress address of the user
   * @returns balance of user
   */
  userBalanceUsdt = async (userAddress: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed

    return new Promise((r, j) => {
      this?.usdtContract?.methods
        ?.balanceOf(userAddress)
        .call()
        .then(async (bal: any) => {
          r(this.web3.utils.fromWei(await this.web3.utils.toBN(bal), "mwei"));
        })
        .catch((err: any) => {
          console.error("### ERROR:", err);
          j("rejected");
        });
    });
  };

  /**
   * function to give approval of paza token to the contract
   * @param walletData walletInformation of the user containing address and private key
   * @param toAddress address to which PAZA approval USDC is to be given
   * @param amount amount of PAZA token to approve
   * @returns transaction hash
   */

  buyPazzaApproval = async (
    walletData: any,
    toAddress: string,
    amount: any
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      console.log("amount buyPazzaApproval", amount);

      let sig = await this.contractTrade.methods
        .approve(toAddress, amount)
        .encodeABI();
      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        TRADE_ADDRESS,
        TradeAbi.abi,
        signer
      );
      const { data } = await contract.approve.populateTransaction(
        toAddress,
        amount
      );
      let obj = {
        addr: TRADE_ADDRESS,
        signer,
      };

      // return await this.biconomyUsdtMethod(walletData, data, obj);
      return await this.biconomyUsdtMethod1(walletData, sig, obj);
    } catch (err: any) {
      console.log("error", err);
      return err;
    }
  };

  buyUsdcApproval = async (walletData: any, toAddress: string, amount: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      console.log(" buyUsdcApproval", amount, "toAddress", toAddress);

      let sig = await this.usdtContract.methods
        .approve(toAddress, amount)
        .encodeABI();

      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(USDC_ADDRESS, UsdtAbi.abi, signer);
      const { data } = await contract.approve.populateTransaction(
        toAddress,
        amount
      );
      let obj = {
        addr: USDC_ADDRESS,
        signer,
      };

      return await this.biconomyUsdtMethod1(walletData, sig, obj);
    } catch (err: any) {
      console.log("error", err);
      return err;
    }
  };

  // sell PazaApproval
  sellPazaApproval = async (
    walletData: any,
    toAddress: string,
    amount: any
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      console.log("amount sellUsdcApproval", amount);

      let sig = await this.contract.methods
        .approve(toAddress, amount)
        .encodeABI();

      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        PAZZA_ADDRESS,
        PazaAbi.abi,
        signer
      );
      const { data } = await contract.approve.populateTransaction(
        toAddress,
        amount
      );
      let obj = {
        addr: PAZZA_ADDRESS,
        signer,
      };

      // return await this.biconomyUsdtMethod(walletData, data, obj);
      return await this.biconomyUsdtMethod1(walletData, sig, obj);
    } catch (err: any) {
      console.log("error", err);
      return err;
    }
  };

  /**
   * function to fetch PAZA allowance of the user
   * @param ownerAddress address of the user to check allowance
   * @param spenderAddress address to which approval is given
   * @returns allowance amount
   */
  buyPazzaAllowance = async (ownerAddress: any, spenderAddress: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    return new Promise((r, j) => {
      this?.usdtContract?.methods
        ?.allowance(ownerAddress, spenderAddress)
        .call()
        .then(async (allowance: any) => {
          r(
            this.web3.utils.fromWei(
              await this.web3.utils.toBN(allowance),
              "ether"
            )
          );
        })
        .catch((err: any) => {
          console.error("### ERROR:", err);
          j("rejected");
        });
    });
  };

  buyUsdcAllowance = async (ownerAddress: any, spenderAddress: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    return new Promise((r, j) => {
      this?.usdtContract?.methods
        ?.allowance(ownerAddress, spenderAddress)
        .call()
        .then(async (allowance: any) => {
          console.log("allowance", allowance);
          const convertedValue = this.web3.utils.fromWei(
            await this.web3.utils.toBN(allowance),
            "ether"
          );
          const finalValue = {
            convertedValue: convertedValue,
            contractValue: allowance?.toString(),
          };
          r(finalValue);
        })
        .catch((err: any) => {
          console.error("### ERROR:", err);
          j("rejected");
        });
    });
  };

  // Calculate tax Sell
  calculateTaxPercent = async (data: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed

    return new Promise((r, j) => {
      this?.bondingCurve?.methods
        ?.calculateTaxPercent(data)
        .call()
        .then(async (tax: any) => {
          r(tax);
          //await this.web3.utils.toBN(price)
        })
        .catch((err: any) => {
          console.error("### ERROR in get calculateTaxPercent :", err);
          j("rejected");
        });
    });
  };

  // sell Paza allowance
  sellPazaAllowance = async (ownerAddress: any, spenderAddress: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    return new Promise((r, j) => {
      this?.contract?.methods
        ?.allowance(ownerAddress, spenderAddress)
        .call()
        .then(async (allowance: any) => {
          const convertedValue = this.web3.utils.fromWei(
            await this.web3.utils.toBN(allowance),
            "ether"
          );
          const finalValue = {
            convertedValue: convertedValue,
            contractValue: allowance?.toString(),
          };
          r(finalValue);
        })
        .catch((err: any) => {
          console.error("### ERROR:", err);
          j("rejected");
        });
    });
  };

  //NOT USING
  buyPazzaToken = async (walletData: any, amount: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // let sig = await this.contract.methods.buy(amount).encodeABI();
      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        PAZZA_ADDRESS,
        PazaAbi.abi,
        signer
      );
      const { data } = await contract.buy.populateTransaction(amount);
      let obj = {
        signer,
        addr: TRADE_ADDRESS,
      };
      return await this.biconomyMethod(walletData, data, obj);
    } catch (err: any) {
      console.log("error", err);
      return err;
    }
  };

  /**
   * function to buy PAZA token
   * @param walletData walletInformation of the user containing address and private key
   * @param amount amount of PAZA token to buy
   * @returns transaction hash
   */

  buyPazzaTokenTrade = async (walletData: any, amount: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // console.log("amount buyPazzaTokenTrade", amount);
      // let sig = await this.contractTrade.methods.buy(amount).encodeABI();
      // console.log("dxgfchvhjbklsadahfdagdsjadkasd", sig);

      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        TRADE_ADDRESS,
        TradeAbi.abi,
        signer
      );
      const { data } = await contract.buy.populateTransaction(amount);
      let obj = {
        signer,
        addr: TRADE_ADDRESS,
      };
      return await this.biconomyMethod(walletData, data, obj);
    } catch (err: any) {
      console.log("error in buyPazzaTokenTrade-2", err);
      return err;
    }
  };

  /**
   * function to give paza approval
   * @param walletData walletInformation of the user containing address and private key
   * @param toAddress address to which approval is to be given
   * @param amount approval amount
   * @returns transaction hash
   */

  sellPazzaApproval = async (
    walletData: any,
    toAddress: string,
    amount: any
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // let sig = await this.contract.methods
      //   .approve(toAddress, amount)
      //   .encodeABI();

      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        PAZZA_ADDRESS,
        PazaAbi.abi,
        signer
      );
      const { data } = await contract.approve.populateTransaction(
        toAddress,
        amount
      );
      let obj = {
        signer,
        addr: PAZZA_ADDRESS,
      };
      return await this.biconomyMethodForSell(walletData, data, obj);
    } catch (err: any) {
      console.log("error", err);
      return err;
    }
  };

  /**
   * function to fetch PAZA allowance of the user when selling PAZA
   * @param ownerAddress address of the user to check allowance
   * @param spenderAddress address to which approval is given
   * @returns allowance amount
   */
  sellPazzaAllowance = async (ownerAddress: any, spenderAddress: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    return new Promise((r, j) => {
      this?.usdtContract?.methods
        ?.allowance(ownerAddress, spenderAddress)
        .call()
        .then(async (allowance: any) => {
          r(
            this.web3.utils.fromWei(
              await this.web3.utils.toBN(allowance),
              "ether"
            )
          );
        })
        .catch((err: any) => {
          console.error("### ERROR:", err);
          j("rejected");
        });
    });
  };

  /**
   * function to fetch allowance of the user
   * @param ownerAddress address of the user to check allowance
   * @param spenderAddress address to which approval is given
   * @returns allowance amount
   */

  totalAllowance = async (ownerAddress: any, spenderAddress: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    return new Promise((r, j) => {
      this?.contract?.methods
        ?.allowance(ownerAddress, spenderAddress)
        .call()
        .then(async (allowance: any) => {
          r(
            this.web3.utils.fromWei(
              await this.web3.utils.toBN(allowance),
              "ether"
            )
          );
        })
        .catch((err: any) => {
          console.error("### ERROR:", err);
          j("rejected");
        });
    });
  };

  //NOT USING
  sellPazzaToken = async (walletData: any, amount: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // let sig = await this.contract.methods.sell(amount).encodeABI();
      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        PAZZA_ADDRESS,
        PazaAbi.abi,
        signer
      );
      const { data } = await contract.sell.populateTransaction(amount);
      let obj = {
        signer,
        addr: TRADE_ADDRESS,
      };
      return await this.biconomyMethod(walletData, data, obj);
    } catch (err: any) {
      console.log("error", err);
      return err;
    }
  };

  /**
   * function to sell PAZA token
   * @param walletData walletInformation of the user containing address and private key
   * @param amount amount to sell PAZA token
   * @returns transaction hash
   */
  sellPazzaTokenTrade = async (walletData: any, amount: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      console.log("amount sellPazzaTokenTrade", amount);
      // let sig = await this.contractTrade.methods.sell(amount).encodeABI();
      const signer: any = new ethersV6.Wallet(
        walletData.privateKey,
        this.provider
      );
      const contract = new ethersV6.Contract(
        TRADE_ADDRESS,
        TradeAbi.abi,
        signer
      );
      const { data } = await contract.sell.populateTransaction(amount);
      let obj = {
        signer,
        addr: TRADE_ADDRESS,
      };
      return await this.biconomyMethod(walletData, data, obj);
    } catch (err: any) {
      console.log("error in sellPazzaTokenTrade", err);
      return err;
    }
  };

  /**
   * common function to execute gasless transactions
   * @param walletData walletInformation of the user containing address and private key
   * @param sig 65 bytes ECDSA signature
   * @returns transaction hash
   */

  biconomyMethod = async (walletData: any, data: any, obj: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      console.log("inside function");
      // const nonce = await this.contractTrade.methods.getNonce(walletData.address).call();
      // if (!nonce) {
      //   throw new Error("Failed to fetch nonce");
      // }

      // // Prepare the transaction data
      // console.log(walletData, "walletData")
      // const txData = this.contractTrade.methods.executeMetaTransaction(walletData.address, sig, nonce).encodeABI();
      // if (!txData) {
      //   throw new Error("Failed to encode transaction data");
      // }

      // Populate Gelato relay request
      const request: CallWithERC2771Request = {
        chainId: this.chainId,
        target: obj.addr,
        data: data,
        user: walletData.address,
      };

      console.log(request, "request  ++++++++++++++++++++++");
      console.log(this.GELATO_RELAY_API_KEY, "request  ++++++++++++++++++++++");
      const response = await this.gelatoRelay.sponsoredCallERC2771(
        request,
        obj.signer,
        this.GELATO_RELAY_API_KEY as string
      );
      console.log(
        `https://relay.gelato.digital/tasks/status/${response.taskId}`
      );
      let transactionHash = await checkTaskStatus(response.taskId);
      console.log(transactionHash, "status ---------------<<<");
      return { transactionHash: transactionHash, error: false };
    } catch (error: any) {
      console.log("error in biconomyMethod1 ", error);
      throw error;
    }
  };

  biconomyMethodforBuyExactUsdc = async (
    walletData: any,
    data: any,
    obj: any
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // let nonce: any = await this.contract.methods
      //   .getNonce(walletData?.address)
      //   .call();
      // console.log("nonce", nonce);

      // let messageToSign = this.constructMetaTransactionMessage(
      //   nonce,
      //   CHAIN_ID,
      //   sig,
      //   BONDINGCURVE_ADDRESS
      // );

      // const signature: any = await this.web3.eth.accounts.sign(
      //   "0x" + messageToSign.toString("hex"),
      //   walletData?.privateKey
      // );

      // let { r, s, v }: any = await this.getSignatureParameters(
      //   signature?.signature
      // );
      // console.log("signature", r, s, v, walletData.address);

      // const tx = await this.bondingCurve.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .encodeABI();

      // if (!tx) {
      //   return console.log("Something went Wrong in tx");
      // }
      // let estimatedGas = await this.bondingCurve.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .estimateGas({ from: walletData.address, value: 0 });

      // if (!estimatedGas) {
      //   return console.log("Something went Wrong in estimatedGas");
      // }

      // const txParams = {
      //   from: walletData.address,
      //   to: BONDINGCURVE_ADDRESS,
      //   gas: await this.web3.utils.toHex(estimatedGas),
      //   gasPrice: await this.web3.eth.getGasPrice(),
      //   value: "0x0",
      //   gasLimit: this.web3.utils.toHex(Number(estimatedGas).toFixed()),
      //   data: tx,
      // };

      // const signedTx: any = await this.web3.eth.accounts.signTransaction(
      //   txParams,
      //   walletData.privateKey
      // );

      // const receipt: any = await this.web3.eth.sendSignedTransaction(
      //   signedTx.rawTransaction,
      //   (error: any, txHash: string) => {
      //     if (error) {
      //       return {
      //         error: true,
      //         message:
      //           "Something  in signTransactionBiconomy sendSignedTransaction",
      //       };
      //     }
      //     console.log("txHash", txHash);
      //     return { transactionHash: txHash, error: false };
      //   }
      // );
      // return { transactionHash: receipt.transactionHash, error: false };
      console.log("coming in biconomyMethodforBuyExactUsdc************");
      const request: SponsoredCallRequest = {
        chainId: this.chainId,
        target: obj.addr,
        data: data,
      };
      const response = await this.gelatoRelay.sponsoredCall(
        request,
        this.GELATO_RELAY_API_KEY as string
      );

      console.log(
        `https://relay.gelato.digital/tasks/status/${response.taskId}`
      );
      let transactionHash = await checkTaskStatus(response.taskId);

      return { transactionHash: transactionHash, error: false };
    } catch (error: any) {
      console.log("error in biconomyMethod2 ", error);
      return {
        error: true,
        ...error,
      };
    }
  };
  biconomyMethodforSellExactUsdc = async (
    walletData: any,
    data: any,
    obj: any
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      const request: CallWithERC2771Request = {
        chainId: this.chainId,
        target: obj.addr,
        data: data,
        user: walletData.address,
      };
      const response = await this.gelatoRelay.sponsoredCallERC2771(
        request,
        obj.signer,
        this.GELATO_RELAY_API_KEY as string
      );
      console.log(
        `https://relay.gelato.digital/tasks/status/${response.taskId}`
      );
      let transactionHash = await checkTaskStatus(response.taskId);
      return { transactionHash: transactionHash, error: false };
    } catch (error: any) {
      console.log("error in biconomyMethod2 ", error);
      return {
        error: true,
        ...error,
      };
    }
  };

  biconomyMethodforBuyExactToken = async (
    walletData: any,
    data: any,
    obj: any
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // let nonce: any = await this.contract.methods
      //   .getNonce(walletData?.address)
      //   .call();
      // let messageToSign = this.constructMetaTransactionMessage(
      //   nonce,
      //   CHAIN_ID,
      //   sig,
      //   BONDINGCURVE_ADDRESS
      // );
      // const signature: any = await this.web3.eth.accounts.sign(
      //   "0x" + messageToSign.toString("hex"),
      //   walletData?.privateKey
      // );
      // let { r, s, v }: any = await this.getSignatureParameters(
      //   signature?.signature
      // );
      // const tx = await this.bondingCurve.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .encodeABI();
      // if (!tx) {
      //   return console.log("Something went Wrong in tx");
      // }
      // let estimatedGas = await this.bondingCurve.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .estimateGas({ from: walletData.address, value: 0 });

      // if (!estimatedGas) {
      //   return console.log("Something went Wrong in estimatedGas");
      // }

      // const txParams = {
      //   from: walletData.address,
      //   to: BONDINGCURVE_ADDRESS,
      //   gas: await this.web3.utils.toHex(estimatedGas),
      //   gasPrice: await this.web3.eth.getGasPrice(),
      //   value: "0x0",
      //   gasLimit: this.web3.utils.toHex(Number(estimatedGas).toFixed()),
      //   data: tx,
      // };

      // const signedTx: any = await this.web3.eth.accounts.signTransaction(
      //   txParams,
      //   walletData.privateKey
      // );

      // const receipt: any = await this.web3.eth.sendSignedTransaction(
      //   signedTx.rawTransaction,
      //   (error: any, txHash: string) => {
      //     if (error) {
      //       return {
      //         error: true,
      //         message:
      //           "Something  in signTransactionBiconomy sendSignedTransaction",
      //       };
      //     }

      //     return { transactionHash: txHash, error: false };
      //   }
      // );
      // return { transactionHash: receipt.transactionHash, error: false };
      console.log("coming in biconomyMethodforBuyExactTOKEN************");
      const request: SponsoredCallRequest = {
        chainId: this.chainId,
        target: obj.addr,
        data: data,
      };
      const response = await this.gelatoRelay.sponsoredCall(
        request,
        this.GELATO_RELAY_API_KEY as string
      );
      console.log(
        `https://relay.gelato.digital/tasks/status/${response.taskId}`
      );
      let transactionHash = await checkTaskStatus(response.taskId);

      return { transactionHash: transactionHash, error: false };
    } catch (error: any) {
      console.log("error in biconomyMethod3 ", error);
      return {
        error: true,
        ...error,
      };
    }
  };
  biconomyMethodforSellExactToken = async (
    walletData: any,
    data: any,
    obj: any
  ) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // let nonce: any = await this.contract.methods
      //   .getNonce(walletData?.address)
      //   .call();
      // let messageToSign = this.constructMetaTransactionMessage(
      //   nonce,
      //   CHAIN_ID,
      //   sig,
      //   BONDINGCURVE_ADDRESS
      // );
      // const signature: any = await this.web3.eth.accounts.sign(
      //   "0x" + messageToSign.toString("hex"),
      //   walletData?.privateKey
      // );
      // let { r, s, v }: any = await this.getSignatureParameters(
      //   signature?.signature
      // );
      // const tx = await this.bondingCurve.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .encodeABI();
      // if (!tx) {
      //   return console.log("Something went Wrong in tx");
      // }
      // let estimatedGas = await this.bondingCurve.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .estimateGas({ from: walletData.address, value: 0 });

      // if (!estimatedGas) {
      //   return console.log("Something went Wrong in estimatedGas");
      // }

      // const txParams = {
      //   from: walletData.address,
      //   to: BONDINGCURVE_ADDRESS,
      //   gas: await this.web3.utils.toHex(estimatedGas),
      //   gasPrice: await this.web3.eth.getGasPrice(),
      //   value: "0x0",
      //   gasLimit: this.web3.utils.toHex(Number(estimatedGas).toFixed()),
      //   data: tx,
      // };

      // const signedTx: any = await this.web3.eth.accounts.signTransaction(
      //   txParams,
      //   walletData.privateKey
      // );

      // const receipt: any = await this.web3.eth.sendSignedTransaction(
      //   signedTx.rawTransaction,
      //   (error: any, txHash: string) => {
      //     if (error) {
      //       return {
      //         error: true,
      //         message:
      //           "Something  in signTransactionBiconomy sendSignedTransaction",
      //       };
      //     }
      //     console.log("txHash", txHash);
      //     return { transactionHash: txHash, error: false };
      //   }
      // );
      // return { transactionHash: receipt.transactionHash, error: false };
      const request: CallWithERC2771Request = {
        chainId: this.chainId,
        target: obj.addr,
        data: data,
        user: walletData.address,
      };

      const response = await this.gelatoRelay.sponsoredCallERC2771(
        request,
        obj.signer,
        this.GELATO_RELAY_API_KEY as string
      );
      console.log(
        `https://relay.gelato.digital/tasks/status/${response.taskId}`
      );
      let transactionHash = await checkTaskStatus(response.taskId);
      return { transactionHash: transactionHash, error: false };
    } catch (error: any) {
      console.log("error in biconomyMethod3 ", error);
      return {
        error: true,
      };
    }
  };
  /**
   * common function to execute gasless transactions when selling tokens
   * @param walletData walletInformation of the user containing address and private key
   * @param sig 65 bytes ECDSA signature
   * @returns transaction hash
   */

  biconomyMethodForSell = async (walletData: any, data: any, obj: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // let nonce: any = await this.contract.methods
      //   .getNonce(walletData?.address)
      //   .call();

      // let messageToSign = this.constructMetaTransactionMessage(
      //   nonce,
      //   CHAIN_ID,
      //   sig,
      //   PAZZA_ADDRESS
      // );
      // const signature: any = await this.web3.eth.accounts.sign(
      //   "0x" + messageToSign.toString("hex"),
      //   walletData?.privateKey
      // );

      // let { r, s, v }: any = await this.getSignatureParameters(
      //   signature?.signature
      // );
      // const tx = await this.contract.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .encodeABI();
      // if (!tx) {
      //   return console.log("Something went Wrong in tx");
      // }
      // let estimatedGas = await this.contract.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .estimateGas({ from: walletData.address, value: 0 });

      // if (!estimatedGas) {
      //   return console.log("Something went Wrong in estimatedGas");
      // }

      // const txParams = {
      //   from: walletData?.address,
      //   to: PAZZA_ADDRESS,
      //   gas: await this.web3.utils.toHex(estimatedGas),
      //   gasPrice: await this.web3.eth.getGasPrice(),
      //   value: "0x0",
      //   gasLimit: this.web3.utils.toHex(Number(estimatedGas).toFixed()),
      //   data: tx,
      // };
      // console.log("txParams", txParams);

      // const signedTx: any = await this.web3.eth.accounts.signTransaction(
      //   txParams,
      //   walletData.privateKey
      // );

      // const receipt: any = await this.web3.eth.sendSignedTransaction(
      //   signedTx.rawTransaction,
      //   (error: any, txHash: string) => {
      //     if (error) {
      //       return {
      //         error: true,
      //         message:
      //           "Something  in signTransactionBiconomy sendSignedTransaction",
      //       };
      //     }
      //     console.log("txHash", txHash);
      //     return { transactionHash: txHash, error: false };
      //   }
      // );
      // return { transactionHash: receipt?.transactionHash, error: false };
      const request: CallWithERC2771Request = {
        chainId: this.chainId,
        target: obj.addr,
        data: data,
        user: walletData.address,
      };
      const response = await this.gelatoRelay.sponsoredCallERC2771(
        request,
        obj.signer,
        this.GELATO_RELAY_API_KEY as string
      );
      console.log(
        `https://relay.gelato.digital/tasks/status/${response.taskId}`
      );
      console.log("response", response);
      if (response) {
        let transactionHash = await checkTaskStatus(response.taskId);

        return { transactionHash: transactionHash, error: false };
      } else {
        return { error: true };
      }
    } catch (error: any) {
      console.log("error in gelatoMethod4 ", error);
      return {
        error: true,
        ...error,
      };
    }
  };

  // biconomyUsdtMethod = async (walletData: any, sig: any) => {
  //   try {
  //     let nonce: any = await this.usdtContract.methods
  //       .getNonce(walletData?.address)
  //       .call();
  //     let messageToSign = this.constructMetaTransactionMessage(
  //       nonce,
  //       CHAIN_ID,
  //       sig,
  //       USDT_ADDRESS
  //     );
  //     const signature: any = await this.web3.eth.accounts.sign(
  //       "0x" + messageToSign.toString("hex"),
  //       walletData?.privateKey
  //     );
  //     let { r, s, v }: any = await this.getSignatureParameters(
  //       signature?.signature
  //     );
  //     const tx = await this.usdtContract.methods
  //       .executeMetaTransaction(walletData?.address, sig, r, s, v)
  //       .encodeABI();
  //     if (!tx) {
  //       return console.log("Something went Wrong in tx");
  //     }
  //     let estimatedGas = await this.usdtContract.methods
  //       .executeMetaTransaction(walletData.address, sig, r, s, v)
  //       .estimateGas({ from: walletData.address, value: 0 });
  //     if (!estimatedGas) {
  //       return console.log("Something went Wrong in estimatedGas");
  //     }
  //     const txParams = {
  //       from: walletData.address,
  //       to: USDT_ADDRESS,
  //       gas: await this.web3.utils.toHex(estimatedGas),
  //       gasPrice: await this.web3.eth.getGasPrice(),
  //       value: "0x0",
  //       gasLimit: this.web3.utils.toHex(Number(estimatedGas).toFixed()),
  //       data: tx,
  //     };
  //     const signedTx: any = await this.web3.eth.accounts.signTransaction(
  //       txParams,
  //       walletData.privateKey
  //     );
  //     const receipt: any = await this.web3.eth.sendSignedTransaction(
  //       signedTx.rawTransaction,
  //       (error: any, txHash: string) => {
  //         if (error) {
  //           return {
  //             error: true,
  //             message:
  //               "Something  in signTransactionBiconomy sendSignedTransaction",
  //           };
  //         }
  //         console.log("txHash", txHash);
  //         return { transactionHash: txHash, error: false };
  //       }
  //     );
  //     return { transactionHash: receipt.transactionHash, error: false };
  //   } catch (error: any) {
  //     console.log("error", error);
  //     throw error;
  //   }
  // };

  /**
   * common function to execute gasless transactions when using USDT tokens
   * @param walletData walletInformation of the user containing address and private key
   * @param sig 65 bytes ECDSA signature
   * @returns transaction hash
   */

  biconomyUsdtMethod = async (walletData: any, data: any, obj: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // let nonce: any = await this.usdtContract.methods
      //   .nonces(walletData?.address)
      //   .call();
      // let message: any = {};
      // message.nonce = nonce;
      // message.from = walletData?.address;
      // message.functionSignature = sig;
      // const domainType = [
      //   { name: "name", type: "string" },
      //   { name: "version", type: "string" },
      //   { name: "verifyingContract", type: "address" },
      //   { name: "salt", type: "bytes32" },
      // ];
      // let domainData = {
      //   name: "USDC",
      //   version: "1",
      //   verifyingContract: USDC_ADDRESS,
      //   salt: "0x" + Number(CHAIN_ID)?.toString(16).padStart(64, "0"),
      // };
      // const metaTransactionType = [
      //   { name: "nonce", type: "uint256" },
      //   { name: "from", type: "address" },
      //   { name: "functionSignature", type: "bytes" },
      // ];
      // const dataToSign = {
      //   types: {
      //     EIP712Domain: domainType,
      //     MetaTransaction: metaTransactionType,
      //   },
      //   domain: domainData,
      //   primaryType: "MetaTransaction",
      //   message: message,
      // };
      // const data = walletData.privateKey?.split("x")[1];
      // const pvtKey = Buffer.from(data, "hex");
      // const signatureNew = sigUtil.signTypedMessage(
      //   pvtKey,
      //   { data: dataToSign },
      //   "V3"
      // );
      // let { r, s, v } = await this.getSignatureParameters(signatureNew);
      // let executeMetaTransactionData = this.usdtContract.methods
      //   .executeMetaTransaction(
      //     walletData.address,
      //     message.functionSignature,
      //     r,
      //     s,
      //     v
      //   )
      //   .encodeABI();
      // let estimatedGas = await this.usdtContract.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .estimateGas({ from: walletData.address, value: 0 });
      // if (!estimatedGas) {
      //   return console.log("Something went Wrong in estimatedGas");
      // }
      // const tx = await this.usdtContract.methods
      //   .executeMetaTransaction(walletData?.address, sig, r, s, v)
      //   .encodeABI();
      // if (!tx) {
      //   return console.log("Something went Wrong in tx");
      // }
      // const txParams = {
      //   from: walletData.address,
      //   to: USDC_ADDRESS,
      //   gas: await this.web3.utils.toHex(estimatedGas),
      //   gasPrice: await this.web3.eth.getGasPrice(),
      //   value: "0x0",
      //   gasLimit: this.web3.utils.toHex(Number(estimatedGas).toFixed()),
      //   data: tx,
      // };
      // const signedTx = await this.web3.eth.accounts.signTransaction(
      //   txParams,
      //   data
      // );
      // let receipt = await this.web3.eth.sendSignedTransaction(
      //   signedTx.rawTransaction,
      //   (error: any, txHash: any) => {
      //     if (error) {
      //       return console.error("errorRRRRRRRRRRRRR", error);
      //     }
      //     console.log("Transaction hash is ", txHash);
      //   }
      // );
      // return { transactionHash: receipt.transactionHash, error: false };
      const request: CallWithERC2771Request = {
        chainId: this.chainId,
        target: obj.addr,
        data: data,
        user: walletData.address,
      };
      const response = await this.gelatoRelay.sponsoredCallERC2771(
        request,
        obj.signer,
        this.GELATO_RELAY_API_KEY as string
      );
      console.log(
        `https://relay.gelato.digital/tasks/status/${response.taskId}`
      );
      let transactionHash = await checkTaskStatus(response.taskId);
      return { transactionHash: transactionHash, error: false };
    } catch (error: any) {
      console.log("error in biconomyUsdtMethod", error);
      return {
        error: true,
        ...error,
      };
    }
  };
  biconomyUsdtMethod1 = async (walletData: any, sig: any, obj: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      let nonce: any = await this.usdtContract.methods
        .nonces(walletData?.address)
        .call();
      let message: any = {};
      message.nonce = nonce;
      message.from = walletData?.address;
      message.functionSignature = sig;
      const domainType = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "verifyingContract", type: "address" },
        { name: "salt", type: "bytes32" },
      ];
      let domainData = {
        name: "USDC",
        version: "1",
        verifyingContract: USDC_ADDRESS,
        salt: "0x" + Number(CHAIN_ID)?.toString(16).padStart(64, "0"),
      };
      const metaTransactionType = [
        { name: "nonce", type: "uint256" },
        { name: "from", type: "address" },
        { name: "functionSignature", type: "bytes" },
      ];
      const dataToSign = {
        types: {
          EIP712Domain: domainType,
          MetaTransaction: metaTransactionType,
        },
        domain: domainData,
        primaryType: "MetaTransaction",
        message: message,
      };
      const data = walletData.privateKey?.split("x")[1];
      const pvtKey = Buffer.from(data, "hex");
      const signatureNew = sigUtil.signTypedMessage(
        pvtKey,
        { data: dataToSign },
        "V3"
      );
      let { r, s, v } = await this.getSignatureParameters(signatureNew);
      let executeMetaTransactionData = this.usdtContract.methods
        .executeMetaTransaction(
          walletData.address,
          message.functionSignature,
          r,
          s,
          v
        )
        .encodeABI();

      let estimatedGas = await this.usdtContract.methods
        .executeMetaTransaction(walletData.address, sig, r, s, v)
        .estimateGas({ from: walletData.address, value: 0 });
      if (!estimatedGas) {
        return console.log("Something went Wrong in estimatedGas");
      }

      const tx = await this.usdtContract.methods
        .executeMetaTransaction(walletData?.address, sig, r, s, v)
        .encodeABI();
      // if (!tx) {
      //   return console.log("Something went Wrong in tx");
      // }
      // const txParams = {
      //   from: walletData.address,
      //   to: USDC_ADDRESS,
      //   gas: await this.web3.utils.toHex(estimatedGas),
      //   gasPrice: await this.web3.eth.getGasPrice(),
      //   value: "0x0",
      //   gasLimit: this.web3.utils.toHex(Number(estimatedGas).toFixed()),
      //   data: tx,
      // };
      // const signedTx = await this.web3.eth.accounts.signTransaction(
      //   txParams,
      //   data
      // );
      // let receipt = await this.web3.eth.sendSignedTransaction(
      //   signedTx.rawTransaction,
      //   (error: any, txHash: any) => {
      //     if (error) {
      //       return console.error("errorRRRRRRRRRRRRR", error);
      //     }
      //     console.log("Transaction hash is ", txHash);
      //   }
      // );
      // return { transactionHash: receipt.transactionHash, error: false };
      const request: CallWithERC2771Request = {
        chainId: this.chainId,
        target: obj.addr,
        data: tx,
        user: walletData.address,
      };
      const response = await this.gelatoRelay.sponsoredCallERC2771(
        request,
        obj.signer,
        this.GELATO_RELAY_API_KEY as string
      );
      console.log(
        `https://relay.gelato.digital/tasks/status/${response.taskId}`
      );
      let transactionHash = await checkTaskStatus(response.taskId);
      return { transactionHash: transactionHash, error: false };
    } catch (error: any) {
      console.log("error in biconomyUsdtMethod", error);
      return {
        error: true,
        ...error,
      };
    }
  };

  /**
   * common function to execute gasless transactions when approving NFTs
   * @param walletData walletInformation of the user containing address and private key
   * @param sig 65 bytes ECDSA signature
   * @returns transaction hash
   */

  biconomyLoanNftMethod = async (walletData: any, data: any, obj: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // Populate Gelato relay request
      // const provider = new ethersV6.JsonRpcProvider(this.providerUrl);
      // console.log(provider, 'provider  ++++++++++++++++++++++');

      // const signer: any = new ethersV6.Wallet(walletData.privateKey, provider);
      // console.log(signer, TRADE_ADDRESS, 'signer  ++++++++++++++++++++++');

      // const contract = new ethersV6.Contract(LOAN_NFT_ADDRESS, loanNftAbi);
      // console.log(contract, "contract +++++++++++++++");

      // const { data } = await contract.batchApproval.populateTransaction(loan_id);
      // console.log(data, "data ++++++++++++++");

      // const chainId = (await this.provider.getNetwork()).chainId;
      // console.log(chainId, "chainId");

      // const gelatoRelay = new GelatoRelay();

      const request: CallWithERC2771Request = {
        chainId: this.chainId,
        target: obj.addr,
        data: data,
        user: walletData.address,
      };
      const response = await this.gelatoRelay.sponsoredCallERC2771(
        request,
        obj.signer,
        this.GELATO_RELAY_API_KEY as string
      );
      console.log(
        `https://relay.gelato.digital/tasks/status/${response.taskId}`
      );
      let transactionHash = await checkTaskStatus(response.taskId);
      return { transactionHash: transactionHash, error: false };
    } catch (error: any) {
      console.log("error", error);
      throw error;
    }
  };

  biconomyLockLoanMethod = async (walletData: any, data: any, obj: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // let nonce: any = await this.poolOfLoansNFTlock.methods
      //   .getNonce(walletData?.address)
      //   .call();

      // console.log("biconomyLockLoanMethod called......", walletData, sig, contractAddress)

      // let messageToSign = this.constructMetaTransactionMessage(
      //   nonce,
      //   CHAIN_ID,
      //   sig,
      //   contractAddress
      // );
      // const signature: any = await this.web3.eth.accounts.sign(
      //   "0x" + messageToSign.toString("hex"),
      //   walletData?.privateKey
      // );

      // let { r, s, v }: any = await this.getSignatureParameters(
      //   signature?.signature
      // );

      // const tx = await this.poolOfLoansNFTlock.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .encodeABI();

      // if (!tx) {
      //   return console.log("Something went Wrong in tx");
      // }
      // let estimatedGas = await this.poolOfLoansNFTlock.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .estimateGas({ from: walletData.address, value: 0 });
      // if (!estimatedGas) {
      //   return console.log("Something went Wrong in estimatedGas");
      // }

      // const txParams = {
      //   from: walletData.address,
      //   to: contractAddress,
      //   gas: await this.web3.utils.toHex(estimatedGas),
      //   gasPrice: await this.web3.eth.getGasPrice(),
      //   value: "0x0",
      //   gasLimit: this.web3.utils.toHex(Number(estimatedGas).toFixed()),
      //   data: tx,
      // };

      // const signedTx: any = await this.web3.eth.accounts.signTransaction(
      //   txParams,
      //   walletData.privateKey
      // );

      // const receipt: any = await this.web3.eth.sendSignedTransaction(
      //   signedTx.rawTransaction,
      //   (error: any, txHash: string) => {
      //     if (error) {
      //       console.log("err inside", error);
      //       return {
      //         error: true,
      //         message:
      //           "Something  in signTransactionBiconomy sendSignedTransaction",
      //       };
      //     }
      //     return { transactionHash: txHash, error: false };
      //   }
      // );
      // return { transactionHash: receipt.transactionHash, error: false };
      const request: CallWithERC2771Request = {
        chainId: this.chainId,
        target: obj.addr,
        data: data,
        user: walletData.address,
      };
      const response = await this.gelatoRelay.sponsoredCallERC2771(
        request,
        obj.signer,
        this.GELATO_RELAY_API_KEY as string
      );
      console.log(
        `https://relay.gelato.digital/tasks/status/${response.taskId}`
      );
      let transactionHash = await checkTaskStatus(response.taskId);
      return { transactionHash: transactionHash, error: false };
    } catch (error: any) {
      console.log("error", error);
      throw error;
    }
  };

  biconomyTransferTAMethod = async (walletData: any, data: any, obj: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // let nonce: any = await this.transferTAData.methods
      //   .getNonce(walletData?.address)
      //   .call();

      // console.log("biconomyTransferTAMethod called......", walletData, sig, contractAddress)

      // let messageToSign = this.constructMetaTransactionMessage(
      //   nonce,
      //   CHAIN_ID,
      //   sig,
      //   contractAddress
      // );
      // const signature: any = await this.web3.eth.accounts.sign(
      //   "0x" + messageToSign.toString("hex"),
      //   walletData?.privateKey
      // );

      // let { r, s, v }: any = await this.getSignatureParameters(
      //   signature?.signature
      // );

      // const tx = await this.transferTAData.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .encodeABI();

      // console.log("tx", tx)

      // if (!tx) {
      //   return console.log("Something went Wrong in tx");
      // }
      // let estimatedGas = await this.transferTAData.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .estimateGas({ from: walletData.address, value: 0 });
      // if (!estimatedGas) {
      //   return console.log("Something went Wrong in estimatedGas");
      // }

      // console.log("poitssssss");
      // const txParams = {
      //   from: walletData.address,
      //   to: contractAddress,
      //   gas: await this.web3.utils.toHex(estimatedGas),
      //   gasPrice: await this.web3.eth.getGasPrice(),
      //   value: "0x0",
      //   gasLimit: this.web3.utils.toHex(Number(estimatedGas).toFixed()),
      //   data: tx,
      // };
      // console.log("txParams", txParams);
      // const signedTx: any = await this.web3.eth.accounts.signTransaction(
      //   txParams,
      //   walletData.privateKey
      // );
      // console.log("signedTx", signedTx);

      // const receipt: any = await this.web3.eth.sendSignedTransaction(
      //   signedTx.rawTransaction,
      //   (error: any, txHash: string) => {
      //     if (error) {
      //       console.log("err inside", error)
      //       return {
      //         error: true,
      //         message:
      //           "Something  in signTransactionBiconomy sendSignedTransaction",
      //       };
      //     }
      //     return { transactionHash: txHash, error: false };
      //   }
      // );
      // return { transactionHash: receipt.transactionHash, error: false };
      const request: CallWithERC2771Request = {
        chainId: this.chainId,
        target: obj.addr,
        data: data,
        user: walletData.address,
      };
      const response = await this.gelatoRelay.sponsoredCallERC2771(
        request,
        obj.signer,
        this.GELATO_RELAY_API_KEY as string
      );
      console.log(
        `https://relay.gelato.digital/tasks/status/${response.taskId}`
      );
      let transactionHash = await checkTaskStatus(response.taskId);
      return { transactionHash: transactionHash, error: false };
    } catch (error: any) {
      console.log("error", error);
      throw error;
    }
  };

  biconomyTokenApproveMethod = async (walletData: any, data: any, obj: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // console.log("biconomyTokenApproveMethod called......", walletData, sig, token_address)
      // let nonce: any = await token.methods
      //   .getNonce(walletData?.address)
      //   .call();

      // console.log("this.token", token._address)

      // let messageToSign = this.constructMetaTransactionMessage(
      //   nonce,
      //   CHAIN_ID,
      //   sig,
      //   token_address
      // );
      // const signature: any = await this.web3.eth.accounts.sign(
      //   "0x" + messageToSign.toString("hex"),
      //   walletData?.privateKey
      // );

      // let { r, s, v }: any = await this.getSignatureParameters(
      //   signature?.signature
      // );

      // const tx = await token.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .encodeABI();

      // if (!tx) {
      //   return console.log("Something went Wrong in tx");
      // }
      // let estimatedGas = await token.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .estimateGas({ from: walletData.address, value: 0 });
      // if (!estimatedGas) {
      //   return console.log("Something went Wrong in estimatedGas");
      // }

      // const txParams = {
      //   from: walletData.address,
      //   to: token_address,
      //   gas: await this.web3.utils.toHex(estimatedGas),
      //   gasPrice: await this.web3.eth.getGasPrice(),
      //   value: "0x0",
      //   gasLimit: this.web3.utils.toHex(Number(estimatedGas).toFixed()),
      //   data: tx,
      //   signature: signature,
      // };

      // const signedTx: any = await this.web3.eth.accounts.signTransaction(
      //   txParams,
      //   walletData.privateKey
      // );

      // const receipt: any = await this.web3.eth.sendSignedTransaction(
      //   signedTx.rawTransaction,
      //   (error: any, txHash: string) => {
      //     if (error) {
      //       return {
      //         error: true,
      //         message:
      //           "Something  in signTransactionBiconomy sendSignedTransaction",
      //       };
      //     }
      //     return { transactionHash: txHash, error: false };
      //   }
      // );
      // return { transactionHash: receipt.transactionHash, error: false };
      const request: CallWithERC2771Request = {
        chainId: this.chainId,
        target: obj.addr,
        data: data,
        user: walletData.address,
      };
      const response = await this.gelatoRelay.sponsoredCallERC2771(
        request,
        obj.signer,
        this.GELATO_RELAY_API_KEY as string
      );
      console.log(
        `https://relay.gelato.digital/tasks/status/${response.taskId}`
      );
      let transactionHash = await checkTaskStatus(response.taskId);
      return { transactionHash: transactionHash, error: false };
    } catch (error: any) {
      console.log("error", error);
      throw error;
    }
  };

  biconomyDeployLoanMethod = async (walletData: any, data: any, obj: any) => {
    await this.initializationPromise; // Ensure connectBiconomy is completed
    try {
      // let nonce: any = await this.tokenizationController.methods
      //   .getNonce(walletData?.address)
      //   .call();

      // let messageToSign = this.constructMetaTransactionMessage(
      //   nonce,
      //   CHAIN_ID,
      //   sig,
      //   TOKENIZATION_CONTROLLER
      // );
      // const signature: any = await this.web3.eth.accounts.sign(
      //   "0x" + messageToSign.toString("hex"),
      //   walletData?.privateKey
      // );

      // let { r, s, v }: any = await this.getSignatureParameters(
      //   signature?.signature
      // );

      // const tx = await this.tokenizationController.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .encodeABI();

      // if (!tx) {
      //   return console.log("Something went Wrong in tx");
      // }
      // let estimatedGas = await this.tokenizationController.methods
      //   .executeMetaTransaction(walletData.address, sig, r, s, v)
      //   .estimateGas({ from: walletData.address, value: 0 });
      // if (!estimatedGas) {
      //   return console.log("Something went Wrong in estimatedGas");
      // }

      // const txParams = {
      //   from: walletData.address,
      //   to: TOKENIZATION_CONTROLLER,
      //   gas: await this.web3.utils.toHex(estimatedGas),
      //   gasPrice: await this.web3.eth.getGasPrice(),
      //   value: "0x0",
      //   gasLimit: this.web3.utils.toHex(Number(estimatedGas).toFixed()),
      //   data: tx,
      // };

      // const signedTx: any = await this.web3.eth.accounts.signTransaction(
      //   txParams,
      //   walletData.privateKey
      // );

      // const receipt: any = await this.web3.eth.sendSignedTransaction(
      //   signedTx.rawTransaction,
      //   (error: any, txHash: string) => {
      //     if (error) {
      //       return {
      //         error: true,
      //         message:
      //           "Something  in signTransactionBiconomy sendSignedTransaction",
      //       };
      //     }
      //     return { transactionHash: txHash, error: false };
      //   }
      // );
      // return { transactionHash: receipt?.transactionHash, error: false };
      const request: CallWithERC2771Request = {
        chainId: this.chainId,
        target: obj.addr,
        data: data,
        user: walletData.address,
      };

      const response = await this.gelatoRelay.sponsoredCallERC2771(
        request,
        obj.signer,
        this.GELATO_RELAY_API_KEY as string
      );
      console.log(
        `https://relay.gelato.digital/tasks/status/${response.taskId}`
      );
      let transactionHash = await checkTaskStatus(response.taskId);
      console.log(transactionHash, "hah 0--------------------------9090909");

      return {
        transactionHash: transactionHash,
        error: transactionHash ? true : false,
      };
    } catch (error: any) {
      console.log("error", error);
      throw error;
    }
  };

  /**
   * web function to convert an amount to ether amount by multiplying the amount with ether decimals
   * @param amount amount to convert
   * @returns converted amount
   */
  web3Amount = async (amount: any) => {
    return await this.web3.utils.toWei(amount, "ether");
  };

  multiplyBy10ToTheDecimal = async (value: any, decimal: any) => {
    // Convert the value to a string, multiply by 10^6 and return the result as a string
    const parts = value.split(".");
    const integerPart = parts[0];
    const fractionalPart = parts[1] || "";
    const paddedFractionalPart = fractionalPart.padEnd(decimal, "0");
    const weiValue = this.web3.utils.toBN(integerPart + paddedFractionalPart);
    return weiValue.toString();
  };

  dividedBy10ToTheDecimal(value: any, decimal: any) {
    // Convert the value to a BigNumber if it isn't already
    const bigNumberValue = this.web3.utils.toBN(value);

    // Calculate 10 raised to the power of the decimal
    const divisor = this.web3.utils.toBN(10).pow(this.web3.utils.toBN(decimal));

    // Perform the division
    const result = bigNumberValue.div(divisor);

    // Return the result as a string
    return result.toString();
  }

  /**
   * function responsible for making contract instances for further use in the this file
   */
  initContract = () => {
    try {
      this.contract = new this.web3.eth.Contract(PazaAbi.abi, PAZZA_ADDRESS);
      this.usdtContract = new this.web3.eth.Contract(UsdtAbi.abi, USDC_ADDRESS);
      this.loanNftContract = new this.web3.eth.Contract(
        loanNftAbi,
        LOAN_NFT_ADDRESS
      );
    } catch (error) {
      console.log("error", error);
    }
  };
}

const checkTaskStatus = async (
  taskId: string
): Promise<{ transactionHash: string | null; error: string | null }> => {
  const interval = 3000; // 3 seconds
  let maxRetries = 20; //
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      console.log(attempts, "attempts", maxRetries, "maxRetries");

      console.log(
        `Checking status for Task ID: ${taskId} (Attempt: ${attempts + 1})`
      );
      console.log(
        "api is -- ",
        `https://api.gelato.digital/tasks/status/${taskId}`
      );
      const response = await axios.get(
        `https://api.gelato.digital/tasks/status/${taskId}`
      );
      console.log("response", response);
      // If response status is 404, log it and retry
      if (response.status === 404) {
        console.warn(
          `Task ID: ${taskId} - Status not found (404). Retrying...`
        );
        attempts++;
        maxRetries++;
        await new Promise((resolve) => setTimeout(resolve, interval));
        continue;
      } else if (response.status === 200) {
        console.log("2000000000000000000");
        const { taskState, transactionHash, lastCheckMessage } =
          response.data.task;

        console.log(`Task ID: ${taskId} - Current State: ${taskState}`);

        if (taskState === "ExecSuccess") {
          console.log("Task executed successfully!", response);
          return transactionHash; // Return the transaction hash
        } else if (taskState === "ExecReverted") {
          console.log("Task execution reverted.");
          throw new Error("Task execution reverted.");
        } else if (taskState === "Cancelled") {
          throw new Error(`Task was cancelled. ${lastCheckMessage}`);
        } else if (taskState === "ExecFailed") {
          console.log("Task execution failed.");
          throw new Error("Task execution failed.");
        } else if (taskState === "WaitingForConfirmation") {
          console.log("Task is waiting for confirmation...");
        } else {
          console.log(`Unhandled task state: ${taskState}`);
          console.log(taskState === "Cancelled");
        }
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(
          `Task ID: ${taskId} - Status not found (404). Retrying...`
        );
      } else {
        console.error("Error fetching task status:", error.message);
        return { transactionHash: null, error: error.message };
      }
    }

    // Wait before the next status check
    attempts++;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  console.error("Max retries reached. Task status not determined.");
  return { transactionHash: null, error: "Cancelled" }; // Return null if max retries are exhausted
};

export default new Web3Service();
