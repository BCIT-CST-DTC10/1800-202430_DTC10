(async () => {
    const id = new URLSearchParams(window.location.search).get(idKey);
    if (!id) {
        window.location = "/404";
    }

    const [star, starHalf, starOutline, types, spot] = await Promise.all([
        fetchIcon("star"),
        fetchIcon("starHalf"),
        fetchIcon("starOutline"),
        fetchFirestoreTypes(),
        fetchFirestoreSpotById(id),
    ]);

    const [{ [id]: images }, reviews] = await Promise.all([
        fetchStorageFilesBySpotIds([id]),
        fetchFirestoreReviews({ spotIds: [id] }),
    ]);
    const rating = calculateRatingFromReviews(reviews);

    const aggSpot = {
        id,
        images: Object.values(images),
        name: spot.name,
        description: spot.description,
        type: types[spot.type].name,
        rating,
    };

    document.querySelector("main>h1.title").innerText = aggSpot.name;
    document.querySelector("main>div.toBeReplaced.mainImage").append(...aggSpot.images.map((v) => {
        const image = document.createElement("img");
        image.src = v;
        return image;
    }));
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

    document.querySelectorAll("div.toBeReplaced#top-spot-List svg").forEach((v) => {
        v.style = "display: inline-block; margin: auto 0; fill: #000;";
    });
})();
