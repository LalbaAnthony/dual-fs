# Dual FS

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