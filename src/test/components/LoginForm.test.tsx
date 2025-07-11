import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/index/LoginForm';
import { BrowserRouter } from 'react-router-dom';

// Mock the hooks
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

const renderWithRouter = (component: React.ReactElement) => {
  const result = render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
  return result;
};

describe('LoginForm', () => {
  it('renders login form elements', () => {
    const { getByPlaceholder, getByRole } = renderWithRouter(<LoginForm />);
    
    expect(getByPlaceholder('Email')).toBeInTheDocument();
    expect(getByPlaceholder('Password')).toBeInTheDocument();
    expect(getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = renderWithRouter(<LoginForm />);
    
    const submitButton = getByRole('button', { name: /sign in/i });
    await user.click(submitButton);
    
    // Check for validation errors
    expect(getByText(/email is required/i)).toBeInTheDocument();
    expect(getByText(/password is required/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    const { getByPlaceholder, getByRole, getByText } = renderWithRouter(<LoginForm />);
    
    const emailInput = getByPlaceholder('Email');
    const submitButton = getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    
    // Check for validation error
    expect(getByText(/invalid email/i)).toBeInTheDocument();
  });

  it('disables submit button while loading', async () => {
    const user = userEvent.setup();
    const { getByPlaceholder, getByRole } = renderWithRouter(<LoginForm />);
    
    const emailInput = getByPlaceholder('Email');
    const passwordInput = getByPlaceholder('Password');
    const submitButton = getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    expect(submitButton).toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    const { getByRole, getByPlaceholder } = renderWithRouter(<LoginForm />);
    
    const form = getByRole('form');
    expect(form).toHaveAttribute('aria-label', 'Login form');
    
    const emailInput = getByPlaceholder('Email');
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    
    const passwordInput = getByPlaceholder('Password');
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('required');
  });
});