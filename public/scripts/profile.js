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

    document.querySelector("img#profileEditButton").addEventListener("click", async (e) => {
        const { value: displayName } = await Sweetalert2.fire({
            title: "Profile update",
            input: "text",
            inputLabel: "Username",
            inputValue: user.displayName,
            showCancelButton: true,
            focusCancel: true,
        });
        await user.updateProfile({
            displayName,
        });
        window.location = window.location;
    });

    document.querySelectorAll("main>div.reviewContainer>a>div.review.toBeReplaced")
        .forEach((v, i) => {
            const review = reviews[i];
            if (!review) {
                return;
            }
            v.parentElement.href = `/detail?id=${review.spotId}`
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

    document.querySelector('div#bookmarkButton').addEventListener('click', () => {
        window.location.href = '/bookmark';
    });

    document.querySelector('div#allReviewButton').addEventListener('click', () => {
        window.location.href = '/allReview';
    });

    document.querySelector("div#logOutButton").addEventListener("click", async () => {
        await firebase.auth().signOut();
        window.location.href = '/';
    });
})();
