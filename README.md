# Dual FS

Dual FS is a tool that allows you to synchronize your local files with a remote server in real-time.

It uses SFTP to connect to the remote server and watch for changes in the local directory. When a change is detected, it automatically uploads the changed file to the remote server.

The goal is to mimic a Vite development server: you can edit your files and see the changes reflected on the remote server without needing to manually upload files or restart any services.

## 🚀 Use

- Go to **Releases**
- Download the lastest available release
- Drop the `dual-fs.exe` on your project root
- Create a `dual-fs-config.json` file as:
```json
{
    "type": "sftp",
    "host": "192.168.0.1",
    "port": 22,
    "username": "user",
    "password": "password",
    "localDir": ".",
    "remoteDir": "/path/to/project",
    "ignore": ["dual-fs.exe", "dual-fs-config.json"]
}
```

## 👨‍💻 Contributing

### Install

```sh
git clone git@github.com:LalbaAnthony/dual-fs.git
npm i
npm run dev
```

### Github settings

Ensure Gihub have right to opere on the repo code:
1. Repo => Settings => Actions => General
2. Workflow permissions => "Read and write permissions"
3. Enable "Allow GitHub Actions to create and approve pull requests"
4. Save

### Push a new version

Full workflow:
```sh
git add .
git commit -m "Some changes"

npm version patch # or 'minor' or 'major'

git push origin main
git push origin --tags
```

## ⚠️ Important

`pkg` npm package does not support ES modules, so the code must be written in CommonJS.