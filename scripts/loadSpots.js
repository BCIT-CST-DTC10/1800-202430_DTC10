function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

(async () => {
    const list = [];
    for (let i = 0; i < 100; i++) {
        list.push({
            id: makeid(32),
            name: 'Lorem ipsum dolor sit',
            desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis nobis odit dolorem accusantium amet praesentium eos perspiciatis necessitatibus quam deserunt?',
            type: ['Cafe', 'School', 'Library'][Math.ceil(Math.random() * 3) % 3],
            rate: Math.round(Math.random() * 50) / 10,
        });
    }

    const spotCard = await fetchComponent('cards/spot');
    const star = await fetchIcon('star');
    const starHalf = await fetchIcon('starHalf');
    const starOutline = await fetchIcon('starOutline');
    list.forEach(async (v, i) => {
        console.log({ i, v });
        document.querySelector('div.toBeReplaced#spotList').innerHTML += spotCard.
            replaceAll('{{image}}', `https://picsum.photos/1024?random=${i + 1}`).
            replaceAll('{{name}}', v.name).
            replaceAll('{{desc}}', v.desc).
            replaceAll('{{type}}', v.type).
            replaceAll('{{star}}', generateRateStar(v.rate).reduce((pre, cur, i) => {
                switch (i) {
                    case 0:
                        return pre + star.repeat(cur);
                    case 1:
                        return pre + starHalf.repeat(cur);
                    case 2:
                        return pre + starOutline.repeat(cur);
                }
            }, '')).
            replaceAll('{{rate}}', v.rate);

        document.querySelectorAll('div.toBeReplaced#spotList svg').forEach((v) => {
            v.style = 'display: inline-block; margin: auto 0; fill: #000;'
        })
    })
})();
