(async () => {
    const user = await fetchFirebaseUser();

    const reviews = Object.entries(await fetchFirestoreReviews({ userIds: [user.uid] })).
        map(([k, v]) => ({
            id: k,
            spotId: v.spotId,
            rating: v.rating,
            comment: v.comment,
            createdAt: v.createdAt,
        })).
        sort((a, b) => b.createdAt - a.createdAt);

    const image = document.createElement("img");
    image.src = user.photoURL ?? "";
    document.querySelector("main>div.mainProfile>div.image").append(image);

    document.querySelector("main>div.mainProfile>div.userDetails>div.username").innerHTML = user.displayName;
    document.querySelector("main>div.mainProfile>div.userDetails>div.bio").innerHTML = user.description ?? "";

    document.querySelectorAll("main>div.reviewContainer>div.review.toBeReplaced").
        forEach((v, i) => {
            v.innerHTML = reviews[i].comment;
        })

    console.log({ user });
})();
