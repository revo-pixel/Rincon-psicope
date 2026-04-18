export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { items, payer, back_urls } = req.body;

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer APP_USR-1454479758661640-041720-88b8c13b486d82437c405e78ac9ce27c-214294215`
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