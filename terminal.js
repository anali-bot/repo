// Simulateur Linux - Gestion du système de fichiers et commandes
class LinuxSimulator {
    constructor() {
        this.fileSystem = {
            '/': {
                type: 'dir',
                contents: {
                    'home': { 
                        type: 'dir', 
                        contents: { 
                            'user': { 
                                type: 'dir', 
                                contents: {
                                    'projects': { type: 'dir', contents: { 'project1.txt': { type: 'file', content: 'Mon projet' } } },
                                    'documents': { type: 'dir', contents: { 'notes.txt': { type: 'file', content: 'Notes importantes' } } },
                                    '.bashrc': { type: 'file', content: 'export PATH="/usr/local/bin:$PATH"\nalias ll="ls -la"' },
                                    'README.md': { type: 'file', content: '# Bienvenue!\n\nCeci est un simulateur Linux web.' }
                                } 
                            } 
                        } 
                    },
                    'var': { type: 'dir', contents: { 'log': { type: 'dir', contents: { 'system.log': { type: 'file', content: '[2024-01-15] System started\n[2024-01-15] All services running' } } } } },
                    'etc': { 
                        type: 'dir', 
                        contents: { 
                            'passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/fish' },
                            'hostname': { type: 'file', content: 'simulator' }
                        } 
                    },
                    'bin': { 
                        type: 'dir', 
                        contents: {
                            'ls': { type: 'file', content: 'executable' },
                            'cd': { type: 'file', content: 'executable' },
                            'fish': { type: 'file', content: 'executable' }
                        } 
                    },
                    'usr': { 
                        type: 'dir', 
                        contents: { 
                            'bin': { type: 'dir', contents: { 'node': { type: 'file', content: 'executable' } } },
                            'share': { type: 'dir', contents: {} }
                        } 
                    },
                    'tmp': { type: 'dir', contents: {} },
                    'root': { type: 'dir', contents: {} }
                }
            }
        };
        this.currentPath = '/home/user';
        this.history = [];
        this.historyIndex = -1;
        this.installedPackages = ['base', 'bash', 'fish', 'zsh', 'vim', 'nano', 'git', 'curl', 'wget', 'node', 'python3', 'gcc'];
        this.isSudo = false;
    }

    // Obtenir le répertoire courant
    getCurrentDir() {
        const parts = this.currentPath.split('/').filter(p => p);
        let current = this.fileSystem['/'];
        for (let part of parts) {
            if (current.contents && current.contents[part]) {
                current = current.contents[part];
            } else {
                return null;
            }
        }
        return current;
    }

    // Exécuter une commande
    execute(command) {
        const cmd = command.trim().split(' ');
        const action = cmd[0];
        const args = cmd.slice(1);

        switch (action) {
            case 'pwd':
                return this.currentPath;
            case 'ls':
                return this.ls(args);
            case 'cd':
                return this.cd(args[0]);
            case 'mkdir':
                return this.mkdir(args[0]);
            case 'echo':
                return args.join(' ');
            case 'clear':
                return 'CLEAR';
            case 'cat':
                return this.cat(args[0]);
            case 'whoami':
                return 'user';
            case 'uname':
                return 'Linux simulator 5.10.0-28-generic #30~20.04.1-Ubuntu SMP Mon Jan 15 13:37:00 UTC 2024 x86_64 GNU/Linux';
            case 'date':
                return new Date().toString();
            case 'help':
                return this.help();
            case 'rm':
                return this.rm(args[0]);
            case 'touch':
                return this.touch(args[0]);
            case 'neofetch':
                return this.neofetch();
            case 'exit':
            case 'logout':
                return 'EXIT';
            case 'nano':
            case 'vim':
            case 'vi':
                return `${action}: Éditeur non disponible dans ce simulateur`;
            case 'find':
                return this.find(args.join(' '));
            case 'tree':
                return this.tree();
            case 'file':
                return this.fileCmd(args[0]);
            case 'wc':
                return this.wc(args[0]);
            case 'head':
                return this.head(args[0], args[1]);
            case 'tail':
                return this.tail(args[0]);
            case 'grep':
                return this.grep(args[0], args[1]);
            case 'hostname':
                return 'simulator';
            case 'whoami':
                return 'user';
            case 'pwd':
                return this.currentPath;
            case 'env':
                return this.env();
            case 'sudo':
                return this.sudo(args);
            case 'apt':
            case 'apt-get':
                return this.apt(args);
            case 'pacman':
                return this.pacman(args);
            case 'dnf':
                return this.dnf(args);
            case 'yum':
                return this.yum(args);
            case 'pip':
            case 'pip3':
                return this.pip(args);
            case 'which':
                return this.which(args[0]);
            case 'whereis':
                return this.whereis(args[0]);
            default:
                return `${action}: commande non trouvée`;
        }
    }

    // Commande ls
    ls(args) {
        const dir = this.getCurrentDir();
        if (!dir || dir.type !== 'dir') {
            return 'Erreur: répertoire non trouvé';
        }
        if (Object.keys(dir.contents).length === 0) {
            return '';
        }
        return Object.keys(dir.contents).map(name => {
            const item = dir.contents[name];
            return item.type === 'dir' ? `<span style="color: #00ff00;">${name}/</span>` : name;
        }).join('  ');
    }

    // Commande cd
    cd(path) {
        if (!path) {
            this.currentPath = '/home/user';
            return '';
        }
        if (path === '..') {
            const parts = this.currentPath.split('/').filter(p => p);
            parts.pop();
            this.currentPath = parts.length === 0 ? '/' : '/' + parts.join('/');
            return '';
        }
        if (path === '/') {
            this.currentPath = '/';
            return '';
        }
        const fullPath = path.startsWith('/') ? path : this.currentPath + '/' + path;
        const parts = fullPath.split('/').filter(p => p);
        let current = this.fileSystem['/'];
        for (let part of parts) {
            if (current.contents && current.contents[part]) {
                current = current.contents[part];
            } else {
                return `cd: pas de tel fichier ou répertoire: ${path}`;
            }
        }
        if (current.type !== 'dir') {
            return `cd: pas un répertoire: ${path}`;
        }
        this.currentPath = '/' + parts.join('/');
        return '';
    }

    // Commande mkdir
    mkdir(name) {
        if (!name) {
            return 'mkdir: argument manquant';
        }
        const dir = this.getCurrentDir();
        if (!dir || dir.type !== 'dir') {
            return 'Erreur: répertoire courant non valide';
        }
        if (dir.contents[name]) {
            return `mkdir: impossible de créer le répertoire '${name}': le fichier existe`;
        }
        dir.contents[name] = { type: 'dir', contents: {} };
        return '';
    }

    // Commande cat
    cat(path) {
        if (!path) {
            return 'cat: argument manquant';
        }
        const fullPath = path.startsWith('/') ? path : this.currentPath + '/' + path;
        const parts = fullPath.split('/').filter(p => p);
        let current = this.fileSystem['/'];
        for (let part of parts) {
            if (current.contents && current.contents[part]) {
                current = current.contents[part];
            } else {
                return `cat: ${path}: Aucun fichier ou répertoire de ce type`;
            }
        }
        if (current.type === 'dir') {
            return `cat: ${path}: C'est un répertoire`;
        }
        return current.content || '';
    }

    // Commande rm
    rm(path) {
        if (!path) {
            return 'rm: argument manquant';
        }
        const dir = this.getCurrentDir();
        if (dir.contents[path]) {
            delete dir.contents[path];
            return '';
        }
        return `rm: impossible de supprimer '${path}': Aucun fichier ou répertoire de ce type`;
    }

    // Commande touch
    touch(path) {
        if (!path) {
            return 'touch: argument manquant';
        }
        const dir = this.getCurrentDir();
        if (!dir.contents[path]) {
            dir.contents[path] = { type: 'file', content: '' };
        }
        return '';
    }

    // Commande find
    find(args) {
        if (!args) return 'find: missing expression';
        
        const results = [];
        const search = (path, dirname) => {
            const dir = this.getCurrentDir();
            if (!dir || dir.type !== 'dir') return;
            
            Object.entries(dir.contents).forEach(([name, item]) => {
                if (name.includes(args) || name.endsWith(args.replace(/\*/, ''))) {
                    results.push(`${dirname}/${name}`);
                }
                if (item.type === 'dir') {
                    this.currentPath = this.currentPath + '/' + name;
                    search(this.currentPath, `${dirname}/${name}`);
                    this.currentPath = this.currentPath.substring(0, this.currentPath.lastIndexOf('/'));
                }
            });
        };
        
        search(this.currentPath, this.currentPath);
        return results.length ? results.join('\n') : 'find: no results';
    }

    // Commande tree
    tree() {
        const tree = (item, prefix = '') => {
            if (item.type === 'file') return '';
            
            let result = '';
            const entries = Object.entries(item.contents);
            entries.forEach(([name, item], i) => {
                const isLast = i === entries.length - 1;
                const connector = isLast ? '└── ' : '├── ';
                result += prefix + connector + name + (item.type === 'dir' ? '/' : '') + '\n';
                
                if (item.type === 'dir') {
                    const ext = isLast ? '    ' : '│   ';
                    result += tree(item, prefix + ext);
                }
            });
            return result;
        };
        
        const dir = this.getCurrentDir();
        return tree(dir);
    }

    // Commande file
    fileCmd(path) {
        if (!path) return 'file: missing filename';
        
        const fullPath = path.startsWith('/') ? path : this.currentPath + '/' + path;
        const parts = fullPath.split('/').filter(p => p);
        let current = this.fileSystem['/'];
        
        for (let part of parts) {
            if (current.contents && current.contents[part]) {
                current = current.contents[part];
            } else {
                return `${path}: cannot open`;
            }
        }
        
        return current.type === 'file' ? `${path}: ASCII text` : `${path}: directory`;
    }

    // Commande wc
    wc(path) {
        if (!path) return 'wc: missing filename';
        
        const content = this.cat(path);
        if (content.startsWith('cat:')) return content;
        
        const lines = content.split('\n').length;
        const words = content.split(/\s+/).length;
        const chars = content.length;
        
        return `${lines} ${words} ${chars} ${path}`;
    }

    // Commande head
    head(path, lines = '10') {
        if (!path) return 'head: missing filename';
        
        const content = this.cat(path);
        if (content.startsWith('cat:')) return content;
        
        const numLines = parseInt(lines) || 10;
        return content.split('\n').slice(0, numLines).join('\n');
    }

    // Commande tail
    tail(path) {
        if (!path) return 'tail: missing filename';
        
        const content = this.cat(path);
        if (content.startsWith('cat:')) return content;
        
        return content.split('\n').slice(-10).join('\n');
    }

    // Commande grep
    grep(pattern, path) {
        if (!pattern || !path) return 'grep: missing arguments';
        
        const content = this.cat(path);
        if (content.startsWith('cat:')) return content;
        
        const lines = content.split('\n').filter(line => line.includes(pattern));
        return lines.length ? lines.join('\n') : '';
    }

    // Commande env
    env() {
        return `PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
HOME=/home/user
SHELL=/bin/fish
USER=user
LOGNAME=user
LANG=fr_FR.UTF-8
TERM=xterm-256color`;
    }

    // Commande neofetch
    neofetch() {
        const os = 'Linux Simulator';
        const kernel = 'Linux 5.10.0';
        const uptime = '2 hours, 30 minutes';
        const shell = 'fish';
        const resolution = window.innerWidth + 'x' + window.innerHeight;
        const cpu = 'Intel Core i7 (simulated)';
        const memory = '16 GB';
        
        return `
<span style="color: #ff6b6b;">        \\$\\$\\$   </span>  <span style="color: #51cf66;">OS</span>: ${os}
<span style="color: #ff6b6b;">       \\$\\$\\$\\$  </span>  <span style="color: #51cf66;">Kernel</span>: ${kernel}
<span style="color: #ff6b6b;">      \\$\\$\\$\\$\\$ </span>  <span style="color: #51cf66;">Uptime</span>: ${uptime}
<span style="color: #ff6b6b;">     \\$\\$\\$\\$\\$\\$ </span>  <span style="color: #51cf66;">Shell</span>: ${shell}
<span style="color: #ff6b6b;">    \\$\\$\\$\\$\\$\\$\\$ </span>  <span style="color: #51cf66;">Resolution</span>: ${resolution}
<span style="color: #ff6b6b;">   \\$\\$\\$\\$\\$\\$\\$\\$ </span>  <span style="color: #51cf66;">CPU</span>: ${cpu}
<span style="color: #ff6b6b;">  \\$\\$\\$\\$\\$\\$\\$\\$\\$ </span>  <span style="color: #51cf66;">Memory</span>: ${memory}
`;
    }

    // Commande sudo
    sudo(args) {
        if (!args.length) return 'sudo: missing command';
        
        this.isSudo = true;
        const cmd = args.join(' ');
        const result = this.execute(cmd);
        this.isSudo = false;
        
        if (result.includes('commande non trouvée')) {
            return result;
        }
        return result;
    }

    // Commande apt (Debian/Ubuntu)
    apt(args) {
        if (!args.length) return 'apt: missing subcommand';
        
        const subcmd = args[0];
        const pkgName = args[1];
        
        switch (subcmd) {
            case 'update':
                return `<span style="color: #51cf66;">Atteint:1 http://archive.ubuntu.com/ubuntu jammy InRelease</span>
Lecture des listes de paquets... Fait
Construction de l'arborescence des dépendances... Fait
Les paquets suivants peuvent être mis à niveau :
  curl git wget nodejs python3-dev
Faire 'apt upgrade' pour les mettre à jour`;
            
            case 'install':
                if (!pkgName) return 'apt install: missing package name';
                if (this.installedPackages.includes(pkgName)) {
                    return `${pkgName} est déjà installé (version 1.0.0)`;
                }
                this.installedPackages.push(pkgName);
                return `<span style="color: #51cf66;">Traitement des déclencheurs pour ${pkgName}...
${pkgName} est maintenant installé (version 2.1.0)</span>`;
            
            case 'remove':
            case 'uninstall':
                if (!pkgName) return 'apt remove: missing package name';
                if (this.installedPackages.includes(pkgName)) {
                    this.installedPackages = this.installedPackages.filter(p => p !== pkgName);
                    return `${pkgName} a été supprimé.`;
                }
                return `${pkgName}: n'est pas installé`;
            
            case 'list':
                return `<span style="color: #51cf66;">Paquets installés:</span>
${this.installedPackages.join('\n')}`;
            
            case 'search':
                if (!pkgName) return 'apt search: missing search term';
                return `${pkgName}/jammy 2.0.0 amd64
  ${pkgName} - package description`;
            
            default:
                return `apt: subcommand '${subcmd}' not recognized`;
        }
    }

    // Commande pacman (Arch Linux)
    pacman(args) {
        if (!args.length) return 'pacman: missing arguments';
        
        const flags = args[0];
        const pkgName = args[1];
        
        if (flags === '-S' || flags === '--sync') {
            if (!pkgName) return 'pacman: missing package name';
            if (this.installedPackages.includes(pkgName)) {
                return `Erreur: ${pkgName} est déjà installé`;
            }
            this.installedPackages.push(pkgName);
            return `<span style="color: #51cf66;">Installation de ${pkgName}...
${pkgName}-2.1.0-1 [installed]
Installation réussie!</span>`;
        }
        
        if (flags === '-R' || flags === '--remove') {
            if (!pkgName) return 'pacman: missing package name';
            if (this.installedPackages.includes(pkgName)) {
                this.installedPackages = this.installedPackages.filter(p => p !== pkgName);
                return `${pkgName} a été supprimé.`;
            }
            return `Erreur: ${pkgName} n'est pas installé`;
        }
        
        if (flags === '-Q' || flags === '--query') {
            return `<span style="color: #51cf66;">Paquets installés:</span>
${this.installedPackages.map(p => `${p} 2.1.0-1`).join('\n')}`;
        }
        
        if (flags === '-Ss' || flags === '--search') {
            if (!pkgName) return 'pacman: missing search term';
            return `<span style="color: #51cf66;">extra/${pkgName} 2.0.0</span>
    ${pkgName} - Arch package`;
        }
        
        return `pacman: option '${flags}' not recognized`;
    }

    // Commande dnf (Fedora)
    dnf(args) {
        if (!args.length) return 'dnf: missing arguments';
        
        const subcmd = args[0];
        const pkgName = args[1];
        
        switch (subcmd) {
            case 'install':
                if (!pkgName) return 'dnf install: missing package name';
                if (this.installedPackages.includes(pkgName)) {
                    return `Package ${pkgName} is already installed`;
                }
                this.installedPackages.push(pkgName);
                return `<span style="color: #51cf66;">Ajout à la transaction...
Installation du package ${pkgName}-2.1.0...
Complété!</span>`;
            
            case 'remove':
                if (!pkgName) return 'dnf remove: missing package name';
                if (this.installedPackages.includes(pkgName)) {
                    this.installedPackages = this.installedPackages.filter(p => p !== pkgName);
                    return `${pkgName} a été supprimé.`;
                }
                return `No package ${pkgName} installed`;
            
            case 'list':
                return `<span style="color: #51cf66;">Installed Packages</span>
${this.installedPackages.join('\n')}`;
            
            case 'search':
                if (!pkgName) return 'dnf search: missing search term';
                return `${pkgName}.x86_64 : ${pkgName} - package description`;
            
            case 'check-update':
                return `${this.installedPackages.slice(0, 3).join('\n')} - update available`;
            
            default:
                return `dnf: subcommand '${subcmd}' not found`;
        }
    }

    // Commande yum (RedHat/CentOS)
    yum(args) {
        if (!args.length) return 'yum: missing arguments';
        
        const subcmd = args[0];
        const pkgName = args[1];
        
        switch (subcmd) {
            case 'install':
                if (!pkgName) return 'yum install: missing package name';
                if (this.installedPackages.includes(pkgName)) {
                    return `Package ${pkgName} already installed and latest version`;
                }
                this.installedPackages.push(pkgName);
                return `<span style="color: #51cf66;">Installing : ${pkgName}-2.1.0
Complete!</span>`;
            
            case 'remove':
                if (!pkgName) return 'yum remove: missing package name';
                if (this.installedPackages.includes(pkgName)) {
                    this.installedPackages = this.installedPackages.filter(p => p !== pkgName);
                    return `Removed: ${pkgName}`;
                }
                return `No packages marked for removal`;
            
            case 'list':
                return `<span style="color: #51cf66;">Installed Packages</span>
${this.installedPackages.join('\n')}`;
            
            case 'search':
                if (!pkgName) return 'yum search: missing search term';
                return `${pkgName}.x86_64 : ${pkgName} - package description`;
            
            default:
                return `yum: subcommand '${subcmd}' not found`;
        }
    }

    // Commande pip (Python)
    pip(args) {
        if (!args.length) return 'pip: missing arguments';
        
        const subcmd = args[0];
        const pkgName = args[1];
        
        switch (subcmd) {
            case 'install':
                if (!pkgName) return 'pip install: missing package name';
                if (this.installedPackages.includes(pkgName)) {
                    return `Requirement already satisfied: ${pkgName} in /usr/lib/python3.10/site-packages (1.0.0)`;
                }
                this.installedPackages.push(pkgName);
                return `<span style="color: #51cf66;">Collecting ${pkgName}
Installing collected packages: ${pkgName}
Successfully installed ${pkgName}-2.1.0</span>`;
            
            case 'uninstall':
                if (!pkgName) return 'pip uninstall: missing package name';
                if (this.installedPackages.includes(pkgName)) {
                    this.installedPackages = this.installedPackages.filter(p => p !== pkgName);
                    return `Successfully uninstalled ${pkgName}-2.1.0`;
                }
                return `WARNING: Skipping ${pkgName} as it is not installed`;
            
            case 'list':
                return `<span style="color: #51cf66;">Python Packages</span>
${this.installedPackages.filter(p => p.includes('python') || p === 'numpy' || p === 'django').join('\n')}`;
            
            case 'search':
                if (!pkgName) return 'pip search: missing search term';
                return `${pkgName} (2.1.0) - ${pkgName} - A python package`;
            
            default:
                return `pip: unknown command '${subcmd}'`;
        }
    }

    // Commande which
    which(cmd) {
        if (!cmd) return 'which: no arguments';
        
        const paths = {
            'ls': '/bin/ls',
            'cd': '/bin/cd',
            'mkdir': '/bin/mkdir',
            'rm': '/bin/rm',
            'cat': '/bin/cat',
            'echo': '/bin/echo',
            'find': '/usr/bin/find',
            'git': '/usr/bin/git',
            'python3': '/usr/bin/python3',
            'node': '/usr/bin/node',
            'npm': '/usr/bin/npm',
            'apt': '/usr/bin/apt',
            'pacman': '/usr/bin/pacman',
            'fish': '/bin/fish',
            'bash': '/bin/bash'
        };
        
        return paths[cmd] || `${cmd}: not found`;
    }

    // Commande whereis
    whereis(cmd) {
        if (!cmd) return 'whereis: no arguments';
        
        return `${cmd}: /usr/bin/${cmd} /usr/share/man/man1/${cmd}.1.gz`;
    }

    // Aide
    help() {
        return `
<span style="color: #51cf66;">Commandes système:</span>
  pwd                - Affiche le répertoire courant
  whoami             - Affiche l'utilisateur courant
  hostname           - Affiche le nom d'hôte
  uname              - Affiche les infos système
  date               - Affiche la date/heure
  env                - Affiche les variables d'environnement
  which [cmd]        - Localise une commande
  whereis [cmd]      - Trouve le chemin d'une commande
  
<span style="color: #51cf66;">Gestion de fichiers:</span>
  ls                 - Liste les fichiers
  cd [dir]           - Change de répertoire
  mkdir [nom]        - Crée un répertoire
  touch [nom]        - Crée un fichier vide
  rm [fichier]       - Supprime un fichier
  cat [fichier]      - Affiche le contenu d'un fichier
  tree               - Arborescence des répertoires
  find [nom]         - Cherche un fichier
  file [chemin]      - Type de fichier
  
<span style="color: #51cf66;">Traitement de texte:</span>
  echo [texte]       - Affiche du texte
  wc [fichier]       - Compte lignes/mots/caractères
  head [fichier]     - Affiche les 10 premières lignes
  tail [fichier]     - Affiche les 10 dernières lignes
  grep [pattern] [fichier] - Recherche un pattern
  
<span style="color: #51cf66;">Gestion de paquets:</span>
  sudo [cmd]         - Exécute avec droits admin
  apt [action] [pkg] - Gestionnaire Debian/Ubuntu
  pacman [flags] [pkg] - Gestionnaire Arch Linux
  dnf [action] [pkg] - Gestionnaire Fedora/RHEL
  yum [action] [pkg] - Gestionnaire RedHat/CentOS
  pip [action] [pkg] - Gestionnaire Python
  
  Actions: install, remove, list, search, update
  
<span style="color: #51cf66;">Exemple:</span>
  apt install nodejs
  pacman -S firefox
  pip install django
  sudo apt update
  
<span style="color: #51cf66;">Autre:</span>
  neofetch           - Affiche les infos système avec logo
  clear              - Efface l'écran
  exit/logout        - Quitter et réinitialiser
  help               - Affiche cette aide
        `;
    }

    // Gérer l'historique
    addToHistory(command) {
        this.history.push(command);
        this.historyIndex = this.history.length;
    }

    getPreviousCommand() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            return this.history[this.historyIndex];
        }
        return '';
    }

    getNextCommand() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            return this.history[this.historyIndex];
        }
        this.historyIndex = this.history.length;
        return '';
    }
}

// Initialiser le terminal
const simulator = new LinuxSimulator();

function getPrompt() {
    const home = simulator.currentPath === '/home/user' ? '~' : simulator.currentPath;
    return `<span style="color: #00ff00;">user@simulator</span> <span style="color: #0088ff;">${home}</span> <span style="color: #00ff00;">❯</span>`;
}

function executeCommand(command) {
    const output = document.getElementById('terminal-output');
    const input = document.getElementById('terminal-input');
    
    simulator.addToHistory(command);
    
    // Afficher la commande
    output.innerHTML += `<div>${getPrompt()} ${command}</div>`;
    
    // Exécuter la commande
    const result = simulator.execute(command);
    
    if (result === 'CLEAR') {
        output.innerHTML = '';
    } else if (result === 'EXIT') {
        output.innerHTML += `<div><span style="color: #ff6b6b;">Fermeture de la session...</span></div>`;
        output.innerHTML += `<div><span style="color: #ff6b6b;">Au revoir!</span></div>`;
        input.disabled = true;
        
        // Attendre 1.5 secondes puis recharger la page
        setTimeout(() => {
            location.reload();
        }, 1500);
    } else if (result) {
        output.innerHTML += `<div>${result}</div>`;
    }
    
    // Scroller vers le bas
    output.scrollTop = output.scrollHeight;
    
    input.value = '';
}

function initTerminal() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');

    if (!input) return;

    // Lancer neofetch automatiquement
    output.innerHTML = '';
    executeCommand('neofetch');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                executeCommand(command);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            input.value = simulator.getPreviousCommand();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            input.value = simulator.getNextCommand();
        }
    });

    // Focus sur l'input au clic
    output.addEventListener('click', () => input.focus());
}

// Initialiser quand le DOM est prêt
document.addEventListener('DOMContentLoaded', initTerminal);