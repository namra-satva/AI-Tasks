import React from "react";
import { Table, Card } from "antd";

interface MatchedTransactionsProps {
  matchedTransactions: any[];
}

const MatchedTransactions: React.FC<MatchedTransactionsProps> = ({ matchedTransactions }) => {
  const columns = [
    { title: "Bank Description", dataIndex: "Bank Description", key: "bank_description" },
    { title: "Bank Date", dataIndex: "Bank Date", key: "bank_date" },
    { title: "Bank Credit", dataIndex: "Bank Credit", key: "bank_credit", sorter: (a, b) => a["Bank Credit"] - b["Bank Credit"] },
    { title: "Bank Debit", dataIndex: "Bank Debit", key: "bank_debit", sorter: (a, b) => a["Bank Debit"] - b["Bank Debit"] },
    { title: "Accounting Description", dataIndex: "Accounting Description", key: "accounting_description" },
    { title: "Accounting Date", dataIndex: "Accounting Date", key: "accounting_date" },
    { title: "Accounting Credit", dataIndex: "Accounting Credit", key: "accounting_credit", sorter: (a, b) => a["Accounting Credit"] - b["Accounting Credit"] },
    { title: "Accounting Debit", dataIndex: "Accounting Debit", key: "accounting_debit", sorter: (a, b) => a["Accounting Debit"] - b["Accounting Debit"] },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-5xl shadow-lg p-4">
        <h2 className="text-2xl font-semibold mb-4">Matched Transactions</h2>
        <Table dataSource={JSON.parse(localStorage.getItem("matchedTransactions") || "[]")} columns={columns} rowKey="Bank Transaction ID" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default MatchedTransactions;
