export const MULTITRADE_ENABLED_CONTRACTORS = [
  'AEP',
  'HHL',
  'FPM',
  'HCW',
  'PSL',
  'AIM',
  'TDK',
  'TMS',
  'WIG',
  'FOS',
  'PUR',
  'HER',
  'SEN',
]

export const PURDY_CONTRACTOR_REFERENCE = 'PUR'
export const MULTITRADE_TRADE_CODE = 'MU'

// If a contractor doesnt have any 'MU' sorCodes, the contractor will
// not be listed when multi-trade has been selected as the trade.
// However, multi-trade is special, and will show sorCodes from any trade,
// so a contractor should need to have 'MU' sorCodes.
// To get around this, we must hardcode these contractors in the dropdown
export const MULTITRADE_CONTRACTORS_WITHOUT_MULTITRADE_SORCODES = [
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
    contractorReference: 'TMS',
    contractorName: 'TDK Mech Services Communal Heating',
  },
  {
    contractorReference: 'WIG',
    contractorName: 'The Wiggett Group LTD',
  },
  {
    contractorReference: 'FOS',
    contractorName: 'FOSTER PM (C1B)',
  },
  {
    contractorReference: 'PUR',
    contractorName: 'PURDY CONTRACTS (C2A)',
  },
  {
    contractorReference: 'HER',
    contractorName: 'HERTS HERITAGE (C2B)',
  },
  {
    contractorReference: 'HHL',
    contractorName: 'Herts Heritage Ltd',
  },
  {
    contractorReference: 'SEN',
    contractorName: 'Saltash Enterprise Ltd',
  },
]
