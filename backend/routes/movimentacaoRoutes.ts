import { Router } from 'express';
import { listar, kpis, criar, excluir } from '../controllers/movimentacaoController.ts';

const router = Router();

router.get('/', listar);
router.get('/kpis', kpis);
router.post('/', criar);
router.delete('/:id', excluir);

export default router;
