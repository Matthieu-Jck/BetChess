const DEFAULT_LANGUAGE = "en";
const STORAGE_KEY = "betchess-language";

const languages = [
  { code: "en", label: "English", htmlLang: "en" },
  { code: "fr", label: "Français", htmlLang: "fr" },
  { code: "de", label: "Deutsch", htmlLang: "de" },
  { code: "es", label: "Español", htmlLang: "es" },
  { code: "it", label: "Italiano", htmlLang: "it" },
  { code: "zh", label: "中文", htmlLang: "zh" },
  { code: "ja", label: "日本語", htmlLang: "ja" }
];

const dictionaries = {
  en: {
    "page.main.title": "BetChess",
    "page.support.title": "BetChess Support",
    "page.privacy.title": "BetChess Privacy",
    "page.terms.title": "BetChess Terms",
    "language.label": "Language",
    "brand.kicker": "No money involved. Just chess with a twist.",
    "header.rules": "Rules",
    "header.players": "Players",
    "game.surrender": "Surrender",
    "timer.opponent": "Opponent",
    "timer.you": "You",
    "timer.youName": "{name} (You)",
    "turn.waiting": "Waiting for a match",
    "turn.yourMove": "Your move",
    "turn.opponent": "Opponent's turn",
    "turn.bet": "Place your bet",
    "turn.secondMove": "Your second move",
    "turn.betLocked": "Bet locked: {prediction}",
    "turn.correctBet": "Correct bet. Bonus turn live.",
    "turn.missedBet": "Missed bet. Normal turn.",
    "move.format": "{from} to {to}",
    "phase.opponent": "Opponent's turn",
    "phase.move": "Your move",
    "phase.second": "Your second move",
    "phase.bet": "Your bet",
    "rules.eyebrow": "How it works",
    "rules.title": "Rules",
    "rules.playTitle": "Play normally",
    "rules.turnLabel": "Your turn:",
    "rules.turnText": "one standard legal chess move.",
    "rules.betLabel": "Your bet:",
    "rules.betText": "drag one of your opponent's pieces to the square you think it will play next.",
    "rules.firstWhiteNoBet": "White does not bet on the very first turn, because Black has not moved yet.",
    "rules.correctTitle": "If your bet is correct",
    "rules.bonusOne": "One bonus move next turn.",
    "rules.twoMoves": "You may play two legal moves in a row before betting again.",
    "rules.noSamePiece": "You cannot move the same piece twice during that bonus turn.",
    "rules.opponentBonusTitle": "If the opponent has a bonus turn",
    "rules.eitherMove": "Your prediction is counted as correct if it matches either of the two moves they make.",
    "rules.noteTitle": "Standard chess rules apply.",
    "rules.noteBody": "Check, checkmate, stalemate, repetition, and insufficient material all work normally.",
    "bonus.kicker": "Jackpot",
    "bonus.title": "Correct bet",
    "bonus.copy": "Bonus turn unlocked",
    "result.kicker": "Game over",
    "result.title": "Result",
    "result.tap": "Tap to continue",
    "result.hint": "Tap anywhere to continue",
    "result.winTitle": "{name} wins",
    "result.drawTitle": "Draw",
    "result.matchComplete": "Match complete",
    "result.noWinner": "No winner",
    "result.reason.checkmate": "Checkmate",
    "result.reason.stalemate": "Stalemate",
    "result.reason.repetition": "Repetition",
    "result.reason.insufficient": "Insufficient material",
    "result.reason.draw": "Draw",
    "result.reason.disconnected": "{name} disconnected",
    "result.reason.surrendered": "{name} surrendered",
    "result.reason.timeout": "{loser} ran out of time",
    "result.reason.generic": "{reason}",
    "username.kicker": "Start a session",
    "username.title": "Choose a username",
    "username.copy": "Pick a short handle so other players can invite you to a match.",
    "username.label": "Username",
    "username.placeholder": "Username",
    "username.submit": "Enter lobby",
    "username.invalid": "Use 2 to 15 letters, numbers, or underscores.",
    "username.empty": "Please choose a valid username.",
    "username.taken": "That username is already in use.",
    "players.eyebrow": "Lobby",
    "players.title": "Players online",
    "players.count": "{count} connected",
    "players.empty": "No opponents available yet.",
    "players.inGame": "In game",
    "players.playing": "Playing",
    "players.sent": "Sent",
    "players.respond": "Respond",
    "players.challenge": "Challenge",
    "players.available": "Available",
    "players.accept": "Accept",
    "players.decline": "Decline",
    "players.challengedYou": "{name} challenged you",
    "players.invitationSent": "Invitation sent to {name}",
    "players.signedIn": "Signed in as {name} - {status}",
    "notice.selfChallenge": "You cannot challenge yourself.",
    "notice.playerBusy": "One of those players is already in a game.",
    "notice.alreadyInvited": "You already invited {name}.",
    "notice.declined": "{name} declined your invitation.",
    "notice.cancelledBusy": "That invitation expired because one player is already busy.",
    "notice.leftLobby": "{name} left the lobby.",
    "notice.nowInMatch": "{name} is now in a match.",
    "support.kicker": "Support",
    "support.title": "BetChess Help",
    "support.reachTitle": "How to reach us",
    "support.reachBody": "BetChess support is handled through the public project repository so bug reports, gameplay issues, and feature requests all land in one place.",
    "support.openIssue": "Open a GitHub issue",
    "support.viewRepo": "View the repository",
    "support.back": "Back to BetChess",
    "support.includeTitle": "What to include in a report",
    "support.includeUser": "Your username and what your opponent saw, if relevant.",
    "support.includeDevice": "The device you used, especially if the issue only happens on phone.",
    "support.includePhase": "The exact phase of the turn where the bug happened.",
    "support.includeMedia": "A screenshot or short clip whenever the board or timers looked wrong.",
    "privacy.kicker": "Privacy",
    "privacy.title": "BetChess Privacy Policy",
    "privacy.collectTitle": "What BetChess collects",
    "privacy.collectUsername": "A lobby username so other players can challenge you.",
    "privacy.collectMatch": "Live match state such as moves, timers, invitations, and game results.",
    "privacy.collectTechnical": "Technical connection data needed to run the multiplayer session.",
    "privacy.noCollectTitle": "What BetChess does not collect",
    "privacy.noPayment": "No payment data.",
    "privacy.noBanking": "No banking or real-money betting information.",
    "privacy.noPassword": "No account password for gameplay, since the game currently uses guest usernames.",
    "privacy.useTitle": "How data is used",
    "privacy.useBody": "Data is used only to show the lobby, run live matches, and deliver the game state between both players. Usernames are visible to other players in the lobby.",
    "privacy.readTerms": "Read the terms",
    "terms.kicker": "Terms",
    "terms.title": "BetChess Terms of Service",
    "terms.freeTitle": "Free-play only",
    "terms.freeBody": "BetChess is a free multiplayer chess variant. It does not process real-money wagers, deposits, or withdrawals.",
    "terms.useTitle": "Use of the service",
    "terms.username": "Choose a username that you are comfortable showing in the public lobby.",
    "terms.behavior": "Do not harass, spam, or impersonate other players.",
    "terms.gambling": "Do not use the app for unlawful or deceptive gambling claims.",
    "terms.statusTitle": "Service status",
    "terms.statusBody": "BetChess is provided as-is. Features, timers, sounds, and multiplayer behavior may change while the project evolves.",
    "terms.privacy": "Privacy policy"
  },
  fr: {
    "page.support.title": "Support BetChess",
    "page.privacy.title": "Confidentialité BetChess",
    "page.terms.title": "Conditions BetChess",
    "language.label": "Langue",
    "brand.kicker": "Lis l'échiquier. Devine la réponse.",
    "header.rules": "Règles",
    "header.players": "Joueurs",
    "game.surrender": "Abandonner",
    "timer.opponent": "Adversaire",
    "timer.you": "Vous",
    "timer.youName": "{name} (vous)",
    "turn.waiting": "En attente d'un match",
    "turn.yourMove": "Votre coup",
    "turn.opponent": "Tour de l'adversaire",
    "turn.bet": "Placez votre pari",
    "turn.secondMove": "Votre second coup",
    "turn.betLocked": "Pari verrouillé : {prediction}",
    "turn.correctBet": "Pari réussi. Tour bonus actif.",
    "turn.missedBet": "Pari raté. Tour normal.",
    "move.format": "{from} vers {to}",
    "phase.opponent": "Tour adverse",
    "phase.move": "Votre coup",
    "phase.second": "Second coup",
    "phase.bet": "Votre pari",
    "rules.eyebrow": "Fonctionnement",
    "rules.title": "Règles",
    "rules.playTitle": "Jouez normalement",
    "rules.turnLabel": "Votre tour :",
    "rules.turnText": "un coup d'échecs légal standard.",
    "rules.betLabel": "Votre pari :",
    "rules.betText": "faites glisser une pièce adverse vers la case où vous pensez qu'elle ira ensuite.",
    "rules.firstWhiteNoBet": "Les Blancs ne parient pas au tout premier tour, car les Noirs n'ont pas encore joué.",
    "rules.correctTitle": "Si votre pari est correct",
    "rules.bonusOne": "Vous gagnez un coup bonus au prochain tour.",
    "rules.twoMoves": "Vous pouvez jouer deux coups légaux d'affilée avant de parier à nouveau.",
    "rules.noSamePiece": "Vous ne pouvez pas jouer la même pièce deux fois pendant ce tour bonus.",
    "rules.opponentBonusTitle": "Si l'adversaire a un tour bonus",
    "rules.eitherMove": "Votre prédiction est correcte si elle correspond à l'un de ses deux coups.",
    "rules.noteTitle": "Les règles classiques des échecs s'appliquent.",
    "rules.noteBody": "Échec, mat, pat, répétition et matériel insuffisant fonctionnent normalement.",
    "bonus.kicker": "Jackpot",
    "bonus.title": "Pari réussi",
    "bonus.copy": "Tour bonus débloqué",
    "result.kicker": "Partie terminée",
    "result.title": "Résultat",
    "result.tap": "Touchez pour continuer",
    "result.hint": "Touchez n'importe où pour continuer",
    "result.winTitle": "{name} gagne",
    "result.drawTitle": "Nulle",
    "result.matchComplete": "Match terminé",
    "result.noWinner": "Aucun vainqueur",
    "result.reason.checkmate": "Échec et mat",
    "result.reason.stalemate": "Pat",
    "result.reason.repetition": "Répétition",
    "result.reason.insufficient": "Matériel insuffisant",
    "result.reason.draw": "Nulle",
    "result.reason.disconnected": "{name} s'est déconnecté",
    "result.reason.surrendered": "{name} a abandonné",
    "result.reason.timeout": "{loser} a perdu au temps",
    "username.kicker": "Démarrer une session",
    "username.title": "Choisissez un pseudo",
    "username.copy": "Choisissez un nom court pour recevoir des invitations.",
    "username.label": "Pseudo",
    "username.placeholder": "Pseudo",
    "username.submit": "Entrer dans le salon",
    "username.invalid": "Utilisez 2 à 15 lettres, chiffres ou underscores.",
    "username.empty": "Veuillez choisir un pseudo valide.",
    "username.taken": "Ce pseudo est déjà utilisé.",
    "players.eyebrow": "Salon",
    "players.title": "Joueurs en ligne",
    "players.count": "{count} connecté(s)",
    "players.empty": "Aucun adversaire disponible pour le moment.",
    "players.inGame": "En partie",
    "players.playing": "En jeu",
    "players.sent": "Envoyé",
    "players.respond": "Répondre",
    "players.challenge": "Défier",
    "players.available": "Disponible",
    "players.accept": "Accepter",
    "players.decline": "Refuser",
    "players.challengedYou": "{name} vous défie",
    "players.invitationSent": "Invitation envoyée à {name}",
    "players.signedIn": "Connecté en tant que {name} - {status}",
    "notice.selfChallenge": "Vous ne pouvez pas vous défier vous-même.",
    "notice.playerBusy": "L'un des joueurs est déjà en partie.",
    "notice.alreadyInvited": "Vous avez déjà invité {name}.",
    "notice.declined": "{name} a refusé votre invitation.",
    "notice.cancelledBusy": "Cette invitation a expiré car un joueur est déjà occupé.",
    "notice.leftLobby": "{name} a quitté le salon.",
    "notice.nowInMatch": "{name} est maintenant en match.",
    "support.kicker": "Support",
    "support.title": "Aide BetChess",
    "support.reachTitle": "Nous contacter",
    "support.reachBody": "Le support BetChess passe par le dépôt public du projet afin de regrouper bugs, problèmes de partie et demandes de fonctionnalités.",
    "support.openIssue": "Ouvrir une issue GitHub",
    "support.viewRepo": "Voir le dépôt",
    "support.back": "Retour à BetChess",
    "support.includeTitle": "À inclure dans un rapport",
    "support.includeUser": "Votre pseudo et ce que votre adversaire a vu, si utile.",
    "support.includeDevice": "L'appareil utilisé, surtout si le problème arrive seulement sur téléphone.",
    "support.includePhase": "La phase exacte du tour où le bug s'est produit.",
    "support.includeMedia": "Une capture ou courte vidéo si le plateau ou les timers semblaient incorrects.",
    "privacy.kicker": "Confidentialité",
    "privacy.title": "Politique de confidentialité BetChess",
    "privacy.collectTitle": "Ce que BetChess collecte",
    "privacy.collectUsername": "Un pseudo de salon pour permettre aux autres joueurs de vous défier.",
    "privacy.collectMatch": "L'état du match en direct : coups, timers, invitations et résultats.",
    "privacy.collectTechnical": "Des données techniques de connexion nécessaires au multijoueur.",
    "privacy.noCollectTitle": "Ce que BetChess ne collecte pas",
    "privacy.noPayment": "Aucune donnée de paiement.",
    "privacy.noBanking": "Aucune information bancaire ni pari en argent réel.",
    "privacy.noPassword": "Aucun mot de passe de compte, car le jeu utilise actuellement des pseudos invités.",
    "privacy.useTitle": "Utilisation des données",
    "privacy.useBody": "Les données servent uniquement à afficher le salon, gérer les matchs en direct et transmettre l'état de partie entre les deux joueurs.",
    "privacy.readTerms": "Lire les conditions",
    "terms.kicker": "Conditions",
    "terms.title": "Conditions d'utilisation BetChess",
    "terms.freeTitle": "Jeu gratuit uniquement",
    "terms.freeBody": "BetChess est une variante d'échecs multijoueur gratuite. Elle ne traite aucun pari, dépôt ou retrait en argent réel.",
    "terms.useTitle": "Utilisation du service",
    "terms.username": "Choisissez un pseudo que vous acceptez d'afficher dans le salon public.",
    "terms.behavior": "Ne harcelez pas, ne spammez pas et n'usurpez pas l'identité d'autres joueurs.",
    "terms.gambling": "N'utilisez pas l'application pour des affirmations de jeu d'argent illégales ou trompeuses.",
    "terms.statusTitle": "État du service",
    "terms.statusBody": "BetChess est fourni tel quel. Les fonctionnalités, timers, sons et comportements multijoueur peuvent évoluer.",
    "terms.privacy": "Politique de confidentialité"
  },
  de: {
    "page.support.title": "BetChess Support",
    "page.privacy.title": "BetChess Datenschutz",
    "page.terms.title": "BetChess Nutzungsbedingungen",
    "language.label": "Sprache",
    "brand.kicker": "Lies das Brett. Sag die Antwort voraus.",
    "header.rules": "Regeln",
    "header.players": "Spieler",
    "game.surrender": "Aufgeben",
    "timer.opponent": "Gegner",
    "timer.you": "Du",
    "timer.youName": "{name} (du)",
    "turn.waiting": "Warte auf ein Match",
    "turn.yourMove": "Dein Zug",
    "turn.opponent": "Zug des Gegners",
    "turn.bet": "Setze deine Vorhersage",
    "turn.secondMove": "Dein zweiter Zug",
    "turn.betLocked": "Vorhersage festgelegt: {prediction}",
    "turn.correctBet": "Richtig getippt. Bonuszug aktiv.",
    "turn.missedBet": "Vorhersage verfehlt. Normaler Zug.",
    "move.format": "{from} nach {to}",
    "phase.opponent": "Gegnerzug",
    "phase.move": "Dein Zug",
    "phase.second": "Zweiter Zug",
    "phase.bet": "Dein Tipp",
    "rules.eyebrow": "So funktioniert es",
    "rules.title": "Regeln",
    "rules.playTitle": "Normal spielen",
    "rules.turnLabel": "Dein Zug:",
    "rules.turnText": "ein normaler legaler Schachzug.",
    "rules.betLabel": "Dein Tipp:",
    "rules.betText": "ziehe eine gegnerische Figur auf das Feld, auf das sie deiner Meinung nach als Nächstes zieht.",
    "rules.firstWhiteNoBet": "Weiß tippt im allerersten Zug nicht, weil Schwarz noch nicht gezogen hat.",
    "rules.correctTitle": "Wenn dein Tipp stimmt",
    "rules.bonusOne": "Du bekommst im nächsten Zug einen Bonuszug.",
    "rules.twoMoves": "Du darfst zwei legale Züge hintereinander machen, bevor du wieder tippst.",
    "rules.noSamePiece": "Du darfst im Bonuszug nicht zweimal dieselbe Figur ziehen.",
    "rules.opponentBonusTitle": "Wenn der Gegner einen Bonuszug hat",
    "rules.eitherMove": "Deine Vorhersage zählt, wenn sie einem der beiden gegnerischen Züge entspricht.",
    "rules.noteTitle": "Die normalen Schachregeln gelten.",
    "rules.noteBody": "Schach, Matt, Patt, Wiederholung und unzureichendes Material funktionieren normal.",
    "bonus.kicker": "Jackpot",
    "bonus.title": "Richtig getippt",
    "bonus.copy": "Bonuszug freigeschaltet",
    "result.kicker": "Spiel beendet",
    "result.title": "Ergebnis",
    "result.tap": "Tippen zum Fortfahren",
    "result.hint": "Irgendwo tippen, um fortzufahren",
    "result.winTitle": "{name} gewinnt",
    "result.drawTitle": "Remis",
    "result.matchComplete": "Match beendet",
    "result.noWinner": "Kein Sieger",
    "result.reason.checkmate": "Schachmatt",
    "result.reason.stalemate": "Patt",
    "result.reason.repetition": "Wiederholung",
    "result.reason.insufficient": "Unzureichendes Material",
    "result.reason.draw": "Remis",
    "result.reason.disconnected": "{name} hat die Verbindung getrennt",
    "result.reason.surrendered": "{name} hat aufgegeben",
    "result.reason.timeout": "{loser} hat die Zeit überschritten",
    "username.kicker": "Sitzung starten",
    "username.title": "Benutzernamen wählen",
    "username.copy": "Wähle einen kurzen Namen, damit andere dich einladen können.",
    "username.label": "Benutzername",
    "username.placeholder": "Benutzername",
    "username.submit": "Lobby betreten",
    "username.invalid": "Nutze 2 bis 15 Buchstaben, Zahlen oder Unterstriche.",
    "username.empty": "Bitte wähle einen gültigen Benutzernamen.",
    "username.taken": "Dieser Benutzername ist bereits vergeben.",
    "players.eyebrow": "Lobby",
    "players.title": "Spieler online",
    "players.count": "{count} verbunden",
    "players.empty": "Noch keine Gegner verfügbar.",
    "players.inGame": "Im Spiel",
    "players.playing": "Spielt",
    "players.sent": "Gesendet",
    "players.respond": "Antworten",
    "players.challenge": "Fordern",
    "players.available": "Verfügbar",
    "players.accept": "Annehmen",
    "players.decline": "Ablehnen",
    "players.challengedYou": "{name} fordert dich heraus",
    "players.invitationSent": "Einladung an {name} gesendet",
    "players.signedIn": "Angemeldet als {name} - {status}",
    "notice.selfChallenge": "Du kannst dich nicht selbst herausfordern.",
    "notice.playerBusy": "Einer der Spieler ist bereits in einem Spiel.",
    "notice.alreadyInvited": "Du hast {name} bereits eingeladen.",
    "notice.declined": "{name} hat deine Einladung abgelehnt.",
    "notice.cancelledBusy": "Diese Einladung ist abgelaufen, weil ein Spieler beschäftigt ist.",
    "notice.leftLobby": "{name} hat die Lobby verlassen.",
    "notice.nowInMatch": "{name} ist jetzt in einem Match.",
    "support.kicker": "Support",
    "support.title": "BetChess Hilfe",
    "support.reachTitle": "So erreichst du uns",
    "support.reachBody": "Der BetChess-Support läuft über das öffentliche Projekt-Repository, damit Fehler, Spielprobleme und Feature-Wünsche an einem Ort bleiben.",
    "support.openIssue": "GitHub-Issue öffnen",
    "support.viewRepo": "Repository ansehen",
    "support.back": "Zurück zu BetChess",
    "support.includeTitle": "Was ein Bericht enthalten sollte",
    "support.includeUser": "Dein Benutzername und was dein Gegner gesehen hat, falls relevant.",
    "support.includeDevice": "Das verwendete Gerät, besonders wenn das Problem nur am Telefon auftritt.",
    "support.includePhase": "Die genaue Zugphase, in der der Fehler passiert ist.",
    "support.includeMedia": "Ein Screenshot oder kurzer Clip, wenn Brett oder Timer falsch aussahen.",
    "privacy.kicker": "Datenschutz",
    "privacy.title": "BetChess Datenschutzrichtlinie",
    "privacy.collectTitle": "Was BetChess sammelt",
    "privacy.collectUsername": "Einen Lobby-Benutzernamen, damit andere dich herausfordern können.",
    "privacy.collectMatch": "Live-Matchdaten wie Züge, Timer, Einladungen und Ergebnisse.",
    "privacy.collectTechnical": "Technische Verbindungsdaten, die für Multiplayer nötig sind.",
    "privacy.noCollectTitle": "Was BetChess nicht sammelt",
    "privacy.noPayment": "Keine Zahlungsdaten.",
    "privacy.noBanking": "Keine Bankdaten und keine Informationen zu Echtgeldwetten.",
    "privacy.noPassword": "Kein Kontopasswort, da das Spiel derzeit Gastnamen nutzt.",
    "privacy.useTitle": "Wie Daten verwendet werden",
    "privacy.useBody": "Daten werden nur genutzt, um die Lobby zu zeigen, Live-Matches auszuführen und den Spielstand zwischen beiden Spielern zu übertragen.",
    "privacy.readTerms": "Bedingungen lesen",
    "terms.kicker": "Bedingungen",
    "terms.title": "BetChess Nutzungsbedingungen",
    "terms.freeTitle": "Nur kostenloses Spiel",
    "terms.freeBody": "BetChess ist eine kostenlose Multiplayer-Schachvariante. Es verarbeitet keine Echtgeldwetten, Einzahlungen oder Auszahlungen.",
    "terms.useTitle": "Nutzung des Dienstes",
    "terms.username": "Wähle einen Benutzernamen, den du in der öffentlichen Lobby zeigen möchtest.",
    "terms.behavior": "Belästige, spamme oder imitiere keine anderen Spieler.",
    "terms.gambling": "Nutze die App nicht für illegale oder irreführende Glücksspielbehauptungen.",
    "terms.statusTitle": "Dienststatus",
    "terms.statusBody": "BetChess wird wie besehen bereitgestellt. Funktionen, Timer, Sounds und Multiplayer-Verhalten können sich ändern.",
    "terms.privacy": "Datenschutzrichtlinie"
  },
  es: {
    "page.support.title": "Soporte de BetChess",
    "page.privacy.title": "Privacidad de BetChess",
    "page.terms.title": "Términos de BetChess",
    "language.label": "Idioma",
    "brand.kicker": "Lee el tablero. Adivina la respuesta.",
    "header.rules": "Reglas",
    "header.players": "Jugadores",
    "game.surrender": "Rendirse",
    "timer.opponent": "Rival",
    "timer.you": "Tú",
    "timer.youName": "{name} (tú)",
    "turn.waiting": "Esperando una partida",
    "turn.yourMove": "Tu jugada",
    "turn.opponent": "Turno del rival",
    "turn.bet": "Haz tu apuesta",
    "turn.secondMove": "Tu segunda jugada",
    "turn.betLocked": "Apuesta fijada: {prediction}",
    "turn.correctBet": "Apuesta correcta. Turno bonus activo.",
    "turn.missedBet": "Apuesta fallida. Turno normal.",
    "move.format": "{from} a {to}",
    "phase.opponent": "Turno rival",
    "phase.move": "Tu jugada",
    "phase.second": "Segunda jugada",
    "phase.bet": "Tu apuesta",
    "rules.eyebrow": "Cómo funciona",
    "rules.title": "Reglas",
    "rules.playTitle": "Juega normalmente",
    "rules.turnLabel": "Tu turno:",
    "rules.turnText": "una jugada legal normal de ajedrez.",
    "rules.betLabel": "Tu apuesta:",
    "rules.betText": "arrastra una pieza rival a la casilla donde crees que jugará después.",
    "rules.firstWhiteNoBet": "Las blancas no apuestan en el primer turno, porque las negras aún no han movido.",
    "rules.correctTitle": "Si tu apuesta es correcta",
    "rules.bonusOne": "Ganas una jugada bonus en tu próximo turno.",
    "rules.twoMoves": "Puedes hacer dos jugadas legales seguidas antes de apostar otra vez.",
    "rules.noSamePiece": "No puedes mover la misma pieza dos veces durante ese turno bonus.",
    "rules.opponentBonusTitle": "Si el rival tiene un turno bonus",
    "rules.eitherMove": "Tu predicción cuenta si coincide con cualquiera de sus dos jugadas.",
    "rules.noteTitle": "Se aplican las reglas normales del ajedrez.",
    "rules.noteBody": "Jaque, mate, ahogado, repetición y material insuficiente funcionan con normalidad.",
    "bonus.kicker": "Jackpot",
    "bonus.title": "Apuesta correcta",
    "bonus.copy": "Turno bonus desbloqueado",
    "result.kicker": "Partida terminada",
    "result.title": "Resultado",
    "result.tap": "Toca para continuar",
    "result.hint": "Toca cualquier lugar para continuar",
    "result.winTitle": "{name} gana",
    "result.drawTitle": "Tablas",
    "result.matchComplete": "Partida completada",
    "result.noWinner": "Sin ganador",
    "result.reason.checkmate": "Jaque mate",
    "result.reason.stalemate": "Ahogado",
    "result.reason.repetition": "Repetición",
    "result.reason.insufficient": "Material insuficiente",
    "result.reason.draw": "Tablas",
    "result.reason.disconnected": "{name} se desconectó",
    "result.reason.surrendered": "{name} se rindió",
    "result.reason.timeout": "{loser} perdió por tiempo",
    "username.kicker": "Iniciar sesión",
    "username.title": "Elige un nombre",
    "username.copy": "Elige un alias corto para que otros puedan invitarte.",
    "username.label": "Nombre",
    "username.placeholder": "Nombre",
    "username.submit": "Entrar al lobby",
    "username.invalid": "Usa de 2 a 15 letras, números o guiones bajos.",
    "username.empty": "Elige un nombre válido.",
    "username.taken": "Ese nombre ya está en uso.",
    "players.eyebrow": "Lobby",
    "players.title": "Jugadores en línea",
    "players.count": "{count} conectado(s)",
    "players.empty": "Aún no hay rivales disponibles.",
    "players.inGame": "En partida",
    "players.playing": "Jugando",
    "players.sent": "Enviada",
    "players.respond": "Responder",
    "players.challenge": "Retar",
    "players.available": "Disponible",
    "players.accept": "Aceptar",
    "players.decline": "Rechazar",
    "players.challengedYou": "{name} te retó",
    "players.invitationSent": "Invitación enviada a {name}",
    "players.signedIn": "Conectado como {name} - {status}",
    "notice.selfChallenge": "No puedes retarte a ti mismo.",
    "notice.playerBusy": "Uno de esos jugadores ya está en una partida.",
    "notice.alreadyInvited": "Ya invitaste a {name}.",
    "notice.declined": "{name} rechazó tu invitación.",
    "notice.cancelledBusy": "La invitación caducó porque un jugador ya está ocupado.",
    "notice.leftLobby": "{name} salió del lobby.",
    "notice.nowInMatch": "{name} está ahora en una partida.",
    "support.kicker": "Soporte",
    "support.title": "Ayuda de BetChess",
    "support.reachTitle": "Cómo contactarnos",
    "support.reachBody": "El soporte de BetChess se gestiona en el repositorio público del proyecto para reunir errores, problemas de juego y solicitudes en un solo lugar.",
    "support.openIssue": "Abrir issue en GitHub",
    "support.viewRepo": "Ver repositorio",
    "support.back": "Volver a BetChess",
    "support.includeTitle": "Qué incluir en un reporte",
    "support.includeUser": "Tu nombre y lo que vio tu rival, si aplica.",
    "support.includeDevice": "El dispositivo usado, especialmente si el problema ocurre solo en teléfono.",
    "support.includePhase": "La fase exacta del turno donde ocurrió el error.",
    "support.includeMedia": "Una captura o clip corto si el tablero o temporizadores se veían mal.",
    "privacy.kicker": "Privacidad",
    "privacy.title": "Política de privacidad de BetChess",
    "privacy.collectTitle": "Qué recopila BetChess",
    "privacy.collectUsername": "Un nombre de lobby para que otros jugadores puedan retarte.",
    "privacy.collectMatch": "Estado de la partida en vivo, como jugadas, temporizadores, invitaciones y resultados.",
    "privacy.collectTechnical": "Datos técnicos de conexión necesarios para el multijugador.",
    "privacy.noCollectTitle": "Qué no recopila BetChess",
    "privacy.noPayment": "Sin datos de pago.",
    "privacy.noBanking": "Sin datos bancarios ni apuestas con dinero real.",
    "privacy.noPassword": "Sin contraseña de cuenta, porque el juego usa nombres de invitado.",
    "privacy.useTitle": "Cómo se usan los datos",
    "privacy.useBody": "Los datos solo se usan para mostrar el lobby, ejecutar partidas en vivo y enviar el estado entre ambos jugadores.",
    "privacy.readTerms": "Leer términos",
    "terms.kicker": "Términos",
    "terms.title": "Términos de servicio de BetChess",
    "terms.freeTitle": "Solo juego gratuito",
    "terms.freeBody": "BetChess es una variante multijugador gratuita de ajedrez. No procesa apuestas, depósitos ni retiros con dinero real.",
    "terms.useTitle": "Uso del servicio",
    "terms.username": "Elige un nombre que aceptes mostrar en el lobby público.",
    "terms.behavior": "No acoses, envíes spam ni suplantes a otros jugadores.",
    "terms.gambling": "No uses la app para afirmaciones ilegales o engañosas sobre apuestas.",
    "terms.statusTitle": "Estado del servicio",
    "terms.statusBody": "BetChess se ofrece tal cual. Funciones, temporizadores, sonidos y multijugador pueden cambiar.",
    "terms.privacy": "Política de privacidad"
  },
  it: {
    "page.support.title": "Supporto BetChess",
    "page.privacy.title": "Privacy BetChess",
    "page.terms.title": "Termini BetChess",
    "language.label": "Lingua",
    "brand.kicker": "Leggi la scacchiera. Chiama la risposta.",
    "header.rules": "Regole",
    "header.players": "Giocatori",
    "game.surrender": "Arrendersi",
    "timer.opponent": "Avversario",
    "timer.you": "Tu",
    "timer.youName": "{name} (tu)",
    "turn.waiting": "In attesa di una partita",
    "turn.yourMove": "La tua mossa",
    "turn.opponent": "Turno avversario",
    "turn.bet": "Fai la tua scommessa",
    "turn.secondMove": "La tua seconda mossa",
    "turn.betLocked": "Scommessa fissata: {prediction}",
    "turn.correctBet": "Scommessa corretta. Bonus attivo.",
    "turn.missedBet": "Scommessa mancata. Turno normale.",
    "move.format": "da {from} a {to}",
    "phase.opponent": "Turno avversario",
    "phase.move": "La tua mossa",
    "phase.second": "Seconda mossa",
    "phase.bet": "La tua scommessa",
    "rules.eyebrow": "Come funziona",
    "rules.title": "Regole",
    "rules.playTitle": "Gioca normalmente",
    "rules.turnLabel": "Il tuo turno:",
    "rules.turnText": "una normale mossa legale di scacchi.",
    "rules.betLabel": "La tua scommessa:",
    "rules.betText": "trascina un pezzo avversario sulla casa in cui pensi che andrà.",
    "rules.firstWhiteNoBet": "Il Bianco non scommette al primissimo turno, perché il Nero non ha ancora mosso.",
    "rules.correctTitle": "Se la scommessa è corretta",
    "rules.bonusOne": "Ottieni una mossa bonus al prossimo turno.",
    "rules.twoMoves": "Puoi fare due mosse legali di fila prima di scommettere di nuovo.",
    "rules.noSamePiece": "Non puoi muovere lo stesso pezzo due volte durante quel turno bonus.",
    "rules.opponentBonusTitle": "Se l'avversario ha un turno bonus",
    "rules.eitherMove": "La tua previsione vale se coincide con una delle sue due mosse.",
    "rules.noteTitle": "Si applicano le regole standard degli scacchi.",
    "rules.noteBody": "Scacco, matto, stallo, ripetizione e materiale insufficiente funzionano normalmente.",
    "bonus.kicker": "Jackpot",
    "bonus.title": "Scommessa corretta",
    "bonus.copy": "Turno bonus sbloccato",
    "result.kicker": "Partita finita",
    "result.title": "Risultato",
    "result.tap": "Tocca per continuare",
    "result.hint": "Tocca ovunque per continuare",
    "result.winTitle": "{name} vince",
    "result.drawTitle": "Patta",
    "result.matchComplete": "Partita completata",
    "result.noWinner": "Nessun vincitore",
    "result.reason.checkmate": "Scacco matto",
    "result.reason.stalemate": "Stallo",
    "result.reason.repetition": "Ripetizione",
    "result.reason.insufficient": "Materiale insufficiente",
    "result.reason.draw": "Patta",
    "result.reason.disconnected": "{name} si è disconnesso",
    "result.reason.surrendered": "{name} si è arreso",
    "result.reason.timeout": "{loser} ha perso per tempo",
    "username.kicker": "Avvia una sessione",
    "username.title": "Scegli un nome",
    "username.copy": "Scegli un nome breve per ricevere inviti.",
    "username.label": "Nome utente",
    "username.placeholder": "Nome utente",
    "username.submit": "Entra nella lobby",
    "username.invalid": "Usa da 2 a 15 lettere, numeri o underscore.",
    "username.empty": "Scegli un nome utente valido.",
    "username.taken": "Questo nome è già in uso.",
    "players.eyebrow": "Lobby",
    "players.title": "Giocatori online",
    "players.count": "{count} connesso/i",
    "players.empty": "Nessun avversario disponibile.",
    "players.inGame": "In partita",
    "players.playing": "In gioco",
    "players.sent": "Inviato",
    "players.respond": "Rispondi",
    "players.challenge": "Sfida",
    "players.available": "Disponibile",
    "players.accept": "Accetta",
    "players.decline": "Rifiuta",
    "players.challengedYou": "{name} ti ha sfidato",
    "players.invitationSent": "Invito inviato a {name}",
    "players.signedIn": "Accesso come {name} - {status}",
    "notice.selfChallenge": "Non puoi sfidare te stesso.",
    "notice.playerBusy": "Uno dei giocatori è già in partita.",
    "notice.alreadyInvited": "Hai già invitato {name}.",
    "notice.declined": "{name} ha rifiutato il tuo invito.",
    "notice.cancelledBusy": "L'invito è scaduto perché un giocatore è occupato.",
    "notice.leftLobby": "{name} ha lasciato la lobby.",
    "notice.nowInMatch": "{name} è ora in partita.",
    "support.kicker": "Supporto",
    "support.title": "Aiuto BetChess",
    "support.reachTitle": "Come contattarci",
    "support.reachBody": "Il supporto BetChess passa dal repository pubblico del progetto, così bug, problemi di gioco e richieste restano in un unico posto.",
    "support.openIssue": "Apri una issue GitHub",
    "support.viewRepo": "Vedi repository",
    "support.back": "Torna a BetChess",
    "support.includeTitle": "Cosa includere in una segnalazione",
    "support.includeUser": "Il tuo nome utente e cosa ha visto l'avversario, se rilevante.",
    "support.includeDevice": "Il dispositivo usato, soprattutto se il problema accade solo su telefono.",
    "support.includePhase": "La fase esatta del turno in cui è avvenuto il bug.",
    "support.includeMedia": "Uno screenshot o breve clip se scacchiera o timer sembravano errati.",
    "privacy.kicker": "Privacy",
    "privacy.title": "Informativa privacy BetChess",
    "privacy.collectTitle": "Cosa raccoglie BetChess",
    "privacy.collectUsername": "Un nome lobby per permettere agli altri giocatori di sfidarti.",
    "privacy.collectMatch": "Stato live della partita, come mosse, timer, inviti e risultati.",
    "privacy.collectTechnical": "Dati tecnici di connessione necessari al multiplayer.",
    "privacy.noCollectTitle": "Cosa non raccoglie BetChess",
    "privacy.noPayment": "Nessun dato di pagamento.",
    "privacy.noBanking": "Nessun dato bancario o informazione su scommesse con denaro reale.",
    "privacy.noPassword": "Nessuna password account, perché il gioco usa nomi ospite.",
    "privacy.useTitle": "Come vengono usati i dati",
    "privacy.useBody": "I dati servono solo per mostrare la lobby, gestire partite live e trasmettere lo stato tra i due giocatori.",
    "privacy.readTerms": "Leggi i termini",
    "terms.kicker": "Termini",
    "terms.title": "Termini di servizio BetChess",
    "terms.freeTitle": "Solo gioco gratuito",
    "terms.freeBody": "BetChess è una variante multigiocatore gratuita degli scacchi. Non gestisce scommesse, depositi o prelievi con denaro reale.",
    "terms.useTitle": "Uso del servizio",
    "terms.username": "Scegli un nome utente che accetti di mostrare nella lobby pubblica.",
    "terms.behavior": "Non molestare, spammare o impersonare altri giocatori.",
    "terms.gambling": "Non usare l'app per dichiarazioni illegali o ingannevoli sul gioco d'azzardo.",
    "terms.statusTitle": "Stato del servizio",
    "terms.statusBody": "BetChess è fornito così com'è. Funzioni, timer, suoni e multiplayer possono cambiare.",
    "terms.privacy": "Informativa privacy"
  },
  zh: {
    "page.support.title": "BetChess 支持",
    "page.privacy.title": "BetChess 隐私",
    "page.terms.title": "BetChess 条款",
    "language.label": "语言",
    "brand.kicker": "读懂棋盘，猜中回应。",
    "header.rules": "规则",
    "header.players": "玩家",
    "game.surrender": "认输",
    "timer.opponent": "对手",
    "timer.you": "你",
    "timer.youName": "{name}（你）",
    "turn.waiting": "等待对局",
    "turn.yourMove": "你的走棋",
    "turn.opponent": "对手回合",
    "turn.bet": "下注预测",
    "turn.secondMove": "你的第二步",
    "turn.betLocked": "预测已锁定：{prediction}",
    "turn.correctBet": "预测正确，奖励回合已开启。",
    "turn.missedBet": "预测失败，正常回合。",
    "move.format": "{from} 到 {to}",
    "phase.opponent": "对手回合",
    "phase.move": "你的走棋",
    "phase.second": "第二步",
    "phase.bet": "你的预测",
    "rules.eyebrow": "玩法说明",
    "rules.title": "规则",
    "rules.playTitle": "正常下棋",
    "rules.turnLabel": "你的回合：",
    "rules.turnText": "走一步标准合法棋。",
    "rules.betLabel": "你的预测：",
    "rules.betText": "拖动对手的一枚棋子到你认为它下一步会去的格子。",
    "rules.firstWhiteNoBet": "白方第一回合不预测，因为黑方还没有走棋。",
    "rules.correctTitle": "如果预测正确",
    "rules.bonusOne": "你下个回合获得一步奖励棋。",
    "rules.twoMoves": "你可以连续走两步合法棋，然后再预测。",
    "rules.noSamePiece": "奖励回合中不能连续移动同一枚棋子。",
    "rules.opponentBonusTitle": "如果对手有奖励回合",
    "rules.eitherMove": "只要你的预测命中对手两步中的任意一步，就算正确。",
    "rules.noteTitle": "标准国际象棋规则仍然适用。",
    "rules.noteBody": "将军、将死、逼和、重复局面和子力不足都正常生效。",
    "bonus.kicker": "大奖",
    "bonus.title": "预测正确",
    "bonus.copy": "奖励回合已解锁",
    "result.kicker": "对局结束",
    "result.title": "结果",
    "result.tap": "点击继续",
    "result.hint": "点击任意位置继续",
    "result.winTitle": "{name} 获胜",
    "result.drawTitle": "和棋",
    "result.matchComplete": "对局完成",
    "result.noWinner": "没有胜者",
    "result.reason.checkmate": "将死",
    "result.reason.stalemate": "逼和",
    "result.reason.repetition": "重复局面",
    "result.reason.insufficient": "子力不足",
    "result.reason.draw": "和棋",
    "result.reason.disconnected": "{name} 已断开连接",
    "result.reason.surrendered": "{name} 已认输",
    "result.reason.timeout": "{loser} 超时",
    "username.kicker": "开始会话",
    "username.title": "选择用户名",
    "username.copy": "选择一个简短昵称，方便其他玩家邀请你。",
    "username.label": "用户名",
    "username.placeholder": "用户名",
    "username.submit": "进入大厅",
    "username.invalid": "请使用 2 到 15 个字母、数字或下划线。",
    "username.empty": "请选择有效用户名。",
    "username.taken": "该用户名已被使用。",
    "players.eyebrow": "大厅",
    "players.title": "在线玩家",
    "players.count": "{count} 人在线",
    "players.empty": "暂无可用对手。",
    "players.inGame": "对局中",
    "players.playing": "正在游戏",
    "players.sent": "已发送",
    "players.respond": "回复",
    "players.challenge": "挑战",
    "players.available": "可用",
    "players.accept": "接受",
    "players.decline": "拒绝",
    "players.challengedYou": "{name} 向你发起挑战",
    "players.invitationSent": "已向 {name} 发送邀请",
    "players.signedIn": "当前身份：{name} - {status}",
    "notice.selfChallenge": "你不能挑战自己。",
    "notice.playerBusy": "其中一名玩家已经在对局中。",
    "notice.alreadyInvited": "你已经邀请过 {name}。",
    "notice.declined": "{name} 拒绝了你的邀请。",
    "notice.cancelledBusy": "邀请已过期，因为有玩家正在忙。",
    "notice.leftLobby": "{name} 离开了大厅。",
    "notice.nowInMatch": "{name} 已进入对局。",
    "support.kicker": "支持",
    "support.title": "BetChess 帮助",
    "support.reachTitle": "如何联系我们",
    "support.reachBody": "BetChess 支持通过公开项目仓库处理，方便集中跟踪错误、游戏问题和功能请求。",
    "support.openIssue": "打开 GitHub Issue",
    "support.viewRepo": "查看仓库",
    "support.back": "返回 BetChess",
    "support.includeTitle": "报告中应包含",
    "support.includeUser": "你的用户名，以及对手看到的情况（如相关）。",
    "support.includeDevice": "你使用的设备，尤其是问题只在手机上出现时。",
    "support.includePhase": "错误发生时的具体回合阶段。",
    "support.includeMedia": "如果棋盘或计时器异常，请提供截图或短视频。",
    "privacy.kicker": "隐私",
    "privacy.title": "BetChess 隐私政策",
    "privacy.collectTitle": "BetChess 收集什么",
    "privacy.collectUsername": "大厅用户名，用于让其他玩家挑战你。",
    "privacy.collectMatch": "实时对局状态，例如走棋、计时、邀请和结果。",
    "privacy.collectTechnical": "运行多人游戏所需的技术连接数据。",
    "privacy.noCollectTitle": "BetChess 不收集什么",
    "privacy.noPayment": "不收集支付数据。",
    "privacy.noBanking": "不收集银行或真钱下注信息。",
    "privacy.noPassword": "不收集账号密码，因为目前使用游客用户名。",
    "privacy.useTitle": "数据如何使用",
    "privacy.useBody": "数据仅用于显示大厅、运行实时对局，并在两名玩家之间传递游戏状态。",
    "privacy.readTerms": "阅读条款",
    "terms.kicker": "条款",
    "terms.title": "BetChess 服务条款",
    "terms.freeTitle": "仅免费娱乐",
    "terms.freeBody": "BetChess 是免费的多人国际象棋变体，不处理真钱下注、充值或提现。",
    "terms.useTitle": "服务使用",
    "terms.username": "请选择你愿意在公开大厅展示的用户名。",
    "terms.behavior": "不要骚扰、刷屏或冒充其他玩家。",
    "terms.gambling": "不要将本应用用于非法或误导性的赌博宣传。",
    "terms.statusTitle": "服务状态",
    "terms.statusBody": "BetChess 按现状提供。功能、计时器、声音和多人行为可能会变化。",
    "terms.privacy": "隐私政策"
  },
  ja: {
    "page.support.title": "BetChess サポート",
    "page.privacy.title": "BetChess プライバシー",
    "page.terms.title": "BetChess 利用規約",
    "language.label": "言語",
    "brand.kicker": "盤面を読み、次の一手を当てる。",
    "header.rules": "ルール",
    "header.players": "プレイヤー",
    "game.surrender": "投了",
    "timer.opponent": "相手",
    "timer.you": "あなた",
    "timer.youName": "{name}（あなた）",
    "turn.waiting": "対局待機中",
    "turn.yourMove": "あなたの手番",
    "turn.opponent": "相手の手番",
    "turn.bet": "予想を置く",
    "turn.secondMove": "あなたの二手目",
    "turn.betLocked": "予想確定：{prediction}",
    "turn.correctBet": "予想的中。ボーナス手番です。",
    "turn.missedBet": "予想失敗。通常手番です。",
    "move.format": "{from} から {to}",
    "phase.opponent": "相手の手番",
    "phase.move": "あなたの手",
    "phase.second": "二手目",
    "phase.bet": "あなたの予想",
    "rules.eyebrow": "遊び方",
    "rules.title": "ルール",
    "rules.playTitle": "通常通り指す",
    "rules.turnLabel": "あなたの手番：",
    "rules.turnText": "通常の合法手を一手指します。",
    "rules.betLabel": "あなたの予想：",
    "rules.betText": "相手の駒を、次に動くと思うマスへドラッグします。",
    "rules.firstWhiteNoBet": "白は最初の手番では予想しません。黒がまだ動いていないためです。",
    "rules.correctTitle": "予想が当たったら",
    "rules.bonusOne": "次の手番でボーナス手を得ます。",
    "rules.twoMoves": "もう一度予想する前に、合法手を二手続けて指せます。",
    "rules.noSamePiece": "ボーナス手番では同じ駒を二回動かせません。",
    "rules.opponentBonusTitle": "相手がボーナス手番の場合",
    "rules.eitherMove": "相手の二手のどちらかに予想が一致すれば的中です。",
    "rules.noteTitle": "通常のチェスルールが適用されます。",
    "rules.noteBody": "チェック、チェックメイト、ステイルメイト、反復、戦力不足は通常通りです。",
    "bonus.kicker": "ジャックポット",
    "bonus.title": "予想的中",
    "bonus.copy": "ボーナス手番を解除",
    "result.kicker": "対局終了",
    "result.title": "結果",
    "result.tap": "タップして続行",
    "result.hint": "どこかをタップして続行",
    "result.winTitle": "{name} の勝ち",
    "result.drawTitle": "引き分け",
    "result.matchComplete": "対局完了",
    "result.noWinner": "勝者なし",
    "result.reason.checkmate": "チェックメイト",
    "result.reason.stalemate": "ステイルメイト",
    "result.reason.repetition": "反復",
    "result.reason.insufficient": "戦力不足",
    "result.reason.draw": "引き分け",
    "result.reason.disconnected": "{name} が切断しました",
    "result.reason.surrendered": "{name} が投了しました",
    "result.reason.timeout": "{loser} の時間切れ",
    "username.kicker": "セッション開始",
    "username.title": "ユーザー名を選択",
    "username.copy": "他のプレイヤーが招待できる短い名前を選んでください。",
    "username.label": "ユーザー名",
    "username.placeholder": "ユーザー名",
    "username.submit": "ロビーへ入る",
    "username.invalid": "2〜15文字の英数字またはアンダースコアを使ってください。",
    "username.empty": "有効なユーザー名を選んでください。",
    "username.taken": "そのユーザー名は既に使用されています。",
    "players.eyebrow": "ロビー",
    "players.title": "オンラインプレイヤー",
    "players.count": "{count} 人接続中",
    "players.empty": "利用できる相手はまだいません。",
    "players.inGame": "対局中",
    "players.playing": "プレイ中",
    "players.sent": "送信済み",
    "players.respond": "返信",
    "players.challenge": "挑戦",
    "players.available": "参加可能",
    "players.accept": "承諾",
    "players.decline": "辞退",
    "players.challengedYou": "{name} から挑戦されました",
    "players.invitationSent": "{name} に招待を送信しました",
    "players.signedIn": "{name} として参加中 - {status}",
    "notice.selfChallenge": "自分自身には挑戦できません。",
    "notice.playerBusy": "どちらかのプレイヤーは既に対局中です。",
    "notice.alreadyInvited": "{name} は既に招待済みです。",
    "notice.declined": "{name} が招待を辞退しました。",
    "notice.cancelledBusy": "どちらかが忙しいため、招待は期限切れになりました。",
    "notice.leftLobby": "{name} がロビーを退出しました。",
    "notice.nowInMatch": "{name} は対局中です。",
    "support.kicker": "サポート",
    "support.title": "BetChess ヘルプ",
    "support.reachTitle": "連絡方法",
    "support.reachBody": "BetChess のサポートは公開リポジトリで管理され、バグ、対局の問題、機能要望を一か所にまとめます。",
    "support.openIssue": "GitHub Issue を開く",
    "support.viewRepo": "リポジトリを見る",
    "support.back": "BetChess に戻る",
    "support.includeTitle": "報告に含める内容",
    "support.includeUser": "関連する場合、あなたのユーザー名と相手に見えた内容。",
    "support.includeDevice": "使用した端末。特にスマホだけで起きる場合。",
    "support.includePhase": "バグが起きた正確な手番フェーズ。",
    "support.includeMedia": "盤面やタイマーが変だった場合はスクリーンショットや短い動画。",
    "privacy.kicker": "プライバシー",
    "privacy.title": "BetChess プライバシーポリシー",
    "privacy.collectTitle": "BetChess が収集するもの",
    "privacy.collectUsername": "他のプレイヤーが挑戦できるロビー用ユーザー名。",
    "privacy.collectMatch": "手、タイマー、招待、結果などのリアルタイム対局状態。",
    "privacy.collectTechnical": "マルチプレイに必要な技術的な接続データ。",
    "privacy.noCollectTitle": "BetChess が収集しないもの",
    "privacy.noPayment": "支払い情報は収集しません。",
    "privacy.noBanking": "銀行情報や現実のお金の賭け情報は収集しません。",
    "privacy.noPassword": "現在はゲスト名を使うため、アカウントパスワードはありません。",
    "privacy.useTitle": "データの使い方",
    "privacy.useBody": "データはロビー表示、ライブ対局の実行、両プレイヤー間の状態共有にのみ使われます。",
    "privacy.readTerms": "規約を読む",
    "terms.kicker": "規約",
    "terms.title": "BetChess 利用規約",
    "terms.freeTitle": "無料プレイのみ",
    "terms.freeBody": "BetChess は無料のマルチプレイヤーチェス変種です。現実のお金の賭け、入金、出金は扱いません。",
    "terms.useTitle": "サービスの利用",
    "terms.username": "公開ロビーに表示してよいユーザー名を選んでください。",
    "terms.behavior": "他のプレイヤーへの嫌がらせ、スパム、なりすましは禁止です。",
    "terms.gambling": "違法または誤解を招くギャンブル表現にアプリを使わないでください。",
    "terms.statusTitle": "サービス状態",
    "terms.statusBody": "BetChess は現状のまま提供されます。機能、タイマー、サウンド、マルチプレイ動作は変更される場合があります。",
    "terms.privacy": "プライバシーポリシー"
  }
};

let currentLanguage = DEFAULT_LANGUAGE;

const supportedCodes = new Set(languages.map((language) => language.code));

const getStoredLanguage = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch (_error) {
    return null;
  }
};

const saveLanguage = (language) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch (_error) {
    // Language switching should still work when localStorage is unavailable.
  }
};

const getTemplate = (key) => dictionaries[currentLanguage]?.[key] ?? dictionaries.en[key] ?? key;

const interpolate = (template, values = {}) => {
  return template.replace(/\{(\w+)\}/g, (_match, key) => String(values[key] ?? ""));
};

const getHtmlLanguage = (language) => {
  return languages.find((item) => item.code === language)?.htmlLang ?? DEFAULT_LANGUAGE;
};

export const t = (key, values = {}) => interpolate(getTemplate(key), values);

export const getCurrentLanguage = () => currentLanguage;

export const onLanguageChange = (callback) => {
  window.addEventListener("betchess:languagechange", callback);
};

export const translateServerMessage = (message) => {
  if (!message) {
    return "";
  }

  const patterns = [
    [/^Please choose a valid username\.$/, "username.empty"],
    [/^That username is already in use\.$/, "username.taken"],
    [/^You cannot challenge yourself\.$/, "notice.selfChallenge"],
    [/^One of those players is already in a game\.$/, "notice.playerBusy"],
    [/^You already invited (.+)\.$/, "notice.alreadyInvited", ["name"]],
    [/^(.+) declined your invitation\.$/, "notice.declined", ["name"]],
    [/^That invitation expired because one player is already busy\.$/, "notice.cancelledBusy"],
    [/^(.+) left the lobby\.$/, "notice.leftLobby", ["name"]],
    [/^(.+) is now in a match\.$/, "notice.nowInMatch", ["name"]]
  ];

  for (const [pattern, key, valueNames = []] of patterns) {
    const match = message.match(pattern);
    if (!match) {
      continue;
    }

    const values = Object.fromEntries(valueNames.map((name, index) => [name, match[index + 1]]));
    return t(key, values);
  }

  return message;
};

const translateReason = (reason) => {
  const normalized = reason.trim().toLowerCase();

  if (normalized.includes("checkmate")) {
    return t("result.reason.checkmate");
  }

  if (normalized.includes("stalemate")) {
    return t("result.reason.stalemate");
  }

  if (normalized.includes("repetition")) {
    return t("result.reason.repetition");
  }

  if (normalized.includes("insufficient material")) {
    return t("result.reason.insufficient");
  }

  const disconnectedMatch = reason.match(/^(.+) disconnected$/i);
  if (disconnectedMatch) {
    return t("result.reason.disconnected", { name: disconnectedMatch[1] });
  }

  const surrenderedMatch = reason.match(/^(.+) surrendered$/i);
  if (surrenderedMatch) {
    return t("result.reason.surrendered", { name: surrenderedMatch[1] });
  }

  return t("result.reason.generic", { reason });
};

export const getGameResultContent = (result) => {
  const trimmedResult = result.trim().replace(/\.$/, "");
  const drawMatch = trimmedResult.match(/^Draw(?: by)?\s*(.*)$/i);
  if (drawMatch) {
    const reason = drawMatch[1] ? translateReason(drawMatch[1]) : t("result.noWinner");
    return {
      detail: reason,
      line: `${t("result.drawTitle")} - ${reason}`,
      title: t("result.drawTitle")
    };
  }

  const timeMatch = trimmedResult.match(/^(.+?) wins on time against (.+)$/i);
  if (timeMatch) {
    const title = t("result.winTitle", { name: timeMatch[1] });
    const detail = t("result.reason.timeout", { loser: timeMatch[2] });
    return { detail, line: `${title} - ${detail}`, title };
  }

  const winByMatch = trimmedResult.match(/^(.+?) wins by (.+)$/i);
  if (winByMatch) {
    const title = t("result.winTitle", { name: winByMatch[1] });
    const detail = translateReason(winByMatch[2]);
    return { detail, line: `${title} - ${detail}`, title };
  }

  const winBecauseMatch = trimmedResult.match(/^(.+?) wins because (.+)$/i);
  if (winBecauseMatch) {
    const title = t("result.winTitle", { name: winBecauseMatch[1] });
    const detail = translateReason(winBecauseMatch[2]);
    return { detail, line: `${title} - ${detail}`, title };
  }

  return {
    detail: t("result.matchComplete"),
    line: trimmedResult,
    title: trimmedResult
  };
};

export const applyTranslations = () => {
  document.documentElement.lang = getHtmlLanguage(currentLanguage);

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  document.querySelectorAll("[data-language-select]").forEach((select) => {
    select.value = currentLanguage;
  });

  document.querySelectorAll("[data-language-option]").forEach((option) => {
    option.setAttribute("aria-selected", String(option.dataset.languageOption === currentLanguage));
  });

  const titleKey = document.body?.dataset.pageTitle;
  if (titleKey) {
    document.title = t(titleKey);
  }
};

export const setLanguage = (language) => {
  if (!supportedCodes.has(language) || currentLanguage === language) {
    return;
  }

  currentLanguage = language;
  saveLanguage(language);
  applyTranslations();
  window.dispatchEvent(new CustomEvent("betchess:languagechange", { detail: { language } }));
};

const initializeLanguage = () => {
  const storedLanguage = getStoredLanguage();
  const browserLanguage = navigator.language?.slice(0, 2);
  currentLanguage = supportedCodes.has(storedLanguage)
    ? storedLanguage
    : supportedCodes.has(browserLanguage)
      ? browserLanguage
      : DEFAULT_LANGUAGE;

  document.querySelectorAll("[data-language-select]").forEach((select) => {
    select.value = currentLanguage;
    select.addEventListener("change", () => setLanguage(select.value));
  });

  document.querySelectorAll("[data-language-menu]").forEach((menuRoot) => {
    const button = menuRoot.querySelector("[data-language-menu-button]");
    const menu = menuRoot.querySelector("[data-language-menu-list]");
    const options = Array.from(menuRoot.querySelectorAll("[data-language-option]"));

    if (!button || !menu || options.length === 0) {
      return;
    }

    const closeMenu = () => {
      menu.hidden = true;
      menuRoot.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      menu.hidden = false;
      menuRoot.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      menu.querySelector(`[data-language-option="${currentLanguage}"]`)?.focus();
    };

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      if (menu.hidden) {
        openMenu();
        return;
      }

      closeMenu();
    });

    options.forEach((option) => {
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        setLanguage(option.dataset.languageOption);
        closeMenu();
        button.focus();
      });
    });

    document.addEventListener("click", (event) => {
      if (!menuRoot.contains(event.target)) {
        closeMenu();
      }
    });

    menuRoot.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        button.focus();
      }
    });
  });

  applyTranslations();
};

if (typeof window !== "undefined") {
  window.addEventListener("load", initializeLanguage);
}

export { languages };
