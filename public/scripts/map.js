(async () => {
    while (!document.querySelector("nav.toBeReplaced").innerHTML) {
        await new Promise((res) => {
            setInterval(res, 250);
        });
    }
    const iframe = document.createElement("iframe");
    iframe.height = window.innerHeight - document.querySelector("nav").offsetHeight;
    iframe.width = window.innerWidth;
    iframe.src = `https://maps.google.com/maps?output=embed&cid=${BigInt("0xbb9196ea9b81f38b")}`;
    document.querySelector("main.toBeReplaced").appendChild(iframe);
})();
