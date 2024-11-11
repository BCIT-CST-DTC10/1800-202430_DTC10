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
    return new Promise((res, rej) => {
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                firebase.firestore().collection("users").doc(
                    user.uid
                ).get().then((v) => {
                    res(Object.assign(user, v.data()));
                }).catch((err) => {
                    console.error("fetchFirestoreUser:", err);
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

const generateRateStar = (rate) => {
    return [Math.floor(rate), rate % 1 ? 1 : 0, 5 - Math.floor(rate) - (rate % 1 ? 1 : 0)];
}

const loadRateStar = async (rate) => {
    const stars = generateRateStar(rate);
    const star = await fetchIcon("star");
    const starHalf = await fetchIcon("starHalf");
    const starOutline = await fetchIcon("starOutline");
    return stars.reduce((pre, cur, i) => {
        switch (i) {
            case 0:
                return pre + star.repeat(cur);
            case 1:
                return pre + starHalf.repeat(cur);
            case 2:
                return pre + starOutline.repeat(cur);
        }
    }, "")
}

(async () => {
    document.querySelector("nav.toBeReplaced").innerHTML = await fetchComponent("topNav");

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
