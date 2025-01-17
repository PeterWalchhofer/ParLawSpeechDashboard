import os
import pickle

import numpy as np
import polars as pl
from sklearn.feature_extraction.text import TfidfVectorizer

# Very dirty... but it works
sw = [
    "a",
    "ab",
    "aber",
    "ach",
    "acht",
    "achte",
    "achten",
    "achter",
    "achtes",
    "ag",
    "alle",
    "allein",
    "allem",
    "allen",
    "aller",
    "allerdings",
    "alles",
    "allgemeinen",
    "als",
    "also",
    "am",
    "an",
    "andere",
    "anderen",
    "andern",
    "anders",
    "au",
    "auch",
    "auf",
    "aus",
    "ausser",
    "außer",
    "ausserdem",
    "außerdem",
    "b",
    "bald",
    "bei",
    "beide",
    "beiden",
    "beim",
    "beispiel",
    "bekannt",
    "bereits",
    "besonders",
    "besser",
    "besten",
    "bin",
    "bis",
    "bisher",
    "bist",
    "c",
    "d",
    "da",
    "dabei",
    "dadurch",
    "dafür",
    "dagegen",
    "daher",
    "dahin",
    "dahinter",
    "damals",
    "damit",
    "danach",
    "daneben",
    "dank",
    "dann",
    "daran",
    "darauf",
    "daraus",
    "darf",
    "darfst",
    "darin",
    "darüber",
    "darum",
    "darunter",
    "das",
    "dasein",
    "daselbst",
    "dass",
    "daß",
    "dasselbe",
    "davon",
    "davor",
    "dazu",
    "dazwischen",
    "dein",
    "deine",
    "deinem",
    "deiner",
    "dem",
    "dementsprechend",
    "demgegenüber",
    "demgemäss",
    "demgemäß",
    "demselben",
    "demzufolge",
    "den",
    "denen",
    "denn",
    "denselben",
    "der",
    "deren",
    "derjenige",
    "derjenigen",
    "dermassen",
    "dermaßen",
    "derselbe",
    "derselben",
    "des",
    "deshalb",
    "desselben",
    "dessen",
    "deswegen",
    "d.h",
    "dich",
    "die",
    "diejenige",
    "diejenigen",
    "dies",
    "diese",
    "dieselbe",
    "dieselben",
    "diesem",
    "diesen",
    "dieser",
    "dieses",
    "dir",
    "doch",
    "dort",
    "drei",
    "drin",
    "dritte",
    "dritten",
    "dritter",
    "drittes",
    "du",
    "durch",
    "durchaus",
    "dürfen",
    "dürft",
    "durfte",
    "durften",
    "e",
    "eben",
    "ebenso",
    "ehrlich",
    "ei",
    "ei,",
    "eigen",
    "eigene",
    "eigenen",
    "eigener",
    "eigenes",
    "ein",
    "einander",
    "eine",
    "einem",
    "einen",
    "einer",
    "eines",
    "einige",
    "einigen",
    "einiger",
    "einiges",
    "einmal",
    "eins",
    "elf",
    "en",
    "ende",
    "endlich",
    "entweder",
    "er",
    "ernst",
    "erst",
    "erste",
    "ersten",
    "erster",
    "erstes",
    "es",
    "etwa",
    "etwas",
    "euch",
    "f",
    "früher",
    "fünf",
    "fünfte",
    "fünften",
    "fünfter",
    "fünftes",
    "für",
    "g",
    "gab",
    "ganz",
    "ganze",
    "ganzen",
    "ganzer",
    "ganzes",
    "gar",
    "gedurft",
    "gegen",
    "gegenüber",
    "gehabt",
    "gehen",
    "geht",
    "gekannt",
    "gekonnt",
    "gemacht",
    "gemocht",
    "gemusst",
    "genug",
    "gerade",
    "gern",
    "gesagt",
    "geschweige",
    "gewesen",
    "gewollt",
    "geworden",
    "gibt",
    "ging",
    "gleich",
    "gott",
    "gross",
    "groß",
    "grosse",
    "große",
    "grossen",
    "großen",
    "grosser",
    "großer",
    "grosses",
    "großes",
    "gut",
    "gute",
    "guter",
    "gutes",
    "h",
    "habe",
    "haben",
    "habt",
    "hast",
    "hat",
    "hatte",
    "hätte",
    "hatten",
    "hätten",
    "heisst",
    "her",
    "heute",
    "hier",
    "hin",
    "hinter",
    "hoch",
    "i",
    "ich",
    "ihm",
    "ihn",
    "ihnen",
    "ihr",
    "ihre",
    "ihrem",
    "ihren",
    "ihrer",
    "ihres",
    "im",
    "immer",
    "in",
    "indem",
    "infolgedessen",
    "ins",
    "irgend",
    "ist",
    "j",
    "ja",
    "jahr",
    "jahre",
    "jahren",
    "je",
    "jede",
    "jedem",
    "jeden",
    "jeder",
    "jedermann",
    "jedermanns",
    "jedoch",
    "jemand",
    "jemandem",
    "jemanden",
    "jene",
    "jenem",
    "jenen",
    "jener",
    "jenes",
    "jetzt",
    "k",
    "kam",
    "kann",
    "kannst",
    "kaum",
    "kein",
    "keine",
    "keinem",
    "keinen",
    "keiner",
    "kleine",
    "kleinen",
    "kleiner",
    "kleines",
    "kommen",
    "kommt",
    "können",
    "könnt",
    "konnte",
    "könnte",
    "konnten",
    "kurz",
    "l",
    "lang",
    "lange",
    "leicht",
    "leide",
    "lieber",
    "los",
    "m",
    "machen",
    "macht",
    "machte",
    "mag",
    "magst",
    "mahn",
    "man",
    "manche",
    "manchem",
    "manchen",
    "mancher",
    "manches",
    "mann",
    "mehr",
    "mein",
    "meine",
    "meinem",
    "meinen",
    "meiner",
    "meines",
    "mensch",
    "menschen",
    "mich",
    "mir",
    "mit",
    "mittel",
    "mochte",
    "möchte",
    "mochten",
    "mögen",
    "möglich",
    "mögt",
    "morgen",
    "muss",
    "muß",
    "müssen",
    "musst",
    "müsst",
    "musste",
    "mussten",
    "n",
    "na",
    "nach",
    "nachdem",
    "nahm",
    "natürlich",
    "neben",
    "nein",
    "neue",
    "neuen",
    "neun",
    "neunte",
    "neunten",
    "neunter",
    "neuntes",
    "nicht",
    "nichts",
    "nie",
    "niemand",
    "niemandem",
    "niemanden",
    "noch",
    "nun",
    "nur",
    "o",
    "ob",
    "oben",
    "oder",
    "offen",
    "oft",
    "ohne",
    "ordnung",
    "p",
    "q",
    "r",
    "recht",
    "rechte",
    "rechten",
    "rechter",
    "rechtes",
    "richtig",
    "rund",
    "s",
    "sa",
    "sache",
    "sagt",
    "sagte",
    "sah",
    "satt",
    "schlecht",
    "schluss",
    "schon",
    "sechs",
    "sechste",
    "sechsten",
    "sechster",
    "sechstes",
    "sehr",
    "sei",
    "seid",
    "seien",
    "sein",
    "seine",
    "seinem",
    "seinen",
    "seiner",
    "seines",
    "seit",
    "seitdem",
    "selbst",
    "sich",
    "sie",
    "sieben",
    "siebente",
    "siebenten",
    "siebenter",
    "siebentes",
    "sind",
    "so",
    "solang",
    "solche",
    "solchem",
    "solchen",
    "solcher",
    "solches",
    "soll",
    "sollen",
    "sollte",
    "sollten",
    "sondern",
    "sonst",
    "sowie",
    "später",
    "statt",
    "t",
    "tag",
    "tage",
    "tagen",
    "tat",
    "teil",
    "tel",
    "tritt",
    "trotzdem",
    "tun",
    "u",
    "über",
    "überhaupt",
    "übrigens",
    "uhr",
    "um",
    "und",
    "und?",
    "uns",
    "unser",
    "unsere",
    "unserer",
    "unter",
    "v",
    "vergangenen",
    "viel",
    "viele",
    "vielem",
    "vielen",
    "vielleicht",
    "vier",
    "vierte",
    "vierten",
    "vierter",
    "viertes",
    "vom",
    "von",
    "vor",
    "w",
    "während",
    "währenddem",
    "währenddessen",
    "wann",
    "war",
    "wäre",
    "waren",
    "wart",
    "warum",
    "was",
    "wegen",
    "weil",
    "weit",
    "weiter",
    "weitere",
    "weiteren",
    "weiteres",
    "welche",
    "welchem",
    "welchen",
    "welcher",
    "welches",
    "wem",
    "wen",
    "wenig",
    "wenige",
    "weniger",
    "weniges",
    "wenigstens",
    "wenn",
    "wer",
    "werde",
    "werden",
    "werdet",
    "wessen",
    "wie",
    "wieder",
    "will",
    "willst",
    "wir",
    "wird",
    "wirklich",
    "wirst",
    "wo",
    "wohl",
    "wollen",
    "wollt",
    "wollte",
    "wollten",
    "worden",
    "wurde",
    "würde",
    "wurden",
    "würden",
    "x",
    "y",
    "z",
    "z.b",
    "zehn",
    "zehnte",
    "zehnten",
    "zehnter",
    "zehntes",
    "zeit",
    "zu",
    "zuerst",
    "zugleich",
    "zum",
    "zunächst",
    "zur",
    "zurück",
    "zusammen",
    "zwanzig",
    "zwar",
    "zwei",
    "zweite",
    "zweiten",
    "zweiter",
    "zweites",
    "zwischen",
    "zwölf",
    "euer",
    "eure",
    "hattest",
    "hattet",
    "jedes",
    "mußt",
    "müßt",
    "sollst",
    "sollt",
    "soweit",
    "weshalb",
    "wieso",
    "woher",
    "wohin",
]


class SpeechWordCloudMaker:
    def __init__(self, speeches, lang):
        self.lang = lang
        # if exists pickled version, load it
        if os.path.exists(f"{lang}_vec.pkl"):
            self.vec = self.from_pickle()
            print("Loaded preprocessed TF-IDF from pickle")
        else:
            self.vec = TfidfVectorizer(stop_words=sw)
            self.vec.fit(speeches["text"])
        self.feature_names = self.vec.get_feature_names_out()

    def get_top_k(self, speech, k):
        speech_vec = self.vec.transform([speech])

        b = speech_vec.T.sum(axis=1)
        df2 = (
            pl.DataFrame(
                {"text": self.feature_names, "value": np.squeeze(np.asarray(b))}
            )
            .sort(by="value", reverse=True)
            .filter(pl.col("value") > 0)
        )

        return df2.head(k)

    def pickle(self):
        pickle.dump(self.vec, open(f"{self.lang}_vec.pkl", "wb"))

    def from_pickle(self):
        return pickle.load(open(f"{self.lang}_vec.pkl", "rb"))
