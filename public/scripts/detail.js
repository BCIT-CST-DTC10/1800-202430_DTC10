(async () => {
    const id = new URL(window.location).searchParams.get(idKey);
    if (!id) {
        window.location = "/404";
    }

    const [star, starHalf, starOutline, types, features, spot] = await Promise.all([
        fetchIcon("star"),
        fetchIcon("starHalf"),
        fetchIcon("starOutline"),
        fetchFirestoreTypes(),
        fetchFirestoreFeatures(),
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
        features: spot.features,
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

    if (aggSpot.features) {
        const featuresContainer = document.querySelector("main>div.toBeReplaced.features");
        featuresContainer.innerHTML = "";

        Object.entries(aggSpot.features).forEach(([k, v]) => {
            const featureElement = document.createElement("div");
            featureElement.classList.add("feature-item");

            const featureLabel = document.createElement("strong");
            featureLabel.innerText = `${features[k].name}: `;
            featureLabel.style.marginTop = "10px"
            featureLabel.style.marginBottom = "10px"
            featureElement.appendChild(featureLabel);

            const featureDescription = document.createElement("span");
            featureDescription.innerText = typeof v === "boolean" ? v ? "Yes" : "No" : v.charAt(0).toUpperCase() + v.slice(1);
            switch (featureDescription.innerText) {
                case "Yes":
                case "Free":
                    featureDescription.style.color = "#90ee90"
                    featureDescription.style.backgroundColor = "#22542c"
                    featureDescription.style.paddingTop = "0px"
                    featureDescription.style.paddingBottom = "0px"
                    featureDescription.style.paddingLeft = "6px"
                    featureDescription.style.paddingRight = "6px"
                    featureDescription.style.borderRadius = "5px"
                    break
                case "No":
                case "None":
                    featureDescription.style.color = "#ee9090"
                    featureDescription.style.backgroundColor = "#542222"
                    featureDescription.style.paddingTop = "0px"
                    featureDescription.style.paddingBottom = "0px"
                    featureDescription.style.paddingLeft = "6px"
                    featureDescription.style.paddingRight = "6px"
                    featureDescription.style.borderRadius = "5px"
                    break
                case "Paid":
                    featureDescription.style.color = "Yellow"
                    break
            }
            featureElement.appendChild(featureDescription);
            featuresContainer.appendChild(featureElement);
        });
    }

    const iframe = document.createElement("iframe");
    iframe.height = window.innerWidth;
    iframe.width = window.innerWidth;
    iframe.src = `https://maps.google.com/maps?output=embed&q=${aggSpot.name} ${aggSpot.address}`;
    document.querySelector("main>div.toBeReplaced.map").appendChild(iframe);
})();
