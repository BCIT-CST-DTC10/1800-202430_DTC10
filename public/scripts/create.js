document.getElementById('fileInput').addEventListener('change', function (event) {
    var files = event.target.files;
    var gallery = document.getElementById('gallery');
    var uploadButton = document.getElementById("imageButton");

    // Clear any existing content
    // gallery.innerHTML = '';

    // Loop through all selected files
    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        // Only process image files
        if (!file.type.match('image.*')) {
            continue;
        }

        var cell = document.createElement('div');
        cell.className = 'gallery-cell';
        gallery.appendChild(cell);

        // var imgContainer = document.createElement('div');
        // // imgContainer.style.marginBottom = '20px'; // Spacing between each image container
        // imgContainer.className = 'gallery-cell';

        // var img = document.createElement('img');
        // img.id = 'img-' + i;
        // img.src = URL.createObjectURL(file);
        // img.style.height = '20em';
        // img.style.width = '20em';
        // img.style.display = 'block'; // Ensure the image is displayed in a block to put it on a new line
        // img.style.marginBottom = '10px';

        // // Append the image and file info to the container
        // imgContainer.appendChild(img);

        // // Append the container to the preview div
        // preview.appendChild(imgContainer);
    }

    uploadButton.innerHTML = "Upload Different"
    uploadButton.style.padding = "0.5em"
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
    console.log(await fetch(`https://one800-202430-dtc10.onrender.com/googleMapsCid?url=${encodeURIComponent("https://maps.google.com/maps?ll=49.257735,-123.123904&z=11&t=m&hl=en-US&gl=US&mapclient=embed&cid=17532711177779613534")}`));
});
