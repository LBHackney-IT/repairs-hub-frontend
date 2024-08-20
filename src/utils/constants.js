export const MULTITRADE_ENABLED_CONTRACTORS = [
  'PCL',
  'AEP',
  'HHL',
  'FPM',
  'HCW',
  'PSL',
  'AIM',
  'TDK',
  'WIG',
]
export const PURDY_CONTRACTOR_REFERENCE = 'PCL'
export const MULTITRADE_TRADE_CODE = 'MU'

// If a contractor doesnt have any 'MU' sorCodes, the contractor will
// not be listed when multi-trade has been selected as the trade.
// However, multi-trade is special, and will show sorCodes from any trade,
// so a contractor should need to have 'MU' sorCodes.
// To get around this, we must hardcode these contractors in the dropdown
export const MULTITRADE_CONTRACTORS_WITHOUT_MULTITRADE_SORCODES = [
  {
    contractorReference: 'PCL',
    contractorName: 'Purdy Contracts (P) Ltd',
  },
  {
    contractorReference: 'FPM',
    contractorName: 'Foster Property Maintenance',
  },
  {
    contractorReference: 'HCW',
    contractorName: 'Hackney Carpet Warehouse',
  },
  {
    contractorReference: 'PSL',
    contractorName: 'Pride Scaffolding Ltd',
  },
  {
    contractorReference: 'AIM',
    contractorName: 'Aim Windows',
  },
  {
    contractorReference: 'AEP',
    contractorName: 'Axis Europe (X) PLC',
  },
  {
    contractorReference: 'TDK',
    contractorName: 'TDK Mechanical Services (UK) Ltd',
  },
  {
    contractorReference: 'WIG',
    contractorName: 'The Wiggett Group LTD',
  },
]
