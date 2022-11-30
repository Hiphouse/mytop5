import { createContext, useContext } from "react";


export const AppContext = createContext({});

// export function AppWrapper(children: any) {
//   let sharedState = {

//   };

//   return ( 
//   <AppContext.Provider value = {sharedState}>
//     {children}
//   </AppContext.Provider>
//   );
// };

export function useAppContext() {
  return useContext(AppContext)
};