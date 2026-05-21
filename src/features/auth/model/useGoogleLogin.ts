declare global {
  interface Window {
    google: Google;
  }
}

interface Google {
  accounts: {
    oauth2: {
      initTokenClient: (config: TokenClientConfig) => TokenClient;
    };
  };
}

interface TokenClient {
  requestAccessToken: () => void;
}

interface TokenClientConfig {
  client_id: string;
  scope: string;
  callback: (response: TokenResponse) => void;
}

interface TokenResponse {
  access_token: string;
}

export const useGoogleLogin = () => {
  const loginWithGoogle = () => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      scope: "email profile",
      callback: async (response) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rocket/oauth/google`, {
          method: "POST",
          body: JSON.stringify({ token: response.access_token }),
        });

        const data = await res.json();
        console.log(data);
        // 저장 후 로그인 완료
      },
    });

    client.requestAccessToken();
  };
  return { loginWithGoogle };
};
