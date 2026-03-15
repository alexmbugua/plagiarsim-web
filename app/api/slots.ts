// Vercel API Route for /api/slots
let uploadSlots = 0; // In-memory storage

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    res.status(200).json({ slots: uploadSlots });
  } else if (req.method === 'POST') {
    const { slots } = req.body;
    if (typeof slots === 'number' && slots > 0) {
      uploadSlots += slots;
      res.status(200).json({ slots: uploadSlots, message: `Added ${slots} slots` });
    } else {
      res.status(400).json({ error: 'Invalid slots' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}