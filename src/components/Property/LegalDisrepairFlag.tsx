import WarningInfoBox from '../Template/WarningInfoBox'

const LegalDisrepairFlag = () => (
  <WarningInfoBox
    header="This property is currently under legal disrepair"
    text="Before raising a work order you must call the Legal Disrepair Team"
    style={{ maxWidth: 600 }}
  />
)

export default LegalDisrepairFlag
