export default async function handler(req, res) {

  try {

    const response = await fetch(
      "https://api.monobank.ua/personal/client-info",
      {
        headers: {
          "X-Token": process.env.MONO_TOKEN
        }
      }
    );

    const data = await response.json();

    const jar = data.jars.find(
      item => item.sendId === "jar/AScRAeMaCs"
    );

    if (!jar) {

      return res.status(404).json({
        error: "Jar not found"
      });

    }

    const collected = Math.round(jar.balance / 100);
    const goal = Math.round(jar.goal / 100);
    const percent = Math.round(
      collected / goal * 100
    );

    return res.status(200).json({
      title: jar.title,
      collected,
      goal,
      percent,
      remaining: goal - collected
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });

  }

}
