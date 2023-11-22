document.getElementById('search-button').addEventListener('click', async () => {
    const searchTerm = document.getElementById('search-input').value
    const resultsContainer = document.getElementById('results-container')
    const errorContainer = document.getElementById('error-container')

    // Réinitialiser les conteneurs de résultats et d'erreurs
    resultsContainer.innerHTML = ''
    errorContainer.innerText = ''

    if (!searchTerm) {
        errorContainer.innerText = "Veuillez entrer le nom d'une commune"
        return
    }

    try {
        const response = await fetch(
            `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
                searchTerm
            )}&fields=nom,population,code,codesPostaux,departement,region&format=json&geometry=centre`
        )

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`)
        }

        const communes = await response.json()

        if (communes.length === 0) {
            errorContainer.innerText =
                'Aucune commune trouvée pour cette recherche'
            return
        }

        // Tri par population croissante
        communes.sort((a, b) => a.population - b.population)

        // Affichage des résultats
        resultsContainer.innerHTML = `<p>Nombre de résultats : ${communes.length}</p>`
        communes.forEach((commune) => {
            resultsContainer.innerHTML += `
                <div class="commune">
                    <h3>${commune.nom}</h3>
                    <p>Population : ${commune.population.toLocaleString(
                        'fr-FR'
                    )}</p>
                    <p>Région : ${commune.region.nom}</p>
                    <p>Département : ${commune.departement.nom}</p>
                    <p>Codes Postaux : ${commune.codesPostaux.join(', ')}</p>
                    <p>Code de la commune : ${commune.code}</p>
                </div>
            `
        })
    } catch (error) {
        errorContainer.innerText = `Erreur lors de la récupération des données: ${error.message}`
    }
})
