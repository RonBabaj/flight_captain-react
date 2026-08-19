import { Alert, Linking, Platform } from 'react-native';

/** Open a URL in a new browser tab on web; use the system handler on native. */
export async function openUrlInNewTab(url: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    const g =
      typeof globalThis !== 'undefined'
        ? (globalThis as {
            window?: {
              open?: (u: string, target: string, features: string) => unknown;
            };
          })
        : undefined;
    const win = g?.window?.open?.(url, '_blank', 'noopener,noreferrer');
    if (win) return true;
    // Popup blocked — fall back to same-tab navigation.
    return openUrlSameTab(url);
  }
  return openUrlSameTab(url);
}

export async function openUrlSameTab(url: string): Promise<boolean> {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) return false;
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

export async function openUrlInNewTabOrAlert(url: string, errorTitle = 'Cannot open link'): Promise<void> {
  const ok = await openUrlInNewTab(url);
  if (!ok) {
    Alert.alert(errorTitle, 'Your device cannot open this booking link.');
  }
}
