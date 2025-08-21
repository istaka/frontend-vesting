import { ReactNode, useState } from "react";
import { Footer, Header } from "../../UI";
import "./PrimaryLayout.scss";
import { Outlet } from "react-router-dom";

const PrimaryLayout = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  const [active, setActive] = useState(false);
  const handleActive = () => {
    window.screen.availWidth < 1200 && setActive(!active);
  };
  return (
    <main className="primary-layout">
      <Header active={active} handleActive={handleActive} from="dddd" />
      <div className="primary-layout__inner"><Outlet/></div>
      <Footer />
    </main>
  );
};

export default PrimaryLayout;
