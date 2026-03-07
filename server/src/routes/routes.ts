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


const router = Router();

// Маршруты для отделов
router.get("/departments", allDepartments);
router.post('/departments', createDepartment);
router.get('/departments/:id', departmentById);
router.put('/departments/:id', editDepartment);
router.delete('/departments/:id', deleteDepartment);
// Маршруты для пользователей справочника
router.get('/employees', allEmployees);
router.post('/employees', createEmployee);
router.get('/employees/:id', employeeById);
router.put('/employees/:id', editEmployee);
router.delete('/employees/:id', deleteEmployee);
//Все пользователи в определенном отделе
router.get('/employees/department/:departmentId', getEmployeesByDepartment);
//Апи для файлов
router.get('/files', allFiles);
router.get('/files/:id', fileById);
router.get('/files/:id/download', downloadFile);
router.post('/files/upload', uploadFile);
router.delete('/files/:id', deleteFile);
//Авторизация
router.post(
  '/register',
  authenticateToken,
  requireAdmin,
  register,
); // Только админ
router.post('login', login);
router.put('/users/:id', authenticateToken, canEditUser, editUser);
router.get('/users', authenticateToken, getUsers);
router.delete('/users/:id', authenticateToken, requireAdmin, deleteUser); // Только админ
//Роли
router.get('/role', getRoles);

export default router;
