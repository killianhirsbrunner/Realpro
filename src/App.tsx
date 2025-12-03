import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AppShell>
        <Dashboard />
      </AppShell>
    </ThemeProvider>
  );
}

export default App;
