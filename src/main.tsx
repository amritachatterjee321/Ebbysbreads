import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EbbysBakeryFlow from './EbbysBakeryFlow.tsx'
import ProtectedAdminRoute from './components/ProtectedAdminRoute.tsx'
import TestEmail from './test-email.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
              <Routes>
          <Route path="/" element={<EbbysBakeryFlow />} />
          <Route path="/admin" element={<ProtectedAdminRoute />} />
          <Route path="/test-email" element={<TestEmail />} />
        </Routes>
    </Router>
  </React.StrictMode>,
) 