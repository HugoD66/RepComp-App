async function fetchLang() {
    try {
        const response = await fetch('./lang.json', {
            method: 'GET',
            headers: {
                "Accept": 'application/json',
                "Content-Type": "application/json"
            },
        }); // Assurez-vous que le chemin est correct
        if (!response.ok) {
            throw new Error('Impossible de charger les données JSON');
        }
        const data = await response.json();
        const typesList = Object.keys(data).map(lang => ({ name: lang, types: data[lang].types }));

        return typesList;
    } catch (error) {
        console.error(error);
        return null;
    }
}
export default fetchLang;

