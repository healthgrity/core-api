# Healthgrity - README

## Prérequis

Avant de démarrer le projet, assurez-vous de suivre ces étapes :

1. Installer Metamask : Metamask est un portefeuille de cryptomonnaie qui vous permettra de gérer vos comptes et d'interagir avec le réseau blockchain. Vous pouvez télécharger Metamask à partir du lien suivant : [Télécharger Metamask](https://metamask.io).

2. Créer un compte développeur : Vous devez créer un compte développeur pour accéder aux fonctionnalités de développement sur la blockchain. Suivez les instructions sur le site officiel de Metamask pour créer un compte développeur.

## Configuration du réseau de test

Avant de déployer le smart contract et de démarrer l'API, vous devez configurer un réseau de test dans Metamask. Suivez ces étapes pour ajouter le réseau MATIC de test :

1. Cliquez sur l'icône Metamask dans votre navigateur et ouvrez le portefeuille.

2. Cliquez sur l'onglet "Réseaux" dans le menu principal.

3. Cliquez sur "Ajouter un réseau" pour ouvrir la fenêtre de configuration du réseau.

4. Remplissez les informations suivantes :
   - Nom du réseau : Mumbai
   - Nouvelle URL de RPC : https://endpoints.omniatech.io/v1/matic/mumbai/public
   - ID de chaîne : 80001
   - Symbole de la devise : MATIC
   - URL de l'explorateur de blocs (facultatif) : https://mumbai.polygonscan.com

5. Cliquez sur "Enregistrer" pour ajouter le réseau MATIC de test à Metamask.

6. Connectez-vous à votre compte développeur sur Metamask et sélectionnez le réseau Mumbai dans la liste des réseaux disponibles.

## Déploiement du smart contract

Avant de démarrer l'API, vous devez déployer le smart contract sur le réseau de test. Suivez ces étapes pour déployer le smart contract en utilisant l'IDE Remix Ethereum :

1. Ouvrez l'IDE Remix Ethereum à l'adresse suivante : [Remix Ethereum](https://remix.ethereum.org/).

2. Importez le fichier du smart contract `/smart-contracts/healthgrity.sol` dans l'IDE Remix Ethereum.

3. Vérifiez et effectuez les modifications nécessaires au smart contract, si nécessaire.

4. Sélectionnez le réseau Mumbai dans Metamask.

5. Dans Remix Ethereum, sélectionnez l'environnement "Injected Web3" dans l'onglet "Environnement".

6. Cliquez sur le bouton "Deploy" pour déployer le smart contract sur le réseau de test Mumbai.

7. Une fois le déploiement terminé, copiez l'ABI (Interface du contrat) générée par Remix Ethereum. Vous aurez besoin de cette ABI pour mettre à jour la variable `abi.js/contractABI`.

## Démarrage de l'API

Maintenant que vous avez configuré Metamask, déployé le smart contract et mis à jour l'ABI dans le fichie de configuration `abi.js`, vous pouvez démarrer l'API. Suivez ces étapes :

1. Ouvrez une fenêtre de terminal.

2. Accédez au répertoire racine du projet.

3. Exécutez la commande `npm install` pour installer les dépendances du projet.

4. Exécutez la commande `npm start` pour démarrer l'API.

5. L'API est maintenant accessible à l'adresse `http://localhost:4001`.

## Interagir avec l'API

Pour interagir avec l'API, vous pouvez utiliser un client REST tel que Postman. Voici comment envoyer des requêtes à l'API :

1. Ouvrez Postman ou tout autre client REST de votre choix.

2. Créez une nouvelle requête et spécifiez l'URL de l'API que vous souhaitez appeler (par exemple, `http://localhost:3001/api/endpoint`).

3. Choisissez la méthode HTTP appropriée (GET, POST, etc.) et ajoutez les paramètres nécessaires à la requête.

4. Envoyez la requête et vérifiez la réponse de l'API.

C'est tout ! Vous êtes maintenant prêt à démarrer et à interagir avec le projet crypto.

Si vous avez des questions supplémentaires ou rencontrez des problèmes, n'hésitez pas à nous contacter.

Bon développement !

## Quelques liens utiles

https://mumbai.polygonscan.com/

https://chainlist.org/chain/137

https://faucet.polygon.technology/
