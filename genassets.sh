json="["; for f in `find images | grep png`; do json=$json$comma'"'$f'"'; comma=","; done; json=$json"]"; echo $json>assets.json
