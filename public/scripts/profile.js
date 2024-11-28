(async () => {
    const user = await fetchFirebaseUser();

    const reviews = Object.entries(await fetchFirestoreReviews({ userIds: [user.uid] }))
        .map(([k, v]) => ({
            id: k,
            spotId: v.spotId,
            rating: v.rating,
            comment: v.comment,
            createdAt: v.createdAt,
            title: v.title,
        }))
        .sort((a, b) => b.createdAt - a.createdAt);


    document.querySelector("main>div.mainProfile>h1>span.username").innerHTML = user.displayName;

    document.querySelectorAll("main>div.reviewContainer>div.review.toBeReplaced")
        .forEach((v, i) => {
            const review = reviews[i];
            if (!review) {
                return;
            }
            v.innerHTML = `
                <span class="reviewText">
                    <span class="reviewTitle">
                        ${(review.title ? review.title : "No title found").slice(0, 40)} -
                    </span>
                    "${(review.comment ? review.comment : "No comment found").slice(0, 100)}"
                </span>
                <span class="reviewRating">
                    ${review.rating} Stars
                </span>
            `;
        });

    document.querySelector("div#logOutButton").addEventListener("click", () => {
        firebase.auth().signOut();
    });

    const favoriteButton = document.getElementById('favoriteButton');
    favoriteButton.addEventListener('click', () => {
        window.location.href = '/favorite.html';
    });

    const allReviewButton = document.getElementById('allReviewButton');
    allReviewButton.addEventListener('click', () => {
        window.location.href = '/allReview.html';
    });
})();
