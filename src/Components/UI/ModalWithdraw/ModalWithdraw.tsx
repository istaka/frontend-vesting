/** @format */

import { useEffect, useState } from "react";
import { Modal } from "antd";
import { CommonButton } from "../CommonBtn/CommonButton";
import { Form, Input } from "antd";
import { toast } from "../../common/Toasts/Toast";
import web3Service from "../../../service/contractServices/web3.service";
import { useDispatch, useSelector } from "react-redux";
import { fetchTokenBalances } from "../../../service/apiServices/ApiServiceHelper";
import TransactionModal from "../../common/TransactionModal/TransactionModal";
import "./ModalWithdraw.scss";

const ModalWithdraw = (props: any) => {
  const dispatch = useDispatch();
  const walletData: any = useSelector(
    (state: any) => state.walletSlice.walletDetails
  );
  const balData: any = useSelector((state: any) => state?.loginSlice);

  const [addre, setAddre] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [amountErr, setAmountErr] = useState<boolean>(false);
  const [addreErr, setAddreErr] = useState<boolean>(false);
  const [amountMaxErr, setAmountMaxErr] = useState<boolean>(false);
  const [addressError, setAddressError] = useState<boolean>(false);
  const [dissablebtn, setdissablebtn] = useState<boolean>(false);
  const [usdcDec, setUsdcDec] = useState<string>("");
  const [showTrnxModal, setShowTrnxModal] = useState(false);

  const [modalData, setModalData] = useState<any>({
    heading: "",
    bodyText: "",
    status: "",
    txHash: "",
  });

  /**
   * function to handle to which address withdraw amount will go to
   * @param e address
   */
  const handleChange = (e: any) => {
    setAddreErr(false);
    setAddre(e.target.value);
    const regexAdd = /^0x[a-fA-F0-9]{40}$/gm;
    const isValidAddress = regexAdd.test(e.target.value);
    if (isValidAddress) {
      setAddressError(false);
    } else {
      setAddressError(true);
    }
    if (e.target.value === "") {
      setAddressError(false);
    }
  };

  /**
   *function to handle amount to withdraw
   * @param e amount to withdraw
   */
  const handleAmount = (e: any) => {
    setAmountErr(false);

    if (props.coinValue === "PAZA") {
      if (Number(e.target.value) > Number(balData.pazzaBal / 10 ** 18)) {
        setAmountMaxErr(true);
      } else {
        setAmountMaxErr(false);
      }
    } else if (props.coinValue === "USDC") {
      if (Number(e.target.value) > Number(balData.usdtBal)) {
        setAmountMaxErr(true);
      } else {
        setAmountMaxErr(false);
      }
    }
    const regex = /^[+]?\d*(?:[.]\d*)?$/;
    const isValidValue = regex.test(e.target.value);
    if (isValidValue) {
      if (e.target.value === "" || regex.test(e.target.value)) {
        setAmount(e.target.value);
      }
      if (!isValidValue || e.target.value == 0) {
        setAmount(e.target.value);
        setdissablebtn(true);
      } else {
        setdissablebtn(false);
      }
    }
  };

  useEffect(() => {
    setdissablebtn(true);
  }, []);
  const handleOpen = () => setShowTrnxModal(true);

  const handleCloseModal = () => {
    props?.handleWithdrawClose(false);
    setShowTrnxModal(false);
  };
  const handleClose = () => {
    setAddreErr(false);
    setAmountErr(false);
    setAmountMaxErr(false);
    setAmount("");
    setAddre("");
    props?.handleWithdrawClose(false);
  };

  useEffect(() => {
    const getUSDCdecimal = async () => {
      await web3Service.connectBiconomy();

      const getUsdcDecimal: any = await web3Service?.getDecimalsUsdc();
      setUsdcDec(getUsdcDecimal);
    };
    getUSDCdecimal();
  }, []);

  /**
   * function to handle withdraw functionality
   * @returns nothing
   */
  const handleWithdraw = async () => {
    try {
      if (addre === "") {
        setAddreErr(true);
        return;
      }
      if (amount === "") {
        setAmountErr(true);
        return;
      }
      handleOpen();
      setModalData({
        heading: `Withdraw ${props?.coinValue}`,
        bodyText: `Withdrawing ${props?.coinValue} token in progress`,
        status: "pending",
        txHash: null,
      });
      const convertedAmt = await web3Service.web3Amount(amount);
      setAmount("");
      setAddre("");
      if (props?.coinValue === "PAZA") {
        if (balData?.pazzaBal > 0 && amount <= balData?.pazzaBal) {
          props?.setDisableWithBtn(true);
          // props?.handleWithdrawClose(false);

          const res: any = await web3Service.transferAmountPAZA(
            walletData,
            addre,
            convertedAmt
          );

          if (res?.transactionHash) {
            setModalData({
              heading: `Withdraw ${props?.coinValue}`,
              bodyText: `${props?.coinValue} token withdrawn successfully`,
              status: "success",
              txHash: res?.transactionHash,
            });
            toast?.success(`XPAZA token withdrawn successfully`);
            await fetchTokenBalances(dispatch);
            // pazzaBal();
            props?.setDisableWithBtn(false);
          }
        } else {
          props?.setDisableWithBtn(false);
          // props?.handleWithdrawClose(false);
          setModalData({
            heading: `Withdraw ${props?.coinValue}`,
            bodyText: `Insufficient balance`,
            status: "error",
            txHash: null,
          });
          toast?.info("Insufficient balance");
        }
      } else if (props?.coinValue === "USDC") {
        if (balData?.usdtBal > 0 && amount <= balData?.usdtBal) {
          
          const inputValue: any = Number(amount) * 10 ** Number(usdcDec);
          props?.setDisableWithBtn(true);
          // props?.handleWithdrawClose(false);

          const res: any = await web3Service.transferAmountUSDC(
            walletData,
            addre,
            inputValue
          );
          if (res?.transactionHash) {
            setModalData({
              heading: `Withdraw ${props?.coinValue}`,
              bodyText: `${props?.coinValue} token withdrawn successfully`,
              status: "success",
              txHash: res?.transactionHash,
            });
            // pazzaBal();
            toast?.success(`USDC token withdrawn successfully`);
            await fetchTokenBalances(dispatch);
            props?.setDisableWithBtn(false);
          }
        } else {
          props?.setDisableWithBtn(false);
          // props?.handleWithdrawClose(false);
          setModalData({
            heading: `Withdraw ${props?.coinValue}`,
            bodyText: `Insufficient balance`,
            status: "error",
            txHash: null,
          });
          toast?.info("Insufficient balance");
        }
      }
    } catch (error: any) {
      props?.setDisableWithBtn(false);
      setAmount("");
      setAddre("");
      setModalData({
        heading: `Withdraw ${props?.coinValue}`,
        bodyText: "Transaction failed",
        status: "error",
        txHash: null,
      });
      console.log("error", error);
      props?.setDisableWithBtn(false);
      // props?.handleWithdrawClose(false);
    }
  };

  return (
    <>
      <Modal
        centered
        className="common-modal alert_model withdrw_mdl"
        visible={props.isModalWithdrawVisible}
        onOk={props.handleWithdrawShow}
        onCancel={() => {
          props.handleWithdrawClose(false);
          setAddreErr(false);
          setAmountErr(false);
          setAmountMaxErr(false);
          setAmount("");
          setAddre("");
        }}
        footer={null}
      >
        <Form>
          <Form.Item>
            <h2 className="modeltitle">
              Withdraw {props?.coinValue === "PAZA" ? "PAZA" : "USDC"} Token
            </h2>
            <Input
              placeholder="Enter Address"
              type="text"
              onChange={handleChange}
              value={addre}
            />
            {addreErr && <p style={{ color: "red" }}> Please fill address </p>}
            {addressError ? (
              <p style={{ color: "red" }}> Please enter valid address </p>
            ) : (
              ""
            )}
            <Input
              placeholder="Enter Amount"
              type="text"
              onChange={handleAmount}
              value={amount}
              min="0.00"
              step="0.001"
              className="paza_withdraw fa_inp"
              max={balData?.pazzaBal}
              maxLength={props?.coinValue === "XPAZA" ? 18 : 6}
            />
            {amountErr && <p style={{ color: "red" }}> Please fill amount </p>}
            {amountMaxErr ? (
              <p style={{ color: "red" }}>
                {" "}
                Entered amount exceeds max balance{" "}
              </p>
            ) : (
              ""
            )}
          </Form.Item>
          <div className="paza_btn_sec">
            <Form.Item>
              <CommonButton
                title={`WithDraw ${
                  props?.coinValue === "PAZA" ? "PAZA" : "USDC"
                } Token`}
                disabled={dissablebtn || amountMaxErr}
                className="ant-btn-primary w-100 with_btn"
                onClick={handleWithdraw}
                htmlType="submit"
              />
            </Form.Item>
            <Form.Item>
              <CommonButton
                title={"Close"}
                className="ant-btn-primary w-100 with_btn"
                onClick={handleClose}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
      {showTrnxModal ? (
        <TransactionModal
          show={showTrnxModal}
          modalData={modalData}
          handleClose={handleCloseModal}
          handleFunction={handleWithdraw}
        />
      ) : null}
    </>
  );
};

export default ModalWithdraw;
