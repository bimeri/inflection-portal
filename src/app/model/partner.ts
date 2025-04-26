export interface Partner {
  id: string;
  partnerName: string;
  partnerType: string;
  conversions: number;
  commissions: number;
  grosssales: number;
  contract: string;
}

export interface MenuItem {
  label: string;
  icon: string;
  link: string;
}
