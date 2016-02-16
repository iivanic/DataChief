var u=require("./utils.js");


this.Renderable = {
    _id : u.helper.generateGUID(),
     get id(){
        return this._id;
    },
    render: function(){
        
    },
    readValue: function(){
        
    }
    ,ctor: function(){
         this._id = u.helper.generateGUID();
    }
}