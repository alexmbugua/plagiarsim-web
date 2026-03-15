// Vercel Serverless Function: /api/create-order
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
    return;
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
