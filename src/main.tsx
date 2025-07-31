import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EbbysBakeryFlow from './EbbysBakeryFlow.tsx'
import ProtectedAdminRoute from './components/ProtectedAdminRoute.tsx'

import GoogleOAuthSetupGuide from './components/GoogleOAuthSetupGuide.tsx'
import OAuthTroubleshooter from './components/OAuthTroubleshooter.tsx'
import OAuthProductionChecker from './components/OAuthProductionChecker.tsx'
import OAuthDebugger from './components/OAuthDebugger.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
              <Routes>
          <Route path="/" element={<EbbysBakeryFlow />} />
          <Route path="/admin" element={<ProtectedAdminRoute />} />

          <Route path="/setup-guide" element={<GoogleOAuthSetupGuide />} />
          <Route path="/troubleshooter" element={<OAuthTroubleshooter />} />
          <Route path="/oauth-checker" element={<OAuthProductionChecker />} />
          <Route path="/oauth-debug" element={<OAuthDebugger />} />
        </Routes>
    </Router>
  </React.StrictMode>,
) 