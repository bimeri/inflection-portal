import {Partner} from "../../app/model/partner";

export const constants = {
  LIST_OF_COLUMNS: [
    {
      title: 'ID',
      compare: (a: Partner, b: Partner) => a.id.localeCompare(b.partnerName),
    },
    {
      title: 'Name',
      compare: (a: Partner, b: Partner) => a.partnerName.localeCompare(b.partnerName),
    },
    {
      title: 'Type',
      compare: (a: Partner, b: Partner) => a.partnerType.localeCompare(b.partnerType),
    },
    {
      title: 'Contract',
      compare: (a: Partner, b: Partner) => a.contract.localeCompare(b.contract),
    },
    {
      title: 'Gross Sales',
      compare: (a: Partner, b: Partner) => a.grosssales - b.grosssales,
    },
    {
      title: 'Commissions',
      compare: (a: Partner, b: Partner) => a.commissions - b.commissions,
    },
    {
      title: 'Conversions',
      compare: (a: Partner, b: Partner) => a.conversions - b.conversions,
    }
  ],
  MOBILE_WIDTH: 985,
  PAGE_SIZE: 15,
  LANG: 'lang',
  LANG_VALUE: navigator.language.split("-")[0] || 'en',
  ASSET_DIR: "assets"
}
