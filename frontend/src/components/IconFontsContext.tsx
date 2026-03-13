/**
 * Provides whether icon fonts have been successfully loaded.
 * When false (e.g. load failed or timed out on web), AppIcon can show visible fallback text.
 */
import React, { createContext, useContext } from 'react';

const IconFontsContext = createContext<boolean>(true);

export function useIconFontsLoaded(): boolean {
  return useContext(IconFontsContext);
}

export function IconFontsProvider({
  loaded,
  children,
}: {
  loaded: boolean;
  children: React.ReactNode;
}) {
  return (
    <IconFontsContext.Provider value={loaded}>
      {children}
    </IconFontsContext.Provider>
  );
}
