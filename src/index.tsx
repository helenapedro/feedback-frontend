import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import App from './App';
import { AwsRum, AwsRumConfig } from 'aws-rum-web';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

// AWS RUM Initialization
try {
  const config: AwsRumConfig = {
    sessionSampleRate: 1,
    identityPoolId: "us-east-2:013c6bc1-422d-4764-8a0c-86db7ec0b028",
    endpoint: "https://dataplane.rum.us-east-2.amazonaws.com",
    telemetries: ["performance","errors","http"],
    allowCookies: true,
    enableXRay: false
  };

  const APPLICATION_ID: string = '0c24ac78-19e9-4357-991a-bb42da4eef7f';
  const APPLICATION_VERSION: string = '1.0.0';
  const APPLICATION_REGION: string = 'us-east-2';

  const awsRum: AwsRum = new AwsRum(
    APPLICATION_ID,
    APPLICATION_VERSION,
    APPLICATION_REGION,
    config
  );

  console.log('AWS RUM initialized successfully');
} catch (error) {
  console.error('AWS RUM initialization failed:', error);
  // Ignore errors thrown during CloudWatch RUM web client initialization
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
