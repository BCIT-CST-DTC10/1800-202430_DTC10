(async () => {
    const firestore = firebase.firestore();
    const storage = firebase.storage();

    const studySpots = firestore.collection("studySpots");

    const spotCard = await fetchComponent('cards/spot');
    const star = await fetchIcon('star');
    const starHalf = await fetchIcon('starHalf');
    const starOutline = await fetchIcon('starOutline');

    const studySpotsData = await studySpots.get();
    if (studySpotsData.empty) {
        throw new Error("Empty studySpots");
    }
    studySpotsData.forEach(async (v) => {
        const data = v.data()

        const image = await storage.ref(v.data().images[0]).getDownloadURL()

        document.querySelector('div.toBeReplaced#spotList').innerHTML += spotCard.
            replaceAll('{{id}}', v.id).
            replaceAll('{{image}}', image).
            replaceAll('{{name}}', data.name).
            replaceAll('{{desc}}', data.description).
            replaceAll('{{type}}', data.type).
            replaceAll('{{star}}', generateRateStar(data.rate).reduce((pre, cur, i) => {
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
