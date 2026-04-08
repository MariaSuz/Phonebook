export interface Department {
  id: number;
  name: string;
  sortOrder?: number;
}

export interface DepartmentCreateInput {
  name: string;
  sortOrder?: number;
}
export interface DepartmentUpdateInput {
  name?: string;
  sortOrder?: number;
}
