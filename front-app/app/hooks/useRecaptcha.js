"use client";
import { useEffect } from "react";

export default function useRecaptcha(){
    // Le badge reCAPTCHA est injecté par Google directement dans <body>, en
    // dehors de l'arbre React : en navigation côté client, React démonte la
    // page mais ne retire jamais ce badge tout seul. On le nettoie nous-mêmes
    // quand le composant qui utilise le hook (la page du formulaire) se démonte.
    useEffect(() => {
      return () => {
        document
          .querySelectorAll(".grecaptcha-badge")
          .forEach((el) => el.remove());
        document
          .querySelectorAll('script[src*="recaptcha"]')
          .forEach((el) => el.remove());
        if (window.grecaptcha) {
          delete window.grecaptcha;
        }
      };
    }, []);

    const getRecaptchaToken = async (action) => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error("reCAPTCHA n'est pas encore chargé"));
        return;
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action })
          .then((token) => resolve(token))
          .catch((err) => reject(err));
      });
    });
  };
  return { getRecaptchaToken };
}