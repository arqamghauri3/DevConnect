import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { log } from "console";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const usernameRaw = searchParams.get("username");
    console.log("Received username param:", usernameRaw);

    const result = UsernameQuerySchema.safeParse({ username: usernameRaw });
    console.log("Validation result:", result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      console.log("Username validation errors:", usernameErrors[0]);
      return Response.json(
        {
          success: false,
          message: usernameErrors[0],
        },
        {
          status: 500,
        }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Failed to check username",
      },
      {
        status: 500,
      }
    );
  }
}
