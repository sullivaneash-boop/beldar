"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { useProject } from "@/lib/state/store";

export function PreferencesSync({ children }: { children: React.ReactNode }) {
  const { settings } = useProject();
  const { theme, glueMode, motion } = settings;

  useEffect(() => {
    const d = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      d.dataset.theme = theme === "system" ? (mq.matches ? "dark" : "light") : theme;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.glue = glueMode ? "true" : "false";
    document.documentElement.dataset.motion = motion;
  }, [glueMode, motion]);

  return <MotionConfig reducedMotion={motion === "reduce" ? "always" : "user"}>{children}</MotionConfig>;
}


export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
  }, []);
  return null;
}
