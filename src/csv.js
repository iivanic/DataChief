this.convertFromArray = function(arr)
{
    var ret = "sep=,\n";
    for(var i in arr)
    {
        for(var j in arr)
        {
            ret+= "\"" + arr[i][j].replace(/\"/gi,"\"\"") + "\",";
        }
        ret = ret.substring(0,ret.length-1);
        ret+='\n';
    }
    return ret;
} 