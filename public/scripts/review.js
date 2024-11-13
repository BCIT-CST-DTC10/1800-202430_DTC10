(async () => {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) {
        window.location = "/404";
    }

    const [reviewCard, star, starHalf, starOutline, spot, reviews] = await Promise.all([
        fetchComponent("cards/review"),
        fetchIcon("star"),
        fetchIcon("starHalf"),
        fetchIcon("starOutline"),
        fetchFirestoreSpotById(id),
        fetchFirestoreReviews({ spotIds: [id] }),
    ]);

    document.querySelector("main>section>h1.title").innerText = spot.name;

    document.querySelector("div#reviews-go-here").innerHTML = Object.entries(reviews).
        map(([k, v]) => ({
            id: k,
            userId: v.userId,
            rating: v.rating,
            comment: v.comment,
            createdAt: v.createdAt,
        })).
        sort((a, b) => b.createdAt - a.createdAt).
        reduce((p, c) => p + reviewCard.
            replaceAll("{{user}}", c.userId).
            replaceAll("{{createdAt}}", c.createdAt.toDate()).
            replaceAll("{{comment}}", c.comment).
            replaceAll("{{star}}", generatingRatingStar(c.rating).reduce((p, c, i) => {
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
            console.log(e.target.name);
            document.querySelector("input#rating").value = Number(e.target.name.replace(/.*-/, ""));
        });
    });

    firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
            document.querySelector("main>section>div").style.display = "none";
        }
    });
})();
