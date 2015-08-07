export default function hashCode(str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        var chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash = hash & hash; // Convert to 32bit integer
    }

    return hash;
}