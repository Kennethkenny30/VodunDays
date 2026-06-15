'use client';

import { IntlProvider } from 'use-intl';
import type { AbstractIntlMessages } from 'use-intl';
import type { ReactNode } from 'react';

interface IntlClientProviderProps {
  locale: string;
  messages: AbstractIntlMessages;
  children: ReactNode;
}

// Wrapper client pour use-intl sans dépendance au plugin next-intl
export function IntlClientProvider({ locale, messages, children }: IntlClientProviderProps) {
  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
}
