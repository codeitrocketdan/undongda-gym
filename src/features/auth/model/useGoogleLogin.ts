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
        const res = await fetch(`/api/auth/google`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ token: response.access_token }),
        });
        if (!res.ok) {
          return;
        }

        window.location.href = "/dagym";
      },
    });

    client.requestAccessToken();
  };
  return { loginWithGoogle };
};
