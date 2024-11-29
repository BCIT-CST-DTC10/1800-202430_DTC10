(async () => {
    const [reviewCard, star, starHalf, starOutline, user, spots] = await Promise.all([
        fetchComponent("cards/review"),
        fetchIcon("star"),
        fetchIcon("starHalf"),
        fetchIcon("starOutline"),
        fetchFirebaseUser(),
        fetchFirestoreSpots(),
    ])

    const invalidReviews = []
    const reviews = Object.entries(await fetchFirestoreReviews({ userIds: [user.uid] }))
        .map(([k, v]) => {
            try {
                return {
                    id: k,
                    spotId: v.spotId,
                    spotName: spots[v.spotId].name,
                    rating: v.rating,
                    comment: v.comment,
                    createdAt: v.createdAt,
                    title: v.title,
                }
            } catch {
                invalidReviews.push(k)
                return null
            }
        }).filter((v) => v)
        .sort((a, b) => b.createdAt - a.createdAt);
    Promise.all(invalidReviews.map((v) => firebase.firestore().collection("reviews").doc(v).delete()));

    document.querySelector("span.username").innerHTML = user.displayName;

    document.querySelector("div.reviewContainer").innerHTML = Object.values(reviews)
        .sort((a, b) => b.createdAt - a.createdAt)
        .reduce((p, c) => p + (() => {
            const a = document.createElement("a");
            a.href = `/detail?id=${c.spotId}`;
            a.style.textDecoration = "none";
            a.innerHTML = reviewCard
                .replaceAll("{{id}}", c.id)
                .replaceAll("{{userId}}", c.userId)
                .replaceAll(/>.*?\{\{user\}\}/ug, `>${c.spotName}`)
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
                }, ""));
            return a.outerHTML;
        })(), document.querySelector("div.reviewContainer").innerHTML);

    document.querySelectorAll("img.delete-button").forEach((v) => {
        v.addEventListener("click", async (e) => {
            e.preventDefault();
            if ((await Sweetalert2.fire({
                title: "Delete review",
                text: "Are you sure you want to delete your review?",
                icon: "question",
                showCancelButton: true,
                focusCancel: true,
            })).isConfirmed) {
                await firebase.firestore().collection("reviews").doc(e.target.id).delete();
                await Sweetalert2.fire({
                    title: "Success",
                    text: "Review deleted",
                    icon: "success",
                });
                window.location.reload();
            }
        });
    });
})();
