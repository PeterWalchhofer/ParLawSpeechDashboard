import json
import requests
from flask import Flask, request
from flask_cors import CORS
import os

app = Flask(__name__)
cors_address = os.environ.get("ParLawSpeechDashboard_CORS", "http://localhost:3000")
es_address = os.environ.get("ParLawSpeechDashboard_ES", "http://localhost:9200")
CORS(app, resources={r"/*": {"origins": cors_address}})
app.config["CORS_HEADERS"] = "Content-Type"
print(f"cors_address: {cors_address}")
print(f"es_address: {es_address}")

@app.route("/significant_word/<string:index>", methods=["POST"])
def get_significant_words(index):
    # parse post body
    from_date = request.json["fromDate"]
    to_date = request.json["toDate"]
    keywords = request.json["keywords"]

    url = f"{es_address}/{index}/_search"
    query = {
        "query": {
            "bool": {
                "must": [
                    {
                        "query_string": {
                            "query": " OR ".join(keywords),
                        }
                    }
                ],
                "filter": [
                    {
                        "range": {
                            "date": {
                                "gt": from_date,
                                "lt": to_date,
                            }
                        }
                    }
                ],
            }
        },
    }
    result = requests.post(url, json=query).json()
    k = 20
    agg = {}
    tf = {}
    for item in result["hits"]["hits"]:
        # json to object
        tfidfs = json.loads(item["_source"]["term_tfidf"])
        # tfidfs = tfidfs[:k]
        for tfidf in tfidfs:
            term = tfidf["term"]
            if term not in agg:
                agg[term] = 0
                tf[term] = 0
            agg[term] += tfidf["value"]
            tf[term] += 1
           

    agg = {k: v / tf[k] for k, v in agg.items()}
    agg = sorted(agg.items(), key=lambda x: x[1], reverse=True)[:k]
    return agg
