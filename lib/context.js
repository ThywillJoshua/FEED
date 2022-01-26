import { createContext } from "react";

//export context and pass in values
//wrap app component with context provider
export const UserContext = createContext({ user: null, username: null });
