import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RoomsPage from './pages/RoomsPage';
import BookingsPage from './pages/BookingsPage';
import AdminPage from './pages/AdminPage';

// Home page
const HomePage = () => (
  <div className="text-center py-20">
    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Welcome to Workspace Booking
    </h1>
    <p className="text-muted-foreground text-lg mb-8">
      Book meeting rooms with ease. Choose a page from the navigation to get started.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
      <div className="p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow">
        <h3 className="font-semibold text-lg mb-2">Browse Rooms</h3>
        <p className="text-sm text-muted-foreground">View available meeting rooms and book your slot</p>
      </div>
      <div className="p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow">
        <h3 className="font-semibold text-lg mb-2">Manage Bookings</h3>
        <p className="text-sm text-muted-foreground">View and cancel your existing bookings</p>
      </div>
      <div className="p-6 bg-white rounded-lg border hover:shadow-lg transition-shadow">
        <h3 className="font-semibold text-lg mb-2">Analytics</h3>
        <p className="text-sm text-muted-foreground">Track revenue and utilization metrics</p>
      </div>
    </div>
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