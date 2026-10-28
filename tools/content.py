# -*- coding: utf-8 -*-
"""Course content for the Icelandic app. Run to emit content.json."""
import json

# ---------------- VOCAB ----------------
# (icelandic, english, note)  note = gender/grammar hint
VOCAB = {
 "Kveðjur — Greetings": [
  ("Halló", "Hello", ""),
  ("Hæ", "Hi", "informal"),
  ("Góðan daginn", "Good morning / good day", "formal-ish, until afternoon"),
  ("Gott kvöld", "Good evening", ""),
  ("Góða nótt", "Good night", ""),
  ("Bless", "Bye", ""),
  ("Takk", "Thanks", ""),
  ("Takk fyrir", "Thank you", ""),
  ("Já", "Yes", ""),
  ("Nei", "No", ""),
  ("Fyrirgefðu", "Sorry / excuse me", "to one person"),
  ("Gjörðu svo vel", "Here you go / please", "when handing something over"),
  ("Hvað segirðu?", "How are you? (lit. what do you say?)", ""),
  ("Allt gott", "All good", "standard reply"),
  ("Velkomin", "Welcome", "velkominn to a man"),
 ],
 "Tölur — Numbers": [
  ("einn", "one", "m. (ein f., eitt n.)"),
  ("tveir", "two", "m. (tvær f., tvö n.)"),
  ("þrír", "three", "m. (þrjár f., þrjú n.)"),
  ("fjórir", "four", "m. (fjórar f., fjögur n.)"),
  ("fimm", "five", ""),
  ("sex", "six", ""),
  ("sjö", "seven", ""),
  ("átta", "eight", ""),
  ("níu", "nine", ""),
  ("tíu", "ten", ""),
  ("ellefu", "eleven", ""),
  ("tólf", "twelve", ""),
  ("tuttugu", "twenty", ""),
  ("hundrað", "hundred", "n."),
  ("þúsund", "thousand", "n."),
 ],
 "Fjölskylda — Family": [
  ("mamma", "mom", "f."),
  ("pabbi", "dad", "m."),
  ("móðir", "mother", "f."),
  ("faðir", "father", "m."),
  ("bróðir", "brother", "m."),
  ("systir", "sister", "f."),
  ("sonur", "son", "m."),
  ("dóttir", "daughter", "f."),
  ("eiginkona", "wife", "f."),
  ("eiginmaður", "husband", "m."),
  ("afi", "grandpa", "m."),
  ("amma", "grandma", "f."),
  ("barn", "child", "n."),
  ("fjölskylda", "family", "f."),
  ("hundur", "dog", "m."),
 ],
 "Matur og drykkur — Food & drink": [
  ("vatn", "water", "n."),
  ("kaffi", "coffee", "n."),
  ("mjólk", "milk", "f."),
  ("brauð", "bread", "n."),
  ("smjör", "butter", "n."),
  ("fiskur", "fish", "m."),
  ("kjöt", "meat", "n."),
  ("lambakjöt", "lamb (meat)", "n."),
  ("ostur", "cheese", "m."),
  ("egg", "egg", "n."),
  ("skyr", "skyr", "n."),
  ("epli", "apple", "n."),
  ("súpa", "soup", "f."),
  ("bjór", "beer", "m."),
  ("te", "tea", "n."),
 ],
 "Náttúra og veður — Nature & weather": [
  ("veður", "weather", "n."),
  ("rigning", "rain", "f."),
  ("snjór", "snow", "m."),
  ("vindur", "wind", "m."),
  ("sól", "sun", "f."),
  ("ský", "cloud", "n."),
  ("fjall", "mountain", "n."),
  ("foss", "waterfall", "m."),
  ("jökull", "glacier", "m."),
  ("eldfjall", "volcano", "n."),
  ("sjór", "sea", "m."),
  ("norðurljós", "northern lights", "n. pl."),
  ("kalt", "cold", "neuter of kaldur — Það er kalt"),
  ("hlýtt", "warm", "neuter of hlýr — Það er hlýtt"),
 ],
 "Tími — Time & days": [
  ("dagur", "day", "m."),
  ("vika", "week", "f."),
  ("mánuður", "month", "m."),
  ("ár", "year", "n."),
  ("í dag", "today", ""),
  ("á morgun", "tomorrow", ""),
  ("í gær", "yesterday", ""),
  ("mánudagur", "Monday", "m. — days are lowercase"),
  ("þriðjudagur", "Tuesday", "m."),
  ("miðvikudagur", "Wednesday", "m."),
  ("fimmtudagur", "Thursday", "m."),
  ("föstudagur", "Friday", "m."),
  ("laugardagur", "Saturday", "m."),
  ("sunnudagur", "Sunday", "m."),
 ],
 "Í bænum — Around town": [
  ("hús", "house", "n."),
  ("gata", "street", "f."),
  ("bíll", "car", "m."),
  ("strætó", "bus", "m."),
  ("flugvöllur", "airport", "m."),
  ("hótel", "hotel", "n."),
  ("búð", "shop", "f."),
  ("banki", "bank", "m."),
  ("sundlaug", "swimming pool", "f."),
  ("kirkja", "church", "f."),
  ("kaffihús", "café", "n."),
  ("miði", "ticket", "m."),
  ("vegur", "road", "m."),
  ("bær", "town / farm", "m."),
 ],
 "Sagnir — Verbs": [
  ("að vera", "to be", "ég er"),
  ("að hafa", "to have", "ég hef"),
  ("að eiga", "to own / have", "ég á"),
  ("að fara", "to go", "ég fer"),
  ("að koma", "to come", "ég kem"),
  ("að tala", "to speak", "ég tala"),
  ("að skilja", "to understand", "ég skil"),
  ("að borða", "to eat", "ég borða"),
  ("að drekka", "to drink", "ég drekk"),
  ("að sjá", "to see", "ég sé"),
  ("að vilja", "to want", "ég vil"),
  ("að búa", "to live (reside)", "ég bý"),
  ("að heita", "to be called", "ég heiti"),
  ("að læra", "to learn", "ég læri"),
  ("að kaupa", "to buy", "ég kaupi"),
 ],
 "Lýsingarorð — Adjectives": [
  ("góður", "good", "góð f., gott n."),
  ("stór", "big", "stór f., stórt n."),
  ("lítill", "small", "lítil f., lítið n."),
  ("nýr", "new", "ný f., nýtt n."),
  ("gamall", "old", "gömul f., gamalt n."),
  ("fallegur", "beautiful", "falleg f., fallegt n."),
  ("dýr", "expensive", "dýr f., dýrt n."),
  ("ódýr", "cheap", "ódýr f., ódýrt n."),
  ("glaður", "happy", "glöð f., glatt n."),
  ("þreyttur", "tired", "þreytt f., þreytt n."),
  ("rauður", "red", "rauð f., rautt n."),
  ("blár", "blue", "blá f., blátt n."),
  ("grænn", "green", "græn f., grænt n."),
  ("hvítur", "white", "hvít f., hvítt n."),
  ("svartur", "black", "svört f., svart n."),
 ],
}

# ---------------- GRAMMAR ----------------
# each lesson: id, title, intro (html-ish plain), tables [(caption, header, rows)], examples [(is, en)], quiz [(q, options, correct_index, explain)]
GRAMMAR = [
 {
  "id": "sounds", "title": "1 · Letters & sounds",
  "intro": "Icelandic spelling is very regular once you know a few rules. The accent marks don't mean stress — stress is always on the first syllable. They mark different vowels.",
  "tables": [("Special letters", ["Letter", "Sounds like", "Example"], [
     ["þ", "th in “think”", "þrír"],
     ["ð", "th in “this” (never at word start)", "góður"],
     ["á", "ow in “cow”", "já"],
     ["é", "ye in “yes”", "ég"],
     ["í / ý", "ee in “see”", "níu"],
     ["ó", "o in “go”", "sól"],
     ["ú", "oo in “food”", "hús"],
     ["æ", "i in “eye”", "æfing"],
     ["ö", "German ö / u in “fur”", "sjö"],
     ["au", "like French “œil” — öy", "auga"],
     ["ei / ey", "ay in “day”", "nei"],
   ]),
   ("Consonant combinations", ["Spelling", "Said like", "Example"], [
     ["ll", "tl", "fjall"],
     ["hv", "kv", "hvað"],
     ["rn", "rdn", "barn"],
     ["nn (after á é í ó ú ý æ ei au)", "dn", "steinn"],
     ["fn", "pn", "nafn"],
     ["pp tt kk", "h + p/t/k (pre-aspiration)", "takk"],
     ["hl hr hn", "breathy, voiceless l/r/n", "hratt"],
   ])],
  "examples": [("þrír", "three"), ("góður", "good"), ("fjall", "mountain"), ("hvað", "what"), ("takk", "thanks"), ("steinn", "stone"), ("nafn", "name"), ("auga", "eye")],
  "quiz": [
   ("How is “hv” in hvað pronounced?", ["hw", "kv", "v", "f"], 1, "hv is always kv: hvað ≈ kvath."),
   ("Where does stress fall in Icelandic words?", ["Last syllable", "On the accented vowel", "First syllable", "It varies"], 2, "Always the first syllable. Accents mark vowel quality, not stress."),
   ("“ll” in fjall sounds most like…", ["l", "y", "tl", "dl"], 2, "ll is a tl-like sound: fjatl."),
   ("Which letter never starts a word?", ["þ", "ð", "æ", "ö"], 1, "ð only appears in the middle or end of words."),
   ("“á” sounds like…", ["a in father", "ow in cow", "ay in day", "aw in saw"], 1, "á = ow, as in cow: já ≈ yow."),
  ]
 },
 {
  "id": "vera", "title": "2 · Pronouns & “að vera” (to be)",
  "intro": "Icelandic has three genders for “they”: þeir (all men / masculine), þær (all women / feminine) and þau (mixed group or neuter). “Það” means “it” and is also used like English “there/it” (Það er kalt — It's cold).",
  "tables": [("að vera — to be (present)", ["Person", "Pronoun", "Verb"], [
     ["I", "ég", "er"], ["you (one)", "þú", "ert"], ["he / she / it", "hann / hún / það", "er"],
     ["we", "við", "erum"], ["you (several)", "þið", "eruð"], ["they", "þeir / þær / þau", "eru"],
   ])],
  "examples": [("Ég er þreyttur.", "I am tired."), ("Hún er í Reykjavík.", "She is in Reykjavík."), ("Við erum frá Ameríku.", "We are from America."), ("Þau eru heima.", "They are at home."), ("Ert þú Íslendingur?", "Are you Icelandic?")],
  "quiz": [
   ("Við ___ glaðir.", ["er", "erum", "eru", "eruð"], 1, "við → erum."),
   ("A mixed group of a man and a woman is…", ["þeir", "þær", "þau", "þið"], 2, "Mixed groups use the neuter plural þau."),
   ("Þú ___ góður kennari.", ["ert", "er", "eruð", "erum"], 0, "þú → ert."),
   ("“Það er kalt” means…", ["He is cold", "It is cold", "That is a cold", "They are cold"], 1, "Það is used for weather and general statements."),
  ]
 },
 {
  "id": "article", "title": "3 · Gender & “the”",
  "intro": "Every noun is masculine, feminine or neuter. There is no word for “a” — just leave it out. “The” is a suffix glued onto the end of the noun, and it changes with gender.",
  "tables": [("The definite suffix (nominative singular)", ["Gender", "a / indefinite", "the / definite"], [
     ["masculine", "hestur (a horse)", "hesturinn"], ["masculine", "bíll (a car)", "bíllinn"],
     ["feminine", "kona (a woman)", "konan"], ["feminine", "búð (a shop)", "búðin"],
     ["neuter", "barn (a child)", "barnið"], ["neuter", "hús (a house)", "húsið"],
   ])],
  "examples": [("Hesturinn er stór.", "The horse is big."), ("Konan talar íslensku.", "The woman speaks Icelandic."), ("Húsið er gamalt.", "The house is old."), ("Þetta er bíll.", "This is a car.")],
  "quiz": [
   ("“The child” is…", ["barnin", "barnið", "barninn", "barnan"], 1, "Neuter → -ið: barnið."),
   ("“The shop” (búð, f.) is…", ["búðið", "búðinn", "búðin", "búðan"], 2, "Feminine → -in: búðin."),
   ("How do you say “a dog”?", ["einn hundur", "hundur", "hundurinn", "a hundur"], 1, "No indefinite article — just hundur."),
   ("Masculine nouns take…", ["-inn", "-in", "-ið", "-ann"], 0, "Masculine → -(i)nn: hesturinn."),
  ]
 },
 {
  "id": "cases", "title": "4 · The four cases",
  "intro": "Nouns change their endings depending on their role in the sentence. Nominative is the subject. Accusative is most direct objects. Dative follows many verbs and prepositions. Genitive shows possession and follows a few prepositions like “til” (to). Prepositions decide the case — learn them as pairs.",
  "tables": [("One noun of each gender", ["Case", "hestur (m.)", "kona (f.)", "barn (n.)"], [
     ["Nominative", "hestur", "kona", "barn"], ["Accusative", "hest", "konu", "barn"],
     ["Dative", "hesti", "konu", "barni"], ["Genitive", "hests", "konu", "barns"],
   ]),
   ("Prepositions and their case", ["Preposition", "Case", "Example"], [
     ["um (about)", "accusative", "um hestinn"], ["frá (from)", "dative", "frá Íslandi"],
     ["með (with)", "dative (usually)", "með mjólk"], ["til (to)", "genitive", "til Akureyrar"],
     ["í / á — where something is", "dative", "í Reykjavík, á Íslandi"], ["í / á — moving into/onto", "accusative", "í bæinn"],
   ])],
  "examples": [("Ég sé hest.", "I see a horse. (accusative)"), ("Ég kem frá Íslandi.", "I come from Iceland. (dative)"), ("Við förum til Akureyrar.", "We're going to Akureyri. (genitive)"), ("Kaffi með mjólk, takk.", "Coffee with milk, please."), ("Ég bý á Íslandi.", "I live in Iceland.")],
  "quiz": [
   ("Ég kem frá ___ (Ísland).", ["Ísland", "Íslandi", "Íslands", "Íslandið"], 1, "frá takes dative: Íslandi."),
   ("Which case is the sentence subject?", ["Accusative", "Dative", "Genitive", "Nominative"], 3, "The subject is nominative."),
   ("“til” takes which case?", ["Nominative", "Accusative", "Dative", "Genitive"], 3, "til + genitive: til Akureyrar."),
   ("Ég sé ___ (hestur).", ["hestur", "hest", "hesti", "hests"], 1, "að sjá takes an accusative object: hest."),
  ]
 },
 {
  "id": "present", "title": "5 · Present tense verbs",
  "intro": "Most verbs follow a few regular patterns. Learn the infinitive (að tala) and the “ég” form, and the rest follows. Watch for a → ö in the “við” form of many verbs (tala → tölum).",
  "tables": [("Two common patterns", ["Pronoun", "að tala (speak)", "að læra (learn)"], [
     ["ég", "tala", "læri"], ["þú", "talar", "lærir"], ["hann/hún/það", "talar", "lærir"],
     ["við", "tölum", "lærum"], ["þið", "talið", "lærið"], ["þeir/þær/þau", "tala", "læra"],
   ])],
  "examples": [("Ég tala smá íslensku.", "I speak a little Icelandic."), ("Við tölum ensku heima.", "We speak English at home."), ("Hún lærir íslensku.", "She is learning Icelandic."), ("Þið lærið hratt.", "You (pl.) learn quickly.")],
  "quiz": [
   ("Við ___ íslensku. (tala)", ["talum", "tölum", "talar", "talið"], 1, "a → ö before -um: tölum."),
   ("Þú ___ dönsku. (læra)", ["lærir", "læri", "lærið", "læra"], 0, "þú → lærir."),
   ("Þau ___ mikið. (tala)", ["talar", "tölum", "tala", "talið"], 2, "Plural they → tala."),
  ]
 },
 {
  "id": "wordorder", "title": "6 · Word order, questions, “ekki”",
  "intro": "The verb is always the second element of a statement (V2). If you start with a time or place, the subject moves after the verb. Questions start with the verb. “Ekki” (not) goes right after the verb. In speech, “þú” after a verb merges into it: talar þú → talarðu.",
  "tables": [("Patterns", ["Type", "Example", "Meaning"], [
     ["Statement", "Ég fer í sund í dag.", "I'm going swimming today."],
     ["Starts with time (V2)", "Í dag fer ég í sund.", "Today I'm going swimming."],
     ["Yes/no question", "Talarðu íslensku?", "Do you speak Icelandic?"],
     ["Negation", "Ég tala ekki íslensku.", "I don't speak Icelandic."],
   ])],
  "examples": [("Í dag fer ég í sund.", "Today I'm going swimming."), ("Talarðu íslensku?", "Do you speak Icelandic?"), ("Ég skil ekki.", "I don't understand."), ("Á morgun kemur hann.", "Tomorrow he comes.")],
  "quiz": [
   ("Correct order: “Tomorrow I'll go”", ["Á morgun ég fer.", "Á morgun fer ég.", "Ég á morgun fer.", "Fer á morgun ég."], 1, "Verb second: Á morgun fer ég."),
   ("Where does “ekki” go in “Ég skil”?", ["Ekki ég skil.", "Ég ekki skil.", "Ég skil ekki.", "Skil ég ekki."], 2, "Right after the verb: Ég skil ekki."),
   ("“Do you understand?”", ["Þú skilur?", "Skilurðu?", "Skilur ekki?", "Ert þú skilur?"], 1, "Verb first, þú merges: Skilurðu?"),
  ]
 },
 {
  "id": "numbers", "title": "7 · Numbers 1–4 have genders",
  "intro": "Only 1–4 change form. They agree with the noun's gender. From five upward, numbers never change.",
  "tables": [("1–4 by gender (nominative)", ["", "masculine", "feminine", "neuter"], [
     ["1", "einn", "ein", "eitt"], ["2", "tveir", "tvær", "tvö"],
     ["3", "þrír", "þrjár", "þrjú"], ["4", "fjórir", "fjórar", "fjögur"],
   ])],
  "examples": [("tveir bílar", "two cars"), ("tvær konur", "two women"), ("tvö börn", "two children"), ("þrjú epli", "three apples"), ("fimm hundar", "five dogs")],
  "quiz": [
   ("___ börn (2, neuter)", ["tveir", "tvær", "tvö", "tvo"], 2, "Neuter: tvö."),
   ("___ systur (3, feminine)", ["þrír", "þrjár", "þrjú", "þrem"], 1, "Feminine: þrjár."),
   ("Which number never changes?", ["einn", "fjórir", "fimm", "tveir"], 2, "Only 1–4 change; fimm is fixed."),
  ]
 },
 {
  "id": "adjectives", "title": "8 · Adjectives agree",
  "intro": "Adjectives match the noun's gender, number and case. In the nominative, the pattern for most adjectives is: masculine -ur, feminine no ending, neuter -t.",
  "tables": [("góður (good), nominative", ["", "masculine", "feminine", "neuter"], [
     ["singular", "góður maður", "góð kona", "gott barn"],
     ["plural", "góðir menn", "góðar konur", "góð börn"],
   ])],
  "examples": [("góður maður", "a good man"), ("góð kona", "a good woman"), ("gott barn", "a good child"), ("Veðrið er gott.", "The weather is good."), ("Bíllinn er rauður.", "The car is red.")],
  "quiz": [
   ("Veðrið (n.) er ___.", ["góður", "góð", "gott", "góðir"], 2, "Neuter singular: gott."),
   ("___ kona", ["fallegur", "falleg", "fallegt", "fallegir"], 1, "Feminine: falleg."),
   ("Hundurinn (m.) er ___.", ["svartur", "svört", "svart", "svartar"], 0, "Masculine: svartur."),
  ]
 },
]

# ---------------- READING ----------------
READING = [
 {"id": "anna", "title": "Ég heiti Anna", "level": "A1", "voice": "salka",
  "sentences": [
   ("Ég heiti Anna.", "My name is Anna."),
   ("Ég er þrjátíu ára og ég bý í Reykjavík.", "I am thirty years old and I live in Reykjavík."),
   ("Ég á einn bróður og eina systur.", "I have one brother and one sister."),
   ("Ég vinn á kaffihúsi í miðbænum.", "I work at a café downtown."),
   ("Á kvöldin les ég bækur og fer í sund.", "In the evenings I read books and go swimming."),
   ("Ég tala íslensku og ensku.", "I speak Icelandic and English."),
  ],
  "glossary": [("ára", "years old"), ("ég á", "I have (own)"), ("ég vinn", "I work"), ("miðbænum", "downtown (dat.)"), ("á kvöldin", "in the evenings"), ("les", "read(s)")],
  "quiz": [("Where does Anna live?", ["Akureyri", "Reykjavík", "Selfoss", "Ísafjörður"], 1),
           ("Where does she work?", ["At a bank", "At a hotel", "At a café", "At a school"], 2),
           ("What does she do in the evenings?", ["Watches TV", "Reads and swims", "Cooks", "Runs"], 1)]},
 {"id": "shop", "title": "Í búðinni — At the shop", "level": "A1", "dialogue": True,
  "sentences": [
   ("Góðan daginn. Get ég aðstoðað?", "Good day. Can I help?", "A"),
   ("Já, takk. Ég ætla að fá eitt brauð og mjólk.", "Yes, thanks. I'd like a loaf of bread and milk.", "B"),
   ("Eitthvað fleira?", "Anything else?", "A"),
   ("Já, áttu skyr?", "Yes, do you have skyr?", "B"),
   ("Já, það er þarna við hliðina á ostinum.", "Yes, it's over there next to the cheese.", "A"),
   ("Frábært. Hvað kostar þetta?", "Great. How much is this?", "B"),
   ("Það eru átta hundruð og fimmtíu krónur.", "That's eight hundred and fifty krónur.", "A"),
   ("Gjörðu svo vel.", "Here you go.", "B"),
   ("Takk fyrir. Eigðu góðan dag!", "Thank you. Have a good day!", "A"),
  ],
  "glossary": [("aðstoðað", "help(ed)"), ("ég ætla að fá", "I'd like (lit. I intend to get)"), ("eitthvað fleira", "anything more"), ("áttu", "do you have (= átt þú)"), ("við hliðina á", "next to"), ("eigðu góðan dag", "have a good day")],
  "quiz": [("What does B buy first?", ["Coffee and cake", "Bread and milk", "Fish", "Cheese"], 1),
           ("Where is the skyr?", ["In the freezer", "Next to the cheese", "By the door", "They're out"], 1),
           ("How much does it cost?", ["580 kr.", "850 kr.", "1,850 kr.", "8,500 kr."], 1)]},
 {"id": "weather", "title": "Veðrið á Íslandi", "level": "A2", "voice": "steinn",
  "sentences": [
   ("Veðrið á Íslandi breytist mjög hratt.", "The weather in Iceland changes very quickly."),
   ("Á morgnana getur verið sól, en eftir hádegi kemur oft rigning og vindur.", "In the mornings it can be sunny, but in the afternoon rain and wind often come."),
   ("Á veturna er dimmt og kalt, en þá sjást stundum norðurljósin.", "In winter it is dark and cold, but then the northern lights are sometimes seen."),
   ("Á sumrin er bjart allan sólarhringinn.", "In summer it is light around the clock."),
   ("Íslendingar segja: Ef þér líkar ekki veðrið, bíddu þá í fimm mínútur.", "Icelanders say: If you don't like the weather, wait five minutes."),
  ],
  "glossary": [("breytist", "changes"), ("hratt", "quickly"), ("eftir hádegi", "in the afternoon"), ("dimmt", "dark"), ("sjást", "are seen"), ("sólarhringinn", "the 24-hour day"), ("bíddu", "wait (imperative)")],
  "quiz": [("How does Icelandic weather change?", ["Slowly", "Very quickly", "Only in winter", "Never"], 1),
           ("When can you sometimes see the northern lights?", ["Summer mornings", "In winter", "In the afternoon rain", "Never"], 1),
           ("How long should you wait if you don't like the weather?", ["Five minutes", "One hour", "A day", "A week"], 0)]},
 {"id": "akureyri", "title": "Ferð til Akureyrar", "level": "A2", "voice": "bui",
  "sentences": [
   ("Á laugardaginn fórum við til Akureyrar.", "On Saturday we went to Akureyri."),
   ("Við keyrðum norður í fimm klukkutíma.", "We drove north for five hours."),
   ("Á leiðinni stoppuðum við í Borgarnesi og fengum okkur kaffi.", "On the way we stopped in Borgarnes and had some coffee."),
   ("Akureyri er fallegur bær við Eyjafjörð.", "Akureyri is a beautiful town on Eyjafjörður."),
   ("Við borðuðum ís og gengum um bæinn.", "We ate ice cream and walked around the town."),
   ("Á sunnudaginn fórum við í sund.", "On Sunday we went swimming."),
  ],
  "glossary": [("fórum", "went (we)"), ("keyrðum", "drove (we)"), ("á leiðinni", "on the way"), ("fengum okkur", "got ourselves / had"), ("gengum", "walked (we)"), ("ís", "ice cream")],
  "quiz": [("How long was the drive?", ["Two hours", "Five hours", "Eight hours", "One day"], 1),
           ("Where did they stop for coffee?", ["Selfoss", "Borgarnes", "Húsavík", "Vík"], 1),
           ("What did they do on Sunday?", ["Drove home", "Went swimming", "Went to church", "Ate fish"], 1)]},
 {"id": "jol", "title": "Jólasveinarnir — The Yule Lads", "level": "A2", "voice": "ugla",
  "sentences": [
   ("Á Íslandi eru þrettán jólasveinar.", "In Iceland there are thirteen Yule Lads."),
   ("Þeir búa uppi í fjöllum með Grýlu og Leppalúða.", "They live up in the mountains with Grýla and Leppalúði."),
   ("Síðustu þrettán dagana fyrir jól kemur einn jólasveinn til byggða á hverri nóttu.", "During the last thirteen days before Christmas, one Yule Lad comes down to town each night."),
   ("Börnin setja skó út í glugga.", "The children put a shoe in the window."),
   ("Góð börn fá eitthvað lítið í skóinn, en óþæg börn fá kartöflu.", "Good children get a little something in the shoe, but naughty children get a potato."),
  ],
  "glossary": [("þrettán", "thirteen"), ("jólasveinn", "Yule Lad"), ("til byggða", "to inhabited areas"), ("á hverri nóttu", "every night"), ("skóinn", "the shoe (acc.)"), ("óþæg", "naughty"), ("kartafla / kartöflu", "potato")],
  "quiz": [("How many Yule Lads are there?", ["Nine", "Twelve", "Thirteen", "Twenty-four"], 2),
           ("Where do they live?", ["In the sea", "Up in the mountains", "In Reykjavík", "Under the church"], 1),
           ("What do naughty children get?", ["Coal", "Nothing", "A potato", "A fish"], 2)]},
]

# ---------------- SENTENCES (listening + speaking) ----------------
SENTENCES = [
 ("Ég tala smá íslensku.", "I speak a little Icelandic."),
 ("Geturðu talað hægar?", "Can you speak more slowly?"),
 ("Hvað kostar þetta?", "How much does this cost?"),
 ("Hvar er klósettið?", "Where is the toilet?"),
 ("Ég skil ekki.", "I don't understand."),
 ("Ég er frá Bandaríkjunum.", "I'm from the United States."),
 ("Mig langar í kaffi.", "I'd like some coffee."),
 ("Hvernig segir maður þetta á íslensku?", "How do you say this in Icelandic?"),
 ("Veðrið er gott í dag.", "The weather is good today."),
 ("Það er kalt úti.", "It's cold outside."),
 ("Ég bý í litlum bæ.", "I live in a small town."),
 ("Hvað heitir þú?", "What's your name?"),
 ("Gaman að kynnast þér.", "Nice to meet you."),
 ("Ég ætla að fara í sund.", "I'm going to go swimming."),
 ("Má ég fá reikninginn?", "May I have the bill?"),
 ("Ég á tvo hunda.", "I have two dogs."),
 ("Klukkan hvað opnar búðin?", "What time does the shop open?"),
 ("Ég er svangur.", "I'm hungry. (said by a man; svöng for a woman)"),
 ("Sjáumst á morgun.", "See you tomorrow."),
 ("Hvar er stoppistöðin?", "Where is the bus stop?"),
 ("Ég elska Ísland.", "I love Iceland."),
 ("Takk fyrir matinn.", "Thanks for the food."),
 ("Hvað er klukkan?", "What time is it?"),
 ("Ég er að læra íslensku.", "I'm learning Icelandic."),
]

# ---------------- SOUND DRILLS ----------------
DRILLS = [
 {"sound": "þ", "tip": "Tongue between teeth, breathy — the th in “think”.", "words": ["þak", "þrír", "það"]},
 {"sound": "ð", "tip": "Voiced th, as in “this”. Soft and buzzy.", "words": ["góður", "maður", "bað"]},
 {"sound": "ll", "tip": "Say a quick t, then let air escape past the sides of your tongue: fjatl.", "words": ["fjall", "allt", "Halla"]},
 {"sound": "hv", "tip": "Always kv: hvað ≈ kvath.", "words": ["hvað", "hvar", "hvalur"]},
 {"sound": "au", "tip": "Round your lips: start at ö, glide to y — öy.", "words": ["auga", "haust", "sauður"]},
 {"sound": "á", "tip": "ow, as in “cow”.", "words": ["já", "ár", "bátur"]},
 {"sound": "æ", "tip": "eye, as in “I”.", "words": ["æfing", "sæti", "bær"]},
 {"sound": "ö", "tip": "Lips rounded, tongue forward — like the u in “fur”.", "words": ["sjö", "köttur", "börn"]},
 {"sound": "pp tt kk", "tip": "Pre-aspiration: a little h before the stop. takk ≈ tahk.", "words": ["takk", "hattur", "þakka"]},
 {"sound": "rn / nn", "tip": "rn → rdn, and nn after a long vowel → dn: barn ≈ bardn, steinn ≈ steidn.", "words": ["barn", "steinn", "fínn"]},
 {"sound": "hl hr hn", "tip": "Breathe out through the l / r / n — no voice.", "words": ["hlaupa", "hratt", "hnífur"]},
 {"sound": "r", "tip": "Tapped or trilled, never the English r.", "words": ["rigning", "Reykjavík", "rauður"]},
]

def build():
    vocab = []
    for cat, items in VOCAB.items():
        vocab.append({"cat": cat, "items": [{"is": a, "en": b, "note": c} for a, b, c in items]})
    grammar = []
    for g in GRAMMAR:
        grammar.append({**g,
            "tables": [{"caption": c, "head": h, "rows": r} for c, h, r in g["tables"]],
            "examples": [{"is": a, "en": b} for a, b in g["examples"]],
            "quiz": [{"q": q, "opts": o, "a": a, "why": w} for q, o, a, w in g["quiz"]]})
    reading = []
    for r in READING:
        sents = []
        for s in r["sentences"]:
            d = {"is": s[0], "en": s[1]}
            if len(s) > 2: d["spk"] = s[2]
            sents.append(d)
        reading.append({**r, "sentences": sents,
            "glossary": [{"is": a, "en": b} for a, b in r["glossary"]],
            "quiz": [{"q": q, "opts": o, "a": a} for q, o, a in r["quiz"]]})
    sentences = [{"is": a, "en": b} for a, b in SENTENCES]
    return {"vocab": vocab, "grammar": grammar, "reading": reading, "sentences": sentences, "drills": DRILLS}

def all_texts(c):
    t = []
    for cat in c["vocab"]:
        t += [i["is"] for i in cat["items"]]
    for g in c["grammar"]:
        t += [e["is"] for e in g["examples"]]
    for r in c["reading"]:
        t += [s["is"] for s in r["sentences"]]
    t += [s["is"] for s in c["sentences"]]
    for d in c["drills"]:
        t += d["words"]
    seen, out = set(), []
    for x in t:
        if x not in seen:
            seen.add(x); out.append(x)
    return out

if __name__ == "__main__":
    c = build()
    json.dump(c, open("content.json", "w"), ensure_ascii=False, indent=1)
    texts = all_texts(c)
    json.dump(texts, open("texts.json", "w"), ensure_ascii=False)
    print(len(texts), "unique texts")
