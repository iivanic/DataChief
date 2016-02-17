var helper = require("./utils.js");
this._id = "";
//alert(0);
this.render = function () {

};
this.readValue = function () {

};
this.ctor = function () {

}
this.getId = function () {
        if (this._id == "")
            this._id = helper.generateGUID();
        return this._id;

}

Object.defineProperty(this, "id", {
    get: function () {
        if (this._id == "")
            this._id = helper.generateGUID();
        return this._id;
    }
});
console.log("prop defined");