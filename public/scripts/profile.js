(async () => {
    const user = await fetchFirebaseUser();

    const reviews = Object.entries(await fetchFirestoreReviews({ userIds: [user.uid] }))
        .map(([k, v]) => ({
            id: k,
            spotId: v.spotId,
            rating: v.rating,
            comment: v.comment,
            createdAt: v.createdAt,
            title: v.title
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

    const image = document.createElement("img");
    image.src = user.photoURL ?? "";
    document.querySelector("main>div.mainProfile>div.image").append(image);

    document.querySelector("main>div.mainProfile>div.userDetails>div.username").innerHTML = user.displayName;
    document.querySelector("main>div.mainProfile>div.userDetails>div.bio").innerHTML = user.description ?? "";

    document.querySelectorAll("main>div.reviewContainer>div.review.toBeReplaced")
        .forEach((v, i) => {
            console.log(`Title: ${reviews[i].title.length}`)
            console.log(`Comment: ${reviews[i].comment.length}`)
            if (reviews[i].title == "") {
                reviews[i].title = "No title found"
            }
            else if (reviews[i].comment == "") {
                reviews[i].comment = "No comment found"
            }
            if (reviews[i].title.length > 40) {
                reviews[i].title = reviews[i].title.slice(0, 40)
                console.log("title smaller")
            }
            if (reviews[i].comment.length > 100) {
                reviews[i].comment = reviews[i].comment.slice(0, 100)
                console.log("comment smaller")
            }
            v.innerHTML = `
            <span class="reviewText">
            <span class="reviewTitle">
            ${reviews[i].title} - </span>"${reviews[i].comment}" 
            </span>
            </span>
            <span class="reviewRating">
            ${reviews[i].rating} Stars
            </span>`;
        })
})();
