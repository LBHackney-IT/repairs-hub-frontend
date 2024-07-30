export const CAUTIONARY_ALERTS = [
  {
    code: 'DAT',
    description: '[Temporary] Dangerous Animals',
  },
  {
    code: 'CFT',
    description: '[Temporary] No Female Staff to Visit',
  },
  {
    code: 'CIT',
    description: '[Temporary] No Lone Interviews',
  },
  {
    code: 'CVT',
    description: '[Temporary] No Lone Visits',
  },
  {
    code: 'OIT',
    description: '[Temporary] Other Type of Incident',
  },
  {
    code: 'PAT',
    description: '[Temporary] Physical Abuse or Threat of',
  },
  {
    code: 'SAT',
    description: '[Temporary] Seek Advice',
  },
  {
    code: 'UET',
    description: '[Temporary] Unclean / Unsafe Environment',
  },
  {
    code: 'VAT',
    description: '[Temporary] Verbal Abuse or Threat of',
  },
  {
    code: 'COR',
    description: 'ASBO or injunction obtained',
  },
  {
    code: 'DA',
    description: 'Dangerous Animals',
  },
  {
    code: 'CX',
    description: 'Do Not Attend - Refer to Authorising Officer',
  },
  {
    code: 'DV',
    description: 'Domestic Violence',
  },
  {
    code: 'CF',
    description: 'No Female Staff to Visit',
  },
  {
    code: 'CI',
    description: 'No Lone Interviews',
  },
  {
    code: 'CV',
    description: 'No Lone Visits',
  },
  {
    code: 'OI',
    description: 'Other Type of Incident',
  },
  {
    code: 'PA',
    description: 'Physical Abuse or Threat of',
  },
  {
    code: 'SA',
    description: 'Seek Advice',
  },
  {
    code: 'SPR',
    description: 'Specific Requirements',
  },
  {
    code: 'CXT',
    description: '[Temporary] Do Not Attend - Refer to Authorising Officer',
  },
  {
    code: 'TRA',
    description: 'Translation Required',
  },
  {
    code: 'UE',
    description: 'Unclean / Unsafe Environment',
  },
  {
    code: 'VA',
    description: 'Verbal Abuse or Threat of',
  },
  {
    code: 'APT',
    description: 'Adapted Property',
  },
  {
    code: 'VOID',
    description: 'Property is VOID',
  },
  {
    code: 'DIS',
    description: 'Property Under Disrepair',
  },
  {
    code: 'TERM',
    description:
      'Tenant has requested termination of tenancy please refer calls to housing officer',
  },
]

export const getCautionaryAlertsType = (alerts) => {
  const cautionaryAlerts = alerts.map((cautionaryAlert) => cautionaryAlert.type)
  return [...new Set(cautionaryAlerts)]
}
