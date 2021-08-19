
export function findHottestBar(lyric) {
   let max = lyric.punchlines[0];
   for(let i = 0; i < lyric.punchlines.length; i++) {
     if(lyric.punchlines[i].raters.length > max.raters.length) {
       max = lyric.punchlines[i];
     }
   }
   return max;
}

export function barPreview(bar) {
  return bar.substr(0,100) + "..."
}
export function isInFavourites(songId,favourites) {
  if(!Array.isArray(favourites)) {
    return false;
  }
   for(let i = 0; i < favourites.length; i++) {
     if(favourites[i] === songId) return true;
   }
   return false
}

export function numberToKOrM(n) {
  if(n === undefined) return;
  n = n.toString()
  if(n.length <= 3) {
    return n
  }else if(n.length <= 6 ) {
    let afterPoint = n.substr(n.length - 3)
    let beforePoint = n.substr(0,n.length - 3);
    return `${beforePoint}.${afterPoint[0]}k`
  }else if(n.length > 6 && n.length < 9) {
     let afterPoint = n.substr(n.length - 6)
     let beforePoint = n.substr(0,n.length - 6);
     return `${beforePoint}.${afterPoint[0]}${afterPoint[1]}M`
   }else if(n.length >= 9) {
     let afterPoint = n.substr(n.length - 9)
     let beforePoint = n.substr(0,n.length - 9);
     return `${beforePoint}.${afterPoint.substr(0,2)}B`
   }
}
