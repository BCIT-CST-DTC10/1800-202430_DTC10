const fetchComponent = async (fileName) => {
    try {
        const response = await fetch(
            `/components/${fileName}.html`,
        );
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.text();
    } catch (error) {
        console.error(error.message);
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
    } catch (error) {
        console.error(error.message);
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
})();
