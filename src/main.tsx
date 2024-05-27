
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AuthProvider from './context/authcontext.tsx'
import QueryProvider from './lib/react-query/Query.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <QueryProvider>
           <AuthProvider>
          <App />
   </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  

)
