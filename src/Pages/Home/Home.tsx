import "./Home.scss";
import HeroSec from "./HeroSec/HeroSec";
import VestingSec from "./VestingSec/VestingSec";
import HistorySec from "./HistorySec/HistorySec";
import PrimaryLayout from "../../Components/Layout/PrimaryLayout/PrimaryLayout";

const Home = () => {

  return (
    <>
      {/* <PrimaryLayout> */}
        <HeroSec />
        <VestingSec />
        <HistorySec />
      {/* </PrimaryLayout> */}
    </>
  );
};

export default Home;
