module.exports = {
    ValidateSessionID: function ValidateSessionID(myGuid){
        var retVal = false;

        if (myGuid == "" || myGuid == null)
        {
            retVal = false;
        } else {
            retVal = true;
        }

        return retVal;
    }
}