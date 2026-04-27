import { Router } from "express";
import {
  allDepartments,
  createDepartment,
  departmentById,
  editDepartment,
  deleteDepartment,
} from '../controllers/departmentsController';
import {
  allEmployees,
  createEmployee,
  deleteEmployee,
  employeeById,
  editEmployee,
  getEmployeesByDepartment,
} from '../controllers/employeesController';
import {
  allFiles,
  deleteFile,
  fileById,
  downloadFile,
  uploadFile,
} from '../controllers/fileController';
import {
  deleteUser,
  editUser,
  getUsers,
  register,
  login,
} from '../controllers/authController';
import { getRoles } from "../controllers/rolesController";
import {
  authenticateToken,
  requireAdmin,
  canEditUser,
} from '../middleware/authMiddleware';
import { employeeValidator } from "../middleware/validator/employeeValidator";
import { validateDepartmentId, validateId } from "../middleware/validator/idValidator";
import { validate } from "../middleware/validate";
import { departmentValidator } from "../middleware/validator/departmentValidator";
import { getAuditLog } from "../controllers/auditLogController";


const router = Router();

// Маршруты для отделов
router.get("/departments", allDepartments);
router.post(
  '/departments',
  authenticateToken,
  departmentValidator,
  validate,
  createDepartment,
);
router.get('/departments/:id', validateId, validate, departmentById);
router.put(
  '/departments/:id',
  authenticateToken,
  validateId,
  departmentValidator,
  validate,
  editDepartment,
);
router.delete(
  '/departments/:id',
  authenticateToken,
  validateId,
  validate,
  deleteDepartment,
);
// Маршруты для пользователей справочника
router.get('/employees', allEmployees);
router.post(
  '/employees',
  authenticateToken,
  employeeValidator,
  validate,
  createEmployee,
);
router.get('/employees/:id', validateId, validate, employeeById);
router.put(
  '/employees/:id',
  authenticateToken,
  validateId,
  employeeValidator,
  validate,
  editEmployee,
);
router.delete(
  '/employees/:id',
  authenticateToken,
  validateId,
  validate,
  deleteEmployee,
);
//Все пользователи в определенном отделе
router.get(
  '/employees/department/:departmentId',
  validateDepartmentId,
  validate,
  getEmployeesByDepartment,
);
//Апи для файлов
router.get('/files', allFiles);
router.get('/files/:id', fileById);
router.get('/files/:id/download', downloadFile);
router.post('/files/upload', authenticateToken, uploadFile);
router.delete('/files/:id', authenticateToken, deleteFile);
//Авторизация
router.post(
  '/register',
  authenticateToken,
  requireAdmin,
  register,
); // Только админ
router.post('/login', login);
router.put('/users/:id', authenticateToken, canEditUser, editUser);
router.get('/users', authenticateToken, getUsers);
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser); // Только админ
//Роли
router.get('/role', getRoles);
//журнал аудита
router.get('/audit', getAuditLog);

export default router;
