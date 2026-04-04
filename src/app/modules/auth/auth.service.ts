import generateToken, { verifyToken } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import { TLogInUser } from "./auth.interface";
import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import emailSender from "./emailSender";



const loginUser = async (payload: TLogInUser) => {
  const { email, password } = payload;
  // Find the user by email
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,

    },
  });

  // Validate password
  const isCorrectPassword = await bcrypt.compare(password, userData?.passwordHash);
  if (!isCorrectPassword) {
    throw new Error("Invalid password");
  }

  // Create JWT token
  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );
  const refreshToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string,
  );

  // Fixed logging

  return {
    accessToken,
    refreshToken,

  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = await verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret,
    );
  } catch (error) {
    console.error("JWT verification failed:", error);
    throw new Error("You are not authorized ");
  }
  if (
    typeof decodedData !== "object" ||
    !decodedData ||
    !("email" in decodedData)
  ) {
    throw new Error("Invalid token payload");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData?.email
    },
  });
  const accessToken = generateToken(
    {
      email: userData?.email,
      role: userData?.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );
  return {
    accessToken,

  };
};
const changePassword = async (user: any, payload: any) => {
  const { oldPassword, newPassword } = payload;

  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: user.email,

    },
  });
  const isCorrectPassword = await bcrypt.compare(
    oldPassword,
    userData.passwordHash,
  );
  if (!isCorrectPassword) {
    throw new Error("Invalid password");
  }

  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      passwordHash: await bcrypt.hash(newPassword, 12),

    },
  });

  return {
    message: "Password changed successfully",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const { email } = payload;

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,

    },
  });
  const resetPassToken = generateToken(
    { email: userData.email, role: userData.role },
    config.reset_pass.token_secret as Secret,
    config.reset_pass.token_expires_in as string,
  );
  const resetPassLink =
    config.reset_pass.link +
    `?userId=${userData.id}&token=${resetPassToken}`;
  await emailSender(
    userData?.email,
    `<div>
    <p>Click the link below to reset your password:</p><a href="${resetPassLink}">
    <button>Reset Password</button>
    </a></div>`,
  );

  //http://localhost:3000/reset-pass?email=ancsddf@gmail.com&token=dhfsdfidshf
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string },
) => {
  const isValidToken = await verifyToken(
    token,
    config.reset_pass.token_secret as Secret,
  );
  if (!isValidToken) {
    throw new Error("Invalid or expired token");
  }
  const hashPassword = bcrypt.hashSync(payload.password, 12);

  const updatePassword = await prisma.user.update({
    where: {
      email: isValidToken.email
    },
    data: {
      passwordHash: hashPassword
    }
  });
  return {
    message: "Password reset successfully"
  };
};
export const authServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
