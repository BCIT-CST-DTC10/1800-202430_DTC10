const idKey = "id";
const redirectUriKey = "redirect_uri";

const fetchComponent = async (fileName) => {
    try {
        const response = await fetch(
            `/components/${fileName}.html`,
        );
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.text();
    } catch (err) {
        console.error("fetchComponent:", err.message);
    }
}

const fetchIcon = async (fileName) => {
    try {
        const response = await fetch(
            `/icons/${fileName}.svg`,
        );
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.text();
    } catch (err) {
        console.error("fetchIcon:", err.message);
    }
}

const fetchFirebaseUser = async () => {
    return new Promise((res) => {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                firebase.firestore().collection("users").doc(
                    user.uid
                ).get().then((v) => {
                    res(Object.assign(user, v.data()));
                }).catch((err) => {
                    console.error("fetchFirebaseUser:", err);
                });
            }
            else {
                res();
            }
        });
    });
}

const fetchFirestoreTypes = async () => {
    try {
        const types = {};
        (await firebase.firestore().collection("types").get()).
            forEach((v) => {
                types[v.id] = v.data();
            });
        return types;
    } catch (err) {
        console.error("fetchFirestoreTypes:", err);
    }
}

const fetchFirestoreFeatures = async () => {
    try {
        const features = {};
        (await firebase.firestore().collection("features").get()).
            forEach((v) => {
                features[v.id] = v.data();
            });
        return features;
    } catch (err) {
        console.error("fetchFirestoreFeatures:", err);
    }
}

const fetchFirestoreSpots = async (options) => {
    const {
        types,
        features,
    } = options ?? {};
    try {
        const spots = {};
        const firestoreCollection = firebase.firestore().collection("spots");
        let firestoreQuery = types instanceof Array ?
            firestoreCollection.where("type", "in", types) :
            firestoreCollection;
        firestoreQuery = features instanceof Array ?
            firestoreQuery.where("feature", "in", features) :
            firestoreQuery;
        (await firestoreQuery.get()).
            forEach((v) => {
                spots[v.id] = v.data();
            });
        return spots;
    } catch (err) {
        console.error("fetchFirestoreSpots:", err);
    }
}

const fetchFirestoreSpotById = async (spotId) => {
    try {
        return (await firebase.firestore().collection("spots").doc(spotId).get()).data();
    } catch (err) {
        console.error("fetchFirestoreSpotById:", err);
    }
}

const fetchStorageFilesBySpotIds = async (spotIds) => {
    try {
        const storage = firebase.storage();
        const storageFiles = await Promise.all((
            await Promise.all(spotIds.map((v) => storage.ref(v).listAll()))
        ).map((v) =>
            Promise.all(v.items.map((w) =>
                new Promise((resolve, reject) => {
                    w.getDownloadURL().then((x) => {
                        resolve([w.fullPath, x]);
                    }).catch((err) => {
                        reject(err);
                    });
                })
            ))
        ));
        return Object.fromEntries(spotIds.map((v, i) =>
            [v, Object.fromEntries(storageFiles[i])]
        ));
    } catch (err) {
        console.error("fetchStorageFilesBySpotIds:", err);
    }
}

const fetchFirestoreReviews = async (options) => {
    const {
        userIds,
        spotIds,
    } = options ?? {};
    try {
        const reviews = {};
        const firestoreCollection = firebase.firestore().collection("reviews");
        let firestoreQuery = userIds instanceof Array ?
            firestoreCollection.where("userId", "in", userIds) :
            firestoreCollection;
        firestoreQuery = spotIds instanceof Array ?
            firestoreQuery.where("spotId", "in", spotIds) :
            firestoreQuery;
        (await firestoreQuery.get()).
            forEach((v) => {
                reviews[v.id] = v.data();
            });
        return reviews;
    } catch (err) {
        console.error("fetchFirestoreReviews:", err);
    }
}

const calculateRatingFromReviews = (reviews) => (Object.values(reviews).reduce((p, c) => p + c.rating, 0) / Object.keys(reviews).length || 0).toFixed(2);

const generatingRatingStar = (rating) => [Math.floor(rating), rating % 1 ? 1 : 0, 5 - Math.floor(rating) - (rating % 1 ? 1 : 0)];

const loadRatingStar = async (rating) => {
    const stars = generatingRatingStar(rating);
    const star = await fetchIcon("star");
    const starHalf = await fetchIcon("starHalf");
    const starOutline = await fetchIcon("starOutline");
    return stars.reduce((p, c, i) => {
        switch (i) {
            case 0:
                return p + star.repeat(c);
            case 1:
                return p + starHalf.repeat(c);
            case 2:
                return p + starOutline.repeat(c);
        }
    }, "")
}

(async () => {
    document.querySelector("nav.toBeReplaced").innerHTML = await fetchComponent("topNav");

    document.querySelector("nav.nav-bar-before>a.signIn-button").addEventListener("click", () => {
        window.location = `/login?redirect_uri=${encodeURIComponent(window.location.pathname + window.location.search)}`;
    });

    firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
            document.querySelector("nav.nav-bar-before>a.signIn-button").style.display = "none";
            const firebaseUser = firebase.firestore().collection("users").doc(user.uid);
            try {
                if (!(await firebaseUser.get()).exists) {
                    throw new Error("User not found");
                }
            } catch (err) {
                await firebaseUser.set({
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }
        } else {
            document.querySelector("nav.nav-bar-before>a.profile-button").style.display = "none";
        }
    });
})();
