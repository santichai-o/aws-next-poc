import crypto from "crypto";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";

const region = process.env.COGNITO_REGION || "ap-southeast-1";
const clientSecret = process.env.COGNITO_CLIENT_SECRET;

const cognitoClient = new CognitoIdentityProviderClient({ region });

export interface CognitoAuthTokens {
  idToken: string;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

function getClientId(): string {
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
  if (!clientId) {
    throw new Error("NEXT_PUBLIC_COGNITO_CLIENT_ID is not set");
  }
  return clientId;
}

function buildSecretHash(email: string, clientId: string): string | undefined {
  if (!clientSecret) {
    return undefined;
  }

  return crypto
    .createHmac("sha256", clientSecret)
    .update(email + clientId)
    .digest("base64");
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<CognitoAuthTokens> {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const clientId = getClientId();
  const secretHash = buildSecretHash(email, clientId);

  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      ...(secretHash ? { SECRET_HASH: secretHash } : {}),
    },
  });

  let response: InitiateAuthCommandOutput;
  try {
    response = await cognitoClient.send(command);
  } catch (error) {
    throw new Error((error as Error).message || "Authentication failed");
  }

  const authResult = response.AuthenticationResult;

  if (!authResult?.IdToken || !authResult.AccessToken) {
    throw new Error("Invalid authentication response");
  }

  return {
    idToken: authResult.IdToken,
    accessToken: authResult.AccessToken,
    refreshToken: authResult.RefreshToken,
    expiresIn: authResult.ExpiresIn,
  };
}
