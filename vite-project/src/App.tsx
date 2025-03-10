import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Button, Upload, message } from 'antd';
import { History, Settings, HelpCircle, X } from 'lucide-react';
import axios from 'axios';

// Import Pages
import Home from './Home';
import UploadPage from './UploadPage';
import ExpenseCategorization from './ExpenseCategorization';
import Chatbot from './Chatbot';
import Reconcile from './Reconcile';

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="min-h-screen">
        {/* Header */}
        <Header className="bg-[#1c3326] flex items-center justify-between px-4">
          <div className="flex items-center text-white gap-2">
            <History className="w-5 h-5" />
            <span>Invoice</span>
          </div>
          <div className="flex items-center gap-4">
            <Settings className="w-5 h-5 text-white" />
            <Button type="text" className="text-white flex items-center gap-1">
              <span>Take tour</span>
            </Button>
            <Button type="text" className="text-white flex items-center gap-1">
              <HelpCircle className="w-5 h-5" />
              <span>Feedback</span>
            </Button>
            <X className="w-5 h-5 text-white cursor-pointer" />
          </div>
        </Header>

        {/* Navigation */}
        <nav className="bg-gray-800 p-4">
          <Link to="/" className="text-white px-4">Home</Link>
          <Link to="/upload" className="text-white px-4">Upload</Link>
          <Link to="/predict_category" className="text-white px-4">Expense Categorization</Link>
          <Link to="/finance_chatbot" className="text-white px-4">Finance Chatbot</Link>
          <Link to="/reconcile" className="text-white px-4">Reconcilliation</Link>

        </nav>

        {/* Page Content */}
        <Content className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/predict_category" element={<ExpenseCategorization />} />
            <Route path="/finance_chatbot" element={<Chatbot />} />
            <Route path="/reconcile" element={<Reconcile />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
