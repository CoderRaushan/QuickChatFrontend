import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./ReduxStore/Store.js";
import { Provider } from "react-redux";
import SocketProvider from "./SocketProvider.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
let persistor = persistStore(store);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <App />
        </SocketProvider>
      </PersistGate>
    </Provider>
    <ToastContainer
      position="top-center"
      autoClose={1000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      limit={1}
    />
  </StrictMode>
);
