# API - Descarte Certo

## Autenticação
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/verify`

## Usuários
- GET `/api/users/profile`
- PUT `/api/users/profile`
- GET `/api/users/disposals`
- GET `/api/users/achievements`
- GET `/api/users/rewards`
- GET `/api/users/ranking`
- GET `/api/users/ranking/schools`

## Descartes
- POST `/api/disposals/` (upload de imagem)
- GET `/api/disposals/my`
- GET `/api/disposals/stats`

## Impacto
- GET `/api/impact/data`
- GET `/api/impact/data/period`
- GET `/api/impact/schools`
- GET `/api/impact/materials`
- GET `/api/impact/environmental`

## Pontos de Coleta
- GET `/api/collection/`
- GET `/api/collection/:id`
- POST `/api/collection/` (admin)
- PUT `/api/collection/:id` (admin)
- DELETE `/api/collection/:id` (admin)
- GET `/api/collection/nearby/:lat/:lng`
- GET `/api/collection/stats/overview`

## Contato
- POST `/api/contact/`
- GET `/api/contact/` (admin)
- GET `/api/contact/:id` (admin)
- PATCH `/api/contact/:id/status` (admin)
- POST `/api/contact/:id/respond` (admin)
- GET `/api/contact/stats/overview` (admin)

## Histórias
- POST `/api/stories/` (upload de imagem)
- GET `/api/stories/`
- GET `/api/stories/:id`
- GET `/api/stories/user/my`
- GET `/api/stories/admin/pending` (admin)
- PATCH `/api/stories/:id/approve` (admin)
- PUT `/api/stories/:id` (upload de imagem)
- DELETE `/api/stories/:id`
- GET `/api/stories/stats/overview`

## Admin
- GET `/api/admin/impact`
- PUT `/api/admin/impact/:id`
- GET `/api/admin/stories`
- DELETE `/api/admin/stories/:id`
- GET `/api/admin/rewards`
- POST `/api/admin/rewards`
- DELETE `/api/admin/rewards/:id` 