import React, { useState } from "react";
import axios from "axios";

function Reconcile(){
  const [bankFile, setBankFile] = useState<File | null>(null);
  const [accountingFile, setAccountingFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [matchedFile, setMatchedFile] = useState<string | null>(null);
  const [mismatchedFile, setMismatchedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "bank" | "accounting") => {
    if (event.target.files && event.target.files.length > 0) {
      type === "bank" ? setBankFile(event.target.files[0]) : setAccountingFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!bankFile || !accountingFile) {
      setError("Please upload both CSV files.");
      return;
    }

    setLoading(true);
    setError(null);
    setMatchedFile(null);
    setMismatchedFile(null);

    const formData = new FormData();
    formData.append("bank_file", bankFile);
    formData.append("accounting_file", accountingFile);

    try {
      const response = await axios.post("http://127.0.0.1:5000/reconcile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMatchedFile(response.data.matched_file);
      setMismatchedFile(response.data.mismatched_file);
    } catch (err) {
      setError("Error processing files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Upload CSV Files</h2>

        {/* Bank File Input */}
        <input type="file" accept=".csv" onChange={(e) => handleFileChange(e, "bank")} className="mb-2" />
        {bankFile && <p className="text-sm text-gray-600">{bankFile.name}</p>}

        {/* Accounting File Input */}
        <input type="file" accept=".csv" onChange={(e) => handleFileChange(e, "accounting")} className="mb-4" />
        {accountingFile && <p className="text-sm text-gray-600">{accountingFile.name}</p>}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? "Processing..." : "Upload & Reconcile"}
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-3">{error}</p>}

        {/* Download Links */}
        {matchedFile && (
          <div className="mt-4">
            <a href={`http://127.0.0.1:5000${matchedFile}`} download className="text-green-600 underline">
              📂 Download Matched Transactions
            </a>
          </div>
        )}

        {mismatchedFile && (
          <div className="mt-2">
            <a href={`http://127.0.0.1:5000${mismatchedFile}`} download className="text-red-600 underline">
              📂 Download Mismatched Transactions
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reconcile;
