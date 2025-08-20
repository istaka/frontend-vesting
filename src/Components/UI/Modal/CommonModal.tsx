/** @format */

import { Modal } from "antd";
import "./CommonModal.scss";
type Props = {
  title: string;
  isModalVisible: boolean;
  handleOk: any;
  handleCancel: any;
  children: any;
  className?: string;
};
const CommonModal = ({
  title,
  isModalVisible,
  handleOk,
  handleCancel,
  children,
  className,
}: Props) => {
  return (
    <>
      <Modal
        className={`common-modal ${className}`}
        centered
        title={title}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <>{children}</>
      </Modal>
    </>
  );
};
export default CommonModal;
