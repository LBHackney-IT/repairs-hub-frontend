export class User {
  #authServiceGroups
  constructor(name, email, authServiceGroups) {
    this.name = name
    this.email = email
    this.#authServiceGroups = authServiceGroups
  }
}
