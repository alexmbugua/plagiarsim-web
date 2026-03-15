// Vercel API Route for /api/admin/stats
export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const stats = {
      totalUsers: 1,
      totalOrders: 2,
      completedOrders: 1,
      pendingOrders: 1,
      totalRevenue: 50,
    };
    res.status(200).json(stats);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}