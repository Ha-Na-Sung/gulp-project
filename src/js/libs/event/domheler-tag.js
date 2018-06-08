/*domheler-tag.js*/
function tag(name,parentEl){
    return (document || parentEl).getElementsByTagName(name);
}