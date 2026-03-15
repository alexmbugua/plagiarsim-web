// Vercel Serverless Function: /api/me
// Returns a mock authenticated user.

export default function handler(req, res) {
  if (req.method === 'GET') {
    const user = {
      id: '1',
      email: 'user@example.com',
      name: 'Demo User',
      createdAt: new Date().toISOString(),
      isAdmin: true,
      roles: ['administrator'],
    };
    res.status(200).json(user);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
