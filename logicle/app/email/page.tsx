import EmailPage from './EmailPage'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emails',
};

export default async function Page() {
  return <EmailPage />
}