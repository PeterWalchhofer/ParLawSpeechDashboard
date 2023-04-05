# Data
## Download data
This creates `/data` and one directory per country. Look into `download_data.sh` for the array of countries. 
Note that you need R installed for fixing encoding issues. This may be redundant in a later data release.

```
bash download_data.sh
```

# Environment
## Install python deps
```
pip install -r requirements.txt
```


## Run AmCat4

```
docker-compose up --pull="missing" -d
```

# Upload 
### All data
```
ls data | xargs -I {} python preprocess_upload/preprocess.py {}
```

### Alternative: Upload single country 

```
python preprocess_upload/preprocess.py austria
```


# Flask App

Significant words aggregation unfortunately requires a flask app running. To run it:
```
flask --app flask/app --debug run
```
# NextJS Frontent

First install stuff.

```
npm i
```

Run locally for development.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Next doesn't check typescript in dev mode, so remember to build every now and then to see if you're still cool with the TS gods.

```
npm run build
```
