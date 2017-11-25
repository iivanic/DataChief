this.convertFromArray = function(arr)
{
    var ret = "sep=,\n";
    for(var i in arr)
    {
        for(var j in arr[i])
        {
            try{
            ret+= (j>0?",":"") + "\"" + arr[i][j].toString().replace(/\"/gi,"\"\"") + "\"";
        }
        catch(e)
        {
            console.log(e);
        }
        }
        
        ret+='\n';
    }
    return ret;
} 