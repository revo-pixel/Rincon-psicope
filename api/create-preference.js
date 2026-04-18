export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { items, payer, back_urls } = req.body;

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      items,
      payer,
      back_urls,
      auto_return: 'approved'
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}