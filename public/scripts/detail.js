(async () => {
    const id = new URLSearchParams(window.location.search).get('id');
    const [star, starHalf, starOutline, types, spot] = await Promise.all([
        fetchIcon("star"),
        fetchIcon("starHalf"),
        fetchIcon("starOutline"),
        fetchFirestoreTypes(),
        fetchFirestoreSpotById(id),
    ]);

    const [{ [id]: images }, reviewsData] = await Promise.all([
        fetchStorageFilesBySpotIds([id]),
        fetchFirestoreReviews({ spotIds: [id] }),
    ]);
    const rating = (Object.values(reviewsData).reduce((p, c) => p + c.rating, 0) / Object.keys(reviewsData).length || 0).toFixed(2);

    const aggSpot = {
        id,
        images: Object.values(images),
        name: spot.name,
        description: spot.description,
        type: types[spot.type].name,
        rating,
    };

    document.querySelector("main>h1.title").innerText = aggSpot.name;
    document.querySelector("main>div.toBeReplaced.mainImage").innerHTML = aggSpot.images;
    document.querySelector("main>div.toBeReplaced.description").innerText = aggSpot.description;
    document.querySelector("main>div.toBeReplaced.reviewStars").innerHTML = generatingRatingStar(aggSpot.rating).
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
