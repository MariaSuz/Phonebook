export interface AnnouncementFormModel {
  id: number;
  message: string;
  startsAt: string;
  endsAt: string;
  showBeforeHours: number; // 0 — не показывать заранее, 24 / 72 / 168
}
