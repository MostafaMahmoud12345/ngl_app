export function toMs(time,unit){
  switch(unit){
    case "s":
      return time * 1000;
    case "m":
      return time * 60 * 1000;
    case "h":
      return time * 60 * 60 * 1000;
    default:
      return time;
  }
}

export function toSeconds(time,unit){
  switch(unit){
    case "ms":
      return time / 1000;
    case "m":
      return time * 60;
    case "h":
      return time * 60 * 60;
    default:
      return time;
  }
}