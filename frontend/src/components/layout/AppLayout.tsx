import { Outlet } from 'react-router-dom';
import { AppShell } from './AppShell';

const AppLayout = () => (
  <AppShell>
    <Outlet />
  </AppShell>
);

export default AppLayout;
