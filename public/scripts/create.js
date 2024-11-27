(async () => {
    const [types, features] = await Promise.all([
        fetchFirestoreTypes(),
        fetchFirestoreFeatures(),
    ]);

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
                    image.style.width = "50%";
                    image.style.marginRight = "1em";
                    image.style.objectFit = "cover";

                    return image;
                }),
        );

        new Flickity(gallery, {
            initialIndex: 0,
            draggable: true,
            wrapAround: true,
        });

        uploadButton.innerHTML = "Upload Different";
    });

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
                        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
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

    document.querySelector("label#mapPreviewButton.button").addEventListener("click", (e) => {
        const iframe = document.createElement("iframe");
        iframe.height = window.innerWidth;
        iframe.width = window.innerWidth;
        iframe.src = `https://maps.google.com/maps?output=embed&q=${document.querySelector("input.form-control#titleInput").value.trim()} ${document.querySelector("input.form-control#addressInput").value.trim()}`;
        document.querySelector("div.toBeReplaced.map").replaceChildren(iframe);
    });

    document.querySelector("label#submitButton.createLocation").addEventListener("click", async () => {
        const name = document.querySelector("input.form-control#titleInput").value.trim();
        const address = document.querySelector("input.form-control#addressInput").value.trim();
        const description = document.querySelector("textarea.form-control#descriptionInput").value.trim();
        const type = document.querySelector("select#type").value.trim();
        const features = Object.fromEntries([...document.querySelectorAll("div.tags>select")].filter((v) => v.id !== "type").map((v) => {
            return [v.id, /^(true|false)$/i.test(v.value)
                ? /^true$/i.test(v.value)
                    ? true
                    : false
                : v.value];
        }));

        if (!name) {
            Swal.fire({
                title: "Error",
                text: "Title can't be empty",
                icon: "error",
            });
            const element = document.querySelector("input.form-control#titleInput");
            element.scrollIntoView();
            element.focus();
            return;
        }
        if (!address) {
            Swal.fire({
                title: "Error",
                text: "Address can't be empty",
                icon: "error",
            });
            const element = document.querySelector("input.form-control#addressInput");
            element.scrollIntoView();
            element.focus();
            return;
        }
        if (!type) {
            Swal.fire({
                title: "Error",
                text: "Location Type can't be unselected",
                icon: "error",
            });
            const element = document.querySelector("select#type");
            element.scrollIntoView();
            element.focus();
            return;
        }

        const result = await firebase.firestore().collection("spots").add({
            name,
            type,
            features,
            address,
            description,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        await Promise.all(
            (await Promise.all(
                (await Promise.all(
                    new Flickity(document.querySelector("#gallery")).cells.map((v) => fetch(v.element.src)),
                )).map((v) => v.blob()),
            )).map((v) => firebase.storage().ref(`${result.id}/${crypto.randomUUID()}`).put(v)),
        );
        await Swal.fire({
            title: "Success",
            text: "New location created",
            icon: "success",
        });
        window.location = `/detail?id=${result.id}`;
    });
})();
