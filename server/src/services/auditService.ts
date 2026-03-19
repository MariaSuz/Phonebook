import { create } from '../models/Audit';
import { CreateAudit } from '../types/auditType';
import isEqual from 'lodash/isEqual';

export const auditService = {
  async log(data: CreateAudit) {
    try {
      let diff: Record<string, any> | null = null;
      if (data.action === 'UPDATE' && data.oldData && data.newData) {
        diff = {};
        const allKeys = [
          ...new Set([
            ...Object.keys(data.oldData),
            ...Object.keys(data.newData),
          ]),
        ];
        for (const key of allKeys) {
          if (!isEqual(data.oldData[key], data.newData[key])) {
            diff[key] = data.newData[key];
          }
        }
        if (Object.keys(diff).length === 0) {
          diff = null;
        }
      }
      const result = await create({
        ...data,
        diff,
      });
      return result;
    } catch (error) {
    }
  },
};
