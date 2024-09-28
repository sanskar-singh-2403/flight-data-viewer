import { Metadata } from 'next';
import FlightTable from './components/FlightTable';
import FileUpload from './components/FileUpload';

export const metadata: Metadata = {
  title: 'Pretectum | Flight Data Viewer',
  description: 'View and search flight data',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Flight Data Viewer</h1>
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <FileUpload />
        </div>
        <FlightTable />
      </div>
    </main>
  );
}