// Vercel API Route for /api/me
export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    // Mock user data
    const mockUser = {
      id: '1',
      email: 'user@example.com',
      name: 'Demo User',
      createdAt: new Date().toISOString(),
      isAdmin: true,
      roles: ['administrator'],
    };
    res.status(200).json(mockUser);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}