(async () => {
    const [types, features] = await Promise.all([
        fetchFirestoreTypes(),
        fetchFirestoreFeatures(),
    ]);

    document.querySelector("div.tags").replaceChildren(
        Object.entries(types).reduce((p, [k, v]) => {
            const option = document.createElement("option");
            option.value = k;
            option.innerText = v.name;
            p.appendChild(option);
            return p;
        }, (() => {
            const select = document.createElement("select");
            select.id = "type";
            select.classList.add("dropdowns");

            const option = document.createElement("option");
            option.selected = true;
            option.disabled = true;
            option.classList.add("optionDefault");
            option.value = "";
            option.innerText = "Location Type";
            select.appendChild(option);

            return select;
        })()),
        ...Object.entries(features).map(([k, v]) =>
            v.values.reduce((p, c) => {
                const option = document.createElement("option");
                option.value = c;
                if (typeof c === "boolean") {
                    option.innerText = c ? "Yes" : "No";
                } else {
                    option.innerText = c.replace(
                        /\w\S*/g,
                        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
                    );
                }
                p.appendChild(option);

                return p;
            }, (() => {
                const select = document.createElement("select");
                select.id = k;
                select.classList.add("dropdowns");

                const option = document.createElement("option");
                option.selected = true;
                option.disabled = true;
                option.classList.add("optionDefault");
                option.value = "";
                option.innerText = v.question;
                select.appendChild(option);

                return select;
            })()),
        ),
    );

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
