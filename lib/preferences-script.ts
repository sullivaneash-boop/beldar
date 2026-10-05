/**
 * Pre-paint script: resolves theme/glue/motion from localStorage before
 * first paint, so there's no flash of the wrong theme.
 */
export const preferencesScript = `(function(){try{var s=JSON.parse(localStorage.getItem("beldar-hq:project")||"{}").settings||{};var d=document.documentElement;var t=s.theme||"system";if(t==="system"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}d.dataset.theme=t;d.dataset.glue=s.glueMode?"true":"false";d.dataset.motion=s.motion==="reduce"?"reduce":"system"}catch(e){}})();`;
