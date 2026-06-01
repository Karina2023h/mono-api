export default async function handler(req, res) {

    const response = await fetch(
        'https://api.monobank.ua/personal/client-info',
        {
            headers: {
                'X-Token': process.env.MONO_TOKEN
            }
        }
    );

    const data = await response.json();

    const jar = data.jars.find(
        item => item.sendId === 'jar/AScRAeMaCs'
    );

    if (!jar) {

        return res.status(404).json({
            error: 'Jar not found'
        });

    }

    return res.status(200).json({

        title: jar.title,

        collected: jar.balance / 100,

        goal: jar.goal / 100,

        percent: Math.round(
            (jar.balance / jar.goal) * 100
        ),

        remaining:
            (jar.goal - jar.balance) / 100

    });

}
