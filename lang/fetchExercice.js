async function fetchExercice(lang, article) {
    try {
        const response = await fetch( 'lang/' + lang + '/exercice/' + article + '.json', {
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

        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
export default fetchExercice;

