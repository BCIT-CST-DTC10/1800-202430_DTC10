document.getElementById('fileInput').addEventListener('change', function (event) {
    var files = event.target.files;
    var preview = document.getElementById('preview');
    var uploadButton = document.getElementById("imageButton")

    // Clear any existing content
    preview.innerHTML = '';

    // Loop through all selected files
    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        // Only process image files
        if (!file.type.match('image.*')) {
            continue;
        }

        var imgContainer = document.createElement('div');
        imgContainer.style.marginBottom = '20px'; // Spacing between each image container

        var img = document.createElement('img');
        img.id = 'img-' + i;
        img.src = URL.createObjectURL(file);
        img.style.height = '20em';
        img.style.width = '20em';
        img.style.display = 'block'; // Ensure the image is displayed in a block to put it on a new line
        img.style.marginBottom = '10px';

        // Append the image and file info to the container
        imgContainer.appendChild(img);

        // Append the container to the preview div
        preview.appendChild(imgContainer);
    }

    uploadButton.innerHTML = "Upload Different"
    uploadButton.style.padding = "0.5em"
});
