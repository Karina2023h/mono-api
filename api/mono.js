export default async function handler(req, res) {

  res.setHeader(
    'Access-Control-Allow-Origin',
    '*'
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, OPTIONS'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {

    const response = await fetch(
      'https://api.monobank.ua/personal/client-info',
      {
        headers: {
          'X-Token': process.env.MONO_TOKEN
        }
      }
    );

    if (!response.ok) {

      return res.status(500).json({
        error: 'Monobank API Error',
        status: response.status
      });

    }

    const data = await response.json();

    if (
      !data ||
      !data.jars ||
      !Array.isArray(data.jars)
    ) {

      return res.status(500).json({
        error: 'No jars returned'
      });

    }

    const jar = data.jars.find(
      item => item.sendId === 'jar/AScRAeMaCs'
    );

    if (!jar) {

      return res.status(404).json({
        error: 'Jar not found'
      });

    }

    const collected =
      Number(jar.balance || 0) / 100;

    const goal =
      Number(jar.goal || 0) / 100;

    const remaining =
      Math.max(
        goal - collected,
        0
      );

    const percent =
      goal > 0
        ? (collected / goal) * 100
        : 0;

    return res.status(200).json({

      success: true,

      title:
        jar.title || 'Збір',

      collected:
        Math.round(collected),

      goal:
        Math.round(goal),

      remaining:
        Math.round(remaining),

      percent:
        Number(
          percent.toFixed(1)
        ),

      updated:
        Date.now()

    });

  } catch (error) {

    return res.status(500).json({

      success: false,

      error:
        error.message

    });

  }

}
