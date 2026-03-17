import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';

type Props = {
  title?: string;
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  errorValue: unknown;
  componentStack?: string;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, errorValue: null };

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, errorValue: error };
  }

  private onWindowError: ((event: any) => void) | null = null;
  private onUnhandledRejection: ((event: any) => void) | null = null;

  componentDidMount() {
    if (typeof window === 'undefined') return;

    this.onWindowError = (event: any) => {
      // eslint-disable-next-line no-console
      console.error('[GlobalError]', {
        message: event?.message,
        error: event?.error,
        filename: event?.filename,
        lineno: event?.lineno,
        colno: event?.colno,
        href: window.location?.href,
      });
    };

    this.onUnhandledRejection = (event: any) => {
      // eslint-disable-next-line no-console
      console.error('[UnhandledRejection]', {
        reason: event?.reason,
        href: window.location?.href,
      });
    };

    window.addEventListener('error', this.onWindowError);
    window.addEventListener('unhandledrejection', this.onUnhandledRejection);
  }

  componentWillUnmount() {
    if (typeof window === 'undefined') return;
    if (this.onWindowError) window.removeEventListener('error', this.onWindowError);
    if (this.onUnhandledRejection) window.removeEventListener('unhandledrejection', this.onUnhandledRejection);
  }

  componentDidCatch(error: unknown, info: { componentStack: string }) {
    // This captures React's component stack even if `error` is `null`.
    // It’s intentionally noisy until we nail the root cause.
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', {
      title: this.props.title,
      error,
      componentStack: info?.componentStack,
      href: typeof window !== 'undefined' ? window.location?.href : undefined,
      width: typeof window !== 'undefined' ? window.innerWidth : undefined,
      height: typeof window !== 'undefined' ? window.innerHeight : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    });

    this.setState({ componentStack: info?.componentStack });
  }

  private reset = () => {
    this.setState({ hasError: false, errorValue: null, componentStack: undefined });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const err = this.state.errorValue as any;
    const errText =
      err == null ? String(err) : err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    const errStack = err && typeof err === 'object' && 'stack' in err ? String(err.stack) : '';

    return (
      <View style={s.wrap}>
        <Text style={s.title}>{this.props.title ?? 'Something went wrong'}</Text>
        <Text style={s.body}>If you share the console output after this screen appears, we can pinpoint the exact crash.</Text>
        <Pressable onPress={this.reset} style={s.btn}>
          <Text style={s.btnText}>Try again</Text>
        </Pressable>
        <Text style={s.stack}>
          {`Thrown value: ${errText}`}
        </Text>
        {!!errStack && <Text style={s.stack}>{errStack}</Text>}
        {!!this.state.componentStack && <Text style={s.stack}>{this.state.componentStack.trim()}</Text>}
      </View>
    );
  }
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 18, justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  body: { fontSize: 14, opacity: 0.8, marginBottom: 14 },
  btn: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, borderWidth: 1 },
  btnText: { fontSize: 14, fontWeight: '600' },
  stack: { marginTop: 14, fontSize: 12, opacity: 0.7 },
});

