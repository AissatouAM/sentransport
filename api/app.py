import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Charger les donnees depuis le fichier JSON
with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)

@app.route("/")
def accueil():
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>"]
    })

@app.route("/lignes")
def get_lignes():
    return jsonify(lignes)

@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    ligne = next(
        (l for l in lignes if l["id"] == ligne_id),
        None
    )
    if ligne is None:
        return jsonify({"erreur": "Ligne non trouvee"}), 404
    return jsonify(ligne)


#Exercice 1
@app.route("/arrets")
def get_arrets():
    arrets = set()
    for ligne in lignes:
        if "listeArrets" in ligne:
            for arret in ligne["listeArrets"]:
                arrets.add(arret)
    return jsonify(list(arrets))

#Exercice 2
@app.route("/stats")
def get_stats():
    nb_lignes = len(lignes)
    total_arrets = 0

    max_arrets = -1
    ligne_plus_chargee = None
    
    for ligne in lignes:
        # On récupère le nombre d'arrêts pour la ligne actuelle
        nb_arrets_ligne = len(ligne.get("listeArrets", []))
        
        # Cumul pour la somme totale de tous les arrêts
        total_arrets += nb_arrets_ligne
        
        # Recherche de la ligne qui a le plus d'arrêts
        if nb_arrets_ligne > max_arrets:
            max_arrets = nb_arrets_ligne
            # On stocke le numéro (ou l'id) de la ligne en question
            ligne_plus_chargee = ligne.get("id") # ou ligne.get("numero") selon votre structure JSON
            
    return jsonify({
        "Nombre total de lignes": nb_lignes,
        "Nombre total d'arrets": total_arrets,
        "Ligne avec le plus d'arrets": ligne_plus_chargee
    })

#Exercice 3
@app.route("/lignes/recherche")
def rechercher_lignes():
    # Récupération du paramètre 'q' dans l'URL. Si absent, la valeur par défaut est ""
    mot_cle = request.args.get("q", "").strip().lower()
    
    # Si aucun mot-clé n'est fourni, on peut retourner toutes les lignes ou une liste vide
    if not mot_cle:
        return jsonify(lignes)
        
    lignes_filtrees = []
    
    for ligne in lignes:
        # On récupère le départ et l'arrivée (convertis en minuscules pour ignorer la casse)
        depart = ligne.get("depart", "").lower()
        arrivee = ligne.get("arrivee", "").lower()
        
        # On vérifie si le mot-clé est contenu dans le départ ou dans l'arrivée
        if mot_cle in depart or mot_cle in arrivee:
            lignes_filtrees.append(ligne)
            
    return jsonify(lignes_filtrees)



if __name__ == "__main__":
    app.run(debug=True, port=5000)