document.getElementById('fileInput').addEventListener('change', () => {
    var preview = document.getElementById('preview');

    preview.innerHTML = '';

    var img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.style.height = '100px';
    img.style.display = 'block'; // Ensure the image is displayed in a block to put it on a new line
    img.style.marginBottom = '10px';

    preview.appendChild(img);
});
