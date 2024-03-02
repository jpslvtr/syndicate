  // App.jsx
  import { Routes, Route, Navigate } from "react-router-dom";
  import { Dashboard, Auth } from "@/layouts";
  import { Newsletter, Audience } from "@/pages/dashboard"; // Ensure these imports are correct

  function App() {
    return (
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="newsletter" element={<Newsletter />}>
            <Route path="audience" element={<Audience />} />
          </Route>
          {/* Define other nested routes within Dashboard as needed */}
        </Route>
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
    );
  }

  export default App;