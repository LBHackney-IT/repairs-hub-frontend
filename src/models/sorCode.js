class SorCode {
  id
  sorCode
  cost
  smv
  shortDescription
  longDescription

  constructor(id, sorCode, cost, smv, shortDescription, longDescription) {
    this.id = id
    this.sorCode = sorCode
    this.cost = cost
    this.smv = smv
    this.shortDescription = shortDescription
    this.longDescription = longDescription
  }
}

export default SorCode
