(async () => {
    const id = new URLSearchParams(window.location.search).get('id');
    const [spotCard, star, starHalf, starOutline, firestoreLocations, firestoreReviews, firestoreStudySpot, storageImages] = await Promise.all([
        fetchComponent("cards/spot"),
        fetchIcon("star"),
        fetchIcon("starHalf"),
        fetchIcon("starOutline"),
        firebase.firestore().collection("tags").get(),
        firebase.firestore().collection("reviews").where("studySpotId", "==", id).get(),
        firebase.firestore().collection("studySpots").doc(id).get(),
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

    const tags = {};
    firestoreLocations.forEach((v) => {
        tags[v.id] = v.data();
    });

    const locations = Object.fromEntries(Object.entries(tags).
        filter(([_, v]) => v.type === "location").
        map(([k, v]) => [k, v.name]));
    const features = Object.fromEntries(Object.entries(tags).
        filter(([_, v]) => v.type === "feature").
        map(([k, v]) => [k, v.name]));

    let rateCount = 0;
    let rateSum = 0;
    firestoreReviews.forEach((v) => {
        rateCount++;
        rateSum += v.data().rating;
    });
    const rate = rateSum / rateCount || 0;

    const studySpotData = firestoreStudySpot.data();
    const studySpot = {
        id: firestoreStudySpot.id,
        images: studySpotData.images,
        name: studySpotData.name,
        desc: studySpotData.description,
        types: Object.entries(studySpotData.tags).
            filter(([k, v]) => locations.hasOwnProperty(k) && v.status).
            map((v) => locations[v[0]]),
        features: Object.fromEntries(Object.entries(studySpotData.tags).
            filter(([k]) => features.hasOwnProperty(k)).
            map(([k, v]) => [features[k], v.status])),
        rate: rate,
    };

    document.querySelector("main>h1.title").innerText = studySpot.name;
    document.querySelector("main>div.toBeReplaced.mainImage").innerHTML = storageImages[studySpot.images[0]];
    document.querySelector("main>div.toBeReplaced.description").innerText = studySpot.desc;
    document.querySelector("main>div.toBeReplaced.reviewStars").innerHTML = generateRateStar(studySpot.rate).
        reduce((p, c, i) => {
            switch (i) {
                case 0:
                    return p + star.trim().repeat(c);
                case 1:
                    return p + starHalf.trim().repeat(c);
                case 2:
                    return p + starOutline.trim().repeat(c);
            }
        }, "");
})();
