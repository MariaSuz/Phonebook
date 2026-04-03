import express from "express";
import routes from "./src/routes/routes";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

//даём доступ фронту
if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Content-Disposition'], //для файлов
    }),
  );
};
app.use(express.json());
app.use("/api", routes);
//Раскомментировать для продакшена
// // Обработка ошибок (важно для IIS)
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   console.error('Error:', err.message);
//   res.status(500).json({ error: 'Internal server error' });
// });

// // 404 для несуществующих API маршрутов
// app.use(/^\/api\/.*/, (req: Request, res: Response) => {
//   res.status(404).json({ error: 'API endpoint not found' });
// });;

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log('Server started successfully');
  });
}
