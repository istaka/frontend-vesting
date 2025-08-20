/** @format */

import { useState } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/lib/table";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./CustomTable.scss";
import { EXPLORER } from "../../../Constants";

const CustomTable = (props: any) => {
  const { setpage, txHistory, total, page } = props;

  interface DataType {
    id: number;
    action: string;
    amount: string;
    pazza: number;
    date: string;
    time: string;
    txid: string;
  }
  const [currentPage, setCurrentPage] = useState<number>(1);

  const columns: ColumnsType<DataType> = [
    {
      title: "Sr No",
      dataIndex: "count",
      key: "count",
      render: (count) => {
        return (page - 1) * 10 + count;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Amount ($)",
      dataIndex: "paza",
      key: "paza",
    },
    {
      title: "PAZA",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Transaction Hash",
      dataIndex: "txid",
      key: "txid",
      render: (text) => (
        <a
          href={EXPLORER + text}
          target="_blank"
          style={{ textDecoration: "underline" }}
        >
          {text.slice(0, 4) + "..." + text.substring(text.length - 4)}
        </a>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
  ];

  /**
   * function when user change the pagination page
   * @param pagination page which user wants to visit
   */
  const handleChange = (pagination: any) => {
    setCurrentPage(pagination?.current);
    setpage(pagination?.current);
    txHistory(pagination?.current);
  };

  return (
    <>
      <PerfectScrollbar>
        <Table
          className="borrow_table"
          columns={columns}
          dataSource={props?.txHis}
          onChange={handleChange}
          pagination={
            total <= 10
              ? false
              : {
                  defaultPageSize: 10,
                  total: total,
                  current: currentPage,
                  hideOnSinglePage: true,
                }
          }
        />
      </PerfectScrollbar>
    </>
  );
};
export default CustomTable;
