import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/clientes');
  return null; // redirect() throws an error, so this is technically unreachable but good practice.
}
