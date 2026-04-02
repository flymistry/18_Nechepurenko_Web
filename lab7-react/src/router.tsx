import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import JokesPage from './pages/JokesPage';
import WeatherPage from './pages/WeatherPage';
import CurrencyPage from './pages/CurrencyPage';
import BooksPage from './pages/BooksPage';
import DogsPage from './pages/DogsPage';
import ThreadsPage from './pages/ThreadsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <JokesPage /> },
      { path: 'jokes', element: <JokesPage /> },
      { path: 'weather', element: <WeatherPage /> },
      { path: 'currency', element: <CurrencyPage /> },
      { path: 'books', element: <BooksPage /> },
      { path: 'dogs', element: <DogsPage /> },
      { path: 'threads', element: <ThreadsPage /> },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}