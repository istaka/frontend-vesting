/** @format */

import { useEffect, useState } from "react";
import { Modal } from "antd";
import { CommonButton } from "../CommonBtn/CommonButton";
import { Form, Input, Tabs } from "antd";
import QRCode from "react-qr-code";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "../../common/Toasts/Toast";
import copycode from "../../../Assets/Images/icons/copy.svg";

import { useDispatch, useSelector } from "react-redux";
import "./ModalDepositStyle.scss";
import { fetchTokenBalances } from "../../../service/apiServices/ApiServiceHelper";

const ModalDeposit = (props: any) => {
  const dispatch = useDispatch();
  const wAddress: any = useSelector(
    (state: any) => state?.walletSlice?.walletDetails?.address
  );
  const [isCopied, setIsCopied] = useState<boolean>(false);

  /**
   * function to call when user close this modal
   */
  const handleDeposit = async () => {
    setIsCopied(false);
    try {
      fetchTokenBalances(dispatch, null);
      props?.handleClose(false);
    } catch (error) {
      props?.handleClose(true);
    }
  };

  return (
    <>
      <Modal
        centered
        className="common-modal alert_model withdrw_mdl"
        visible={props?.isVisible}
        onOk={props?.handleShow}
        onCancel={() => {
          props?.handleClose(false);
        }}
        footer={null}
      >
        <Form>
          {
            <h2 className="modeltitle">
              {" "}
              Deposit {props?.coinValue === "PAZA"
                ? "PAZA"
                : "USDC"} Token{" "}
            </h2>
          }
          <div className="qr_scner">
            <QRCode value={props?.address} />
            <p>Scan QR code </p>
          </div>
          <div className="copy_adrs">
            <Form.Item>
              <Input
                placeholder={props?.address}
                type="text"
                value={props?.address}
                disabled
              />
              {isCopied ? null : (
                <CopyToClipboard
                  text={props?.address}
                  onCopy={() => {
                    setIsCopied(true);
                    toast?.success("Copied");
                  }}
                >
                  <img src={copycode} alt="copy_twofa" className="code_code" />
                </CopyToClipboard>
              )}
            </Form.Item>
          </div>
          <Form.Item>
            <CommonButton
              title={"Close"}
              className="ant-btn-primary w-100"
              onClick={handleDeposit}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ModalDeposit;
