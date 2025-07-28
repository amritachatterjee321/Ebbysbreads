import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EbbysBakeryFlow from './EbbysBakeryFlow.tsx'
import ProtectedAdminRoute from './components/ProtectedAdminRoute.tsx'
import TestEmail from './test-email.tsx'
import TestProductUpdates from './test-product-updates.tsx'
import GoogleOAuthSetupGuide from './components/GoogleOAuthSetupGuide.tsx'
import OAuthTroubleshooter from './components/OAuthTroubleshooter.tsx'
import OAuthProductionChecker from './components/OAuthProductionChecker.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
              <Routes>
          <Route path="/" element={<EbbysBakeryFlow />} />
          <Route path="/admin" element={<ProtectedAdminRoute />} />
          <Route path="/test-email" element={<TestEmail />} />
          <Route path="/test-product-updates" element={<TestProductUpdates />} />
          <Route path="/setup-guide" element={<GoogleOAuthSetupGuide />} />
          <Route path="/troubleshooter" element={<OAuthTroubleshooter />} />
          <Route path="/oauth-checker" element={<OAuthProductionChecker />} />
        </Routes>
    </Router>
  </React.StrictMode>,
) 