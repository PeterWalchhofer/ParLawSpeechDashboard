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

One can specify CLI options, see `python preprocess_upload/preprocess.py --help` for details.

```
python preprocess_upload/preprocess.py --path data --amcat-host http://localhost/amcat CZ
```



# NextJS Frontent
OPTIONAL: should be run with docker-compose at port 3000
1 First install stuff.

```
npm i
```
2 Rename `.env` to `.env.local`

3 Run locally for development.

```bash
npm run dev
```

4 Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Next doesn't check typescript in dev mode, so remember to build every now and then to see if you're still cool with the TS gods.

```
npm run build
```

# Linux Server (Ubuntu)

Required packages

```bash
sudo apt install unzip curl ca-certificates curl gnupg
```

## R Installation

Add public key and repository:

```
wget -qO- https://cloud.r-project.org/bin/linux/ubuntu/marutter_pubkey.asc | sudo tee -a /etc/apt/trusted.gpg.d/cran_ubuntu_key.asc
sudo add-apt-repository "deb https://cloud.r-project.org/bin/linux/ubuntu $(lsb_release -cs)-cran40/"
```

install R with dependencies:

```
sudo apt install libxml2-dev g++ libcurl4-openssl-dev r-base-dev r-base 
```

Install R packages with `rpackages.r`


## Docker

See [official documentation](https://docs.docker.com/engine/install/ubuntu/)

Get GPG keys

```
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

Add repository to apt:

```
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Install docker and docker compose (latest version based on Go)

```
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Test installation

```
sudo docker run hello-world
docker compose version
```