const chokidar = require('chokidar');
const SftpClient = require('ssh2-sftp-client');
const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

const CONFIG = {
    type: 'sftp', // ou 'ftp'
    host: '192.168.0.1',
    port: 22, // 21 pour FTP
    username: 'info',
    password: 'STr232!13',
    localDir: '.',
    remoteDir: '/web/testAnthony',
    ignore: ['node_modules/**', '.git/**', '*.log', 'sync-watch.js']
};

class Server {
    constructor(config) {
        this.config = config;
        this.isSftp = config.type === 'sftp';
    }

    async connect() {
        if (this.isSftp) {
            this.client = new SftpClient();
            await this.client.connect({
                host: this.config.host,
                port: this.config.port,
                username: this.config.username,
                password: this.config.password
            });
        } else {
            this.client = new ftp.Client();
            this.client.ftp.verbose = true;
            await this.client.access({
                host: this.config.host,
                port: this.config.port,
                user: this.config.username,
                password: this.config.password,
                secure: false
            });
        }
    }

    async disconnect() {
        if (this.isSftp) {
            await this.client.end();
        } else {
            this.client.close();
        }
    }

    async ensureRemoteDir(remotePath) {
        const remoteDir = path.dirname(remotePath).replace(/\\/g, '/');
        try {
            if (this.isSftp) {
                await this.client.mkdir(remoteDir, true);
            } else {
                await this.client.ensureDir(remoteDir);
            }
        } catch (err) {
        }
    }

    async upload(localPath, remotePath) {
        try {
            await this.connect();

            if (!fs.existsSync(localPath)) {
                console.error(`❌ Fichier local introuvable: ${localPath}`);
                return;
            }

            await this.ensureRemoteDir(remotePath);

            const normalizedRemotePath = remotePath.replace(/\\/g, '/');
            if (this.isSftp) {
                await this.client.put(localPath, normalizedRemotePath);
            } else {
                await this.client.uploadFrom(localPath, normalizedRemotePath);
            }

            console.log(`📤 Upload: ${localPath} → ${remotePath}`);
        } catch (err) {
            console.error(`❌ Erreur ${this.config.type.toUpperCase()}:`, err.message);
            console.error(err);
        } finally {
            await this.disconnect();
        }
    }

    async delete(remotePath) {
        try {
            await this.connect();

            const normalizedRemotePath = remotePath.replace(/\\/g, '/');

            if (this.isSftp) {
                await this.client.delete(normalizedRemotePath);
            } else {
                await this.client.remove(normalizedRemotePath);
            }

            console.log(`🗑️ Suppression: ${normalizedRemotePath}`);
        } catch (err) {
            console.error(`❌ Erreur suppression ${this.config.type.toUpperCase()}:`, err.message);
            console.error(err);
        } finally {
            await this.disconnect();
        }
    }
}

const server = new Server(CONFIG);

console.log(`\n👀 Surveillance du dossier: ${path.resolve(CONFIG.localDir)}`);
console.log(`\n📁 Fichiers ignorés: ${CONFIG.ignore.join(', ')}`);

const watcher = chokidar.watch(CONFIG.localDir, {
    ignored: CONFIG.ignore,
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100
    }
});

watcher
    .on('ready', () => {
        console.log('\n🚀 Prêt ! Modifiez un fichier pour commencer...');
    })
    .on('change', async (filePath) => {
        const relativePath = path.relative(CONFIG.localDir, filePath);
        const remotePath = path.join(CONFIG.remoteDir, relativePath);
        await server.upload(filePath, remotePath);
    })
    .on('unlink', async (filePath) => {
        const relativePath = path.relative(CONFIG.localDir, filePath);
        const remotePath = path.join(CONFIG.remoteDir, relativePath);
        await server.delete(remotePath);
    })
    .on('error', (error) => {
        console.error('\n❌ Erreur watcher:', error);
    });