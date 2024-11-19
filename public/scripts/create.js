document.querySelector("#fileInput").addEventListener("change", function (event) {
    const gallery = document.querySelector("#gallery");
    const uploadButton = document.querySelector("#imageButton");

    new Flickity(gallery).destroy();

    gallery.replaceChildren(
        ...[...event.target.files]
            .filter((v) => v.type.match("image.*"))
            .map((v) => {
                const image = document.createElement("img");
                image.src = URL.createObjectURL(v);

                image.style.display = "block";
                image.style.maxHeight = "20em";
                image.style.minHeight = "10em";
                image.style.maxWidth = "50%";
                image.style.marginRight = "1em";

                return image
            }),
    );

    const flickity = new Flickity(gallery, {
        initialIndex: 0,
        draggable: true,
    });

    uploadButton.innerHTML = "Upload Different"
});

document.querySelector("label#openMapButton.button").addEventListener("click", (e) => {
    const iframe = document.createElement("iframe");
    iframe.height = window.innerWidth;
    iframe.width = window.innerWidth;
    iframe.src = `https://maps.google.com/maps?output=embed&cid=${BigInt("0xbb9196ea9b81f38b")}`;
    document.querySelector("div.toBeReplaced.map").appendChild(iframe);
    e.target.style = "display: none;";
    document.querySelector("label#loadPlaceButton.button").style = "";
});

document.querySelector("label#loadPlaceButton.button").addEventListener("click", async () => {
    console.log(await fetch(`${backend}/googleMapsCid?url=${encodeURIComponent("https://maps.google.com/maps?ll=49.257735,-123.123904&z=11&t=m&hl=en-US&gl=US&mapclient=embed&cid=17532711177779613534")}`));
});
