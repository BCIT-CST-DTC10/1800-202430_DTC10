(async () => {
    const id = new URL(window.location).searchParams.get(idKey);
    if (!id) {
        window.location = "/404";
    }

    const [star, starHalf, starOutline, bookmark, bookmarkOutline, types, features, spot, user] = await Promise.all([
        fetchIcon("star"),
        fetchIcon("starHalf"),
        fetchIcon("starOutline"),
        fetchIcon("bookmark"),
        fetchIcon("bookmarkOutline"),
        fetchFirestoreTypes(),
        fetchFirestoreFeatures(),
        fetchFirestoreSpotById(id),
        fetchFirebaseUser(),
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

    document.querySelector("main>div.toBeReplaced.createdAt").innerText = `Location added on ${aggSpot.createdAt.toLocaleString("en-CA")}`;
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
            featureElement.appendChild(featureLabel);

            const featureDescription = document.createElement("span");
            featureDescription.innerText = typeof v === "boolean" ? v ? "Yes" : "No" : v.charAt(0).toUpperCase() + v.slice(1);
            switch (featureDescription.innerText) {
                case "Yes":
                case "Free":
                    featureElement.style.color = "white"
                    featureElement.style.backgroundColor = "#22542c" // #542222

                    featureElement.style.paddingTop = "0px"
                    featureElement.style.paddingBottom = "0px"
                    featureElement.style.paddingLeft = "6px"
                    featureElement.style.paddingRight = "6px"

                    featureElement.style.marginTop = "5px"
                    featureElement.style.marginBottom = "5px"

                    featureElement.style.borderRadius = "5px"

                    featureDescription.style.color = "#90ee90" // #ee9090
                    break
                case "No":
                case "None":
                    featureElement.style.color = "white"
                    featureElement.style.backgroundColor = "#542222"

                    featureElement.style.paddingTop = "0px"
                    featureElement.style.paddingBottom = "0px"
                    featureElement.style.paddingLeft = "6px"
                    featureElement.style.paddingRight = "6px"

                    featureElement.style.marginTop = "5px"
                    featureElement.style.marginBottom = "5px"

                    featureElement.style.borderRadius = "5px"

                    featureDescription.style.color = "#ee9090"
                    break
                case "Paid":
                    featureElement.style.color = "white"
                    featureElement.style.backgroundColor = "#545322"

                    featureElement.style.paddingTop = "0px"
                    featureElement.style.paddingBottom = "0px"
                    featureElement.style.paddingLeft = "6px"
                    featureElement.style.paddingRight = "6px"

                    featureElement.style.marginTop = "5px"
                    featureElement.style.marginBottom = "5px"

                    featureElement.style.borderRadius = "5px"

                    featureDescription.style.color = "#eee390"
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

    const updateBookmark = (isAdded) => {
        const state = isAdded ?? (user.bookmarks && Object.hasOwn(user.bookmarks, id));
        const title = document.querySelector("main>h1.title");
        title.innerText = aggSpot.name;
        title.innerHTML += state ? bookmark.trim() : bookmarkOutline.trim();
        const svg = document.querySelector("main>h1.title svg");
        svg.style = "display: inline-block; margin: auto 0; fill: #f0a92e; cursor: pointer;";
        svg.addEventListener("click", state ? async () => {
            await firebase.firestore().collection("users").doc(user.uid).update({
                [`bookmarks.${id}`]: firebase.firestore.FieldValue.delete(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            updateBookmark(false);
        } : async () => {
            await firebase.firestore().collection("users").doc(user.uid).update({
                [`bookmarks.${id}`]: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            updateBookmark(true);
        });
    }

    if (user) {
        updateBookmark();
    } else {
        document.querySelector("main>h1.title").innerText = aggSpot.name;
    }

    document.querySelector("main").style.display = "";
})();
