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
    if (!spot) {
        window.location = "/404";
    }

    const [{ [id]: images }, reviews] = await Promise.all([
        fetchStorageFilesBySpotIds([id]),
        fetchFirestoreReviews({ spotIds: [id] }),
    ]);
    const rating = calculateRatingFromReviews(reviews);

    const aggSpot = {
        id,
        images: Object.values(images),
        name: spot.name,
        address: spot.address,
        createdAt: spot.createdAt.toDate(),
        description: spot.description,
        type: types[spot.type].name,
        rating,
    };

    document.querySelector("main>h1.title").innerText = aggSpot.name;

    const gallery = document.querySelector("main>div.toBeReplaced.mainImage");
    gallery.replaceChildren(...aggSpot.images.map((v) => {
        const image = document.createElement("img");
        image.src = v;

        image.style.display = "block";
        image.style.height = "20em";
        image.style.width = "20em";
        image.style.marginRight = "1em";
        image.style.objectFit = "cover";
        image.style.borderRadius = "25px";

        return image;
    }));
    new Flickity(gallery, {
        initialIndex: 0,
        draggable: true,
        wrapAround: true,
    });

    document.querySelector("main>div.toBeReplaced.createdAt").innerText = `Location added at ${aggSpot.createdAt.toLocaleString("en-CA")}`;
    document.querySelector("main>div.toBeReplaced.description").innerText = aggSpot.description;
    const review = document.querySelector("main>div.toBeReplaced.reviewStars");
    review.innerHTML += generatingRatingStar(aggSpot.rating.average)
        .reduce((p, c, i) => {
            switch (i) {
                case 0:
                    return p + star.trim().repeat(c);
                case 1:
                    return p + starHalf.trim().repeat(c);
                case 2:
                    return p + starOutline.trim().repeat(c);
            }
        }, "") + aggSpot.rating.ratingCount
            .map((v) => [v, Math.round(v / aggSpot.rating.count * 100 || 0)])
            .reduce((p, c) => {
                const percentage = document.createElement("percentage");
                percentage.style = `--count: ${c[0]}; --percentage: ${c[1]};`;
                const bar = document.createElement("bar");
                bar.appendChild(percentage);
                return bar.outerHTML + p;
            }, "");
    review.addEventListener("click", () => {
        window.location = `/review?id=${id}`;
    });

    document.querySelectorAll("div.toBeReplaced#top-spot-List svg").forEach((v) => {
        v.style = "display: inline-block; margin: auto 0; fill: #000;";
    });

    const iframe = document.createElement("iframe");
    iframe.height = window.innerWidth;
    iframe.width = window.innerWidth;
    iframe.src = `https://maps.google.com/maps?output=embed&q=${aggSpot.name} ${aggSpot.address}`;
    document.querySelector("main>div.toBeReplaced.map").appendChild(iframe);
})();
