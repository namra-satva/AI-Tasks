import React, { useState } from "react";
import axios from "axios";
import { Button, Alert, Spin, Upload } from "antd";
import { UploadOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function Reconcile() {
  const [bankFile, setBankFile] = useState<File | null>(null);
  const [accountingFile, setAccountingFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchedTransactions, setMatchedTransactions] = useState([]);
  const [mismatchedTransactions, setMismatchedTransactions] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (file: File, type: "bank" | "accounting") => {
    if (type === "bank") {
      setBankFile(file);
    } else {
      setAccountingFile(file);
    }
    return false; // Prevent default upload behavior
  };

  const handleUpload = async () => {
    if (!bankFile || !accountingFile) {
      setError("Please upload both CSV files.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("bank_file", bankFile);
    formData.append("accounting_file", accountingFile);

    try {
      const response = await axios.post("http://127.0.0.1:5000/reconcile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      localStorage.setItem("matchedTransactions", JSON.stringify(response.data.matched_transactions));
      localStorage.setItem("mismatchedTransactions", JSON.stringify(response.data.mismatched_transactions));

      setMatchedTransactions(JSON.parse(localStorage.getItem("matchedTransactions") || "[]"));
      setMismatchedTransactions(JSON.parse(localStorage.getItem("mismatchedTransactions") || "[]"));
      setShowButtons(true); // Show buttons after reconciliation
    } catch (err) {
      setError("Error processing files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-6">Upload CSV Files for Reconciliation</h2>

      {/* Upload Section (Full Width, Side by Side) */}
      <div className="flex justify-center w-full px-8 space-x-8">
        {/* Bank File Upload */}
        <div className="flex flex-col items-center justify-center w-1/2 h-64 border-2 border-dashed border-blue-400 rounded-lg bg-white shadow-md p-6">
          <FileTextOutlined className="text-4xl text-blue-500 mb-3" />
          <h3 className="text-lg font-medium mb-3">Upload Bank Statement</h3>
          <Upload.Dragger beforeUpload={(file) => handleFileChange(file, "bank")} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Choose Bank CSV</Button>
          </Upload.Dragger>
          {bankFile && <p className="text-sm text-gray-600 mt-3">{bankFile.name}</p>}
        </div>

        {/* Accounting File Upload */}
        <div className="flex flex-col items-center justify-center w-1/2 h-64 border-2 border-dashed border-green-400 rounded-lg bg-white shadow-md p-6">
          <FileTextOutlined className="text-4xl text-green-500 mb-3" />
          <h3 className="text-lg font-medium mb-3">Upload Accounting Records</h3>
          <Upload.Dragger beforeUpload={(file) => handleFileChange(file, "accounting")} showUploadList={false}>
            <Button icon={<UploadOutlined />}>Choose Accounting CSV</Button>
          </Upload.Dragger>
          {accountingFile && <p className="text-sm text-gray-600 mt-3">{accountingFile.name}</p>}
        </div>
      </div>

      {/* Upload & Reconcile Button */}
      <div className="mt-8">
        <Button type="primary" onClick={handleUpload} size="large" disabled={loading}>
          {loading ? <Spin size="large" /> : "Upload & Reconcile"}
        </Button>
      </div>

      {/* Error Message */}
      {error && <Alert message={error} type="error" className="mt-4" />}

      {/* Show Buttons After Successful Reconciliation */}
      {showButtons && (
        <div className="mt-6 flex space-x-4">
          <Button type="primary" onClick={() => navigate("/matched-transactions", { state: { matchedTransactions } })}>
            View Matched Transactions
          </Button>
          <Button type="default" onClick={() => navigate("/mismatched-transactions", { state: { mismatchedTransactions } })}>
            View Mismatched Transactions
          </Button>
        </div>
      )}
    </div>
  );
}

export default Reconcile;
