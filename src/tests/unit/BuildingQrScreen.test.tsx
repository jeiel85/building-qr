import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BuildingQrScreen, useBuildingQrStore } from '@/features/building-qr';

describe('<BuildingQrScreen />', () => {
  beforeEach(() => {
    useBuildingQrStore.setState({ input: '' });
  });

  it('renders the title and input', () => {
    render(<BuildingQrScreen />);
    expect(screen.getByRole('heading', { name: '링크를 빌딩숲으로' })).toBeInTheDocument();
    expect(screen.getByLabelText('링크 또는 텍스트')).toBeInTheDocument();
  });

  it('typing updates the field', () => {
    render(<BuildingQrScreen />);
    const input = screen.getByLabelText('링크 또는 텍스트') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'https://a.bc' } });
    expect(input.value).toBe('https://a.bc');
    expect(useBuildingQrStore.getState().input).toBe('https://a.bc');
  });

  it('"샘플 링크" button fills the input', () => {
    render(<BuildingQrScreen />);
    fireEvent.click(screen.getByRole('button', { name: '샘플 링크' }));
    const input = screen.getByLabelText('링크 또는 텍스트') as HTMLInputElement;
    expect(input.value.length).toBeGreaterThan(0);
  });
});
