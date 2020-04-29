# biarbala.ir

### just run
run `index.js`
```bash
sudo node index.js
```

### prodoction
- clone at ~/biarbala
- set environment variables `logger_level = prod` and `acme_server = prod` in `.env` file
- mount your sites storage device to `/path/to/biarbala/data` directory
- run `index.js` using `pm2` process :

- just run
```bash
chmod +x install.sh
./install.sh
```

- or you can do it manually
```bash
npm run pm2 start index.js --name biarbala
```

- change the password of `www` deployment. `biarbala.ir/password/www/superman/{newpass}`

### uninstall
```bash
sudo ./uninstall.sh
```

### cluster
you can set `app_workers` environment variable in `.env` file.

### .env
`.env.template` is a template with possible variables to set

### pm2
logs are at `~/.pm2/logs/`

### scripts
TODO: implement. scripts to run and does something to deployments