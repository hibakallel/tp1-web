function calculerPrix() {
    var voiture = document.getElementById("voiture").value;
    var dateDebut = document.getElementById("dateDebut").value;
    var dateFin = document.getElementById("dateFin").value;
    var prixTotal = document.getElementById("prixTotal");
    var message = document.getElementById("message");

    message.textContent = "";

    // Vérifier les dates et le véhicule
    if (voiture === "" || dateDebut === "" || dateFin === "") {
        message.textContent = "Veuillez remplir les informations de réservation.";
        return;
    }

    var debut = new Date(dateDebut);
    var fin = new Date(dateFin);

    // Vérifier les dates
    if (fin < debut) {
        message.textContent =
            "La date de fin doit être supérieure ou égale à la date de début.";
        return;
    }

    // Calcul du nombre de jours
    var difference = fin - debut;

    var nombreJours =
        difference / (1000 * 60 * 60 * 24);

    // Une location d'une seule journée
    if (nombreJours === 0) {
        nombreJours = 1;
    }

    // Le value du select contient directement le prix
    var prixJournalier = Number(voiture);

    var total = nombreJours * prixJournalier;

    prixTotal.value = total + " DT";
}

document.getElementById("nom").addEventListener("change", function (event) {
    event.preventDefault();

    var nom = document.getElementById("nom").value;
    if (nom.length < 3) {
        alert("Le nom doit contenir au moins 3 caractères.");
    } else {
        alert(nom);
        console.log(nom);
    }
});

document.getElementById("reservationForm").addEventListener("submit", function (event) {

    event.preventDefault();

    var nom = document.getElementById("nom").value;
    var email = document.getElementById("email").value;
    var telephone = document.getElementById("telephone").value;
    var categorie = document.getElementById("categorie").value;
    var voiture = document.getElementById("voiture").value;
    var dateDebut = document.getElementById("dateDebut").value;
    var dateFin = document.getElementById("dateFin").value;

    var message = document.getElementById("message");

    message.textContent = "";

    // Validation
    if (nom === "") {
        message.textContent = "Veuillez saisir votre nom et prénom.";
        return;
    }

    if (email === "") {
        message.textContent = "Veuillez saisir votre email.";
        return;
    }

    if (telephone === "") {
        message.textContent = "Veuillez saisir votre téléphone.";
        return;
    }

    if (categorie === "") {
        message.textContent = "Veuillez sélectionner une catégorie.";
        return;
    }

    if (voiture === "") {
        message.textContent = "Veuillez sélectionner une voiture.";
        return;
    }

    if (dateDebut === "" || dateFin === "") {
        message.textContent = "Veuillez sélectionner les dates.";
        return;
    }

    var debut = new Date(dateDebut);
    var fin = new Date(dateFin);

    if (fin < debut) {
        message.textContent =
            "La date de fin doit être supérieure ou égale à la date de début.";
        return;
    }

    calculerPrix();

    message.textContent = "Réservation validée avec succès.";
});