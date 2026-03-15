// Vercel Serverless Function: /api/orders
const orders = [
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
];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(orders);
    return;
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
