import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RoomsPage from './pages/RoomsPage';
import BookingsPage from './pages/BookingsPage';

// Placeholder pages (we'll create these in next commits)
const HomePage = () => (
  <div className="text-center py-20">
    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Welcome to Workspace Booking
    </h1>
    <p className="text-muted-foreground text-lg">
      Book meeting rooms with ease. Choose a page from the navigation to get started.
    </p>
  </div>
);

const AdminPage = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
    <p>Admin page coming soon...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;