(async () => {
    const id = new URL(window.location).searchParams.get(idKey);
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
        cid: spot.googleMapsCid,
        createdAt: spot.createdAt.toDate(),
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
    document.querySelector("main>div.toBeReplaced.createdAt").innerText = `Location added at ${aggSpot.createdAt.toLocaleString("en-CA")}`;
    document.querySelector("main>div.toBeReplaced.description").innerText = aggSpot.description;
    const reviewLink = document.createElement("a");
    reviewLink.href = `/review?id=${id}`;
    reviewLink.innerHTML = generatingRatingStar(aggSpot.rating.average).
        reduce((p, c, i) => {
            switch (i) {
                case 0:
                    return p + star.trim().repeat(c);
                case 1:
                    return p + starHalf.trim().repeat(c);
                case 2:
                    return p + starOutline.trim().repeat(c);
            }
        }, "") + aggSpot.rating.ratingCount.
            map((v) => [v, Math.round(v / aggSpot.rating.count * 100 || 0)]).
            reduce((p, c) => {
                const percentage = document.createElement("percentage");
                percentage.style = `--count: ${c[0]}; --percentage: ${c[1]};`;
                const bar = document.createElement("bar");
                bar.appendChild(percentage);
                return bar.outerHTML + p;
            }, "");
    document.querySelector("main>div.toBeReplaced.reviewStars").innerHTML = reviewLink.outerHTML;

    document.querySelectorAll("div.toBeReplaced#top-spot-List svg").forEach((v) => {
        v.style = "display: inline-block; margin: auto 0; fill: #000;";
    });

    const iframe = document.createElement("iframe");
    iframe.height = window.innerWidth;
    iframe.width = window.innerWidth;
    iframe.src = `https://maps.google.com/maps?output=embed&hl=en&cid=${BigInt(aggSpot.cid)}`;
    document.querySelector("main>div.toBeReplaced.map").appendChild(iframe);
})();
