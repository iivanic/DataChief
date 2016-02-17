var helper=require("./utils.js");

this.Renderable = {
    _id : "",
     get id(){
         if(this._id=="" )
         this._id=helper.generateGUID();
        return this._id;
    },
    render: function(){
        
    },
    readValue: function(){
        
    }
    ,ctor: function(){
        // this._id = helper.generateGUID();
    }
}