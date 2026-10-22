# Auto Rent — Système de Réservation de Véhicules

Projet de développement web réalisé dans le cadre des Travaux Pratiques (Parties 1 à 4).

## 🛠️ Technologies et bibliothèques
- **HTML5 & CSS3** : Structure sémantique, design responsive et feuille de style pour impression (`@media print`).
- **JavaScript (ES6+)** : Manipulation du DOM, gestion des événements asynchrones (`fetch`, `async/await`), et persistance locale (`localStorage`).
- **jQuery (v3.7.1)** : Manipulation simplifiée et support des bibliothèques externes.
- **Select2 (v4.1.0)** : Menus déroulants interactifs avec recherche et placeholder.
- **DataTables (v1.13.7)** : Catalogue interactif avec tri, recherche instantanée et pagination.

## 🚀 Fonctionnalités principales
1. **Catalogue dynamique** : Chargement automatique de 50 véhicules depuis un fichier `data/vehicles.csv`.
2. **Listes dépendantes** : Sélection dynamique des véhicules en fonction de la catégorie choisie et de leur disponibilité.
3. **Calcul en direct** : Calcul automatique du prix total estimé selon la durée de location.
4. **Génération de devis** : Transfert des informations de réservation vers une page `devis.html`.
5. **Impression de facture** : Impression au format ticket/facture avec masquage automatique des menus.
6. **Formulaire de contact** : Page dédiée `contact.html` avec validation des données côté client.

## 🤖 Améliorations réalisées avec l'IA
- **Amélioration 1 :** Blocage automatique des dates passées dans les sélecteurs de date (`min`).
- **Amélioration 2 :** Mise en page optimisée pour l'impression du devis via des règles `@media print`.
- **Amélioration 3 :** Filtrage intelligent des véhicules disponibles (`available: true`).