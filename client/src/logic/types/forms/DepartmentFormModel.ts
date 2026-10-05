export interface DepartmentCreateModel {
  name: string;
  sortOrder: number;
}

export interface Department extends DepartmentCreateModel {
  id: number;
}

export type DepartmentUpdateModel = DepartmentCreateModel;