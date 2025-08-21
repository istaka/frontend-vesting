/** @format */

import React, { useEffect, useState } from "react";
import { ButtonCustom } from "../button/ButtonCustom";
import { UpArrow, DownArrow } from "../../../Assets/Images/icons/svgImg";
import "./DepositWithdrawStyle.scss";
import { useSelector } from "react-redux";
import ModalWithdraw from "../ModalWithdraw/ModalWithdraw";
import ModalDeposit from "../ModalDeposit/ModalDeposit";
import { Col, Row } from "antd";
import { BalBox } from "../BalBox/BalBox";
import decFunction from "../../common/Decimal";

interface DepositWithdrawPorps {
  coinName: string;
  value: number;
  img: any;
  balBox: boolean;
  staked: number;
  pazaPrice: number;
}
declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}
const DepositWithdraw: React.FC<DepositWithdrawPorps> = (props) => {
  const coinValue = props.coinName;
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [currentVal, setCurrentVal] = useState<string>("Deposit");
  const [isModalWithdrawVisible, setIsModalWithdrawVisible] =
    useState<boolean>(false);
  const [disableWithBtn, setDisableWithBtn] = useState<boolean>(false);
  const address: any = useSelector(
    (state: any) => state?.walletSlice?.walletDetails?.address
  );

  const handleClose = (flag: boolean) => {
    setIsVisible(flag);
  };
  const handleShow = () => {
    setIsVisible(true);
  };
  const handleWithdrawClose = (flag: boolean) => {
    setIsModalWithdrawVisible(flag);
  };
  const handleWithdrawShow = () => {
    setIsModalWithdrawVisible(true);
  };
  const handleSubmit = (val: any) => {
    setCurrentVal(val);
    handleShow();
  };
  const handleWithdraw = () => {
    handleWithdrawShow();
  };
  const disableWithdraw = (flag: boolean) => {
    setDisableWithBtn(flag);
  };

  return (
    <div className="depositcard">
      <div className="depositcard__coin">
        <img src={props?.img} alt="icon-img" />
      </div>
      <div className="depositcard__detail">
        <p
          title={
            props?.staked
              ? (
                  decFunction(props?.staked) + decFunction(props?.value)
                ).toLocaleString()
              : decFunction(props?.value).toLocaleString()
          }
        >
          {props?.coinName} Balance:{" "}
          {props?.staked ? (
            <span>
              {(decFunction(props?.staked) + decFunction(props?.value))
                .toLocaleString()
                ?.substring(0, 15) + "..."}
            </span>
          ) : (
            decFunction(props?.value).toLocaleString()?.substring(0, 15) + "..."
          )}{" "}
        </p>
        {props?.balBox ? (
          <Row gutter={16} className="balbox-row">
            <Col xs={12}>
              {/* {props?.staked ? props?.staked : 0} */}
              {/* ` ${(Number(props?.staked) / 1000).toFixed(2)}` + ' K'  */}
              <BalBox
                BalHeading="Staked"
                BalAmt={
                  props?.staked
                    ? decFunction(props?.staked).toLocaleString()
                    : "0.00"
                }
                UsdPrice={
                  props?.pazaPrice && props?.staked
                    ? decFunction(props?.staked / (props?.pazaPrice / 10 ** 18))
                    : "0.00"
                }
              />
            </Col>
            <Col xs={12}>
              <BalBox
                BalHeading="Wallet"
                BalAmt={
                  props?.value
                    ? decFunction(props?.value).toLocaleString()
                    : "0.00"
                }
                UsdPrice={
                  props.pazaPrice
                    ? (props?.value / (props?.pazaPrice / 10 ** 18)).toFixed(2)
                    : "0.00"
                }
              />
            </Col>
          </Row>
        ) : (
          <></>
        )}
        <div className="depositcard__detail__action">
          <ButtonCustom
            label="Deposit"
            onClick={() => {
              handleSubmit("Deposit");
            }}
            leftIcon={<UpArrow />}
          />
          {/* {coinValue === "XPAZA" && ( */}
          <ButtonCustom
            label="Withdraw"
            onClick={handleWithdraw}
            leftIcon={<DownArrow />}
            disabled={disableWithBtn}
          />
          {/* )} */}
        </div>
      </div>
      {isVisible && (
        <ModalDeposit
          isVisible={isVisible}
          handleClose={handleClose}
          handleShow={handleShow}
          currentVal={currentVal}
          address={address}
          coinValue={coinValue}
        />
      )}

      {isModalWithdrawVisible && (
        <ModalWithdraw
          isModalWithdrawVisible={isModalWithdrawVisible}
          handleWithdrawClose={handleWithdrawClose}
          handleWithdrawShow={handleWithdrawShow}
          address={address}
          coinValue={coinValue}
          disableWithdraw={disableWithdraw}
          setDisableWithBtn={setDisableWithBtn}
        />
      )}
    </div>
  );
};
export default DepositWithdraw;
