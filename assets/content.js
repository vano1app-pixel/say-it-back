/* Say It Back — course data.

   Every line exists in all supported languages at once. The language you are
   LEARNING decides what is spoken and scored; the language you already SPEAK
   decides the small translation shown underneath. Adding a language means
   adding its code here and one string per line — nothing else changes.

   All practice text is original and written for this app. */

window.COURSE = {

  languages: [
    { code: "en", label: "English",  own: "English",  speech: "en-US" },
    { code: "es", label: "Spanish",  own: "Español",  speech: "es-ES" },
    { code: "fr", label: "French",   own: "Français", speech: "fr-FR" }
  ],

  /* Interface strings, in each language someone might already speak. */
  ui: {
    en: {
      iSpeak: "I speak", iLearn: "I want to learn", start: "Start learning",
      onboardTitle: "Two questions, then you're speaking.",
      onboardBody: "Pick the language you already speak and the one you want to practise. You can change both later.",
      modeTogether: "Together", modeAfter: "After", modeListen: "Listen",
      modeHintTogether: "The voice reads and you read out loud at the same time.",
      modeHintAfter: "The voice reads the line first, then it's your turn.",
      modeHintListen: "Just listen. No microphone, no score.",
      startBtn: "Start", nextBtn: "Next line", doneBtn: "Done", finishBtn: "Finish",
      nextPassage: "Next passage", again: "Start again", reading: "Reading…",
      replay: "Replay", skip: "Skip", mic: "Mic", sound: "Sound",
      speed: "Speed", voice: "Voice", dayStreak: "Day streak", xp: "XP",
      lines: "Lines", accuracy: "Accuracy", xpEarned: "XP earned",
      streak: "Streak", best: "Best", reset: "Reset progress",
      pressStart: "press Start", line: "Line", of: "of",
      yourTurn: "Your turn — take your time",
      readAlong: "Read out loud with the voice — take your time",
      listening: "Listening", listen: "Listen", heard: "Heard",
      perfect: "Perfect", good: "Good", close: "Close",
      missWords: "The underlined words didn't come through.",
      counted: "Counted — press Next line.",
      complete: "Passage complete", keepGoing: "Nicely done. Keep it going tomorrow.",
      unlocked: "is open", badges: "Badges", ownText: "Practise your own text",
      practiseThis: "Practise this", locked: "Locked", level: "Level",
      micOn: "Turn on the microphone",
      micAsk: "Turn the microphone on so the words light up green as you say them.",
      micBlocked: "The microphone is blocked. Allow it in the address bar, then reload.",
      noSR: "This browser can't score your speaking — Chrome can. You can still practise and mark each line yourself.",
      settings: "Change languages"
    },
    es: {
      iSpeak: "Hablo", iLearn: "Quiero aprender", start: "Empezar",
      onboardTitle: "Dos preguntas y empiezas a hablar.",
      onboardBody: "Elige el idioma que ya hablas y el que quieres practicar. Puedes cambiar los dos más tarde.",
      modeTogether: "Juntos", modeAfter: "Después", modeListen: "Escuchar",
      modeHintTogether: "La voz lee y tú lees en voz alta al mismo tiempo.",
      modeHintAfter: "La voz lee la frase primero y luego te toca a ti.",
      modeHintListen: "Solo escuchar. Sin micrófono y sin puntuación.",
      startBtn: "Empezar", nextBtn: "Siguiente", doneBtn: "Listo", finishBtn: "Terminar",
      nextPassage: "Siguiente texto", again: "Empezar de nuevo", reading: "Leyendo…",
      replay: "Repetir", skip: "Saltar", mic: "Micro", sound: "Sonido",
      speed: "Velocidad", voice: "Voz", dayStreak: "Días seguidos", xp: "XP",
      lines: "Frases", accuracy: "Precisión", xpEarned: "XP ganados",
      streak: "Racha", best: "Mejor", reset: "Borrar progreso",
      pressStart: "pulsa Empezar", line: "Frase", of: "de",
      yourTurn: "Te toca — tómate tu tiempo",
      readAlong: "Lee en voz alta con la voz — tómate tu tiempo",
      listening: "Escuchando", listen: "Escucha", heard: "He oído",
      perfect: "Perfecto", good: "Bien", close: "Casi",
      missWords: "Las palabras subrayadas no se han oído.",
      counted: "Contado — pulsa Siguiente.",
      complete: "Texto completado", keepGoing: "Muy bien. Sigue mañana.",
      unlocked: "está abierto", badges: "Insignias", ownText: "Practica tu propio texto",
      practiseThis: "Practicar esto", locked: "Bloqueado", level: "Nivel",
      micOn: "Activar el micrófono",
      micAsk: "Activa el micrófono para que las palabras se pongan verdes cuando las digas.",
      micBlocked: "El micrófono está bloqueado. Permítelo en la barra de direcciones y recarga.",
      noSR: "Este navegador no puede puntuar tu voz — Chrome sí. Puedes practicar igualmente y marcar cada frase tú mismo.",
      settings: "Cambiar idiomas"
    },
    fr: {
      iSpeak: "Je parle", iLearn: "Je veux apprendre", start: "Commencer",
      onboardTitle: "Deux questions, puis vous parlez.",
      onboardBody: "Choisissez la langue que vous parlez déjà et celle que vous voulez pratiquer. Vous pourrez changer les deux plus tard.",
      modeTogether: "Ensemble", modeAfter: "Après", modeListen: "Écouter",
      modeHintTogether: "La voix lit et vous lisez à voix haute en même temps.",
      modeHintAfter: "La voix lit la phrase d'abord, puis c'est à vous.",
      modeHintListen: "Écouter seulement. Pas de micro, pas de score.",
      startBtn: "Commencer", nextBtn: "Suivante", doneBtn: "Terminé", finishBtn: "Finir",
      nextPassage: "Texte suivant", again: "Recommencer", reading: "Lecture…",
      replay: "Réécouter", skip: "Passer", mic: "Micro", sound: "Son",
      speed: "Vitesse", voice: "Voix", dayStreak: "Jours d'affilée", xp: "XP",
      lines: "Phrases", accuracy: "Précision", xpEarned: "XP gagnés",
      streak: "Série", best: "Record", reset: "Effacer la progression",
      pressStart: "appuyez sur Commencer", line: "Phrase", of: "sur",
      yourTurn: "À vous — prenez votre temps",
      readAlong: "Lisez à voix haute avec la voix — prenez votre temps",
      listening: "J'écoute", listen: "Écoutez", heard: "Entendu",
      perfect: "Parfait", good: "Bien", close: "Presque",
      missWords: "Les mots soulignés ne sont pas passés.",
      counted: "Compté — appuyez sur Suivante.",
      complete: "Texte terminé", keepGoing: "Bien joué. Continuez demain.",
      unlocked: "est ouvert", badges: "Badges", ownText: "Pratiquer votre propre texte",
      practiseThis: "Pratiquer ceci", locked: "Verrouillé", level: "Niveau",
      micOn: "Activer le microphone",
      micAsk: "Activez le microphone pour que les mots deviennent verts quand vous les dites.",
      micBlocked: "Le microphone est bloqué. Autorisez-le dans la barre d'adresse, puis rechargez.",
      noSR: "Ce navigateur ne peut pas noter votre voix — Chrome le peut. Vous pouvez tout de même pratiquer et marquer chaque phrase vous-même.",
      settings: "Changer de langue"
    }
  },

  levels: [
    {
      name: { en: "Getting started", es: "Para empezar", fr: "Pour commencer" },
      hint: {
        en: "Short present-tense lines. Get your mouth moving.",
        es: "Frases cortas en presente. Empieza a mover la boca.",
        fr: "Des phrases courtes au présent. Faites bouger votre bouche."
      },
      sets: [
        {
          title: { en: "Morning", es: "La mañana", fr: "Le matin" },
          lines: [
            { en: "I wake up at seven o'clock.", es: "Me despierto a las siete.", fr: "Je me réveille à sept heures." },
            { en: "I make a cup of coffee.", es: "Me preparo una taza de café.", fr: "Je me prépare une tasse de café." },
            { en: "I open the window and look outside.", es: "Abro la ventana y miro afuera.", fr: "J'ouvre la fenêtre et je regarde dehors." },
            { en: "The street is quiet.", es: "La calle está tranquila.", fr: "La rue est calme." },
            { en: "It is a good morning.", es: "Es una buena mañana.", fr: "C'est une bonne matinée." }
          ]
        },
        {
          title: { en: "The shop", es: "La tienda", fr: "Le magasin" },
          lines: [
            { en: "I go to the shop on Saturday.", es: "Voy a la tienda el sábado.", fr: "Je vais au magasin le samedi." },
            { en: "I need bread, milk and eggs.", es: "Necesito pan, leche y huevos.", fr: "J'ai besoin de pain, de lait et d'œufs." },
            { en: "The man at the counter smiles at me.", es: "El hombre del mostrador me sonríe.", fr: "L'homme au comptoir me sourit." },
            { en: "I say thank you and I go home.", es: "Le doy las gracias y me voy a casa.", fr: "Je le remercie et je rentre chez moi." }
          ]
        }
      ]
    },

    {
      name: { en: "Every day", es: "El día a día", fr: "Le quotidien" },
      hint: {
        en: "The past tense, and joining two ideas together.",
        es: "El pasado, y unir dos ideas en una frase.",
        fr: "Le passé, et relier deux idées ensemble."
      },
      sets: [
        {
          title: { en: "Late", es: "Tarde", fr: "En retard" },
          lines: [
            { en: "Yesterday I missed my bus.", es: "Ayer perdí el autobús.", fr: "Hier, j'ai raté mon bus." },
            { en: "I waited twenty minutes in the rain.", es: "Esperé veinte minutos bajo la lluvia.", fr: "J'ai attendu vingt minutes sous la pluie." },
            { en: "When the next one came, it was full.", es: "Cuando llegó el siguiente, estaba lleno.", fr: "Quand le suivant est arrivé, il était plein." },
            { en: "So I walked, and I was late for work.", es: "Así que fui andando y llegué tarde al trabajo.", fr: "Alors j'ai marché, et je suis arrivé en retard au travail." },
            { en: "Nobody said anything, but I felt bad about it.", es: "Nadie dijo nada, pero me sentí mal.", fr: "Personne n'a rien dit, mais je me suis senti mal." }
          ]
        },
        {
          title: { en: "The parcel", es: "El paquete", fr: "Le colis" },
          lines: [
            { en: "A parcel arrived for me last week.", es: "La semana pasada me llegó un paquete.", fr: "Un colis est arrivé pour moi la semaine dernière." },
            { en: "I had not ordered anything, so I was confused.", es: "No había pedido nada, así que me quedé confundido.", fr: "Je n'avais rien commandé, donc j'étais perplexe." },
            { en: "I opened it and found a book inside.", es: "Lo abrí y encontré un libro dentro.", fr: "Je l'ai ouvert et j'ai trouvé un livre à l'intérieur." },
            { en: "There was a small card with my sister's name on it.", es: "Había una tarjeta pequeña con el nombre de mi hermana.", fr: "Il y avait une petite carte avec le nom de ma sœur." },
            { en: "She remembered my birthday before I did.", es: "Se acordó de mi cumpleaños antes que yo.", fr: "Elle s'est souvenue de mon anniversaire avant moi." }
          ]
        }
      ]
    },

    {
      name: { en: "Real conversation", es: "Conversación real", fr: "Vraie conversation" },
      hint: {
        en: "Contractions and everyday phrases — how people actually talk.",
        es: "Expresiones del día a día — cómo habla la gente de verdad.",
        fr: "Des expressions de tous les jours — comment les gens parlent vraiment."
      },
      sets: [
        {
          title: { en: "Catching up", es: "Ponerse al día", fr: "Prendre des nouvelles" },
          lines: [
            { en: "Hey, I haven't seen you in ages.", es: "Oye, hace siglos que no te veo.", fr: "Salut, ça fait des siècles qu'on ne s'est pas vus." },
            { en: "How's the new job going?", es: "¿Qué tal el trabajo nuevo?", fr: "Comment se passe le nouveau boulot ?" },
            { en: "I heard you moved across town.", es: "Me han dicho que te has mudado al otro lado de la ciudad.", fr: "J'ai entendu dire que tu as déménagé à l'autre bout de la ville." },
            { en: "We should catch up properly sometime.", es: "Deberíamos vernos con calma un día de estos.", fr: "On devrait se voir tranquillement un de ces jours." },
            { en: "Give me a shout when you're free.", es: "Avísame cuando tengas un rato.", fr: "Fais-moi signe quand tu es libre." }
          ]
        },
        {
          title: { en: "Running late", es: "Voy tarde", fr: "En retard" },
          lines: [
            { en: "Sorry, I'm running a bit late.", es: "Perdona, voy un poco tarde.", fr: "Désolé, je suis un peu en retard." },
            { en: "The traffic has been awful all morning.", es: "Ha habido un tráfico horrible toda la mañana.", fr: "Il y a eu une circulation horrible toute la matinée." },
            { en: "I'll be there in about fifteen minutes.", es: "Llego en unos quince minutos.", fr: "J'arrive dans une quinzaine de minutes." },
            { en: "Go ahead and order without me.", es: "Pedid sin mí, no me esperéis.", fr: "Commandez sans moi, ne m'attendez pas." },
            { en: "I'll grab something when I get there.", es: "Ya pediré algo cuando llegue.", fr: "Je prendrai quelque chose en arrivant." }
          ]
        }
      ]
    },

    {
      name: { en: "Work and opinion", es: "Trabajo y opinión", fr: "Travail et opinion" },
      hint: {
        en: "Interviews, meetings, saying what you think without being rude.",
        es: "Entrevistas, reuniones, decir lo que piensas sin ser brusco.",
        fr: "Entretiens, réunions, dire ce que vous pensez sans être brusque."
      },
      sets: [
        {
          title: { en: "The interview", es: "La entrevista", fr: "L'entretien" },
          lines: [
            { en: "Thank you for taking the time to meet me today.", es: "Gracias por sacar tiempo para reunirse conmigo hoy.", fr: "Merci d'avoir pris le temps de me rencontrer aujourd'hui." },
            { en: "I've spent the last three years working in customer support.", es: "He pasado los últimos tres años trabajando en atención al cliente.", fr: "J'ai passé les trois dernières années à travailler au service client." },
            { en: "What I enjoy most is solving a problem the customer thought was impossible.", es: "Lo que más me gusta es resolver un problema que el cliente creía imposible.", fr: "Ce que j'aime le plus, c'est résoudre un problème que le client croyait impossible." },
            { en: "I'm looking for a role where I can take on more responsibility.", es: "Busco un puesto en el que pueda asumir más responsabilidad.", fr: "Je cherche un poste où je peux prendre plus de responsabilités." },
            { en: "Could you tell me what a typical week looks like on your team?", es: "¿Podría contarme cómo es una semana normal en su equipo?", fr: "Pourriez-vous me décrire une semaine typique dans votre équipe ?" }
          ]
        },
        {
          title: { en: "Explaining a delay", es: "Explicar un retraso", fr: "Expliquer un retard" },
          lines: [
            { en: "I want to be upfront with you about the timeline.", es: "Quiero ser sincero con usted sobre los plazos.", fr: "Je veux être franc avec vous au sujet des délais." },
            { en: "We underestimated how long the first stage would take.", es: "Subestimamos cuánto tiempo llevaría la primera fase.", fr: "Nous avons sous-estimé le temps que prendrait la première étape." },
            { en: "That is our fault, and I'm not going to pretend otherwise.", es: "Es culpa nuestra, y no voy a fingir lo contrario.", fr: "C'est notre faute, et je ne vais pas prétendre le contraire." },
            { en: "We're now looking at the end of the month.", es: "Ahora hablamos de finales de mes.", fr: "Nous envisageons maintenant la fin du mois." },
            { en: "I'll send you an update every Friday until it's finished.", es: "Le enviaré una actualización cada viernes hasta que esté terminado.", fr: "Je vous enverrai un point chaque vendredi jusqu'à ce que ce soit terminé." }
          ]
        }
      ]
    },

    {
      name: { en: "Fluent", es: "Con fluidez", fr: "Aisance" },
      hint: {
        en: "Long sentences, idiom and rhythm. Say these like you mean them.",
        es: "Frases largas, expresiones y ritmo. Dilas como si las sintieras.",
        fr: "Phrases longues, expressions et rythme. Dites-les avec conviction."
      },
      sets: [
        {
          title: { en: "The turning point", es: "El punto de inflexión", fr: "Le tournant" },
          lines: [
            { en: "Looking back, I can pinpoint the exact moment things changed.", es: "Mirando atrás, puedo señalar el momento exacto en que todo cambió.", fr: "Avec le recul, je peux identifier le moment exact où les choses ont changé." },
            { en: "I had been going through the motions for the better part of a year.", es: "Llevaba casi un año haciendo las cosas por inercia.", fr: "Cela faisait presque un an que je faisais les choses machinalement." },
            { en: "It wasn't that I lacked the ability; I had simply stopped pushing myself.", es: "No es que me faltara capacidad; simplemente había dejado de exigirme.", fr: "Ce n'est pas que je manquais de capacités ; j'avais simplement cessé de me pousser." },
            { en: "Once I admitted that out loud, the excuses fell apart.", es: "En cuanto lo admití en voz alta, las excusas se vinieron abajo.", fr: "Dès que je l'ai admis à voix haute, les excuses se sont effondrées." },
            { en: "Everything that has happened since traces back to that one conversation.", es: "Todo lo que ha pasado desde entonces viene de aquella conversación.", fr: "Tout ce qui s'est passé depuis remonte à cette seule conversation." }
          ]
        },
        {
          title: { en: "On confidence", es: "Sobre la confianza", fr: "Sur la confiance" },
          lines: [
            { en: "Confidence isn't something you are born with.", es: "La confianza no es algo con lo que se nace.", fr: "La confiance n'est pas quelque chose avec quoi on naît." },
            { en: "It is what is left after you have done the hard thing often enough that it stops frightening you.", es: "Es lo que queda después de hacer lo difícil tantas veces que deja de darte miedo.", fr: "C'est ce qui reste après avoir fait la chose difficile assez souvent pour qu'elle cesse de vous effrayer." },
            { en: "People who sound effortless have almost always been through a long stretch of sounding ridiculous.", es: "Los que parecen hablar sin esfuerzo casi siempre han pasado una larga etapa sonando ridículos.", fr: "Ceux qui semblent parler sans effort ont presque toujours traversé une longue période où ils sonnaient ridicules." },
            { en: "The ones who never get there are the ones who waited to feel ready.", es: "Los que nunca llegan son los que esperaron a sentirse preparados.", fr: "Ceux qui n'y arrivent jamais sont ceux qui ont attendu de se sentir prêts." },
            { en: "You don't think your way into speaking; you speak your way into thinking.", es: "No se llega a hablar pensando; se llega a pensar hablando.", fr: "On n'arrive pas à parler en réfléchissant ; on arrive à réfléchir en parlant." }
          ]
        }
      ]
    }
  ]
};
