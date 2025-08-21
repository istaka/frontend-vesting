import web3Service from "../../../service/contractServices/web3.service";


export const getSellPazaPriceFun = async (data: any) => {
    const usdcDec: any = await web3Service?.getDecimalsPaza();
    const sellUsdcPriceVal: any = await web3Service?.getSellPazaPrice(data);
    
    let price = sellUsdcPriceVal / 10 ** usdcDec;
    let finalObject = {
      inputValue: price,
      convertedValue: sellUsdcPriceVal,
    };
    return finalObject;
    // let tokenprice: any = (pazaPriceVal);
  };

  export const getSellUsdcPriceFun = async (data: any) => {
    try {
  
      const pazaDec: any = await web3Service?.getDecimalsUsdc();
      const sellUsdcPriceVal: any = await web3Service?.getSellUsdcPrice(data);
  
      let price = sellUsdcPriceVal / 10 ** pazaDec;
      return {
        inputValue: price,
        convertedValue: sellUsdcPriceVal,
      };
    } catch (error: any) {
      console.error("Error in getSellUsdcPriceFun:", error);
      // toast.error("Failed to fetch sell price. Please try again.");
      return null; 
    }
  };


