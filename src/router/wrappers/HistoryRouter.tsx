import { ReactNode, useLayoutEffect, useState } from 'react';
import { Router } from 'react-router-dom';
import { Action, History, Location } from 'history';

type TBrowserRouterProps = {
  basename?: string;
  children?: ReactNode;
  history: History;
};

const HistoryRouter: React.FC<TBrowserRouterProps> = ({ basename, children, history }) => {
  const [state, setState] = useState<{ action: Action; location: Location }>({
    action: history.action,
    location: history.location
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router basename={basename} location={state.location} navigationType={state.action} navigator={history}>
      {children}
    </Router>
  );
};

export default HistoryRouter;
