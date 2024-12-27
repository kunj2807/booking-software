import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import Route from './routes/index.js';

import {
  BrowserRouter as Router,
} from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.js';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Route />
        </Router>
      </AuthProvider>
      <ToastContainer />
    </div>
  );
}

export default App;
