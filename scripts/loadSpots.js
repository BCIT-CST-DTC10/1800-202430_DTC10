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
            name: `${makeid(6)} ${makeid(6)} ${makeid(6)} ${makeid(6)}`,
            type: ['Cafe', 'School', 'Library'][Math.ceil(Math.random() * 3) % 3],
            rate: Math.round(Math.random() * 50) / 10,
        });
    }
    const spotCard = await fetchComponent('cards/spot');
    list.forEach((v, i) => {
        console.log({ i, v });
        document.querySelector('div.toBeReplaced#spotList').innerHTML += spotCard.
            replaceAll('{{name}}', v.name).
            replaceAll('{{desc}}', v.id).
            replaceAll('{{type}}', v.type).
            replaceAll('{{rate}}', v.rate);
    })
})();
