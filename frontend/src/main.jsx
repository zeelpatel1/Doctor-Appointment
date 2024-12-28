import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {PersistGate} from 'redux-persist/integration/react'
import App from './App.jsx'
import {Provider} from 'react-redux'
import store,{persistor} from './redux/store.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
  </Provider>,
)