import axios from "axios";

export const verifyUser = async (token: string) => {
    const response = await axios.post("http://localhost:6969/auth/verifyUser", { token });
    return response;
}

