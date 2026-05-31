from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# ===== DONNÉES LOCALES =====
# Lignes de bus Dakar Dem Dikk - Quartiers de Dakar uniquement (Labs 1-7)
lignes = [
    {
        "id": 1,
        "numero": "1",
        "depart": "Parcelles Assainies",
        "arrivee": "Plateau",
        "arrets": 14,
        "couleur": "#0a6e31",  # Vert
        "listeArrets": [
            "Parcelles U14",
            "Parcelles U10",
            "Camberene",
            "Patte d'Oie",
            "Grand Dakar",
            "Colobane",
            "Ponty",
            "Plateau"
        ]
    },
    {
        "id": 2,
        "numero": "7",
        "depart": "Guediawaye",
        "arrivee": "Place Obe",
        "arrets": 18,
        "couleur": "#e74c3c",  # Rouge
        "listeArrets": [
            "Guediawaye",
            "Pikine",
            "Thiaroye",
            "Keur Massar",
            "Grand Yoff",
            "Parcelles",
            "Liberte 6",
            "Liberte 5",
            "Point E",
            "Fann",
            "Medina",
            "Plateau",
            "Patte d'Oie",
            "Fass",
            "Hann",
            "Mermoz",
            "Ngor",
            "Place Obe"
        ]
    },
    {
        "id": 3,
        "numero": "15",
        "depart": "Pikine",
        "arrivee": "Medina",
        "arrets": 12,
        "couleur": "#3498db",  # Bleu
        "listeArrets": [
            "Pikine",
            "Thiaroye",
            "Keur Massar",
            "Liberte 5",
            "Liberte 6",
            "Ouest Foire",
            "Fann",
            "Medina",
            "Plateau",
            "Patte d'Oie",
            "Hann",
            "Mermoz"
        ]
    },
    {
        "id": 4,
        "numero": "23",
        "depart": "Ouakam",
        "arrivee": "Grand Dakar",
        "arrets": 10,
        "couleur": "#f39c12",  # Orange
        "listeArrets": [
            "Ouakam",
            "Almadies",
            "Ngor",
            "Grand Yoff",
            "Yoff",
            "Colobane",
            "Grand Dakar",
            "Camberene",
            "Patte d'Oie",
            "Plateau"
        ]
    },
    {
        "id": 5,
        "numero": "8",
        "depart": "Almadies",
        "arrivee": "Colobane",
        "arrets": 16,
        "couleur": "#9b59b6",  # Violet
        "listeArrets": [
            "Almadies",
            "Ngor",
            "Grand Yoff",
            "Yoff Village",
            "Yoff",
            "Ouakam",
            "Colobane",
            "Ponty",
            "Plateau",
            "Patte d'Oie",
            "Grand Dakar",
            "Camberene",
            "HLM",
            "Fass",
            "Hann",
            "Mermoz"
        ]
    },
    {
        "id": 6,
        "numero": "12",
        "depart": "Yoff",
        "arrivee": "Sandaga",
        "arrets": 11,
        "couleur": "#1abc9c",  # Turquoise
        "listeArrets": [
            "Yoff Village",
            "Yoff",
            "Grand Yoff",
            "Ouakam",
            "Almadies",
            "Ngor",
            "Colobane",
            "Ponty",
            "Plateau",
            "Sandaga",
            "Medina"
        ]
    },
    {
        "id": 7,
        "numero": "2",
        "depart": "Fann",
        "arrivee": "Grand Yoff",
        "arrets": 15,
        "couleur": "#2ecc71",  # Vert clair
        "listeArrets": [
            "Fann",
            "Ouest Foire",
            "Liberte 6",
            "Liberte 5",
            "Liberte 4",
            "Point E",
            "Mermoz",
            "Ngor",
            "Almadies",
            "Ouakam",
            "Grand Yoff",
            "Yoff",
            "Colobane",
            "Grand Dakar",
            "Ponty"
        ]
    },
    {
        "id": 8,
        "numero": "5",
        "depart": "Mermoz",
        "arrivee": "Dieuppeul",
        "arrets": 12,
        "couleur": "#34495e",  # Gris foncé
        "listeArrets": [
            "Mermoz",
            "Ngor",
            "Hann",
            "Fass",
            "HLM",
            "Camberene",
            "Patte d'Oie",
            "Plateau",
            "Fann",
            "Medina",
            "Liberte 5",
            "Dieuppeul"
        ]
    },
    {
        "id": 9,
        "numero": "11",
        "depart": "Sicap",
        "arrivee": "Liberte 5",
        "arrets": 16,
        "couleur": "#e67e22",  # Orange foncé
        "listeArrets": [
            "Sicap",
            "Liberte 5",
            "Liberte 6",
            "Ouest Foire",
            "Fann",
            "Medina",
            "Point E",
            "Liberte 4",
            "Liberte 3",
            "Liberte 2",
            "Plateau",
            "Patte d'Oie",
            "Fass",
            "Hann",
            "Mermoz",
            "Ngor"
        ]
    },
    {
        "id": 10,
        "numero": "14",
        "depart": "Tally",
        "arrivee": "Castor",
        "arrets": 13,
        "couleur": "#c0392b",  # Rouge foncé
        "listeArrets": [
            "Tally",
            "Castor",
            "Hann",
            "Fass",
            "HLM",
            "Camberene",
            "Patte d'Oie",
            "Grand Dakar",
            "Colobane",
            "Plateau",
            "Fann",
            "Medina",
            "Point E"
        ]
    }
]

# Liste pour les incidents signalés
incidents = []

# ===== ENDPOINTS =====

@app.route("/", methods=["GET"])
def accueil():
    """Endpoint d'accueil avec la liste des endpoints disponibles"""
    return jsonify({
        "message": "Bienvenue sur l'API SénTransport !",
        "endpoints": [
            "/lignes",
            "/lignes/<id>",
            "/arrets",
            "/stats",
            "/lignes/recherche?q=<terme>",
            "/incidents (GET)",
            "/incidents (POST)"
        ]
    })

@app.route("/lignes", methods=["GET"])
def get_lignes():
    """Retourne toutes les lignes de bus"""
    return jsonify(lignes)

@app.route("/lignes/<int:ligne_id>", methods=["GET"])
def get_ligne_by_id(ligne_id):
    """Retourne une ligne spécifique par ID"""
    for ligne in lignes:
        if ligne["id"] == ligne_id:
            return jsonify(ligne)
    return jsonify({"erreur": "Ligne non trouvée"}), 404

@app.route("/arrets", methods=["GET"])
def get_arrets():
    """Retourne la liste de tous les arrêts uniques"""
    tous_les_arrets = set()
    for ligne in lignes:
        for arret in ligne["listeArrets"]:
            tous_les_arrets.add(arret)
    return jsonify(sorted(list(tous_les_arrets)))

@app.route("/stats", methods=["GET"])
def get_stats():
    """Retourne les statistiques du réseau"""
    total_lignes = len(lignes)
    total_arrets = sum(ligne["arrets"] for ligne in lignes)
    ligne_max_arrets = max(lignes, key=lambda l: l["arrets"])
    
    return jsonify({
        "total_lignes": total_lignes,
        "total_arrets": total_arrets,
        "ligne_plus_arrets": ligne_max_arrets["numero"]
    })

@app.route("/lignes/recherche", methods=["GET"])
def recherche_lignes():
    """Filtre les lignes par terme de recherche"""
    q = request.args.get("q", "").lower()
    
    resultat = [
        ligne for ligne in lignes
        if q in ligne["depart"].lower() or q in ligne["arrivee"].lower()
    ]
    
    return jsonify(resultat)

@app.route("/incidents", methods=["GET"])
def get_incidents():
    """Retourne la liste de tous les incidents"""
    return jsonify(incidents)

@app.route("/incidents", methods=["POST"])
def post_incident():
    """Crée un nouvel incident"""
    data = request.get_json()
    
    # Validation
    if not data or "ligne" not in data or "description" not in data:
        return jsonify({"erreur": "Champs requis manquants"}), 400
    
    # Création de l'incident
    incident = {
        "id": len(incidents) + 1,
        "ligne": data["ligne"],
        "description": data["description"],
        "lieu": data.get("lieu", "Non précisé")
    }
    
    incidents.append(incident)
    return jsonify(incident), 201

# ===== DÉMARRAGE =====

if __name__ == "__main__":
    print("🚌 Serveur SénTransport démarré sur http://127.0.0.1:5000")
    app.run(debug=True, port=5000)