// Vercel API Route for /api/wallet
let walletBalance = 0; // In-memory storage

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    res.status(200).json({ balance: walletBalance });
  } else if (req.method === 'POST') {
    const { amount, method } = req.body;
    if (typeof amount === 'number' && amount > 0) {
      walletBalance += amount;
      res.status(200).json({ balance: walletBalance, message: `Added $${amount} via ${method}` });
    } else {
      res.status(400).json({ error: 'Invalid amount' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}