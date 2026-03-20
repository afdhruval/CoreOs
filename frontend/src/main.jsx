import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/index.css'
import App from './app/App.jsx'
import Approutes from "./app/App.routes.jsx";
import { store } from "./app/app.store.js";
import { Provider } from "react-redux"

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Approutes>
      <App />
    </Approutes>
  </Provider>
)
