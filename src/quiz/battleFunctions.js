
export function toggleBattlePointsAnimation(target) {
  target.classList.add("battle-points-animation")
  window.setTimeout(()=>{
    target.classList.remove("battle-points-animation")
  },501)
}
