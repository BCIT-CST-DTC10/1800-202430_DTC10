(async () => {
    const [spotCard, star, starHalf, starOutline, types, spots] = await Promise.all([
        fetchComponent("cards/spot"),
        fetchIcon("star"),
        fetchIcon("starHalf"),
        fetchIcon("starOutline"),
        fetchFirestoreTypes(),
        fetchFirestoreSpots(),
    ]);

    const spotKeys = Object.keys(spots);
    const [images, ...reviewsData] = await Promise.all([
        fetchStorageFilesBySpotIds(spotKeys),
        ...spotKeys.map((v) =>
            fetchFirestoreReviews({
                spotIds: [v],
            })),
    ]);
    const ratings = Object.fromEntries(spotKeys.map((v, i) => [v,
        (Object.values(reviewsData[i]).reduce((p, c) => p + c.rating, 0) / Object.keys(reviewsData[i]).length || 0).toFixed(2),
    ]));

    const aggSpotList = Object.entries(spots).map(([k, v]) => ({
        id: k,
        image: Object.values(images[k])[0],
        name: v.name,
        description: v.description,
        type: types[v.type].name,
        rating: ratings[k],
    })).sort((i, j) => {
        if (i.rating > j.rating) {
            return -1;
        } else if (j.rating > i.rating) {
            return 1;
        }

        if (i.name > j.name) {
            return 1;
        } else if (j.name > i.name) {
            return -1;
        }

        return 0;
    });

    document.querySelector("div.toBeReplaced#spotList").innerHTML = aggSpotList.reduce((p, c) => {
        return p + spotCard.
            replaceAll("{{id}}", c.id).
            replaceAll("{{image}}", c.image).
            replaceAll("{{name}}", c.name).
            replaceAll("{{desc}}", c.description).
            replaceAll("{{type}}", c.type).
            replaceAll("{{star}}", generatingRatingStar(c.rating).reduce((p, c, i) => {
                switch (i) {
                    case 0:
                        return p + star.repeat(c);
                    case 1:
                        return p + starHalf.repeat(c);
                    case 2:
                        return p + starOutline.repeat(c);
                }
            }, "")).
            replaceAll("{{rating}}", c.rating);
    }, document.querySelector("div.toBeReplaced#spotList").innerHTML)

    document.querySelectorAll("div.toBeReplaced#spotList svg").forEach((w) => {
        w.style = "display: inline-block; margin: auto 0; fill: #000;"
    })
})();
