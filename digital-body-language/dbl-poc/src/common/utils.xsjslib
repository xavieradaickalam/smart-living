/*****************************************************************************/
/* public util functions                                                     */
/** **************************************************************************/

function generateUUID(){
    var d = new Date().getTime();
    //var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c==='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
}

function convertDate(timestamp) {
	var result = '';
	var d = new Date(timestamp);
	if (d === undefined) {
		return undefined;
	} else {
		result = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate()	+ " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
		if (d.getMilliseconds() !== 0) {
			result = result + ":." + d.getMilliseconds();
		}
	}
	return result;
}