## Запуск сервера

1. Установите Node.js и PostgreSQL, создайте базу `phonebook`.
2. Создайте файл `server-new/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/phonebook"
JWT_SECRET="любая_строка"
# для продакшена добавьте: NODE_ENV=production
```

3. Запустите:

```bash
cd server-new
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```