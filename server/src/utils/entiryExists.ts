import { AppError } from "./errorHelper";

export const checkEntityExistence = async <T>(
  id: number,
  getById: (id: number) => Promise<T | null>,
  entityName: string,
): Promise<T> => {
  const entryId = await getById(id);
  if (!entryId) {
    throw new AppError(`${entityName} не найден`, 404);
  }
  return entryId;
};