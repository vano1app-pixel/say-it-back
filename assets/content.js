/* Say It Back — practice material.
   Five levels, four passages each, written to build in difficulty:
   sentence length, tense, contractions, idiom and rhythm.
   All text is original and written for this app. */

window.LEVELS = [
  {
    name: "Getting started",
    hint: "Short present-tense lines. Get your mouth moving.",
    sets: [
      {
        title: "Morning",
        lines: [
          "I wake up at seven o'clock.",
          "I make a cup of coffee.",
          "I open the window and look outside.",
          "The street is quiet.",
          "It is a good morning."
        ]
      },
      {
        title: "The shop",
        lines: [
          "I go to the shop on Saturday.",
          "I need bread, milk and eggs.",
          "The man at the counter smiles at me.",
          "I say thank you and I go home."
        ]
      },
      {
        title: "My friend",
        lines: [
          "My friend lives in another city.",
          "We talk on the phone every week.",
          "She asks me about my work.",
          "I ask her about her family.",
          "It is always a short call, but it is a good one."
        ]
      },
      {
        title: "After work",
        lines: [
          "I finish work at six.",
          "I walk home slowly.",
          "I cook dinner and I listen to music.",
          "Then I sit down and read for an hour.",
          "I sleep well on those days."
        ]
      }
    ]
  },

  {
    name: "Every day",
    hint: "The past tense, and joining two ideas together.",
    sets: [
      {
        title: "Late",
        lines: [
          "Yesterday I missed my bus.",
          "I waited twenty minutes in the rain.",
          "When the next one came, it was full.",
          "So I walked, and I was late for work.",
          "Nobody said anything, but I felt bad about it."
        ]
      },
      {
        title: "The parcel",
        lines: [
          "A parcel arrived for me last week.",
          "I had not ordered anything, so I was confused.",
          "I opened it and found a book inside.",
          "There was a small card with my sister's name on it.",
          "She remembered my birthday before I did."
        ]
      },
      {
        title: "Cooking",
        lines: [
          "I tried to cook something new on Sunday.",
          "I followed the recipe carefully, step by step.",
          "Halfway through, I realised I had no onions.",
          "I used what I had, and it still tasted fine.",
          "Now I cook it every week."
        ]
      },
      {
        title: "The old photograph",
        lines: [
          "I found an old photograph in a drawer.",
          "It was taken outside my grandmother's house.",
          "I was four years old, and I was holding a red ball.",
          "I do not remember the day at all.",
          "But my mother remembers everything about it."
        ]
      }
    ]
  },

  {
    name: "Real conversation",
    hint: "Contractions and phrasal verbs — how people actually talk.",
    sets: [
      {
        title: "Catching up",
        lines: [
          "Hey, I haven't seen you in ages.",
          "How's the new job going?",
          "I heard you moved across town.",
          "We should catch up properly sometime.",
          "Give me a shout when you're free."
        ]
      },
      {
        title: "Running late",
        lines: [
          "Sorry, I'm running a bit late.",
          "The traffic's been awful all morning.",
          "I'll be there in about fifteen minutes.",
          "Go ahead and order without me.",
          "I'll grab something when I get there."
        ]
      },
      {
        title: "Sorting it out",
        lines: [
          "I've been meaning to sort this out for weeks.",
          "Every time I sit down to do it, something comes up.",
          "I'm going to block out an hour tomorrow.",
          "Once it's done, I won't have to think about it again.",
          "I should have dealt with it ages ago."
        ]
      },
      {
        title: "Turning it down",
        lines: [
          "Thanks for thinking of me, but I'll have to pass.",
          "I've got too much on at the minute.",
          "If I take on one more thing, I'll do all of it badly.",
          "Ask me again in a few weeks, though.",
          "I'd genuinely like to help once things calm down."
        ]
      }
    ]
  },

  {
    name: "Work and opinion",
    hint: "Interviews, meetings, disagreeing without being rude.",
    sets: [
      {
        title: "The interview",
        lines: [
          "Thank you for taking the time to meet me today.",
          "I've spent the last three years working in customer support.",
          "What I enjoy most is solving a problem the customer thought was impossible.",
          "I'm looking for a role where I can take on more responsibility.",
          "Could you tell me what a typical week looks like on your team?"
        ]
      },
      {
        title: "Disagreeing well",
        lines: [
          "I see your point, but I'd look at it slightly differently.",
          "The numbers suggest the problem started before we made the change.",
          "I'm not saying we should abandon the plan entirely.",
          "I'd rather test it with a small group first.",
          "If it works, then we roll it out to everyone."
        ]
      },
      {
        title: "Explaining a delay",
        lines: [
          "I want to be upfront with you about the timeline.",
          "We underestimated how long the first stage would take.",
          "That's on us, and I'm not going to pretend otherwise.",
          "We're now looking at the end of the month.",
          "I'll send you an update every Friday until it's finished."
        ]
      },
      {
        title: "Asking for more",
        lines: [
          "I'd like to talk about my role and where it goes next.",
          "Over the past year I've taken on a good deal more than I was hired for.",
          "I've trained two new people and I now run the weekly report on my own.",
          "I think that's worth revisiting my title and my salary.",
          "I'm not asking for an answer today — just for us to start the conversation."
        ]
      }
    ]
  },

  {
    name: "Fluent",
    hint: "Long sentences, idiom and rhythm. Say these like you mean them.",
    sets: [
      {
        title: "The turning point",
        lines: [
          "Looking back, I can pinpoint the exact moment things changed.",
          "I'd been going through the motions for the better part of a year.",
          "It wasn't that I lacked the ability; I had simply stopped pushing myself.",
          "Once I admitted that out loud, the excuses fell apart.",
          "Everything that's happened since traces back to that one conversation."
        ]
      },
      {
        title: "On confidence",
        lines: [
          "Confidence isn't something you're born with, and it isn't a personality trait.",
          "It's what's left over after you've done the difficult thing often enough that it stops frightening you.",
          "People who sound effortless in a second language have almost always been through a long stretch of sounding ridiculous.",
          "The ones who never get there are the ones who waited to feel ready.",
          "You don't think your way into speaking; you speak your way into thinking."
        ]
      },
      {
        title: "Making the case",
        lines: [
          "I'd like to walk you through why I think this is worth the investment.",
          "On the face of it, the numbers look marginal at best.",
          "But that assumes the current growth rate holds, and I don't believe it will.",
          "If we're right, the cost of waiting is far higher than the cost of moving now.",
          "I'm happy to be challenged on any of this."
        ]
      },
      {
        title: "What fluency actually is",
        lines: [
          "Fluency has very little to do with the size of your vocabulary.",
          "It's the speed at which you stop translating and simply mean what you're saying.",
          "You'll notice it first in small moments — a joke that lands, an argument you win without preparing it.",
          "Nobody hands you that; it accumulates quietly while you're busy being embarrassed.",
          "And then one day somebody asks how long you've lived here, and you realise you never answered them in your own language."
        ]
      }
    ]
  }
];
