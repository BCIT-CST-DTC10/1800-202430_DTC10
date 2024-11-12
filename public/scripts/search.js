(async () => {
    const [spotCard, button, star, starHalf, starOutline, types, features, spots] = await Promise.all([
        fetchComponent("cards/spot"),
        fetchComponent("searchFilterButton"),
        fetchIcon("star"),
        fetchIcon("starHalf"),
        fetchIcon("starOutline"),
        fetchFirestoreTypes(),
        fetchFirestoreFeatures(),
        fetchFirestoreSpots(),
    ]);

    const spotKeys = Object.keys(spots);
    const [images, ...reviews] = await Promise.all([
        fetchStorageFilesBySpotIds(spotKeys),
        ...spotKeys.map((v) =>
            fetchFirestoreReviews({
                spotIds: [v],
            })),
    ]);
    const ratings = Object.fromEntries(spotKeys.map((v, i) => [v, calculateRatingFromReviews(reviews[i])]));

    const aggSpots = Object.entries(spots).
        map(([k, v]) => ({
            id: k,
            image: Object.values(images[k])[0],
            name: v.name,
            description: v.description,
            typeName: types[v.type].name,
            type: v.type,
            features: v.features,
            rating: ratings[k],
        })).
        sort((i, j) => {
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

    const callbackReduceAggSpotsToSpotCards = (p, c) => p + spotCard.
        replaceAll("{{id}}", c.id).
        replaceAll("{{image}}", c.image).
        replaceAll("{{name}}", c.name).
        replaceAll("{{description}}", c.description).
        replaceAll("{{type}}", c.typeName).
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

    const updateSpotCards = () => {
        let filtered = aggSpots;

        const search = document.querySelector("div.search-bar>input").value;
        if (search) {
            filtered = filtered.
                filter((v) => RegExp(search, "gi").test(v.name) || RegExp(search, "gi").test(v.description));
        }

        const types = []
        document.querySelectorAll("div#filter-section>a.button.activated").forEach((v) => {
            types.push(v.id);
        });
        if (types.length) {
            filtered = filtered.
                filter((v) => types.includes(v.type));
        }

        const features = []
        document.querySelectorAll("div#filter-section>a.button.activated").forEach((v) => {
            types.push(v.id);
        });
        if (features) {
            filtered = filtered.
                filter((v) => features.filter(value => Object.keys(v.features).includes(value)).length);
        }

        if (filtered.length === aggSpots.length) {
            filtered = aggSpots.slice(0, 5);
        }
        document.querySelector("div.toBeReplaced#top-spot-List").innerHTML = filtered.reduce(callbackReduceAggSpotsToSpotCards, "");
    }

    document.querySelector("div#filter-section").innerHTML = Object.entries(types).
        map(([k, v]) => ({
            id: k,
            name: v.name,
        })).
        sort((i, j) => {
            if (i.name > j.name) {
                return 1;
            } else if (j.name > i.name) {
                return -1;
            }

            return 0;
        }).
        reduce((p, c) => p + button.
            replaceAll("{{id}}", c.id).
            replaceAll("{{name}}", c.name), document.querySelector("div#filter-section").innerHTML);

    document.querySelectorAll("div.toBeReplaced#top-spot-List svg").forEach((w) => {
        w.style = "display: inline-block; margin: auto 0; fill: #000;";
    });

    document.querySelectorAll("div#filter-section>a.button").forEach((v) => {
        v.addEventListener("click", (e) => {
            if (e.target.classList.contains("activated")) {
                e.target.classList.remove("activated");
            } else {
                e.target.classList.add("activated");
            }
            updateSpotCards();
        });
    });

    document.querySelector("div.search-bar>button").addEventListener("click", () => {
        updateSpotCards();
    });

    updateSpotCards();
})();
