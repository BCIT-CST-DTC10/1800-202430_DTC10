(async () => {
    const [spotCard, star, starHalf, starOutline, types, spots, user] = await Promise.all([
        fetchComponent("cards/spot"),
        fetchIcon("star"),
        fetchIcon("starHalf"),
        fetchIcon("starOutline"),
        fetchFirestoreTypes(),
        fetchFirestoreSpots(),
        fetchFirebaseUser()
    ]);

    document.querySelector("span.username").innerHTML = user.displayName;

    const spotKeys = Object.keys(user.bookmarks);
    if (spotKeys && spotKeys.length) {
        const [images, ...reviews] = await Promise.all([
            fetchStorageFilesBySpotIds(spotKeys),
            ...spotKeys.map((v) =>
                fetchFirestoreReviews({
                    spotIds: [v],
                })),
        ]);

        const ratings = Object.fromEntries(spotKeys.map((v, i) => [v, calculateRatingFromReviews(reviews[i]).average]));

        document.querySelector("div.toBeReplaced#favSpots").innerHTML = spotKeys
            .map((v) => ({
                id: v,
                image: Object.values(images[v])[0],
                name: spots[v].name,
                description: spots[v].description,
                type: types[spots[v].type].name,
                rating: ratings[v],
            }))
            .sort((i, j) => user.bookmarks[j.id].toDate() - user.bookmarks[i.id].toDate())
            .reduce((p, c) => p + spotCard
                .replaceAll("{{id}}", c.id)
                .replaceAll("{{image}}", c.image)
                .replaceAll("{{name}}", c.name)
                .replaceAll("{{description}}", c.description)
                .replaceAll("{{type}}", c.type)
                .replaceAll("{{star}}", generatingRatingStar(c.rating).reduce((p, c, i) => {
                    switch (i) {
                        case 0:
                            return p + star.repeat(c);
                        case 1:
                            return p + starHalf.repeat(c);
                        case 2:
                            return p + starOutline.repeat(c);
                    }
                }, ""))
                .replaceAll("{{rating}}", c.rating), document.querySelector("div.toBeReplaced#favSpots").innerHTML);
    }
})();
