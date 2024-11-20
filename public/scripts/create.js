(() => {
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

        new Flickity(gallery, {
            initialIndex: 0,
            draggable: true,
        });

        uploadButton.innerHTML = "Upload Different"
    });

    document.querySelector("label#mapPreviewButton.button").addEventListener("click", (e) => {
        const iframe = document.createElement("iframe");
        iframe.height = window.innerWidth;
        iframe.width = window.innerWidth;
        iframe.src = `https://maps.google.com/maps?output=embed&q=${document.querySelector("input#titleInput").value.trim()}`;
        document.querySelector("div.toBeReplaced.map").replaceChildren(iframe);
        e.target.style = "display: none;";
        document.querySelector("label#loadPlaceButton.button").style = "";
    });
})();
