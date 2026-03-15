// Vercel API Route for /api/admin/add-wallet
let walletBalance = 0; // Shared with wallet.ts

export default function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { userId, amount } = req.body;
    if (typeof amount === 'number' && amount > 0) {
      walletBalance += amount;
      res.status(200).json({ message: `Added $${amount} to user ${userId}'s wallet` });
    } else {
      res.status(400).json({ error: 'Invalid amount' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}