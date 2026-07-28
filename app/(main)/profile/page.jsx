import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';

// This page acts as a redirect to the authenticated user's own profile
export default async function MyProfileRedirectPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const session = token ? verifyToken(token) : null;

  if (!session) redirect('/login');
  
  redirect(`/profile/${session.username}`);
}
