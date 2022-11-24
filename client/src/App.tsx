import './App.scss';
import React, { Fragment, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import useAxios from './hooks/useAxios';
import useRefreshToken from './hooks/useRefreshToken';
import RequireAuth from './routes/RequireAuth';

import { Roles } from './utils/types';

import EntryPage from './routes/EntryPage';
const LandingPage = React.lazy(() => import('./routes/LandingPage'));

function App() {
  const { response: testdata, error, loading, axiosRequest: getData } = useAxios();
  const refresh = useRefreshToken();

  useEffect(() => {
    console.log(testdata);
  }, [testdata]);

  async function getTestData() {
    getData({
      method: 'get',
      url: 'api/v1/users/test',
    });
  }

  return (
    <Fragment>
      <button onClick={getTestData}>test me</button>
      <button onClick={refresh}>refresh</button>
      <Routes>
        <Route path='/' element={<EntryPage />} />
        <Route path='/login' element={<EntryPage />} />

        <Route
          path='/publicpage'
          element={
            <Suspense fallback={<div>loading...</div>}>
              <LandingPage />
            </Suspense>
          }
        />

        <Route element={<RequireAuth allowedRoles={[Roles.USER, Roles.ADMIN]} />}>
          <Route path='/landingpage' element={<LandingPage />} />
        </Route>

        <Route path='/*' element={<h4>error</h4>} />
      </Routes>
    </Fragment>
  );
}

export default App;
