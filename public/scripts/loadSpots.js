(async () => {
    const [spotCard, star, starHalf, starOutline, firestoreLocations, firestoreReviews, firestoreStudySpots, storageImages] = await Promise.all([
        fetchComponent("cards/spot"),
        fetchIcon("star"),
        fetchIcon("starHalf"),
        fetchIcon("starOutline"),
        firebase.firestore().collection("tags").where("type", "==", "location").get(),
        firebase.firestore().collection("reviews").get(),
        firebase.firestore().collection("studySpots").get(),
        (async () => Object.fromEntries(await Promise.all((
            await firebase.storage().ref().listAll()
        ).items.map((v) => new Promise((resolve, reject) => {
            v.getDownloadURL().then((w) => {
                resolve([v.fullPath, w]);
            }).catch((err) => {
                reject(err);
            });
        })))))(),
    ])

    const locations = {};
    firestoreLocations.forEach((v) => {
        locations[v.id] = v.data().name;
    });

    const rates = {};
    firestoreReviews.forEach((v) => {
        const data = v.data();
        if (!rates.hasOwnProperty(data.studySpotId)) {
            rates[data.studySpotId] = {
                count: 0,
                rate: 0,
            };
        }
        rates[data.studySpotId].count++;
        rates[data.studySpotId].rate += data.rating;
    });
    Object.entries(rates).forEach(([k, v]) => {
        rates[k] = v.rate / v.count;
    })

    const studySpotList = [];
    firestoreStudySpots.forEach((v) => {
        const data = v.data();

        studySpotList.push({
            id: v.id,
            image: v.data().images[0],
            name: data.name,
            desc: data.description,
            type: Object.entries(data.tags).
                filter(([k, v]) => locations.hasOwnProperty(k) && v.status).
                map((v) => locations[v[0]]).
                reduce((p, c) => c ? `${p} ${c}` : p, ""),
            rate: rates[v.id] ?? 0,
        });
    });
    studySpotList.sort((i, j) => {
        if (i.rate > j.rate) {
            return -1;
        } else if (j.rate > i.rate) {
            return 1;
        }

        if (i.name > j.name) {
            return 1;
        } else if (j.name > i.name) {
            return -1;
        }

        return 0;
    });

    document.querySelector("div.toBeReplaced#spotList").innerHTML = studySpotList.reduce((p, c) => {
        return p + spotCard.
            replaceAll("{{id}}", c.id).
            replaceAll("{{image}}", storageImages[c.image]).
            replaceAll("{{name}}", c.name).
            replaceAll("{{desc}}", c.desc).
            replaceAll("{{type}}", c.type).
            replaceAll("{{star}}", generateRateStar(c.rate).reduce((p, c, i) => {
                switch (i) {
                    case 0:
                        return p + star.repeat(c);
                    case 1:
                        return p + starHalf.repeat(c);
                    case 2:
                        return p + starOutline.repeat(c);
                }
            }, "")).
            replaceAll("{{rate}}", c.rate);
    }, document.querySelector("div.toBeReplaced#spotList").innerHTML)

    document.querySelectorAll("div.toBeReplaced#spotList svg").forEach((w) => {
        w.style = "display: inline-block; margin: auto 0; fill: #000;"
    })
})();
