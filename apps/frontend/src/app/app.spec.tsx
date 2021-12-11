import { render } from '@testing-library/react';

import App from './App';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);

    expect(baseElement).toBeTruthy();
  });

  it('should render the login view on default', () => {
    const { getByText } = render(<App />);

    expect(getByText(/Pick your username!/gi)).toBeTruthy();
  });
});
