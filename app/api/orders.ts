// Vercel API Route for /api/orders
let orders = [
  {
    id: '1',
    service: 'Plagiarism Check',
    status: 'completed',
    createdAt: new Date().toISOString(),
    fileName: 'document.pdf',
  },
  {
    id: '2',
    service: 'AI Detection',
    status: 'pending',
    createdAt: new Date().toISOString(),
    fileName: 'essay.docx',
  },
]; // In-memory storage

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    res.status(200).json(orders);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}