# -*- coding: utf-8 -*-
"""Scenario ("journey") content. Each scene = one unit.
Dialogue speakers: "A" = the local (NPC), "U" = you, the traveller.
U lines may carry "alts": other correct things you could say.
"""
import json

S = []

S.append(dict(
 id="komur", is_title="Komið til landsins", en_title="Arriving at the airport", pic="🛬",
 npc=dict(role="Starfsmaður", en="Airport staff", g="f"),
 setting="You've just landed at Keflavík and need to find your bags.",
 signs=[("Komur","Arrivals"),("Brottfarir","Departures"),("Farangur","Baggage"),("Útgangur","Exit"),("Snyrting","Restrooms"),("Tollur","Customs")],
 words=[("flugvél","aeroplane","✈️"),("flugvöllur","airport","🛫+🏢"),("farangur","baggage","🛄"),("útgangur","exit","exit"),("stigi","stairs","🪜"),("niðri","downstairs","🪜+⬇️"),("til vinstri","to the left","sign:←"),("til hægri","to the right","sign:→")],
 dialogue=[
  ("U","Afsakið, talar þú ensku?","Excuse me, do you speak English?"),
  ("A","Já, en þú mátt alveg tala íslensku við mig.","Yes, but you're welcome to speak Icelandic with me."),
  ("U","Hvar er farangurinn?","Where is the baggage?", [("Hvar fæ ég töskuna mína?","Where do I get my suitcase?")]),
  ("A","Farangurinn er niðri. Farðu niður stigann og svo til vinstri.","The baggage is downstairs. Go down the stairs and then left."),
  ("U","Niður og til vinstri. Takk fyrir!","Down and to the left. Thank you!"),
  ("A","Ekkert að þakka. Velkomin til Íslands!","You're welcome. Welcome to Iceland!"),
 ],
 tips=[
  ("“Afsakið” is the polite “excuse me” for strangers. “Fyrirgefðu” is more like “sorry”.", ["Afsakið", "Fyrirgefðu"]),
  ("Directions: til vinstri (left), til hægri (right), beint áfram (straight ahead).", ["til vinstri", "til hægri", "beint áfram"]),
 ],
 build=[("Hvar er farangurinn?","Where is the baggage?"),("Farðu niður stigann.","Go down the stairs."),("Ekkert að þakka.","You're welcome.")],
))

S.append(dict(
 id="vegabref", is_title="Vegabréfaeftirlit", en_title="Passport control", pic="🛂",
 npc=dict(role="Landamæravörður", en="Border officer", g="m"),
 setting="The border officer asks why you're here and how long you'll stay.",
 words=[("vegabréf","passport","🛂"),("ferðamaður","tourist","🧑+📸"),("frí","holiday","🏖️"),("vika","week","🗓️+7"),("dagur","day","🗓️+1"),("nótt","night","🌃"),("hótel","hotel","🏨"),("að gista","to stay (overnight)","🛌")],
 dialogue=[
  ("A","Góðan daginn. Vegabréfið, takk.","Good morning. Passport, please."),
  ("U","Gjörðu svo vel.","Here you go."),
  ("A","Hver er tilgangur ferðarinnar?","What is the purpose of your trip?"),
  ("U","Ég er í fríi.","I'm on holiday.", [("Ég er ferðamaður.","I'm a tourist.")]),
  ("A","Hvað ætlarðu að vera lengi á Íslandi?","How long will you be in Iceland?"),
  ("U","Í eina viku.","For one week.", [("Í tíu daga.","For ten days.")]),
  ("A","Og hvar gistirðu?","And where are you staying?"),
  ("U","Á hóteli í Reykjavík.","At a hotel in Reykjavík."),
  ("A","Allt í lagi. Góða ferð!","All right. Have a good trip!"),
 ],
 tips=[
  ("For how long: í + the time word. Feminine “vika” becomes “eina viku”.", ["Í eina viku.", "Í tvo daga."]),
  ("“-ðu” at the end of a verb is “þú” glued on: ætlar þú → ætlarðu, gistir þú → gistirðu.", ["Hvar gistirðu?"]),
 ],
 build=[("Ég er í fríi.","I'm on holiday."),("Í eina viku.","For one week."),("Á hóteli í Reykjavík.","At a hotel in Reykjavík.")],
))

S.append(dict(
 id="tollur", is_title="Í tollinum", en_title="Customs", pic="🧳",
 npc=dict(role="Tollvörður", en="Customs officer", g="f"),
 setting="A customs officer stops you on the way out.",
 words=[("ferðataska","suitcase","🧳"),("tollur","customs","🛃"),("áfengi","alcohol","🥃"),("vín","wine","🍷"),("flaska","bottle","🍾"),("tóbak","tobacco","🚬"),("matur","food","🍽️"),("gjöf","gift","🎁")],
 dialogue=[
  ("A","Góðan daginn. Ertu með eitthvað tollskylt?","Good day. Do you have anything to declare?"),
  ("U","Nei, ekkert.","No, nothing."),
  ("A","Ertu með áfengi eða tóbak?","Do you have alcohol or tobacco?"),
  ("U","Bara eina flösku af víni.","Just one bottle of wine."),
  ("A","Það er í lagi. Má ég sjá í töskuna?","That's fine. May I look in the suitcase?"),
  ("U","Já, auðvitað.","Yes, of course."),
  ("A","Takk. Þú mátt fara.","Thanks. You may go."),
 ],
 tips=[
  ("“Ertu með…?” (lit. are you with…?) is the everyday way to ask “do you have…?”.", ["Ertu með áfengi?", "Ertu með kort?"]),
  ("“Má ég…?” = may I…? Very useful and very polite.", ["Má ég sjá?", "Má ég fá vatn?"]),
 ],
 build=[("Nei, ekkert.","No, nothing."),("Bara eina flösku af víni.","Just one bottle of wine."),("Já, auðvitað.","Yes, of course.")],
))

S.append(dict(
 id="ruta", is_title="Rútan í bæinn", en_title="The bus into town", pic="🚌",
 npc=dict(role="Sölumaður", en="Ticket seller", g="m"),
 setting="Buying a bus ticket from the airport to Reykjavík.",
 words=[("rúta","coach / bus","🚌"),("miði","ticket","🎫"),("kort","card","💳"),("að borga","to pay","💳+✔"),("mínúta","minute","⏱️"),("klukkutími","hour","🕐"),("aðra leiðina","one way","🎫+→"),("fram og til baka","return","🎫+⇄")],
 dialogue=[
  ("U","Góðan daginn. Einn miða til Reykjavíkur, takk.","Hello. One ticket to Reykjavík, please."),
  ("A","Aðra leiðina eða fram og til baka?","One way or return?"),
  ("U","Aðra leiðina, takk.","One way, please.", [("Fram og til baka, takk.","Return, please.")]),
  ("A","Gjörðu svo vel. Rútan fer eftir tíu mínútur.","Here you go. The bus leaves in ten minutes."),
  ("U","Get ég borgað með korti?","Can I pay by card?"),
  ("A","Já, ekkert mál.","Yes, no problem."),
  ("U","Hvað tekur ferðin langan tíma?","How long does the trip take?"),
  ("A","Um það bil fjörutíu og fimm mínútur.","About forty-five minutes."),
 ],
 tips=[
  ("Going to a place: til + genitive. The place name changes: Reykjavík → til Reykjavíkur, Akureyri → til Akureyrar.", ["til Reykjavíkur", "til Akureyrar"]),
  ("“Get ég…?” = can I…? Follow it with the -að form of the verb.", ["Get ég borgað með korti?"]),
 ],
 build=[("Einn miða til Reykjavíkur, takk.","One ticket to Reykjavík, please."),("Get ég borgað með korti?","Can I pay by card?"),("Rútan fer eftir tíu mínútur.","The bus leaves in ten minutes.")],
))

S.append(dict(
 id="hotel", is_title="Á hótelinu", en_title="Hotel check-in", pic="🏨",
 npc=dict(role="Móttaka", en="Receptionist", g="f"),
 setting="Checking in at your hotel in the evening.",
 words=[("herbergi","room","🛏️"),("lykill","key","🔑"),("morgunmatur","breakfast","🍳"),("hæð","floor / storey","🏢+3"),("lyfta","lift / elevator","🛗"),("þráðlaust net","wifi","📶"),("lykilorð","password","🔑+•••"),("nótt","night","🌃")],
 dialogue=[
  ("A","Gott kvöld og velkomin.","Good evening and welcome."),
  ("U","Gott kvöld. Ég á pantað herbergi á nafninu Smith.","Good evening. I have a room booked under the name Smith."),
  ("A","Já, hérna er það. Tvær nætur, er það ekki?","Yes, here it is. Two nights, isn't it?"),
  ("U","Jú, tvær nætur.","Yes, two nights."),
  ("A","Morgunmatur er frá sjö til tíu. Herbergið er á þriðju hæð.","Breakfast is from seven to ten. The room is on the third floor."),
  ("U","Takk. Er þráðlaust net hérna?","Thanks. Is there wifi here?"),
  ("A","Já, lykilorðið er á kortinu. Hér er lykillinn.","Yes, the password is on the card. Here is the key."),
 ],
 tips=[
  ("“Jú” is the yes you use to answer a negative question (“isn't it?”). “Já” would sound odd there.", ["Er það ekki? — Jú!"]),
  ("Floors use ordinals: fyrsta hæð, önnur hæð, þriðja hæð. “Á” makes it á þriðju hæð.", ["á þriðju hæð"]),
 ],
 build=[("Ég á pantað herbergi.","I have a room booked."),("Er þráðlaust net hérna?","Is there wifi here?"),("Herbergið er á þriðju hæð.","The room is on the third floor.")],
))

S.append(dict(
 id="leid", is_title="Að spyrja til vegar", en_title="Asking for directions", pic="🧭",
 npc=dict(role="Vegfarandi", en="Passer-by", g="m"),
 setting="You're downtown looking for Hallgrímskirkja and the bus stop.",
 words=[("beint áfram","straight ahead","sign:↑"),("gata","street","🏘️"),("kirkja","church","⛪"),("langt","far","far"),("nálægt","near","near"),("stoppistöð","bus stop","🚏"),("horn","corner","sign:↱"),("hinum megin","on the other side","sign:⇄")],
 dialogue=[
  ("U","Afsakið, hvar er Hallgrímskirkja?","Excuse me, where is Hallgrímskirkja?"),
  ("A","Farðu beint áfram upp Skólavörðustíg. Hún er efst á hæðinni.","Go straight up Skólavörðustígur. It's at the top of the hill."),
  ("U","Er langt þangað?","Is it far?"),
  ("A","Nei, bara fimm mínútna gangur.","No, just a five-minute walk."),
  ("U","Og hvar er næsta stoppistöð?","And where is the nearest bus stop?"),
  ("A","Hún er hinum megin við götuna, til hægri.","It's on the other side of the street, to the right."),
  ("U","Kærar þakkir!","Many thanks!", [("Takk fyrir!","Thank you!")]),
 ],
 tips=[
  ("Things are he/she/it by grammatical gender: kirkja and stoppistöð are feminine, so they're “hún” (she).", ["Hún er efst á hæðinni."]),
  ("“Farðu” = go! (an order to one person). It's farðu, not “far þú”.", ["Farðu beint áfram."]),
 ],
 build=[("Hvar er næsta stoppistöð?","Where is the nearest bus stop?"),("Er langt þangað?","Is it far?"),("Farðu beint áfram.","Go straight ahead.")],
))

S.append(dict(
 id="kaffi", is_title="Á kaffihúsinu", en_title="At the café", pic="☕",
 npc=dict(role="Afgreiðslukona", en="Barista", g="f"),
 setting="Ordering a coffee and a cinnamon roll.",
 words=[("kaffi","coffee","☕+🫘"),("te","tea","🍵"),("mjólk","milk","🥛"),("sykur","sugar","🍬"),("kanilsnúður","cinnamon roll","🥐"),("kaka","cake","🍰"),("bolli","cup","☕"),("að taka með","to take away","🥡")],
 dialogue=[
  ("A","Hæ! Hvað má bjóða þér?","Hi! What can I get you?"),
  ("U","Ég ætla að fá kaffi og kanilsnúð.","I'll have a coffee and a cinnamon roll.", [("Ég ætla að fá kaffi og köku.","I'll have a coffee and a piece of cake.")]),
  ("A","Viltu mjólk í kaffið?","Do you want milk in the coffee?"),
  ("U","Já, smá mjólk, takk.","Yes, a little milk, please."),
  ("A","Ætlarðu að borða hér eða taka með?","Eating here or taking away?"),
  ("U","Taka með, takk.","Take away, please.", [("Borða hér, takk.","Eat here, please.")]),
  ("A","Það verða þrettán hundruð krónur.","That'll be thirteen hundred krónur."),
 ],
 tips=[
  ("“Ég ætla að fá…” (I'm going to get…) is how you order anything. The item takes the accusative: kanilsnúður → kanilsnúð.", ["Ég ætla að fá kaffi.", "Ég ætla að fá kanilsnúð."]),
  ("“Viltu…?” = do you want…? (vilt þú → viltu).", ["Viltu mjólk?"]),
 ],
 build=[("Ég ætla að fá kaffi.","I'll have a coffee."),("Smá mjólk, takk.","A little milk, please."),("Taka með, takk.","Take away, please.")],
))

S.append(dict(
 id="bud", is_title="Í matvörubúðinni", en_title="At the grocery store", pic="🛒",
 npc=dict(role="Starfsmaður", en="Shop assistant", g="m"),
 setting="Finding skyr and bread, then paying at the till.",
 words=[("búð","shop","🏪"),("kælir","fridge / cooler","🥛+❄️"),("kassi","till / checkout","🛒+💳"),("poki","bag","🛍️"),("verð","price","🏷️"),("brauð","bread","🍞"),("ávextir","fruit","🍎🍌"),("grænmeti","vegetables","🥦🥕")],
 dialogue=[
  ("U","Afsakið, hvar finn ég skyr?","Excuse me, where do I find skyr?"),
  ("A","Í kælinum, aftast í búðinni.","In the cooler, at the back of the shop."),
  ("U","En brauð?","And bread?"),
  ("A","Brauðið er við hliðina á kassanum.","The bread is next to the till."),
  ("A","Viltu poka?","Do you want a bag?"),
  ("U","Já, einn poka, takk.","Yes, one bag, please.", [("Nei takk, ég er með poka.","No thanks, I have a bag.")]),
  ("A","Gjörðu svo vel. Eigðu góðan dag!","Here you go. Have a good day!"),
 ],
 tips=[
  ("“Hvar finn ég…?” = where do I find…? The thing you're looking for goes in the accusative.", ["Hvar finn ég skyr?", "Hvar finn ég mjólk?"]),
  ("Location: aftast (at the very back), fremst (at the very front), við hliðina á (next to).", ["aftast í búðinni", "við hliðina á kassanum"]),
 ],
 build=[("Hvar finn ég skyr?","Where do I find skyr?"),("Einn poka, takk.","One bag, please."),("Eigðu góðan dag!","Have a good day!")],
))

S.append(dict(
 id="sund", is_title="Í sundi", en_title="At the swimming pool", pic="♨️",
 npc=dict(role="Laugarvörður", en="Pool attendant", g="f"),
 setting="Icelandic pools have strict rules: shower without your swimsuit before you get in.",
 words=[("sundlaug","swimming pool","🏊"),("heitur pottur","hot tub","♨️"),("sturta","shower","🚿"),("handklæði","towel","🧖"),("sundföt","swimsuit","🩱"),("búningsklefi","changing room","🚪+👕"),("skápur","locker","🗄️+🔑"),("fullorðinn","adult","🧑+18")],
 dialogue=[
  ("A","Halló! Einn fullorðinn?","Hello! One adult?"),
  ("U","Já, einn fullorðinn, takk.","Yes, one adult, please."),
  ("A","Hér er armbandið. Mundu að fara í sturtu án sundfata áður en þú ferð í laugina.","Here's the wristband. Remember to shower without your swimsuit before you go in the pool."),
  ("U","Allt í lagi. Hvar eru heitu pottarnir?","OK. Where are the hot tubs?"),
  ("A","Þeir eru úti, við hliðina á lauginni.","They're outside, next to the pool."),
  ("U","Frábært, takk!","Great, thanks!"),
 ],
 tips=[
  ("“Mundu að…” = remember to… You'll hear it from parents, teachers and pool attendants.", ["Mundu að fara í sturtu."]),
  ("Adjectives get a soft ending after “the”: heitur pottur (a hot tub) → heiti potturinn (the hot tub) → heitu pottarnir (the hot tubs).", ["heitur pottur", "heiti potturinn", "heitu pottarnir"]),
 ],
 build=[("Einn fullorðinn, takk.","One adult, please."),("Hvar eru heitu pottarnir?","Where are the hot tubs?"),("Mundu að fara í sturtu.","Remember to shower.")],
))

S.append(dict(
 id="bensin", is_title="Á bensínstöðinni", en_title="At the gas station", pic="⛽",
 npc=dict(role="Afgreiðslumaður", en="Attendant", g="m"),
 setting="On the road south. Checking conditions — and grabbing a hot dog.",
 words=[("bensín","petrol / gas","⛽"),("vegur","road","🛣️"),("færð","road conditions","🛣️+🌨️"),("vindur","wind","💨"),("hálka","ice on the road","🚗+🧊"),("varlega","carefully","⚠️"),("pylsa","hot dog","🌭"),("bílaleiga","car rental","🚗+🔑")],
 dialogue=[
  ("U","Afsakið, er vegurinn til Víkur opinn?","Excuse me, is the road to Vík open?"),
  ("A","Já, en það er mikill vindur undir Eyjafjöllum. Farðu varlega.","Yes, but it's very windy below Eyjafjöll. Drive carefully."),
  ("U","Hvar get ég athugað færðina?","Where can I check the road conditions?"),
  ("A","Á vef Vegagerðarinnar.","On the Road Administration's website."),
  ("U","Takk. Og eina pylsu með öllu, takk!","Thanks. And one hot dog with everything, please!"),
  ("A","Ekkert mál.","No problem."),
 ],
 tips=[
  ("“Pylsa með öllu” — a hot dog with everything (raw and fried onion, ketchup, sweet mustard, remoulade) is practically a national dish.", ["Eina pylsu með öllu."]),
  ("“Farðu varlega” (take care / drive carefully) is also a friendly goodbye.", ["Farðu varlega!"]),
 ],
 build=[("Er vegurinn opinn?","Is the road open?"),("Farðu varlega.","Drive carefully."),("Eina pylsu með öllu, takk.","One hot dog with everything, please.")],
))

S.append(dict(
 id="spjall", is_title="Smáspjall", en_title="Small talk", pic="💬",
 npc=dict(role="Heimamaður", en="Local", g="f"),
 setting="A friendly local starts chatting with you.",
 words=[("hvaðan","where from","🌍+❓"),("veður","weather","🌦️"),("rok","strong wind","🌬️"),("rigning","rain","🌧️"),("skrítið","strange","🤨"),("að læra","to learn","📚"),("smá","a little","🤏"),("að líka","to like","👍")],
 dialogue=[
  ("A","Hvaðan ertu?","Where are you from?"),
  ("U","Ég er frá Bandaríkjunum.","I'm from the United States.", [("Ég er frá Kanada.","I'm from Canada.")]),
  ("A","Og hvernig líkar þér á Íslandi?","And how do you like Iceland?"),
  ("U","Mjög vel! En veðrið er svolítið skrítið.","Very much! But the weather is a bit strange."),
  ("A","Já, það er alltaf svona. Talarðu íslensku?","Yes, it's always like this. Do you speak Icelandic?"),
  ("U","Bara smá. Ég er að læra.","Just a little. I'm learning."),
  ("A","Þú talar bara mjög vel!","You speak really well!"),
 ],
 tips=[
  ("“Mér líkar…” (I like) works backwards: the liker is in the dative. So it's “mér líkar” and “þér líkar”, never “ég líkar”.", ["Mér líkar vel á Íslandi.", "Hvernig líkar þér?"]),
  ("“Ég er að…” + a verb = I'm (in the middle of) doing something.", ["Ég er að læra."]),
 ],
 build=[("Hvaðan ertu?","Where are you from?"),("Mér líkar vel á Íslandi.","I like it in Iceland."),("Ég er að læra.","I'm learning.")],
))

S.append(dict(
 id="apotek", is_title="Í apótekinu", en_title="At the pharmacy", pic="💊",
 npc=dict(role="Lyfjafræðingur", en="Pharmacist", g="f"),
 setting="You've got a headache, and you want to know the emergency number.",
 words=[("apótek","pharmacy","pharmacy"),("hausverkur","headache","🤕"),("tafla","pill / tablet","💊"),("læknir","doctor","🧑‍⚕️"),("veikur","sick","🤒"),("hjálp","help","🆘"),("sjúkrahús","hospital","🏥"),("að hringja","to call","📞")],
 dialogue=[
  ("U","Góðan daginn. Ég er með hausverk. Áttu eitthvað við því?","Hello. I have a headache. Do you have anything for it?"),
  ("A","Já, þetta er gott við hausverk. Lestu leiðbeiningarnar á pakkanum.","Yes, this is good for headaches. Read the instructions on the package."),
  ("U","Takk. Hvað kostar þetta?","Thanks. How much is this?"),
  ("A","Níu hundruð krónur.","Nine hundred krónur."),
  ("U","Og hvert á ég að hringja ef það er neyðartilfelli?","And where do I call if there's an emergency?"),
  ("A","Þá hringirðu í einn einn tveir.","Then you call one-one-two."),
 ],
 tips=[
  ("Aches and illnesses use “Ég er með…” (I'm with…).", ["Ég er með hausverk.", "Ég er með hita."]),
  ("Phone numbers are read digit by digit. Iceland's emergency number is 112: einn einn tveir.", ["einn einn tveir"]),
 ],
 build=[("Ég er með hausverk.","I have a headache."),("Hvað kostar þetta?","How much is this?"),("Ég þarf hjálp.","I need help.")],
))

REACTIONS = [("Ha? Fyrirgefðu, ég skil ekki.","Huh? Sorry, I don't understand."),("Ha? Hvað sagðirðu?","Huh? What did you say?"),("Ehh… afsakið?","Uhh… excuse me?")]

def build():
    out = []
    for s in S:
        d = dict(id=s["id"], is_title=s["is_title"], en_title=s["en_title"], pic=s["pic"], npc=s["npc"], setting=s["setting"])
        d["signs"] = [{"is":a,"en":b} for a,b in s.get("signs",[])]
        d["words"] = [{"is":a,"en":b,"pic":c} for a,b,c in s["words"]]
        dl = []
        for line in s["dialogue"]:
            e = {"spk":line[0],"is":line[1],"en":line[2]}
            if len(line) > 3: e["alts"] = [{"is":a,"en":b} for a,b in line[3]]
            dl.append(e)
        d["dialogue"] = dl
        d["tips"] = [{"en":a,"ex":b} for a,b in s["tips"]]
        d["build"] = [{"is":a,"en":b} for a,b in s["build"]]
        out.append(d)
    return out

def texts(sc):
    t = []
    for s in sc:
        t += [x["is"] for x in s["signs"]] + [x["is"] for x in s["words"]]
        for l in s["dialogue"]:
            t.append(l["is"]); t += [a["is"] for a in l.get("alts",[])]
        for tp in s["tips"]: t += tp["ex"]
        t += [b["is"] for b in s["build"]]
    t += [a for a,b in REACTIONS]
    return t

if __name__ == "__main__":
    sc = build()
    json.dump({"scenes": sc, "reactions": [{"is":a,"en":b} for a,b in REACTIONS]}, open("scenes.json","w"), ensure_ascii=False, indent=1)
    print(len(sc), "scenes", len(set(texts(sc))), "texts")
