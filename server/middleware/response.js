// Middleware para padronizar respostas da API
function apiResponse(req, res, next) {
  res.success = (data = null) => {
    res.json({ success: true, data, error: null });
  };
  res.fail = (error = 'Erro desconhecido', status = 400, data = null) => {
    res.status(status).json({ success: false, data, error });
  };
  next();
}

module.exports = apiResponse; 