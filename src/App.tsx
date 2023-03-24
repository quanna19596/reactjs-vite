import { useEffect } from 'react';

import Router from '@/router';
import { petActions, useAppDispatch } from '@/redux';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(petActions.findPetByIdRequest({ petId: 123 }));
  });

  return <Router />;
};

export default App;
