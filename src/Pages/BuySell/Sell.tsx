import { useState } from "react";
import Sellsec from "./Sellsec/Sellpage";
import HistorySec from "./HistorySec/HistorySec";

const Sell = () => {

  // State to track the function trigger
  const [isTriggered, setIsTriggered] = useState(false);

  // Function to update the state when Sellsec triggers handleSell();
  const handleTrigger = () => {
    setIsTriggered((prev) => !prev); // Toggle or set true
  };

  return (
    <>
      <Sellsec onSell={handleTrigger} />
      <HistorySec isSold={isTriggered} />
    </>
  );
};

export default Sell;
