// Vercel API Route for /api/create-order
let orders: any[] = [
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
]; // Shared in-memory storage

export default function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { service, fileName } = req.body;
    const newOrder = {
      id: (orders.length + 1).toString(),
      service,
      status: 'pending',
      createdAt: new Date().toISOString(),
      fileName,
    };
    orders.push(newOrder);
    res.status(201).json(newOrder);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}