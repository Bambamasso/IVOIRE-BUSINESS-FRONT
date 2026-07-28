"use client";
export default function useRecaptcha(){
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