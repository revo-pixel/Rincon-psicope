export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { items, payer, back_urls } = req.body;

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer APP_USR-7400778288484178-041720-7dc94f844ec58fb83d70f8f5ebe9174d-3343080341`
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