# biarbala.ir

### just run
run `index.js`
```bash
sudo node index.js
```

### prodoction
- clone at ~/biarbala
- set environment variables `logger_level = prod` and `acme_server = prod` in `.env` file
- copy project files to `/usr/src/biarbala/`
- mount your sites storage device to `/usr/src/biarbala/data` directory
- run `index.js` as `systemd` process :

- just run
```bash
chmod +x install.sh
sudo ./install.sh
```

- or you can put, start and enable the  `biarbala.index.service` in `/lib/systemd/system`
```bash
sudo cp biarbala.index.service /lib/systemd/system
sudo systemctl start biarbala.index
sudo systemctl enable biarbala.index
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

### scripts
TODO: implement. scripts to run and does something to deployments