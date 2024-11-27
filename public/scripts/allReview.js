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
            <div class="review-header">
                <div class="review-rating">${generateRatingStars(review.rating)}</div>                        
                <h3 class="review-title">${review.title ? review.title : "No title"}</h3>
                <h5 class="review-comment">${review.createdAt}</h5>
            </div>
            <div class="review-body">
                <p class="review-comment">${review.comment ? review.comment : "No comment"}</p>
            </div>
        `;

        reviewContainer.appendChild(reviewElement)
    });
})();
