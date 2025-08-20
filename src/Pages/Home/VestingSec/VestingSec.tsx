import "./VestingSec.scss";
import Slider from "react-slick";
import { useEffect } from "react";
import { Paza_Address } from "../../../Constant";
import { TimeLine } from "../../../Components/UI";
import { useDispatch, useSelector } from "react-redux";
import {
  checkBalances,
  getDecimal,
} from "../../../Components/UI/ConnectWallet/connectWalletHelper";
import {
  SliderLeftIcon,
  SliderRightIcon,
} from "../../../Assets/Icon/svg/SvgIcons";

const VestingSec = () => {
  const dispatch = useDispatch();

  const owner = useSelector((state: any) => state?.address?.owner);
  const wallet_Address = useSelector(
    (state: any) => state?.address?.walletAddress
  );
  const ownerBalances = useSelector(
    (state: any) => state?.address?.ownerBalances
  );
  const selectedVesting = useSelector(
    (state: any) => state?.address?.selectedVestingAddress
  );

  const stakingData = [
    {
      title: "BALANCE (VESTED)",
      value: ownerBalances ? `${ownerBalances?.balance_Vested} PAZA` : "0 PAZA",
    },
    {
      title: "CLAIMED",
      value: ownerBalances ? `${ownerBalances?.claimed} PAZA` : "0 PAZA",
    },
    {
      title: "TOTAL ALLOCATED",
      value: ownerBalances
        ? `${ownerBalances?.total_Allocation} PAZA`
        : "0 PAZA",
    },
    // {
    //   title: "Issue Price",
    //   // value: ownerBalances ? `${ownerBalances?.proxyBal} USDC` : "0 PAZA",
    //   value: wallet_Address ? "0.033 USDC" : "0.00 USDC",
    // },
    {
      title: "Current Price",
      // value: ownerBalances ? ownerBalances?.total_Allocation : "0",
      value: ownerBalances ? `${ownerBalances?.proxyBal} USDC` : "0 USDC",
    },
  ];

  function NextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style }} onClick={onClick}>
        <SliderRightIcon />
      </div>
    );
  }

  function PrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div className={className} style={{ ...style }} onClick={onClick}>
        <SliderLeftIcon />
      </div>
    );
  }
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    arrows: false,

    responsive: [
      {
        breakpoint: 1368,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          dots: false,
          arrows: false,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 424,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
        },
      },
    ],
  };
  const checkBal = async () => {
    if (selectedVesting) {
      let data: any;
      if (
        selectedVesting?.type == "single"
          ? (data = [Paza_Address])
          : (data = [Paza_Address, wallet_Address])
      ) {
        // let data = [Paza_Address];
        let decimal: any = await getDecimal();
        // let data1 = [Paza_Address, wallet_Address];
        await checkBalances(data, selectedVesting, decimal, dispatch);
      }
    }
  };
  useEffect(() => {
    checkBal();
  }, [selectedVesting]);

  return (
    <section className="vesting-sec">
      {/* <Container> */}
      <div className="vesting-sec__slider">
        <Slider {...settings}>
          {stakingData.map((item, index) => (
            <div key={index}>
              <div className="vesting-card">
                <h6 className="text-secondary">
                  {item.value}{" "}
                  {/* {item?.title == "Current Price" ? "USDC" : "PAZA"} */}
                </h6>
                <h5>{item.title}</h5>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <TimeLine />
      {/* </Container> */}
    </section>
  );
};

export default VestingSec;
