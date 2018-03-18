import { ChangePasswordInput } from "./change-password.input";
import { GraphContext } from "../../helpers";

export async function changePassword(obj, args: { input: ChangePasswordInput }, context: GraphContext, info): Promise<boolean> {
    throw new Error("Not implemented");
}
