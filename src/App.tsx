import { Provider } from 'react-redux';

import Router from '@/router';
import { store } from '@/redux';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
};

export default App;
