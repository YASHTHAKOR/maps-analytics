
function moduleConfig(){
  this.imports = {};
  this.options = {};
}

moduleConfig.prototype.setImports = (imports) => {
  this.imports = imports;
}

moduleConfig.prototype.setOptions = (options) => {
  this.options = options;
}

moduleConfig.prototype.getImports = () => {
  return this.imports;
}

moduleConfig.prototype.getOptions = () => {
  return this.options;
}

module.exports = new moduleConfig()
