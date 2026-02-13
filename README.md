# Dual FS

## 🚀 Use

...

## 👨‍💻 Contributing

### Github settings

Ensure Gihub have right to opere on the repo code:
1. Repo => Settings => Actions => General
2. Workflow permissions => "Read and write permissions"
3. Enable "Allow GitHub Actions to create and approve pull requests"
4. Save

### Push a new version

```sh
git add .
git commit -m "Some changes"

npm version patch  # 1.0.0 -> 1.0.1
# ou
npm version minor  # 1.0.0 -> 1.1.0
# ou
npm version major  # 1.0.0 -> 2.0.0

git push origin main
git push origin --tags
```