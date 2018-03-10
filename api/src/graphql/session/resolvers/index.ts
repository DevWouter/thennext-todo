import { getOwner } from "./get-owner.resolver";

export const SessionResolvers = {
    owner: getOwner
};