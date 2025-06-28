const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Obter todos os pontos de coleta
router.get('/', async (req, res) => {
  try {
    const { lat, lng, radius = 10, materials } = req.query;

    let where = { active: true };

    // Filtrar por materiais aceitos
    if (materials) {
      const materialArray = materials.split(',');
      where.materials = {
        contains: JSON.stringify(materialArray)
      };
    }

    let collectionPoints = await prisma.collectionPoint.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    // Filtrar por distância se coordenadas fornecidas
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const maxRadius = parseFloat(radius);

      collectionPoints = collectionPoints.filter(point => {
        const distance = calculateDistance(
          userLat, userLng,
          point.latitude, point.longitude
        );
        return distance <= maxRadius;
      });

      // Ordenar por distância
      collectionPoints.sort((a, b) => {
        const distanceA = calculateDistance(userLat, userLng, a.latitude, a.longitude);
        const distanceB = calculateDistance(userLat, userLng, b.latitude, b.longitude);
        return distanceA - distanceB;
      });
    }

    res.json({ collectionPoints });

  } catch (error) {
    console.error('Erro ao buscar pontos de coleta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter ponto de coleta por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const collectionPoint = await prisma.collectionPoint.findUnique({
      where: { id }
    });

    if (!collectionPoint) {
      return res.status(404).json({ error: 'Ponto de coleta não encontrado' });
    }

    res.json({ collectionPoint });

  } catch (error) {
    console.error('Erro ao buscar ponto de coleta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo ponto de coleta (apenas admin)
router.post('/', authenticateToken, requireRole('admin'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('address').trim().isLength({ min: 5 }).withMessage('Endereço deve ter pelo menos 5 caracteres'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude inválida'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude inválida'),
  body('materials').isArray().withMessage('Materiais deve ser um array'),
  body('phone').optional().trim(),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('website').optional().isURL().withMessage('Website inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      address,
      latitude,
      longitude,
      materials,
      phone,
      email,
      website
    } = req.body;

    const collectionPoint = await prisma.collectionPoint.create({
      data: {
        name,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        materials: JSON.stringify(materials),
        phone,
        email,
        website
      }
    });

    res.status(201).json({
      message: 'Ponto de coleta criado com sucesso',
      collectionPoint
    });

  } catch (error) {
    console.error('Erro ao criar ponto de coleta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar ponto de coleta (apenas admin)
router.put('/:id', authenticateToken, requireRole('admin'), [
  body('name').optional().trim().isLength({ min: 2 }),
  body('address').optional().trim().isLength({ min: 5 }),
  body('latitude').optional().isFloat({ min: -90, max: 90 }),
  body('longitude').optional().isFloat({ min: -180, max: 180 }),
  body('materials').optional().isArray(),
  body('phone').optional().trim(),
  body('email').optional().isEmail(),
  body('website').optional().isURL(),
  body('active').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = { ...req.body };

    // Converter coordenadas se fornecidas
    if (updateData.latitude) updateData.latitude = parseFloat(updateData.latitude);
    if (updateData.longitude) updateData.longitude = parseFloat(updateData.longitude);
    if (updateData.materials) updateData.materials = JSON.stringify(updateData.materials);

    const collectionPoint = await prisma.collectionPoint.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Ponto de coleta atualizado com sucesso',
      collectionPoint
    });

  } catch (error) {
    console.error('Erro ao atualizar ponto de coleta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar ponto de coleta (apenas admin)
router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.collectionPoint.delete({
      where: { id }
    });

    res.json({ message: 'Ponto de coleta deletado com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar ponto de coleta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar pontos de coleta próximos
router.get('/nearby/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const { radius = 5, materials } = req.query;

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxRadius = parseFloat(radius);

    let where = { active: true };

    if (materials) {
      const materialArray = materials.split(',');
      where.materials = {
        contains: JSON.stringify(materialArray)
      };
    }

    const collectionPoints = await prisma.collectionPoint.findMany({
      where
    });

    // Filtrar por distância e ordenar
    const nearbyPoints = collectionPoints
      .map(point => {
        const distance = calculateDistance(
          userLat, userLng,
          point.latitude, point.longitude
        );
        return { ...point, distance };
      })
      .filter(point => point.distance <= maxRadius)
      .sort((a, b) => a.distance - b.distance);

    res.json({
      nearbyPoints,
      userLocation: { lat: userLat, lng: userLng },
      radius: maxRadius
    });

  } catch (error) {
    console.error('Erro ao buscar pontos próximos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Obter estatísticas de pontos de coleta
router.get('/stats/overview', async (req, res) => {
  try {
    const totalPoints = await prisma.collectionPoint.count();
    const activePoints = await prisma.collectionPoint.count({
      where: { active: true }
    });

    // Contar pontos por tipo de material
    const materialStats = {};
    const collectionPoints = await prisma.collectionPoint.findMany();

    collectionPoints.forEach(point => {
      try {
        const materials = JSON.parse(point.materials);
        materials.forEach(material => {
          materialStats[material] = (materialStats[material] || 0) + 1;
        });
      } catch (error) {
        console.error('Erro ao parsear materiais:', error);
      }
    });

    res.json({
      totalPoints,
      activePoints,
      inactivePoints: totalPoints - activePoints,
      materialStats
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Função para calcular distância entre dois pontos (fórmula de Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distância em km
  return distance;
}

module.exports = router; 