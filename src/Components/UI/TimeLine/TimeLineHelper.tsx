import { Paza_Address } from "../../../Constant";
import { toast } from "../../common/Toasts/Toast";
import { setloader } from "../../../redux/reducers/Loader/loaderslice";
import { callSendMethod } from "../../../service/contractServices/contract.service";
import {
  checkBalances,
  getDecimal,
} from "../ConnectWallet/connectWalletHelper";
import { setSelectedVestingAddress } from "../../../redux/reducers/login/address/address";

export const claimFunction = async (
  data: any,
  dispatch: any,
  wallet_Address: any
) => {
  console.log("data?.beneficiary", data);

  try {
    let sendData: any;
    let address: any;
    let contract: any;
    if (data?.type == "single") {
      sendData = [Paza_Address];
      address = wallet_Address;
      contract = "VESTING_CONTRACT";
    } else {
      sendData = [Paza_Address];
      address = wallet_Address;
      contract = "MULTI_VESTING_CONTRACT";
    }
    let result: any = await callSendMethod(
      "claim",
      sendData,
      address,
      contract,
      "",
      data?.contractAddress
    );
    if (result?.blockHash) {
      return result;
    }
  } catch (error) {
    
    dispatch(setloader(false));
    if (error.message.match("User denied transaction signature")) {
      toast.error("User denied transaction signature");
    } else if (error?.message) {
      toast.error("Error claiming tokens");
    } else {
      toast.error(error);
    }
    return error;
  }
};

export const checkBalanceAfterClaim = async (
  data: any,
  dispatch: any,
  wallet_Address: any
) => {
  console.log("datadata ", data);
  let selectedData = {
    type: data?.type,
    contractAddress: data?.contractAddress,
    // contractAddress: data?.value,
  };
  if (selectedData) {
    let data = [Paza_Address];
    let decimal: any = await getDecimal();
    if (selectedData.type == "single") {
      await checkBalances(data, selectedData, decimal, dispatch);
    } else if (selectedData.type == "multi") {
      let data = [Paza_Address, wallet_Address];
      await checkBalances(data, selectedData, decimal, dispatch);
    }
  }
};

const timeLineData = [
  {
    year: "Jan, 2023",
    token: "100",
    isClaimed: true,
  },
  {
    year: "Jan, 2024",
    token: "100",
    // isClaimable: true,
    // isNotClaim: true,
  },
  {
    year: "Jan, 2025",
    token: "100",
    // isClaimable: true,
    // isNotClaim: true,
  },
  {
    year: "Jan, 2026",
    token: "100",
    isClaimable: false,
  },
  {
    year: "Jan, 2026",
    token: "100",
    isClaimable: true,
  },
  {
    year: "Jan, 2026",
    token: "100",
    isClaimable: false,
  },
  {
    year: "Jan, 2027",
    token: "100",
  },
];

export const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 5,
  arrows: false,
  responsive: [
    {
      breakpoint: 1368,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      },
    },

    {
      breakpoint: 767,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 374,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};


