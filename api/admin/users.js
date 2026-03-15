// Vercel Serverless Function: /api/admin/users
export default function handler(req, res) {
  if (req.method === 'GET') {
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
    res.status(200).json(users);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
