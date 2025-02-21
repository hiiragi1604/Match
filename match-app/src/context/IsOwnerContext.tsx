import { createContext, useContext, useState } from "react";

export const IsOwnerContext = createContext({
    isOwner: false,
    setIsOwner: (isOwner: boolean) => {}
});

export const IsOwnerProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOwner, setIsOwner] = useState(false);
    return (
        <IsOwnerContext.Provider value={{ isOwner, setIsOwner }}>{children}</IsOwnerContext.Provider>
    );
};

export const useIsOwner = () => {
    return useContext(IsOwnerContext);
};



