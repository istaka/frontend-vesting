import React, { useState } from "react";
import Lottie from "react-lottie";
import loading from "../../../Assets/Animation/loading.json";
import tick from "../../../Assets/Animation/tick.json";
import error from "../../../Assets/Animation/error.json";
import "./TransactionModal.scss";
import { Col, Modal, Row } from "react-bootstrap";
import { CloseIcon } from "../../../Assets/Images/icons/svgImg";
import { ButtonCustom } from "../../UI/button/ButtonCustom";
import { EXPLORER } from "../../../Constants";

const TransactionModal = ({
  show,
  handleClose,
  modalData,
  handleFunction,
}: {
  show: boolean;
  handleClose: () => any;
  modalData: any;
  handleFunction: Function;
}) => {
  const viewTransactiononExplorer = (e: any) => {
    e.preventDefault();
    window.open(`${EXPLORER}/tx/${modalData?.txHash}`);
  };
  return (
    <Modal
      className="transaction_modal"
      show={show}
      centered
      handleClose={handleClose}
      backdropClassName="transaction_modal_bckdrop"
      //   backdrop="static"
    >
      <Modal.Header>
        <Modal.Title>{modalData?.heading}</Modal.Title>
        <button
          className="modal_close_btn"
          onClick={() =>
            modalData?.status == "success" || modalData?.status == "error"
              ? handleClose()
              : null
          }
        >
          <CloseIcon />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div
          className={`lottie_animation ${
            modalData?.status == "success" ? "tick_animation" : ""
          }`}
        >
          <Lottie
            options={{
              loop:
                modalData?.status == "success"
                  ? false
                  : modalData?.status == "error"
                  ? false
                  : true,
              animationData:
                modalData?.status == "success"
                  ? tick
                  : modalData?.status == "error"
                  ? error
                  : loading,
              autoplay: true,
            }}
          />
        </div>
        <p className="transaction_text">{modalData?.bodyText}</p>
        {modalData?.txHash ? <div className="url_box"></div> : null}
        {modalData?.status == "success" || modalData?.status == "error" ? (
          <div className="transaction_action_btn">
            <Row>
              <Col sm={modalData?.heading == "Verify Phrase" ? 12 : 6}>
                <ButtonCustom
                  onClick={() => handleClose()}
                  label="Close"
                  className="danger"
                />
              </Col>
              {modalData?.status == "error" ? (
                <Col sm={6}>
                  <ButtonCustom
                    fluid
                    label="Retry"
                    onClick={() => handleFunction()}
                  />
                </Col>
              ) : modalData?.status == "success" &&
                modalData?.txHash &&
                modalData?.heading != "Verify Phrase" ? (
                <Col sm={6}>
                  <ButtonCustom
                    fluid
                    label="View Transaction"
                    onClick={(e: any) => viewTransactiononExplorer(e)}
                  />
                </Col>
              ) : null}
            </Row>
          </div>
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

export default TransactionModal;
