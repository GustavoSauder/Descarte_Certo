// Sistema de Propriedade e Controle Total
// Apenas o proprietário autorizado pode modificar este arquivo

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class ProjectOwnership {
  constructor() {
    this.ownerId = process.env.OWNER_ID || 'GUSTAVO_OWNER_2025';
    this.ownerEmail = process.env.OWNER_EMAIL || 'gustavo@descarte-certo.com';
    this.ownerKey = process.env.OWNER_KEY || crypto.randomBytes(32).toString('hex');
    this.projectHash = this.generateProjectHash();
    this.lastModified = new Date().toISOString();
    this.accessLog = [];
  }

  // Gerar hash único do projeto
  generateProjectHash() {
    const projectFiles = this.getProjectFiles();
    const content = projectFiles.map(file => file.content).join('');
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  // Listar todos os arquivos do projeto
  getProjectFiles() {
    const files = [];
    const scanDirectory = (dir) => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          scanDirectory(fullPath);
        } else if (stat.isFile() && this.isCodeFile(item)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            files.push({
              path: fullPath,
              content: content,
              size: stat.size,
              modified: stat.mtime
            });
          } catch (error) {
            console.error(`Erro ao ler arquivo: ${fullPath}`);
          }
        }
      });
    };

    scanDirectory(process.cwd());
    return files;
  }

  // Verificar se é arquivo de código
  isCodeFile(filename) {
    const codeExtensions = [
      '.js', '.jsx', '.ts', '.tsx', '.json', '.prisma', '.sql',
      '.html', '.css', '.scss', '.md', '.txt', '.env', '.yml', '.yaml'
    ];
    return codeExtensions.some(ext => filename.endsWith(ext));
  }

  // Verificar integridade do projeto
  verifyIntegrity() {
    const currentHash = this.generateProjectHash();
    const isIntact = currentHash === this.projectHash;
    
    if (!isIntact) {
      console.error('🚨 ALERTA: Integridade do projeto comprometida!');
      console.error('Hash esperado:', this.projectHash);
      console.error('Hash atual:', currentHash);
      
      // Log de segurança
      this.logSecurityEvent('INTEGRITY_COMPROMISED', {
        expectedHash: this.projectHash,
        currentHash: currentHash,
        timestamp: new Date().toISOString()
      });
    }
    
    return isIntact;
  }

  // Verificar propriedade
  verifyOwnership(userId, userEmail) {
    const isOwner = userId === this.ownerId && userEmail === this.ownerEmail;
    
    if (!isOwner) {
      this.logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', {
        userId: userId,
        userEmail: userEmail,
        timestamp: new Date().toISOString(),
        ip: 'unknown'
      });
    }
    
    return isOwner;
  }

  // Log de eventos de segurança
  logSecurityEvent(event, data) {
    const logEntry = {
      event: event,
      data: data,
      timestamp: new Date().toISOString(),
      projectHash: this.projectHash
    };

    this.accessLog.push(logEntry);
    
    // Salvar em arquivo de log
    const logPath = path.join(process.cwd(), 'security.log');
    fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
    
    console.log('🔒 SECURITY LOG:', logEntry);
  }

  // Middleware de verificação de propriedade
  ownershipMiddleware() {
    return (req, res, next) => {
      // Verificar se o usuário é o proprietário
      if (req.user && !this.verifyOwnership(req.user.id, req.user.email)) {
        return res.status(403).json({
          error: 'Acesso negado. Apenas o proprietário pode realizar esta ação.',
          code: 'OWNERSHIP_REQUIRED',
          owner: this.ownerEmail
        });
      }

      // Verificar integridade do projeto
      if (!this.verifyIntegrity()) {
        return res.status(500).json({
          error: 'Integridade do projeto comprometida. Contate o proprietário.',
          code: 'INTEGRITY_ERROR'
        });
      }

      next();
    };
  }

  // Gerar relatório de segurança
  generateSecurityReport() {
    return {
      owner: {
        id: this.ownerId,
        email: this.ownerEmail
      },
      project: {
        hash: this.projectHash,
        lastModified: this.lastModified,
        integrity: this.verifyIntegrity()
      },
      security: {
        totalEvents: this.accessLog.length,
        recentEvents: this.accessLog.slice(-10),
        unauthorizedAttempts: this.accessLog.filter(log => 
          log.event === 'UNAUTHORIZED_ACCESS_ATTEMPT'
        ).length
      },
      timestamp: new Date().toISOString()
    };
  }

  // Atualizar propriedade (apenas proprietário)
  updateOwnership(newOwnerId, newOwnerEmail, currentOwnerKey) {
    if (currentOwnerKey !== this.ownerKey) {
      throw new Error('Chave de proprietário inválida');
    }

    this.ownerId = newOwnerId;
    this.ownerEmail = newOwnerEmail;
    this.ownerKey = crypto.randomBytes(32).toString('hex');
    this.lastModified = new Date().toISOString();

    this.logSecurityEvent('OWNERSHIP_UPDATED', {
      newOwnerId: newOwnerId,
      newOwnerEmail: newOwnerEmail,
      timestamp: new Date().toISOString()
    });

    return true;
  }

  // Backup de segurança
  createSecurityBackup() {
    const backup = {
      ownership: {
        ownerId: this.ownerId,
        ownerEmail: this.ownerEmail,
        ownerKey: this.ownerKey,
        projectHash: this.projectHash,
        lastModified: this.lastModified
      },
      accessLog: this.accessLog,
      timestamp: new Date().toISOString()
    };

    const backupPath = path.join(process.cwd(), 'security-backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
    
    return backupPath;
  }

  // Restaurar backup de segurança
  restoreSecurityBackup(backupPath) {
    try {
      const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      
      this.ownerId = backup.ownership.ownerId;
      this.ownerEmail = backup.ownership.ownerEmail;
      this.ownerKey = backup.ownership.ownerKey;
      this.projectHash = backup.ownership.projectHash;
      this.lastModified = backup.ownership.lastModified;
      this.accessLog = backup.accessLog;

      this.logSecurityEvent('SECURITY_BACKUP_RESTORED', {
        backupPath: backupPath,
        timestamp: new Date().toISOString()
      });

      return true;
    } catch (error) {
      throw new Error('Erro ao restaurar backup: ' + error.message);
    }
  }
}

// Instância global do sistema de propriedade
const projectOwnership = new ProjectOwnership();

// Verificar integridade na inicialização
if (!projectOwnership.verifyIntegrity()) {
  console.error('🚨 ALERTA CRÍTICO: Integridade do projeto comprometida na inicialização!');
  process.exit(1);
}

module.exports = projectOwnership; 