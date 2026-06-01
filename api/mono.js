export default async function handler(req, res) {

  const response = await fetch(
    "https://api.monobank.ua/personal/client-info",
    {
      headers: {
        "X-Token": process.env.MONO_TOKEN
      }
    }
  );

  const text = await response.text();

  return res.status(200).send(text);

}
