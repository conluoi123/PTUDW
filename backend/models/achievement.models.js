class Achievement {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.criteria = data.criteria;
  }
}

export default Achievement;
