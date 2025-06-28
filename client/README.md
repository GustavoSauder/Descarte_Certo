# Descarte Certo - Frontend

## Google Analytics

Para ativar o Google Analytics, adicione a variável no arquivo `.env`:

```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Exemplos de uso dos serviços de API

```js
import { userService, disposalService, impactService } from './src/services';

// Login
userService.login({ email: 'user@email.com', password: '123456' });

// Buscar perfil
userService.getProfile();

// Listar descartes
disposalService.listDisposals();

// Buscar dados de impacto
impactService.getImpact();
```

Todos os serviços estão em `src/services/` e seguem o padrão de funções assíncronas baseadas em axios. 