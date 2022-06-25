import "../styles/index.css";
import "../public/fontawesome/css/all.min.css";
import App from "../components/App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/redux-store";

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App>
          <Component {...pageProps} />
        </App>
      </PersistGate>
    </Provider>
  );
};

export default MyApp;
