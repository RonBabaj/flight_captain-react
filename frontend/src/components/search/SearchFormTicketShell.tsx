import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { TicketStub } from '../../ui/TicketStub';

/** Boarding-pass shell: navy stub + body; mood can bleed to top edge. */
export function SearchFormTicketShell({
  children,
  style,
  accentHeight,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  accentHeight?: number;
}) {
  return (
    <TicketStub style={style} stubHeight={accentHeight} innerStyle={shell.body}>
      {children}
    </TicketStub>
  );
}

const shell = StyleSheet.create({
  body: { flex: 1 },
});