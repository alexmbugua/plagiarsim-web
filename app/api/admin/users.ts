// Vercel API Route for /api/admin/users
const users = [
  {
    id: '1',
    name: 'Demo User',
    email: 'user@example.com',
    wallet: 0,
    slots: 0,
    orders: 2,
  },
];

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    res.status(200).json(users);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}