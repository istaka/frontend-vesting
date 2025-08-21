/** @format */

import { Link } from "react-router-dom";
import swap from "../../Assets/Images/swap.png";
// @ts-ignore
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
// import { InfoIcon } from "../../Assets/Svg/SvgImages";

import { CustomButton } from "../../Components/UI";
import { Input } from "antd";
import BuySell from "../../Components/common/Buy-n-Sell-Form/BuySell";
import { InfoIcon } from "../../Assets/Svg/SvgImages";

const Sellpage = () => {


  const [show, setShow] = useState(false);
 

  return (
    <>
      <div className="dashboard_page">
        <Row justify="center">
          <Col xs={24} xl={18} xxl={19}>
            <Row gutter={[20, 20]} justify="center" align="middle">
              <Col xs={24} md={18} xxl={11}>
                <div className="buy-n-sell-box">
                 <h2>Sell PAZA</h2>
                  <div className="buy-n-sell-box-inner">
                    <div className="slippage-container">
                      <h5>Exchange</h5>
                      <div className="rightgroup">
                        {" "}
                        <span title="Slippage refers to the difference between the expected price of a trade and the actual price at execution.">
                          <InfoIcon />
                        </span>
                        <span>Slippage</span>
                        <Input
                          placeholder="    %"
                          type="text"
                          className="slipagebox"
                          
                        />
                      </div>
                    </div>
                    <div className="top">
                      <BuySell
                        type="number"
                        label="From"
                        name="from"
                        // defaultValue={input1}
                        placeholder="0.0"
                        maxLength={18}
                        min={0}
                      />
                        <p style={{ color: "red" }}>
                          {" "}
                          Entered amount exceeds max balance of USDC
                        </p>
                    </div>
                    <div className="swapp">
                      <Link to="#">
                        <img src={swap} alt="" />
                      </Link>
                    </div>
                    <div className="bottom">
                      <BuySell
                        type="number"
                        label="To"
                        name="to"
                       
                        placeholder="0.0"
                        maxLength={18}
                        min={0}
                      />
                     
                      <Row className="pricebar">
                        <Col xs={4} md={8} className="left">
                         
                            <>
                              <span>Tax = </span>
                              &nbsp;
                              <b>$ {"taxonSell"}</b>
                            </>
                        </Col>

                        <Col xs={12} className="right">
                          <span className="price">Price </span>
                          <span>
                            1 USDC ={" "}
                            {/* {(Number(pazaTokenprice) / 10 ** 18).toFixed(2)}{" "} */}
                            PAZA
                          </span>
                        </Col>
                      </Row>
                    </div>
                  
                      <CustomButton
                        text={
                        
                            "Sell"
                        }
                      className="ant-btn-primary w-100"
                      onClick={()=> setShow(true)}
                       
                      />
                  </div>
                </div>
              </Col>
            </Row>
          </Col>

          
        </Row>
      </div>
       
    </>
  );
};

export default Sellpage;