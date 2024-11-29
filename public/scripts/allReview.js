(async () => {
    const [user, spots] = await Promise.all([fetchFirebaseUser(), fetchFirestoreSpots()])

    const reviews = Object.entries(await fetchFirestoreReviews({ userIds: [user.uid] }))
        .map(([k, v]) => ({
            id: k,
            spotId: v.spotId,
            spotName: spots[v.spotId].name,
            rating: v.rating,
            comment: v.comment,
            createdAt: v.createdAt,
            title: v.title,
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

    document.querySelector("span.username").innerHTML = user.displayName;

    const reviewContainer = document.querySelector("main>div.reviewContainer");

    reviewContainer.innerHTML = ``;

    const generateRatingStars = (rating) => {
        const star = "<img src='/icons/star.svg' class='star-icon'>";
        const halfStar = "<img src='/icons/starHalf.svg' class='star-icon'>";
        const emptyStar = "<img src='/icons/starOutline.svg' class='star-icon'>";
        let stars = "";

        const fullStars = Math.floor(rating);
        const halfStars = (rating % 1 >= 0.5) ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStars;

        stars += star.repeat(fullStars);
        stars += halfStar.repeat(halfStars);
        stars += emptyStar.repeat(emptyStars);

        return stars;
    };

    reviews.forEach((review) => {
        const reviewElement = document.createElement(`div`);
        reviewElement.classList.add(`review`);

        reviewElement.innerHTML = `
        <a href="/detail?id=${review.spotId}" class="links">
            <div class="review-header">
                <div class="review-rating">${review.spotName}</div>
                <div class="review-rating">${generateRatingStars(review.rating)}</div>
                <h3 class="review-title">${review.title ? review.title : "No title"}</h3>
                <h5 class="review-time">${review.createdAt.toDate().toLocaleString("en-CA")}</h5>
            </div>
            <div class="review-body">
                <p class="review-comment">${review.comment ? review.comment : "No comment"}</p>
                <img src="/icons/delete.svg" class="delete-button"
                style="float: right; cursor: pointer; border: 2px solid #EA3323; border-radius: 5px; position: absolute; right: 16px; bottom: 35px;"
                id="{{id}}" userId="{{userId}}">
            </div>
        </a>
        `;

        reviewContainer.appendChild(reviewElement)
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
                    await firebase.firestore().collection("reviews").doc(e.target.attributes.id.value).delete();
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
        document.querySelectorAll("img.delete-button").forEach((v) => {
            if (user.uid !== v.attributes.userId.value) {
                v.style.display = "none";
            }
        });
    } else {
        document.querySelector("main>section>div").style.display = "none";
        document.querySelectorAll("img.delete-button").forEach((v) => {
            v.style.display = "none";
        });
    }
})();
