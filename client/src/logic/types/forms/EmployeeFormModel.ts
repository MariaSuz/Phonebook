export interface EmployeeCreateModel {
  departmentId: number;
  cabinet: string;
  position: string;
  fullName: string;
  internalPhone: string;
  cityPhone: string;
  mobilePhone: string;
  email: string;
  sortOrder: number;
}

export interface Employee extends EmployeeCreateModel {
  id: number;
}

export type EmployeeUpdateModel = EmployeeCreateModel;