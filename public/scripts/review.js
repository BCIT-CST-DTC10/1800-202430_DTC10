(async () => {
    const id = new URL(window.location).searchParams.get(idKey);
    if (!id) {
        window.location = "/404";
    }

    const [reviewCard, star, starHalf, starOutline, spot, reviews, user] = await Promise.all([
        fetchComponent("cards/review"),
        fetchIcon("star"),
        fetchIcon("starHalf"),
        fetchIcon("starOutline"),
        fetchFirestoreSpotById(id),
        fetchFirestoreReviews({ spotIds: [id] }),
        fetchFirebaseUser(),
    ]);
    if (!spot) {
        window.location = "/404";
    }

    const users = await fetchAuthUserByIds(Object.values(reviews).map((v) => v.userId));

    document.querySelector("div#reviewPrompt>h1.title").innerText = spot.name;

    document.querySelector("div#reviews-go-here").innerHTML = Object.entries(reviews)
        .map(([k, v]) => ({
            id: k,
            userId: v.userId,
            userName: users[v.userId].displayName,
            title: v.title,
            rating: v.rating,
            comment: v.comment,
            createdAt: v.createdAt,
        }))
        .sort((a, b) => b.createdAt - a.createdAt)
        .reduce((p, c) => p + reviewCard
            .replaceAll("{{id}}", c.id)
            .replaceAll("{{userId}}", c.userId)
            .replaceAll("{{user}}", c.userName)
            .replaceAll("{{title}}", c.title)
            .replaceAll("{{createdAt}}", c.createdAt.toDate().toLocaleString("en-CA"))
            .replaceAll("{{comment}}", c.comment)
            .replaceAll("{{star}}", generatingRatingStar(c.rating).reduce((p, c, i) => {
                switch (i) {
                    case 0:
                        return p + star.trim().repeat(c);
                    case 1:
                        return p + starHalf.trim().repeat(c);
                    case 2:
                        return p + starOutline.trim().repeat(c);
                }
            }, "")), document.querySelector("div#reviews-go-here").innerHTML);

    document.querySelectorAll("div.toBeReplaced#top-spot-List svg").forEach((v) => {
        v.style = "display: inline-block; margin: auto 0; fill: #000;";
    });

    document.querySelectorAll("div.star-container>img").forEach((v) => {
        v.addEventListener("click", (e) => {
            const starId = Number(e.target.name.replace(/.*-/, ""));
            document.querySelector("input#rating").value = starId;
            document.querySelectorAll("div.star-container>img").forEach((v, i) => {
                if (i < starId) {
                    v.src = "/icons/star.svg";
                } else {
                    v.src = "/icons/starOutline.svg";
                }
            });
        });
    });

    document.querySelector("div#submitReview>button").addEventListener("click", async () => {
        await firebase.firestore().collection("reviews").add({
            spotId: id,
            userId: user.uid,
            title: document.querySelector("input#reviewTitle").value,
            rating: Number(document.querySelector("input#rating").value),
            comment: document.querySelector("textarea#floatingTextarea2").value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        await Sweetalert2.fire({
            title: "Success",
            text: "New review created",
            icon: "success",
        });
        window.location.reload();
    });

    document.querySelectorAll("img.delete-button").forEach((v) => {
        v.addEventListener("click", async (e) => {
            if (user.uid === e.target.attributes.userId.value) {
                if ((await Sweetalert2.fire({
                    title: "Delete review",
                    text: "Are you sure you want to delete your review?",
                    icon: "question",
                    showCancelButton: true,
                    focusCancel: true,
                })).isConfirmed) {
                    await firebase.firestore().collection("reviews").doc(e.target.id.value).delete();
                    await Sweetalert2.fire({
                        title: "Success",
                        text: "Review deleted",
                        icon: "success",
                    });
                    window.location.reload();
                }
            }
        });
    });

    if (user) {
        document.querySelector("div#signInPrompt").style.display = "none";
        document.querySelectorAll("img.delete-button").forEach((v) => {
            if (user.uid !== v.attributes.userId.value) {
                v.style.display = "none";
            }
        });
    } else {
        document.querySelector("div#signInPrompt").style.display = "";
        document.querySelector("div#reviewPrompt").style.display = "none";
        document.querySelectorAll("img.delete-button").forEach((v) => {
            v.style.display = "none";
        });
    }
})();
