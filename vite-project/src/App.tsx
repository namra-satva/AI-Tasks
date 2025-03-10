import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link,useLocation  } from 'react-router-dom';
import { Layout, Button, Upload, message } from 'antd';
import { History, Settings, HelpCircle, X } from 'lucide-react';
import axios from 'axios';
import Home from './Home';
import UploadPage from './UploadPage';
import ExpenseCategorization from './ExpenseCategorization';
import Chatbot from './Chatbot';
import Reconcile from './Reconcile';
import MatchedTransactions from './MacthedTransactions';
import MismatchedTransactions from './MismacthedTransactions';

const { Header, Content } = Layout;
const MatchedTransactionsWrapper = () => {
  const location = useLocation();
  console.log(location.state);
  const data = location.state?.matchedTransactions || [];
  return <MatchedTransactions matchedTransactions={data} />;
};
const MismatchedTransactionsWrapper = () => {
  
  const location = useLocation();
  console.log(location.state);
  
  const data = location.state?.mismatchedTransactions || [];  
  return <MismatchedTransactions mismatchedTransactions={data} />;
};

function App() {
  return (
    <Router>
      <Layout className="min-h-screen">
       

        {/* Navigation */}
        <nav className="bg-gray-800 p-4">
          <Link to="/" className="text-white px-4">Home</Link>
          <Link to="/upload" className="text-white px-4">Upload</Link>
          <Link to="/predict_category" className="text-white px-4">Expense Categorization</Link>
          <Link to="/finance_chatbot" className="text-white px-4">Finance Chatbot</Link>
          <Link to="/reconcile" className="text-white px-4">Reconcilliation</Link>
          <Link to="/matched-transactions" className="text-white px-4">Matched Transactions</Link>
          <Link to="/mismatched-transactions" className="text-white px-4">Mismatched Transactions</Link>
        </nav>

        {/* Page Content */}
        <Content className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/predict_category" element={<ExpenseCategorization />} />
            <Route path="/finance_chatbot" element={<Chatbot />} />
            <Route path="/reconcile" element={<Reconcile />} />
            <Route path="/matched-transactions" element={<MatchedTransactionsWrapper />} />
            <Route path="/mismatched-transactions" element={<MismatchedTransactionsWrapper />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
