# biarbala.ir

### just run
run `index.js`
```bash
node index.js
```
run redbird reverse proxy
```bash
sudo node proxy.js
```

### development run
run `index.js` with proxy
```bash
node index.js --with-proxy
```

### prodoction
- put the biarbala directory in `/home/force`
- set environment variables `logger_level = prod` and `letsencrypt_env = prod` in `.env` file
- mount your sites storage device to `/home/force/biarbala/data` directory
- run `proxy.js` and `index.js` as `systemd` process :

- just run
```bash
chmod +x install.sh
sudo ./install.sh
```

- or you can put, start and enable the `biarbala.proxy.service` and `biarbala.index.service` in `/lib/systemd/system`
```bash
sudo cp biarbala.proxy.service /lib/systemd/system
sudo cp biarbala.index.service /lib/systemd/system
sudo systemctl start biarbala.proxy
sudo systemctl start biarbala.index
sudo systemctl enable biarbala.proxy
sudo systemctl enable biarbala.index
```

### uninstall
```bash
sudo ./uninstall.sh
```

### redbird proxy
you can set `proxy_workers`  environment variable in `.env` file.
it't recomended to set to 1 or 2 based on cpu cores

### cluster
you can set `app_workers` environment variable in `.env` file.

### .env
`.env.template` is a template with possible variables to set

### scripts
TODO: implement. scripts to run and does something to deployments