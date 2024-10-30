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
        alert('Failed to fetch component');
    }
}

(async () => {
    document.querySelector('footer.placeholder').innerHTML = await fetchComponent('bottomNav');
})();
