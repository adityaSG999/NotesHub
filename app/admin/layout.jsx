import AdminSidebar from '@/components/features/AdminSidebar';

export const metadata = {
  title: 'Admin Panel | NotesHub',
};

export default function AdminLayout({ children }) {
  return <AdminSidebar>{children}</AdminSidebar>;
}
