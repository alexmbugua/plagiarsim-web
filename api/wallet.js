// Vercel Serverless Function: /api/wallet
let walletBalance = 0;

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ balance: walletBalance });
    return;
  }

  if (req.method === 'POST') {
    const { amount, method } = req.body;
    if (typeof amount === 'number' && amount > 0) {
      walletBalance += amount;
      res.status(200).json({ balance: walletBalance, message: `Added $${amount} via ${method}` });
    } else {
      res.status(400).json({ error: 'Invalid amount' });
    }
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
