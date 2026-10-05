export interface TechSiteCreateModel {
  name: string;
  url: string;
  icon?: string;
  description?: string;
  sortOrder?: number;
}

export interface TechSite extends TechSiteCreateModel {
  id: number;
}
