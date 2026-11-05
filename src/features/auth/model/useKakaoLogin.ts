const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${
  process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

export const useKakaoLogin = () => {
  const loginWithKakao = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return {
    loginWithKakao,
  };
};
