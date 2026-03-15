// Vercel API Route for /api/update-order
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
    const { id, status } = req.body;
    const order = orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}