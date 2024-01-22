const SelectPageSizeFilter = ({ pageSize, setPageSize }) => {
  return (
    <div className="damp-and-mould-flex-container damp-and-mould-filter">
      <label for="pageSizeSelect" style={{ marginRight: '15px' }}>
        Show:
      </label>
      <select
        data-testid="dampAndMould_pageSizeSelect"
        className={`govuk-select lbh-select govuk-!-width-full`}
        value={pageSize}
        onChange={(e) => setPageSize(e.target.value)}
        name="pageSize"
        id="pageSizeSelect"
        style={{ marginTop: '0' }}
      >
        <option value={12} label="12 items" />
        <option value={20} label="20 items" />
        <option value={40} label="40 items" />
      </select>
    </div>
  )
}

export default SelectPageSizeFilter
