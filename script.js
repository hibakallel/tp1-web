// =====================================================================
// Variable globale contenant les véhicules chargés depuis le CSV
// =====================================================================
let vehiculesData = [];

// =====================================================================
// Étape 2 : Fonction pour lire et parser le fichier CSV
// =====================================================================
async function chargerVehiculesCSV() {
    try {
        const response = await fetch('data/vehicles.csv');
        if (!response.ok) throw new Error("Fichier CSV introuvable");
        const texte = await response.text();

        const lignes = texte.trim().split('\n');
        vehiculesData = [];

        // Ignorer la première ligne (l'en-tête id,category,brand...)
        for (let i = 1; i < lignes.length; i++) {
            const col = lignes[i].split(',');
            if (col.length >= 7) {
                vehiculesData.push({
                    id: col[0].trim(),
                    category: col[1].trim(),
                    brand: col[2].trim(),
                    model: col[3].trim(),
                    power: col[4].trim(),
                    pricePerDay: Number(col[5].trim()),
                    available: col[6].trim().toLowerCase() === 'true'
                });
            }
        }

        // 1. Remplir le tableau du catalogue
        remplirCatalogue();

        // 2. Initialiser DataTables sur le catalogue
        $('#catalogueTable').DataTable({
            pageLength: 5,
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/fr-FR.json"
            }
        });

    } catch (error) {
        console.error("Erreur lors du chargement du CSV :", error);
    }
}

// =====================================================================
// Générer dynamiquement les lignes <tbody> du catalogue
// =====================================================================
function remplirCatalogue() {
    const $tbody = $('#catalogueTable tbody');
    $tbody.empty();

    vehiculesData.forEach(v => {
        const dispoBadge = v.available
            ? '<span style="color: green; font-weight: bold;">Disponible</span>'
            : '<span style="color: red; font-weight: bold;">Réservé</span>';

        $tbody.append(`
            <tr>
                <td>${v.category}</td>
                <td>${v.brand} ${v.model}</td>
                <td>${v.power} CV</td>
                <td>${v.pricePerDay} DT</td>
                <td>${dispoBadge}</td>
            </tr>
        `);
    });
}

// =====================================================================
// Calcul du prix estimé
// =====================================================================
function calculerPrix() {
    const voitureVal = document.getElementById("voiture").value;
    const dateDebut = document.getElementById("dateDebut").value;
    const dateFin = document.getElementById("dateFin").value;
    const prixTotal = document.getElementById("prixTotal");
    const message = document.getElementById("message");

    message.textContent = "";

    if (!voitureVal || !dateDebut || !dateFin) {
        prixTotal.value = "";
        return;
    }

    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);

    if (fin < debut) {
        message.style.color = "red";
        message.textContent = "La date de fin doit être supérieure ou égale à la date de début.";
        prixTotal.value = "";
        return;
    }

    const diffTemps = fin.getTime() - debut.getTime();
    let nbJours = Math.ceil(diffTemps / (1000 * 3600 * 24));
    if (nbJours === 0) nbJours = 1;

    const prixJour = Number(voitureVal);
    const total = nbJours * prixJour;

    prixTotal.value = total + " DT";
    return { nbJours, prixJour, total };
}

// =====================================================================
// Initialisation au chargement de la page
// =====================================================================
$(document).ready(function () {

    // 👉 AMÉLIORATION AI 1 : Sécurité des dates (Empêcher de choisir une date passée)
    const aujourdhui = new Date().toISOString().split('T')[0];
    document.getElementById("dateDebut").setAttribute("min", aujourdhui);
    document.getElementById("dateFin").setAttribute("min", aujourdhui);

    // Charger les véhicules depuis le fichier CSV
    chargerVehiculesCSV();

    // Initialiser Select2 sur les deux listes
    $('#categorie').select2({ placeholder: "Sélectionnez une catégorie", allowClear: true, width: '100%' });
    $('#voiture').select2({ placeholder: "Sélectionnez une voiture", allowClear: true, width: '100%' });

    // Listes dépendantes : Catégorie -> Véhicules
    $('#categorie').on('change', function () {
        const catChoisie = $(this).val();
        const $voiture = $('#voiture');

        // Vider la liste
        $voiture.empty().append('<option value="">-- Sélectionner --</option>');

        if (catChoisie) {
            // 👉 AMÉLIORATION AI 3 : Filtrer par catégorie ET disponibilité (v.available === true)
            const filtre = vehiculesData.filter(v => v.category.toLowerCase() === catChoisie.toLowerCase() && v.available);

            filtre.forEach(v => {
                const texte = `${v.brand} ${v.model} (${v.pricePerDay} DT/j)`;
                $voiture.append(new Option(texte, v.pricePerDay));
            });
        }

        // Rafraîchir Select2
        $voiture.trigger('change');
        document.getElementById("prixTotal").value = "";
    });

    // Recalcul en temps réel
    $('#voiture').on('change', calculerPrix);
    document.getElementById("dateDebut").addEventListener("change", calculerPrix);
    document.getElementById("dateFin").addEventListener("change", calculerPrix);

    // Validation du formulaire et génération du devis
    document.getElementById("reservationForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const nom = document.getElementById("nom").value.trim();
        const email = document.getElementById("email").value.trim();
        const tel = document.getElementById("telephone").value.trim();
        const categorie = document.getElementById("categorie").value;
        const voitureSelect = document.getElementById("voiture");
        const dateDebut = document.getElementById("dateDebut").value;
        const dateFin = document.getElementById("dateFin").value;
        const message = document.getElementById("message");

        if (!nom || !email || !tel || !categorie || !voitureSelect.value || !dateDebut || !dateFin) {
            message.style.color = "red";
            message.textContent = "Veuillez remplir tous les champs.";
            return;
        }

        const calcul = calculerPrix();
        if (!calcul) return;

        // Récupérer le nom complet de la voiture choisie
        const voitureTexte = voitureSelect.options[voitureSelect.selectedIndex].text;

        // Sauvegarder dans localStorage pour la page devis.html
        const devisData = {
            nom: nom,
            email: email,
            telephone: tel,
            categorie: categorie,
            voiture: voitureTexte,
            dateDebut: dateDebut,
            dateFin: dateFin,
            nombreJours: calcul.nbJours,
            prixJournalier: calcul.prixJour,
            prixTotal: calcul.total
        };

        localStorage.setItem("autoRentDevis", JSON.stringify(devisData));

        // Redirection vers la page devis.html
        window.location.href = "devis.html";
    });
});