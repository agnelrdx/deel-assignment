import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import HomePage from 'routes/home/HomePage';
import DashboardPage from 'routes/dashboard/DashboardPage';
import NotFoundPage from 'routes/not-found/NotFoundPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate replace to="/404" />} />
    </>
  )
);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
