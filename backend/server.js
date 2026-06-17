const path = require('path');
const express = require('express');
const cors = require('cors');

// Database
const DatabaseManager = require('./database');

// Services
const AuthService = require('./services/AuthService');
const ClientService = require('./services/ClientService');
const TechnicianService = require('./services/TechnicianService');
const OrderService = require('./services/OrderService');
const ServiceRequestService = require('./services/ServiceRequestService');
const EmailService = require('./services/EmailService');
const ReportService = require('./services/ReportService');

// Controllers
const AuthController = require('./controllers/AuthController');
const ClientController = require('./controllers/ClientController');
const TechnicianController = require('./controllers/TechnicianController');
const OrderController = require('./controllers/OrderController');
const ServiceRequestController = require('./controllers/ServiceRequestController');
const ReportController = require('./controllers/ReportController');

// Initialize
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || null;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'database', 'molatech.db');
const db = new DatabaseManager(DB_PATH);

// Services instances
const authService = new AuthService(db);
const clientService = new ClientService(db);
const technicianService = new TechnicianService(db);
const emailService = new EmailService();
const orderService = new OrderService(db, emailService);
const serviceRequestService = new ServiceRequestService(db);
const reportService = new ReportService(db);

// Controllers instances
const authController = new AuthController(authService);
const clientController = new ClientController(clientService);
const technicianController = new TechnicianController(technicianService);
const orderController = new OrderController(orderService);
const serviceRequestController = new ServiceRequestController(serviceRequestService);
const reportController = new ReportController(reportService);

// Middleware
const allowedOrigin = process.env.CORS_ORIGIN;
app.disable('x-powered-by');
app.use(cors({
  origin: allowedOrigin ? allowedOrigin.split(',').map(origin => origin.trim()) : true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const serviceRequestRateLimit = (() => {
  const attempts = new Map();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 5;

  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const current = attempts.get(key) || [];
    const recent = current.filter(timestamp => now - timestamp < windowMs);

    if (recent.length >= maxAttempts) {
      return res.status(429).json({ error: 'Muitas solicitacoes em pouco tempo. Tente novamente em alguns minutos.' });
    }

    recent.push(now);
    attempts.set(key, recent);
    next();
  };
})();

// Health check for web hosting platforms
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'MolaTech OS',
    version: '1.0.0'
  });
});

app.get('/api/config/public', (req, res) => {
  res.json({
    whatsappCentralNumber: process.env.WHATSAPP_CENTRAL_NUMBER || '5511999999999',
    whatsappCentralName: process.env.WHATSAPP_CENTRAL_NAME || 'Central MolaTech'
  });
});

// Routes - Auth
app.post('/api/auth/login', (req, res) => authController.login(req, res));

// Routes - Clients
app.get('/api/clientes', (req, res) => clientController.getAll(req, res));
app.post('/api/clientes', (req, res) => clientController.create(req, res));

// Routes - Technicians
app.get('/api/tecnicos', (req, res) => technicianController.getAll(req, res));
app.get('/api/tecnicos/ativos', (req, res) => technicianController.getActive(req, res));
app.post('/api/tecnicos', (req, res) => technicianController.create(req, res));

// Routes - Orders
app.get('/api/ordens', (req, res) => orderController.getAll(req, res));
app.get('/api/ordens/abertas', (req, res) => orderController.getOpen(req, res));
app.get('/api/ordens/concluidas', (req, res) => orderController.getClosed(req, res));
app.get('/api/ordens/:id', (req, res) => orderController.getById(req, res));
app.post('/api/ordens', (req, res) => orderController.create(req, res));
app.put('/api/ordens/:id/finalizar-pago', (req, res) => orderController.finalizeAsPaid(req, res));

// Routes - Service Requests (Public)
app.get('/api/solicitacoes', (req, res) => serviceRequestController.getAll(req, res));
app.get('/api/solicitacoes/pendentes', (req, res) => serviceRequestController.getPending(req, res));
app.get('/api/solicitacoes/tipos', (req, res) => serviceRequestController.getServiceTypes(req, res));
app.get('/api/solicitacoes/:id', (req, res) => serviceRequestController.getById(req, res));
app.post('/api/solicitacoes', serviceRequestRateLimit, (req, res) => serviceRequestController.create(req, res));
app.put('/api/solicitacoes/:id/status', (req, res) => serviceRequestController.updateStatus(req, res));

// Routes - Finance and Reports
app.get('/api/financeiro/resumo', (req, res) => reportController.getFinanceSummary(req, res));
app.get('/api/relatorios/financeiro', (req, res) => reportController.getFinanceReport(req, res));
app.get('/api/relatorios/clientes', (req, res) => reportController.getClientReport(req, res));
app.get('/api/relatorios/tecnicos', (req, res) => reportController.getTechnicianReport(req, res));

// Dashboard metrics
app.get('/api/dashboard', async (req, res) => {
  try {
    const metrics = await db.getDashboardMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível carregar o dashboard.' });
  }
});

// Static routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.get('*', (req, res) => {
  const filePath = path.join(__dirname, '..', 'frontend', req.path);
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint não encontrado' });
  }
  res.sendFile(filePath, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
    }
  });
});

const listenArgs = HOST ? [PORT, HOST] : [PORT];
const server = app.listen(...listenArgs, () => {
  console.log(`🔧 MolaTech OS Backend v1.0`);
  console.log(`✨ Rodando em http://${HOST || 'localhost'}:${PORT}`);
  console.log(`🗄️ Banco SQLite: ${DB_PATH}`);
  console.log(`📊 Login padrão: admin@molatech.com / admin123`);
});

const shutdown = async () => {
  console.log('Encerrando MolaTech OS...');
  server.close(async () => {
    await db.close();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
